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

app.listen( 3001 );

/**
 * WebSocket Server
 */
class Clients {
	constructor() {
		this.clientList = {};
		this.saveClient = this.saveClient.bind(this);
	}
	saveClient(username, conn) {
		this.clientList[username] = {
			conn: conn,
			validUser: false,
			validGame: false,
			gid: -1
		};
	}
}

class States {
	constructor() {
		this.stateList = {};
		this.saveState = this.saveState.bind(this);
	}
	saveState(gid, state) {
		this.stateList[gid] = state;
	}
}

var WebSocket = require( 'ws' );
var wss = new WebSocket.Server( { port: 8080 } );
var clients = new Clients();
var states = new States();
var um = require( './controllers/user.js' );
var gm = require( './controllers/gameManager.js' );

wss.on( 'connection', function connection( ws ) {
	ws.on( 'message', function incoming( message ) {
		var msgObj = JSON.parse( message );
		// Add current connection to the clients[] array (if it's not there already)
		if (!(msgObj.username in clients.clientList)) {
			clients.saveClient(msgObj.username, ws);
		}
		switch( msgObj.msgType ) {
			case "start":
				um.verifyUser( msgObj.username, msgObj.password, function( validUser ) {
					clients.clientList[msgObj.username].validUser = validUser;
					gm.addToQueue( msgObj.gameName, msgObj.username, function( validGame ) {
						clients.clientList[msgObj.username].validGame = validGame;
						if ( !(validUser && validGame) ) {
							// Remove user from queue if timeout was triggered
							gm.deleteFromQueue( msgObj.gameName, msgObj.username, function() { } );
							//clients.splice( clientIndex, 1 );
							delete clients.clientList[msgObj.username];
						} else {
							// Otherwise check to see if game is ready to play
							gm.gameReady( msgObj.gameName, function( ready, gameID, userNames ) { 
								if ( ready ) {
									for ( var i = 0; i < userNames.length; i++ ) {
										clients.clientList[userNames[i]].gid = gameID;
									}
									gm.startGame( gameID, userNames, function( state ) {
										// Send state to player 1
										var message = { msgType: "playersTurn", state: state, gid: gameID };
										clients.clientList[userNames[0]].conn.send( JSON.stringify( message ) );
										states.saveState(gameID, state);
									} );
								}
							} );
						}
					} );
				} );


				break;
			case "move":
				if ( msgObj.gid != clients.clientList[msgObj.username].gid ) { console.log("invalid gameID\n"); break; }
				gm.makeMove( states.stateList[msgObj.gid], msgObj.move, function( state ) {
					switch( state.gameOver ) {
						case 0:
							// Send the current state to the next player
							var message = { msgType: "playersTurn", state: state, gid: msgObj.gid };
							var nextPlayer = state.players[state.currentPlayer].username;
							clients.clientList[nextPlayer].conn.send(JSON.stringify( message ));
							states.stateList[msgObj.gid] = state;
							break;
						case 1:
							var message = { msgType: "gameOver", state: state, gid: msgObj.gid };
							for (var i = 0; i < state.players.length; i++) {
								clients.clientList[state.players[i].username].conn.send(JSON.stringify(message));
								console.log( JSON.stringify(message) + "sent" );
								delete clients.clientList[state.players[i].username];
							}
							gm.deleteLiveGame( msgObj.gid, function(res) { /*TODO ERR?*/ } );
							states.stateList[msgObj.gid] = state;
							break;
						default:
							// TODO: Err: Something went wrong with the game state
					}
				} );
				break;
			default:
				console.log( "ERROR: invalid message type: " + msgObj.msgType );
		}
	} );
} );

/**
 * Returns the state for a given gameID
 */
exports.getState = function( gid, callback ) {
	callback( states.stateList[gid] );
}
