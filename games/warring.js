/**
 * warring.js contains the functions for Warring Kingdoms
 *
 * Created by: Andrew Corum, 2/24/2018
 */
var PF = require( 'pathfinding' );
const MAP_SIZE = 17;
const KEEP1 = { x: 4, y: 4 };
const KEEP2 = { x: MAP_SIZE - 5, y: MAP_SIZE - 5 };
const FARM_DIST = 4;

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
			food: 400,
			errors: 0,
		} );
	}

	// Generate map
	state = generateMap( state );

	// Create initial player units
	// One peasant
	state.players[0].units[0] = {
		class: "farmer",
		x: KEEP1.x + 1, y: KEEP1.y,
		hp: 40,
		attack: 0,
		range: 0,
		hasFood: false,
		canMove: true,
	};
	state.players[1].units[0] = {
		class: "farmer",
		x: KEEP2.x - 1, y: KEEP2.y,
		hp: 40,
		attack: 0,
		range: 0,
		hasFood: false,
		canMove: true,
	};

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
		try {
			move = JSON.parse( move );
		} catch ( e ) {
			state.currentPlayer = (state.currentPlayer + 1) % state.players.length;
			callback( state );
		}
	}
	state = updateState( state, move );
	state.currentPlayer = (state.currentPlayer + 1) % state.players.length;
	callback( state );
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
	if ( typeof move.updates == "undefined" )
		return state;

	move.updates.forEach( function( update ) {
		var player = move.player;
		switch ( update.type ) {
			case "move":
				state = makeMove( state, update );
				break;
			case "attack":
				state = attack( state, update );
				break;
			case "train":
				state = train( state, update );
				break;
			case "build":
				state = build( state, update );
				break;
			default:
				state.players[move.player].errors++;
		}
	} );

	// Check for game over
	state = gameOver( state );

	// Reset 'canMove' for each unit
	for ( var i = 0; i < state.players.length; i++ ) {
		for ( var j = 0; j < state.players[i].units.length; j++ ) {
			state.players[i].units[j].canMove = true;
		}
	}

	// Update wall styles on map
	var pathmap = [];
	for ( var row = 0; row < MAP_SIZE; row++ ) {
		pathmap[row] = new Array( MAP_SIZE );
		for ( var col = 0; col < MAP_SIZE; col++ ) {
			if ( state.map[row][col].type == "wall" ){
				pathmap[row][col] = 1;
			} else {
				pathmap[row][col] = 0;
			}
		}
	}
	state.map = setPathStyles( state.map, pathmap, "wall" );

	return state;
}

/**
 * build checks if building is valid, impliments it,
 * and then returns the new state
 *
 * @param: (JSON) state
 * @param: (obj) move
 *
 * @return: (JSON) newState
 */
function build( state, move ) {
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
	if ( typeof move.direction != "string" ) {
		state.players[player].errors++;
		return state;
	}
	if ( !state.players[player].units[move.unit].canMove ) {
		state.players[player].errors++;
		return state;
	}

	// Check that there is enough food to build wall
	let cost = 250;
	if ( state.players[player].food < cost ) {
		state.players[player].errors++;
		return state;
	}

	// Calculate newX and newY of wall
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

	// Check if there is space for the wall
	if ( obstructed( state, newX, newY ) ) {
		state.players[player].errors++;
		return state;
	}

	// Build the wall & make payment
	state.map[newY][newX] = {
		type: "wall",
		style: 0,
		hp: 150, solid: true
	}
	state.players[player].food -= cost;

	// Disable future moves
	state.players[player].units[move.unit].canMove = false;

	return state;
}

/**
 * train checks if training is valid, impliments it,
 * and then returns the new state
 *
 * @param: (JSON) state
 * @param: (obj) move
 *
 * @return: (JSON) newState
 */
