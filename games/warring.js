/**
 * warring.js contains the functions for Warring Kingdoms
 *
 * Created by: Andrew Corum, 2/24/2018
 */

const MAP_SIZE = 10;

/**
 * start creates then returns initial game state
 *
 * @param: (int) lgid (ie live game id)
 * @param: (array) userNames
 *
 * @return: (JSON) state
 */
exports.start = function( lgid, usernames, callback ) {
	// Initialize state & players variables
	var state = {
		id: lgid, game: "warring", players: [],
		map: [], 
		gameOver: 0, winner: -1, error: "",
	};
	for ( var i = 0; i < usernames.length; i++ ) {
		state.players.push( {
			username: usernames[i],
			units: [],
			gold: 400,
			errors: 0,
		} );
	}

	// Generate map
	for ( var row = 0; row < MAP_SIZE; row++ ) {
		state.map[row] = new Array(MAP_SIZE);
		for ( var col = 0; col < MAP_SIZE; col++ ) {
			state.map[row][col] = { type: "grass", solid: false };
		}
	}

	// Create initial player units
	for ( var i = 0; i < usernames.length; i++ ) {
		// One peasant
		state.players[i].units[0] = {
			class: "worker",
			x: 1 + 6 * i, y: 2 + 6 * i,
			hp: 40,
			ac: 0,
			attack: 0,
			range: 0,
		};
	}

	callback( state );
}

/**
 * move checks if a move is validated, updates the state,
 * and then returns the new state
 *
 * @param: (JSON) state
 * @param: (int) move
 *
 * @return: (JSON) state
 */
exports.move = function( state, move, callback ) {
	if ( typeof move == "string" ) {
		move = JSON.parse( move );
	}
	callback( updateState( state, move ) );
}

/**
 * updateState updates a game state based on a given move
 *
 * @param: (JSON) move
 * @param: (JSON) state
 *
 * @return: (JSON) new state
 */
function updateState( state, move ) {
	move.updates.forEach( function( update ) {
		var player = move.player;
		switch ( update.type ) {
			case "move":
				state = makeMove( state, update, player );
				break;
			case "attack":
				state = attack( state, update, player );
				break;
			case "train":
				state = train( state, update, player );
				break;
			case "build":
				state = build( state, update, player );
				break;
			default:
				state.players[move.player].errors++;
		}
	} );

	// Check for game over
	state = gameOver( state );
	return state;
}

/**
 * move checks if a move is valid, impliments it,
 * and then returns the new state
 *
 * @param: (JSON) state
 * @param: (int) move
 * @param: (int) player (index of the player performing an action)
 *
 * @return: (JSON) newState
 */
function makeMove( state, move, player ) {
	// Make sure move is an object with unit# and direction
	if ( typeof move != "object" ) {
		state.players[player].errors++;
		return state;
	}
	if ( typeof move.unit != "number" ) {
		state.players[player].errors++;
		return state;
	}
	if ( typeof move.direction != "string" || move.direction.length != 1 ) {
		state.players[player].errors++;
		return state;
	}

	// Calculate newX and newY
	var newX = state.players[player].units[move.unit].x;
	var newY = state.players[player].units[move.unit].y;
	switch( move.direction ) {
		case "N":
			newY -= 1;
			break;
		case "E":
			newX += 1;
			break;
		case "S":
			newY += 1;
			break;
		case "W":
			newX -= 1;
			break;
		default:
			state.players[player].errors++;
			return state;
	}

	// Check for obstacles
	if ( obstructed( state, newX, newY ) ) {
		state.players[player].errors++;
		return state;
	}

	// Make move
	state.players[player].units[move.unit].x = newX;
	state.players[player].units[move.unit].y = newY;

	return state;
}

/**
 * obstructed() looks for any obstructions at a particular location
 *
 * @param: (int) x
 * @param: (int) y
 *
 * @return: (bool) obstructed
 */
function obstructed( state, x, y ) {
	// Check if (x,y) is off the map
	if ( x >= MAP_SIZE || x < 0 || y > MAP_SIZE || y < 0 )
		return true;

	// Check map tile
	if ( state.map[x][y].solid )
		return true;

	// Check units
	for ( var i = 0; i < state.players.length; i++ ) {
		for ( var j = 0; j < state.players[i].units.length; j++ ) {
			let unit = state.players[i].units[j];
			if ( unit.x == x && unit.y == y )
				return true;
		}
	}

	return false;
}

/**
 * gameOver returns state updated with whether or not the game is over
 *
 * @param: (JSON) state
 *
 * @return: (JSON) state
 */
function gameOver( state ) {
	return state;
}
