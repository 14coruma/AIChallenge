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
		if ( getClientIndex( clients, clientObj.username ) == -1 ) {
			clients.push( { connection : ws, username : clientObj.username, validUser: false, validGame: false, gid: -1 } );
		}
		var clientIndex = getClientIndex( clients, clientObj.username );
		switch( clientObj.msgType ) {
			case "start":
				um.verifyUser( clientObj.username, clientObj.passHash, function( validUser ) {
					clients[clientIndex].validUser = validUser;
					gm.addToQueue( clientObj.gameName, clientObj.username, function( validGame ) {
						clients[clientIndex].validGame = validGame;
						if ( !(validUser && validGame) ) {
							// Remove user from queue if timeout was triggered
							gm.deleteFromQueue( clientObj.gameName, clientObj.username, function() { } );
							clients.splice( clientIndex, 1 );
						} else {
							// Otherwise check to see if game is ready to play
							gm.gameReady( clientObj.gameName, function( ready, gameID, userNames ) { 
								if ( ready ) {
									for ( var i = 0; i < userNames.length; i++ ) {
										clients[getClientIndex( clients, userNames[i] )].gid = gameID;
									}
									gm.startGame( gameID, userNames, function( state ) {
										// Send state to player 1
										var message = { msgType: "playersTurn", state: state };
										console.log( JSON.stringify( message ) );
										getClientConn( clients, userNames[0] ).send( JSON.stringify( message ) );
										console.log( "\n to User: " + userNames[0] + " with conn " + getClientConn( clients, userNames[0] ) );
										states.push( state );
									} );
								}
							} );
						}
					} );
				} );


				break;
			case "move":
				if ( clientObj.gameID != clients[clientIndex].gid ) { /* TODO: Err: invalid gameID*/ break; }
				var stateIndex = getStateIndex( states, clientObj.gameID );
				gm.makeMove( states[stateIndex], clientObj.move, function( state ) {
					switch( state.gameOver ) {
						case 0:
							// Send the current state to the next player
							var message = { msgType: "playersTurn", state: state };
							var nextPlayer = state.players[state.currentPlayer].username;
							getClientConn( clients, nextPlayer ).send(
								JSON.stringify( message )
							);
							states[stateIndex] = state;
							console.log( "\nplayer1: " + state.players[0].score + "  player2: " + state.players[1].score );
							break;
						case 1:
							// TODO: Send game over msg to game clients
							// TODO: End connection with clients, remove from clients[] array
							break;
						default:
							// TODO: Err: Something went wrong with the game state
					}
				} );
				break;
			default:
				// TODO: Err: invalid msgType
		}
	} );
} );

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
		}
	}
	return -1;
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
		}
	}
	return -1
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
		}
	return -1;
	}
}