function train( state, move ) {
	let player = state.currentPlayer;
	// Make sure move is an object with unit class
	if ( typeof move != "object" ) {
		state.players[player].errors++;
		return state;
	}
	if ( typeof move.class != "string" ) {
		state.players[player].errors++;
		return state;
	}

	// Check that there is enough food to train unit
	var cost, unit;
	switch( move.class ) {
		case "farmer":
			cost = 400;
			unit = {
				class: "farmer", hp: 40, attack: 0,  range: 0, hasFood: false, canMove: true,
			};
			break;
		case "soldier":
			cost = 450;
			unit = {
				class: "soldier", hp: 60, attack: 15,  range: 0, canMove: true,
			};
			break;
		case "archer":
			cost = 500;
			unit = {
				class: "archer", hp: 50, attack: 10,  range: 2, canMove: true,
			};
			break;
		default:
			state.players[player].errors++;
			return state;
	}
	if ( state.players[player].food < cost ) {
		state.players[player].errors++;
		return state;
	}

	// Check for an open space around the keep
	var keepX, keepY;
	for ( var row = 0; row < MAP_SIZE; row++ ) {
		for ( var col = 0; col < MAP_SIZE; col++ ) {
			if ( state.map[row][col].type == "keep" &&
				 state.map[row][col].style == player ) {
				keepX = col; keepY = row;
				row = col = MAP_SIZE;
			}
		}
	}
	var space = freeAround( state, keepX, keepY );
	if ( space == false ) {
		state.players[player].errors++;
		return state;
	}
	unit.x = space.x;
	unit.y = space.y;

	// Create unit
	state.players[player].units.push( unit );
	state.players[player].food -= cost;

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
	// Make sure move is an object with unit# and direction, and not a farmer
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
	if ( state.players[player].units[move.unit].class == "farmer" ) {
		state.players[player].errors++;
		return state;
	}
	if ( !state.players[player].units[move.unit].canMove ) {
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

	// Disable future moves
	state.players[player].units[move.unit].canMove = false;

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
	if ( !state.players[player].units[move.unit].canMove ) {
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

	// Check to see if farmer is by a farm or the keep
	if ( state.players[player].units[move.unit].class == "farmer" ) {
		if ( !state.players[player].units[move.unit].hasFood 
		     && state.map[newY][newX].type == "farm" ) {
			state.players[player].units[move.unit].hasFood = true;
		} else if ( state.players[player].units[move.unit].hasFood
		     && byKeep( state, newX, newY ) ) {
			state.players[player].units[move.unit].hasFood = false;
			state.players[player].food += 200;
		}
	}

	// Disable future moves
	state.players[player].units[move.unit].canMove = false;

	return state;
}

/**
 * occupied() looks for any occupants at a particular location
 *
 * @param: (obj) state
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
	if ( state.map[y][x].type == "wall" )
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
 * @param: (obj) state
 * @param: (int) x
 * @param: (int) y
 *
 * @return: (bool) obstructed
 */
function obstructed( state, x, y ) {
	// Check if (x,y) is off the map
	if ( x >= MAP_SIZE || x < 0 || y >= MAP_SIZE || y < 0 )
		return true;

	// Check map tile
	if ( state.map[y][x].solid == true ) {
		return true;
	}

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
 * freeAround() finds a free space around a point
 * returns false on failure
 *
 * @param: (obj) state
 * @param: (int) x
 * @param: (int) y
 *
 * @return: (obj) { x, y }
 *          (bool) false (upon failure to find free space)
 */
function freeAround( state, x, y ) {
	if ( !obstructed( state, x+1, y ) )
		return { x: x+1, y: y };
	if ( !obstructed( state, x, y+1 ) )
		return { x: x, y: y+1 };
	if ( !obstructed( state, x-1, y ) )
		return { x: x-1, y: y };
	if ( !obstructed( state, x, y-1 ) )
		return { x: x, y: y-1 };
	return false;
}

/**
 * byKeep() checks if currentPlayer's keep is around a point
 *
 * @param: (obj) state
 * @param: (int) x
 * @param: (int) y
 *
 * @return: (bool) result
 */
function byKeep( state, x, y ) {
	if ( x+1 < MAP_SIZE && state.map[y][x+1].type == "keep"
	     && state.map[y][x+1].style == state.currentPlayer )
		return true;
	if ( x-1 > 0 && state.map[y][x-1].type == "keep"
	     && state.map[y][x-1].style == state.currentPlayer )
		return true;
	if ( y+1 < MAP_SIZE && state.map[y+1][x].type == "keep"
	     && state.map[y-1][x].style == state.currentPlayer )
		return true;
	if ( y-1 > 0 && state.map[y-1][x].type == "keep"
	     && state.map[y-1][x].style == state.currentPlayer )
		return true;
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

/**
 * generateMap() creates the initial game map
 *
 * @param: (obj) state
 *
 * @return: (obj) state (with map updated)
 */
function generateMap( state ) {
	// Initialize map
	for ( var row = 0; row < MAP_SIZE; row++ ) {
		state.map[row] = new Array(MAP_SIZE);
	}

	// Initialize height map
	var hmap = new Array( MAP_SIZE );
	for ( var row = 0; row < MAP_SIZE; row++ ) {
		hmap[row] = new Array( MAP_SIZE );
		for ( var col = 0; col < MAP_SIZE; col++ ) {
			hmap[row][col] = 0;
		}
	}

	// Initialize Corners
	hmap[0][0] = hmap[0][MAP_SIZE-1] = hmap[MAP_SIZE-1][MAP_SIZE-1] = hmap[MAP_SIZE-1][0] = 50;

	// Create heightmap with diamond-square algorithm
	var hmap = diamond_square( hmap, MAP_SIZE, MAP_SIZE );

	// Create game map from heightmap
	for ( var row = 0; row < MAP_SIZE; row++ ) {
		for ( var col = 0; col < MAP_SIZE; col++ ) {
			if ( hmap[row][col] < 66 ) {
				state.map[row][col] = {
					type: "water", style: Math.floor( Math.random() * 2 ),
					solid: true
				};
			} else if ( hmap[row][col] < 75 ) {
				state.map[row][col] = {
					type: "grass", style: Math.floor( Math.random() * 4 ),
					solid: false
				}
			} else if ( hmap[row][col] < 78 ) {
				state.map[row][col] = {
					type: "tree", style: Math.floor( Math.random() * 3 ),
					solid: false
				}
			} else {
				state.map[row][col] = {
					type: "mountain", style: Math.floor( Math.random() * 3 ),
					solid: true
				};
			}
		}
	}

	// Create windy path between castles (using A*)
	// This algorithm can fail, so re-run algorithm until successful
	var success = false;
	while ( !success ) {
		var pathmap = new Array( MAP_SIZE );
		for ( var row = 0; row < MAP_SIZE; row++ ) {
			pathmap[row] = new Array( MAP_SIZE );
			for ( var col = 0; col < MAP_SIZE; col++ ) {
				pathmap[row][col] = 0;
			}
		}
		success = buildPath( KEEP1.x, KEEP1.y, KEEP2.x, KEEP2.y, pathmap );
	}
	pathmap = success;

	// Convert path into tiles on map
	state.map = setPathStyles( state.map, pathmap, "path" );

	// Add a farm for each player within FARM_DIST moves away
	state.map = generateFarm( state.map, KEEP1.x+1, KEEP1.y );
	state.map = generateFarm( state.map, KEEP2.x-1, KEEP2.y );

	// Create lakes, islands, and beaches
	state.map = createIslands( state.map );
	state.map = createLakes( state.map );
	//state.map = createBeaches( state.map ); TODO

	// Castles
	state.map[KEEP1.y][KEEP1.x] = { type: "keep", style: 0, hp: 500, solid: true }
	state.map[KEEP2.y][KEEP2.x] = { type: "keep", style: 1, hp: 500, solid: true }

	return state;
}

/**
 * Creates a path between two points, with some random variation
 *
 * @param: (int) startX
 * @param: (int) startY
 * @param: (int) endX
 * @param: (int) endY
 * @param: (2d map) map
 *
 * @return: (2d map) map (updated with path)
 *          (bool) false (upon failure to build a path)
 */
function buildPath( startX, startY, endX, endY, map ) {
	// Base case: we're done
	if ( startX == endX && startY == endY ) {
		map[startY][startX] = 1;
		return map;
	}

	// Find A* path
	var grid = new PF.Grid( map );
	var finder = new PF.AStarFinder();
	var path = finder.findPath( startX, startY, endX, endY, grid );

	// if no path was found, then the algorithm failed and should be re-run
	if ( path.length == 0 ) {
		return false;
	}

	map[startY][startX] = 1;

	// Add random bend, calculate buildPath from there
	var r = Math.random();
	var dir = (r < 0.1) ? -1 : 0;
	dir = (r > 0.8) ? 1 : dir;
	if ( startX == path[1][0] ) {
		startX += dir;
		startX = (startX < 0 || startX >= MAP_SIZE) ? startX - dir : startX;
		startY = (dir == 0) ? path[1][1] : startY;
	} else {
		startX = (dir == 0) ? path[1][0] : startX;
		startY += dir;
		startY = (startY < 0 || startY >= MAP_SIZE) ? startY - dir : startY;
	}
	map[startY][startX] = 0;
	map = buildPath( startX, startY, endX, endY, map );

	return map;
}

/**
 * Sets the proper path style (bends, straight, T, etc.)
 * for a given pathmap
 *
 * @param: (2d array) state map
 * @param: (2d array) pathmap
 * @param: (string) type (eg. wall, river, path...)
 *
 * @return: (2d array) updated state map
 */
function setPathStyles( stateMap, pathmap, type ) {
	for ( var row = 0; row < MAP_SIZE; row++ ) {
		for ( var col = 0; col < MAP_SIZE; col++ ) {
			if ( pathmap[row][col] == 0 ) continue;
			if ( type == "free" ) {
				if ( stateMap[row][col].type != "path" ) {
					stateMap[row][col].type = "grass";
					stateMap[row][col].style = 0;
					stateMap[row][col].solid = false;
				}
				continue;
			}

			// Figure out style
			var style = 0;
			if ( col < MAP_SIZE-1 && row < MAP_SIZE-1
			     && pathmap[row][col+1] && pathmap[row+1][col] ) // ╔
				style = 1;
			if ( col > 0 && col < MAP_SIZE-1
			     && pathmap[row][col-1] && pathmap[row][col+1] ) // ═
				style = 2;
			if ( col > 0 && row < MAP_SIZE-1
			     && pathmap[row][col-1] && pathmap[row+1][col] ) // ╗
				style = 3;
			if ( row > 0 && row < MAP_SIZE-1
			     && pathmap[row-1][col] && pathmap[row+1][col] ) // ║
				style = 4;
			if ( row > 0 && col < MAP_SIZE-1
			     && pathmap[row-1][col] && pathmap[row][col+1] ) // ╚
				style = 6;
			if ( col > 0 && row > 0
			     && pathmap[row][col-1] && pathmap[row-1][col] ) // ╝
				style = 8;
			if ( col < MAP_SIZE-1 && row > 0 && row < MAP_SIZE-1
			     && pathmap[row-1][col] && pathmap[row+1][col] && pathmap[row][col+1] ) // ╠
				style = 9;
			if ( col > 0 && row > 0 && row < MAP_SIZE-1
			     && pathmap[row-1][col] && pathmap[row+1][col] && pathmap[row][col-1] ) // ╣
				style = 10;
			if ( col > 0 && row > 0 && col < MAP_SIZE-1
			     && pathmap[row][col-1] && pathmap[row-1][col] && pathmap[row][col+1] ) // ╩
				style = 11;
			if ( col > 0 && row < MAP_SIZE-1 && col < MAP_SIZE-1
			     && pathmap[row][col-1] && pathmap[row+1][col] && pathmap[row][col+1] ) // ╦
				style = 12;
			if ( col > 0 && row > 0 && col < MAP_SIZE-1 && row < MAP_SIZE-1
			     && pathmap[row][col-1] && pathmap[row-1][col] && pathmap[row][col+1] && pathmap[row+1][col] ) // ╬
				style = 0;

			// update map
			stateMap[row][col].style = style;
			stateMap[row][col].type = type;
			stateMap[row][col].solid = (type == "river" || type == "wall" );
		}
	}

	return stateMap;
}

/**
 * Creates a random height map
 *
 * @param: (int) map width
 * @param: (int) map height
 *
 * @return: (2d array) height map
 */
function diamond_square( hmap, width, height ) {
	if ( width <= 2 || height <= 2 ) return hmap;

	let scale = 5 * width;
	// Diamond average
	hmap[Math.floor(height/2)][Math.floor(width/2)] = (
		hmap[0][0] + hmap[0][width-1] + hmap[height-1][width-1] + hmap[height-1][0]
		+ Math.random() * scale - 0.5
	) / 4;

	// Square averages
	hmap[0][Math.floor(width/2)] = (
		hmap[0][0] + hmap[0][width-1] + hmap[Math.floor(height/2)][Math.floor(width/2)]
		+ Math.random() * scale - 0.5
	) / 3;
	hmap[Math.floor(height/2)][0] = (
		hmap[0][0] + hmap[Math.floor(height/2)][Math.floor(width/2)] + hmap[height-1][0]
		+ Math.random() * scale - 0.5
	) / 3;
	hmap[Math.floor(height/2)][width-1] = (
		hmap[0][width-1] + hmap[Math.floor(height/2)][Math.floor(width/2)] + hmap[height-1][width-1]
		+ Math.random() * scale - 0.5
	) / 3;
	hmap[height-1][Math.floor(width/2)] = (
		hmap[height-1][0] + hmap[Math.floor(height/2)][Math.floor(width/2)] + hmap[height-1][width-1]
		+ Math.random() * scale - 0.5
	) / 3;

	// Recursively calculate in each quadrant of hmap
	var q1 = new Array( Math.ceil(height/2) );
	var q2 = new Array( Math.ceil(height/2) );
	var q3 = new Array( Math.ceil(height/2) );
	var q4 = new Array( Math.ceil(height/2) );
	for ( var row = 0; row < Math.ceil(height/2); row++ ) {
		q1[row] = hmap[row].slice( Math.floor(width/2), width );
		q2[row] = hmap[row].slice( 0, Math.ceil(width/2) );
	}
	for ( var row = Math.floor(height/2); row < height; row++ ) {
		q3[row-Math.floor(height/2)] = hmap[row].slice( 0, Math.ceil(width/2) );
		q4[row-Math.floor(height/2)] = hmap[row].slice( Math.floor(width/2), width );
	}

	q1 = diamond_square( q1, Math.ceil(width/2), Math.ceil(height/2) );
	q2 = diamond_square( q2, Math.ceil(width/2), Math.ceil(height/2) );
	q3 = diamond_square( q3, Math.ceil(width/2), Math.ceil(height/2) );
	q4 = diamond_square( q4, Math.ceil(width/2), Math.ceil(height/2) );

	// Combine quadrants back together
	for ( var row = 0; row < Math.ceil(height/2); row++ ) {
		for ( var col = Math.floor(width/2); col < width; col++ ) {
			hmap[row][col] = q1[row][col-Math.floor(width/2)];
		}
	}
	for ( var row = 0; row < Math.ceil(height/2); row++ ) {
		for ( var col = 0; col < Math.ceil(width/2); col++ ) {
			hmap[row][col] = q2[row][col];
		}
	}
	for ( var row = Math.floor(height/2); row < height; row++ ) {
		for ( var col = 0; col < Math.ceil(width/2); col++ ) {
			hmap[row][col] = q3[row-Math.floor(height/2)][col];
		}
	}
	for ( var row = Math.floor(height/2); row < height; row++ ) {
		for ( var col = Math.floor(width/2); col < width; col++ ) {
			hmap[row][col] = q4[row-Math.floor(height/2)][col-Math.floor(width/2)];
		}
	}

	return hmap;
}

/**
 * Places farm by point on the map, adds a path to farm
 *
 * @param: (2d array) stateMap
 * @param: (int) x
 * @param: (int) y
 * 
 * @return: (2d array) stateMap (updated)
 */
function generateFarm( stateMap, x, y ) {
	var shiftX = Math.floor( (Math.random() - 0.5)*FARM_DIST );
	var shiftY = (shiftX < 0 ) ? (FARM_DIST + shiftX) : (FARM_DIST - shiftX);
	var farmX = x + shiftX;
	var farmY = y + shiftY; 

	// Create windy path between castle and farm (using A*)
	var success = false;
	while ( !success ) {
		var pathmap = new Array( MAP_SIZE );
		for ( var row = 0; row < MAP_SIZE; row++ ) {
			pathmap[row] = new Array( MAP_SIZE );
			for ( var col = 0; col < MAP_SIZE; col++ ) {
				pathmap[row][col] = 0;
			}
		}
		success = buildPath( x, y, farmX, farmY, pathmap );
	}
	pathmap = success;

	// Convert path into tiles on map
	stateMap = setPathStyles( stateMap, pathmap, "free" );
	stateMap[farmY][farmX] = {
		type: "farm", style: Math.floor(Math.random() * 4), solid: false
	};

	return stateMap;
}

/**
 * TODO: Needs some work...
 * Finds grass that is touching water. Uses setPathStyles() to set
 * beach style.
 *
 * @param: (2d array) stateMap
 *
 * @return: (2d array) stateMap (updated)
 */
function createBeaches( stateMap ) {
	// Create beach map mask
	var beachMap = new Array( MAP_SIZE );
	for ( var row = 0; row < MAP_SIZE; row++ ) {
		beachMap[row] = new Array( MAP_SIZE );
		for ( var col = 0; col < MAP_SIZE; col++ ) {
			beachMap[row][col] = 0;
			if ( stateMap[row][col].type != "grass" ) continue;
			if ( row > 0 && stateMap[row-1][col].type == "water" ) {
				beachMap[row][col] = 1;
			} else if ( row < MAP_SIZE-1 && stateMap[row+1][col].type == "water" ) {
				beachMap[row][col] = 1;
			} else if ( col > 0 && stateMap[row][col-1].type == "water" ) {
				beachMap[row][col-1] = 1;
			} else if ( col < MAP_SIZE-1 && stateMap[row][col+1].type == "water" ) {
				beachMap[row][col] = 1;
			}
		}
	}

	stateMap = setPathStyles( stateMap, beachMap, "beach" );

	return stateMap;
}

/**
 * Create islands on map
 *
 * @param: (2d array) stateMap
 *
 * @return: (2d array) stateMap (updated)
 */
function createIslands( stateMap ) {
	for ( var row = 0; row < MAP_SIZE; row++ ) {
		for ( var col = 0; col < MAP_SIZE; col++ ) {
			if ( stateMap[row][col].type == "water" ) continue;
			if ( row > 0 && stateMap[row-1][col].type != "water" ) {
				continue;
			} else if ( row < MAP_SIZE-1 && stateMap[row+1][col].type != "water" ) {
				continue;
			} else if ( col > 0 && stateMap[row][col-1].type != "water" ) {
				continue;
			} else if ( col < MAP_SIZE-1 && stateMap[row][col+1].type != "water" ) {
				continue;
			} else {
				stateMap[row][col] = {
					type: "island", style: Math.floor( Math.random() * 4 ),
					solid: false
				};
			}
		}
	}

	return stateMap;
}

/**
 * Create lakes on map
 *
 * @param: (2d array) stateMap
 *
 * @return: (2d array) stateMap (updated)
 */
function createLakes( stateMap ) {
	for ( var row = 0; row < MAP_SIZE; row++ ) {
		for ( var col = 0; col < MAP_SIZE; col++ ) {
			if ( stateMap[row][col].type != "water" ) continue;
			if ( row > 0 && stateMap[row-1][col].type == "water" ||
			     row > 0 && stateMap[row-1][col].type == "island" ) {
				continue;
			} else if ( row < MAP_SIZE-1 && stateMap[row+1][col].type == "water" ||
			            row < MAP_SIZE-1 && stateMap[row+1][col].type == "island" ) {
				continue;
			} else if ( col > 0 && stateMap[row][col-1].type == "water" ||
			            col > 0 && stateMap[row][col-1].type == "island" ) {
				continue;
			} else if ( col < MAP_SIZE-1 && stateMap[row][col+1].type == "water" ||
			            col < MAP_SIZE-1 && stateMap[row][col+1].type == "island" ) {
				continue;
			} else {
				stateMap[row][col] = {
					type: "lake", style: 0, solid: true
				};
			}
		}
	}

	return stateMap;
}
