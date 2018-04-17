/**
 * farmer.js contains a bot for Warring Kingdoms that just farms
 *
 * Created by: Andrew Corum, 4/16/2018
 */
"use strict"

var PF = require( 'pathfinding' );
const MAP_SIZE = 17;

var data = JSON.parse( process.argv[2] );

var move = getMove( data.state );

// Sleep to give appearance of thinking ;)
sleep( 400 ).then( () => {
	console.log( JSON.stringify( move ) );
} )

/*
 * Simple sleep function using promise
 */
function sleep( time ) {
	return new Promise( ( resolve ) => setTimeout( resolve, time ) );
}

/**
 * getMove calculates the move required for the farmer
 */
function getMove( state ) {
	// Locate keep
	var myKeep;
	switch ( state.currentPlayer ) {
		case 0:
			myKeep = { x: 4, y: 4 };
			break;
		case 1:
			myKeep = { x: MAP_SIZE - 5, y: MAP_SIZE - 5 };
			break;
	}

	// Locate farm
	var myFarm = { x: 999, y: 999 };
	for ( var row = 0; row < MAP_SIZE; row++ ) {
		for ( var col = 0; col < MAP_SIZE; col++ ){
			if ( state.map[row][col].type == "farm" && 
				( distance( myKeep.x, myKeep.y, col, row ) < distance( myKeep.x, myKeep.y, myFarm.x, myFarm.y ) ) )
				myFarm = { x: col, y: row };
		}
	}

	// Locate farmer
	var myFarmer = {
		x: state.players[state.currentPlayer].units[0].x,
		y: state.players[state.currentPlayer].units[0].y,
		hasFood: state.players[state.currentPlayer].units[0].hasFood,
	};

	// Create mapMask
	var mapMask = [];
	for ( var row = 0; row < MAP_SIZE; row++ ) {
		mapMask[row] = new Array( MAP_SIZE );
		for ( var col = 0; col < MAP_SIZE; col++ ) {
			mapMask[row][col] = state.map[row][col].solid ? 1 : 0;
		}
	}
	for ( var player = 0; player < 2; player++ ) {
		for ( var i = 0; i < state.players[player].units.length; i++ ) {
			mapMask[state.players[player].units[i].y][state.players[player].units[i].x] = 1;
		}
	}

	// Figure out move for farmer
	var dir;
	if ( myFarmer.hasFood ) { // Head to keep
		mapMask[myFarmer.y][myFarmer.x] = 0;
		mapMask[myKeep.y][myKeep.x] = 0;
		dir = dirTowards( myFarmer.x, myFarmer.y, myKeep.x, myKeep.y, mapMask );
	} else { // Head to farm
		mapMask[myFarmer.y][myFarmer.x] = 0;
		dir = dirTowards( myFarmer.x, myFarmer.y, myFarm.x, myFarm.y, mapMask );
	}

	// Create move object
	var move = { updates: [] };
	move.updates.push( { type: "move", unit: 0, direction: dir } );

	return move;
}

/**
 * Find the direction a unit must take to reach a given destination
 *
 * @param: (ints) startX, startY
 * @param: (ints) endX, endY
 * @param: (2d array) map
 *
 * @return: (char) direction
 *          (bool) false (if no path is found)
 */
function dirTowards( startX, startY, endX, endY, map ) {
	map[startY][startX] = 0;
	var grid = new PF.Grid( map );
	var finder = new PF.AStarFinder();
	var path = finder.findPath( startX, startY, endX, endY, grid );
	if ( path.length <= 1 ) {
		return false;
	}
	if ( path[1][1] - startY == -1 )
		return "N";
	if ( path[1][0] - startX == 1 )
		return "E";
	if ( path[1][1] - startY == 1 )
		return "S";
	if ( path[1][0] - startX == -1 )
		return "W";
	return false;
}

/**
 * Finds the distance between two points (no diagonals)
 * 
 * @param: (ints) x1, y1
 * @param: (ints) x2, y2
 *
 * @return: (int) distance
 */
function distance( x1, y1, x2, y2 ) {
	return Math.abs( ( x2 - x1 ) + ( y2 - y1 ) );
}
