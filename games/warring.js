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
		id: lgid, game: "warring", players: [], currentPlayer: 0,
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
			state.map[row][col] = {
				type: "grass",
				style: Math.floor( Math.random() * 4 ),
				hp: 0, solid: false
			};
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
			carrying: true,
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

	// Update currentPlayer
	state.currentPlayer = (state.currentPlayer + 1) % state.players.length;

	return state;
}

/**
 * attack checks if an attack is valid, impliments it,
 * and then returns the new state
 *
 * @param: (JSON) state
 * @param: (obj) move
 *
 * @return: (JSON) newState
 */
function attack( state, move ) {
	let player = state.currentPlayer;
	// Make sure move is an object with unit# and direction, and not a worker
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
	if ( state.players[player].units[move.unit].class == "worker" ) {
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

	// Check for occupants
	var victim = occupied( state, newX, newY );
	switch( victim.type ) {
		case "wall":
			state.map[newY][newX].hp
				-= state.players[player].units[move.unit].attack;
			state = checkBroken( state, newX, newY );
			break;
		case "unit":
			state.players[victim.player].units[victim.unit].hp
				-= state.players[player].units[move.unit].attack;
			state = checkDead( state, victim.player, victim.unit );
			break;
		case "empty":
			state.players[player].errors++;
			return state;
			break;
	}

	return state;
}

/**
 * makeMove checks if a move is valid, impliments it,
 * and then returns the new state
 *
 * @param: (JSON) state
 * @param: (int) move
 * @param: (int) player (index of the player performing an action)
 *
 * @return: (JSON) newState
 */
function makeMove( state, move ) {
	let player = state.currentPlayer;
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
 * occupied() looks for any occupants at a particular location
 *
 * @param: (int) x
 * @param: (int) y
 *
 * @return: (obj) { type: (string), player: (int), unit: (int) }
 */
function occupied( state, x, y ) {
	// Check if (x,y) is off the map
	if ( x >= MAP_SIZE || x < 0 || y > MAP_SIZE || y < 0 )
		return { type: "empty" };

	// Check map tile
	if ( state.map[x][y].type == "wall" )
		return { type: "wall" };

	// Check units
	for ( var i = 0; i < state.players.length; i++ ) {
		for ( var j = 0; j < state.players[i].units.length; j++ ) {
			let unit = state.players[i].units[j];
			if ( unit.x == x && unit.y == y )
				return { type: "unit", player: i, unit: j };
		}
	}

	return { type: "empty" };
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
 * checkBroken() checks to see if a map element is destroyed or not
 *
 * @param: (obj) state
 * @param: (int) x
 * @param: (int) y
 *
 * @return: (obj) updated state
 */
function checkBroken( state, x, y ) {
	if ( state.map[y][x].hp <= 0 )
		state.map[y][x] = { type: "rubble", solid: false };
	return state;
}

/**
 * checkDead() checks to see if a unit is dead
 *
 * @param: (obj) state
 * @param: (int) player
 * @param: (int) unit
 *
 * @return: (obj) updated state
 */
function checkDead( state, player, unit ) {
	if ( state.players[player].units[unit].hp <= 0 )
		state.players[player].units.splice( unit, 1 );
	return state;
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
