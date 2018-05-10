#!/usr/bin/nodejs
/**
 * attack_simple.js contains a bot for Warring Kingdoms that just farms
 * and sends soldiers to opponent's keep whenever possible
 *
 * Created by: Andrew Corum, 5/08/2018
 */
"use strict"

var PF = require( 'pathfinding' );
const MAP_SIZE = 17;

var data = JSON.parse( process.argv[2] );

var move = getMove( data.state );

// Sleep to give appearance of thinking ;)
sleep( 200 ).then( () => {
	console.log( JSON.stringify( move ) );
} );

/*
 * Simple sleep function using promise
 */
function sleep( time ) {
	return new Promise( ( resolve ) => setTimeout( resolve, time ) );
}

/**
 * getMove calculates all game updates
 */
function getMove( state ) {
	// Locate keeps
	var myKeep, enemyKeep;
	switch ( state.currentPlayer ) {
		case 0:
			myKeep = { x: 4, y: 4 };
			enemyKeep = { x: MAP_SIZE - 5, y: MAP_SIZE - 5 };
			break;
		case 1:
			enemyKeep = { x: 4, y: 4 };
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
			var unit = state.players[player].units[i];
			if ( unit.class != "dead" ) {
				mapMask[unit.y][unit.x] = 1;
			}
		}
	}

	// Create move object
	var move = { updates: [] };

	// Iterate through all of my units, moving each one accordingly
	for ( var i = 0; i < state.players[state.currentPlayer].units.length; i++ ) {
		var unit = state.players[state.currentPlayer].units[i];
		switch ( unit.class ) {
			case "farmer":
				move.updates.push( moveFarmer( i, unit, myFarm, myKeep, mapMask ) );
				break;
			case "soldier":
				move.updates.push( moveSoldier( i, unit, state, enemyKeep, mapMask ) );
				break;
			default:
				break;
		}
	}

	// Train units if have enough money
	if ( state.players[state.currentPlayer].food >= 450 ) {
		move.updates.push( { type: "train", class: "soldier" } );
	}

	return move;
}

/**
 * Move soldier in order to attack units and keep
 *
 * @param: index, the position in units array
 * @param: soldier, the unit object in units array
 * @param: state, the game state
 * @param: enemyKeep, the (x,y) coords
 * @param: mapMask, the solid mask of the game map
 *
 * @return: update, the soldier update object
 */
function moveSoldier( index, soldier, state, enemyKeep, mapMask ) {
	// Set default target
	var target = { x: enemyKeep.x, y: enemyKeep.y }; 

	// Figure out if soldier should target an enemy unit
	var enemyIndex = (state.currentPlayer + 1) % 2
	for ( var j = 0; j < state.players[enemyIndex].units.length; j++ ) {
		var enemy = state.players[enemyIndex].units[j];
		if ( enemy.class != "dead" ) {
			target.x = enemy.x; target.y = enemy.y;
			enemy.targeted = true
			j = 99999999;
		}
	}

	mapMask[target.y][target.x] = 0;
	var dir = dirTowards( soldier.x, soldier.y, target.x, target.y, mapMask );
	mapMask[target.y][target.x] = 1;

	var type = "move";
	if ( distance( soldier.x, soldier.y, target.x, target.y ) <= 1 ) {
		type = "attack";
	}

	return { type: type, unit: index, direction: dir };
}

/**
 * Move farmer in order to harvest food
 *
 * @param: index, the position in units array
 * @param: farmer, the unit object in units array
 * @param: myFarm, basic farm object (x, y)
 * @param: myKeep, basic keep object (x, y)
 * @param: mapMask, the solid mask of the game map
 *
 * @return: update, the farmer update object
 */
function moveFarmer( index, farmer, myFarm, myKeep, mapMask ) {
	// Figure out move for farmer
	var dir;
	if ( farmer.hasFood ) { // Head to keep
		mapMask[myKeep.y][myKeep.x] = 0;
		dir = dirTowards( farmer.x, farmer.y, myKeep.x, myKeep.y, mapMask );
		mapMask[myKeep.y][myKeep.x] = 1;
	} else { // Head to farm
		mapMask[myFarm.y][myFarm.x] = 0;
		dir = dirTowards( farmer.x, farmer.y, myFarm.x, myFarm.y, mapMask );
		mapMask[myFarm.y][myFarm.x] = 1;
	}

	return { type: "move", unit: index, direction: dir };
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
	map[startY][startX] = 1;

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
