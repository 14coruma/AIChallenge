/**
 * server.js runs the main nodejs express server and
 * WebSocket server for AIChallenges
 *
 * Created by: Andrew Corum: 2 Oct 2017
 */

/**
 * Express Server
 */
var express = require( 'express' );
var app = express(); 
var routes = require( './routes/routes' );

app.use( express.static( 'public' ));
routes( app );

app.listen( 8000 );

/**
 * WebSocket Server
 */
var WebSocket = require( 'ws' );
var wss = new WebSocket.Server( { port: 8080 } );
var clients = [];
var states = [];
var um = require( './controllers/user.js' );
var gm = require( './controllers/gameManager.js' );

wss.on( 'connection', function connection( ws ) {
	ws.on( 'message', function incoming( message ) {
		var clientObj = JSON.parse( message );
		// Add current connection to the clients[] array (if it's not there already)
		// Ths will keep track of whether or not the user has been verified
		if ( getClientIndex( clients, clientObj.username ) === -1 ) {
			clients.push( { connection : ws, username : clientObj.username, validUser: false, validGame: false, gid: -1 } );
		}
		var clientIndex = getClientIndex( clients, clientObj.username );
		switch( clientObj.msgType ) {
			case "start":
				um.verifyUser( clientObj.username, clientObj.passHash, function( validUser ) {
					clients[clientIndex].validUser = validUser;
				} );
				gm.addToQueue( clientObj.gameName, clientObj.username, function( validGame ) {
					clients[clientIndex].validGame = validGame;
				} );

				waitForReady( clientIndex, function( ready ) {
					if ( !ready ) {
						// Remove user from queue if timeout was triggered
						gm.deleteFromQueue( gameName, username );
						clients.splice( clientIndex, 1 );
					} else {
						// Otherwise check to see if game is ready to play
						gm.gameReady( gameName, function( ready, gameID, userNames ) { 
							for ( var i = 0; i < userNames.length; i++ ) {
								clients[getClientIndex( clients, userNames[i] )].gid = gameID;
							}
							startGame( gameID, userNames, function( state ) {
								var gameState = state; 
								// Send state to player 1
								getClientConn( clients, userNames[0] ).send( JSON.stringify( gameState ) );
								states.push( state );
							} );
						} );
					}
				} );

				break;
			case "move":
				if ( clientObj.gameID != clients[clientIndex].gid ) { /* TODO: Err: invalid gameID*/ break; }
				var stateIndex = getStateIndex( states, clientObj.gameID );
				gm.makeMove( states[stateIndex], clientObj.move, function( state ) {
					switch( state.gameOver ) {
						case 0:
							// Send the current state to the next player
							var nextPlayer = state.players[state.currentPlayer].username;
							getClientConn( clients, nextPlayer ).send(
								JSON.stringify( state )
							);
							states[stateIndex] = state;
							break;
						case 1:
							// TODO: Send game over msg to game clients
							// TODO: End connection with clients, remove from clients[] array
							break;
						default:
							// TODO: Err: Something went wrong with the game state
					}
					break;
				} );
			default:
				// TODO: Err: invalid msgType
		}
	} );
} );

/**
 * Checks to see if a user has been validated. Returns true if ready,
 * otherwise hits a timeout and returns false
 * 
 * @param: (int) clientIndex
 * @param: (fn) callback
 *
 * @return: (bool) Whether or not the user is ready
 */
function waitForReady( clientIndex, callback ) {
	setTimeout( callback(false), 1000 );
	var ready = false;
	while ( !ready ) {
		ready = clients[clientIndex].validUser && clients[clientIndex].validGame;
	}
	callback(true);
}

/**
 * Searches the states[] array for a game state by its id
 * 
 * @param: (array) states srray
 * @param: (string) lgid
 *
 * @return: (int) index
 */
function getStateIndex( stateArray, id ) {
	for ( var i = 0; i < stateArray.length; i++ ) {
		if ( stateArray[i].id === id ) {
			return i;
		} else {
			return -1;
		}
	}
}

/**
 * Searches the client[] array for a user's index in the array
 * 
 * @param: (array) clientArray
 * @param: (string) username
 *
 * @return: (int) index
 */
function getClientIndex( clientArray, username ) {
	for ( var i = 0; i < clientArray.length; i++ ) {
		if ( clientArray[i].username === username ) {
			return i;
		} else {
			return -1;
		}
	}
}

/**
 * Searches the client[] array for a user's connection
 * 
 * @param: (array) clientArray
 * @param: (string) username
 *
 * @return: WebSocket Connection
 */
function getClientConn( clientArray, username ) {
	for ( var i = 0; i < clientArray.length; i++ ) {
		if ( clientArray[i].username === username ) {
			return clientArray[i].connection;
		} else {
			return -1;
		}
	}
}
