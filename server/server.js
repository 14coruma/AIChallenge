/**
 * server.js runs the main nodejs express server and
 * WebSocket server for AIChallenges
 *
 * Created by: Andrew Corum: 2 Oct 2017
 */

"use strict";

/**
 * Express Server
 */
var express = require( 'express' );
var app     = express(); 
var routes  = require( './routes/routes' );

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
		this.timeout;
	}
	saveState(gid, state) {
		this.stateList[gid] = state;
		gm.saveState(gid, state);
	}
	startTime(gid, state) {
		this.timeout = setTimeout( function() {
			var message = { msgType: "gameOver", state: state, gid: gid };
			for (var i = 0; i < state.players.length; i++) {
				sendMessage( state.players[i].username, message );
				delete clients.clientList[state.players[i].username];
			}
			gm.endLiveGame( gid, state, function(res) { /*TODO ERR?*/ } );
			delete states.stateList[gid];
		}, 600000 );
	}
	endTime(gid){
		clearTimeout(this.timeout);
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
							// Automatically add "defaultBot" to queue as well
							gm.addToQueue( msgObj.gameName, "defaultBot", function( validGame ) {
								gm.gameReady( msgObj.gameName, function( ready, gameID, userNames ) { 
									if ( ready ) { // This should always be true...hopefully
										clients.clientList[msgObj.username].gid = gameID;
										gm.startGame( gameID, userNames, function( state ) {
											// Send state to player 1
											var message = { msgType: "playersTurn", state: state, gid: gameID };
											sendMessage( msgObj.username, message );
											states.saveState( gameID, state );
											states.startTime( gameID, state );
										} );
									}
								} );
							} );
						}
					} );
				} );


				break;
			case "move":
				if ( msgObj.gid != clients.clientList[msgObj.username].gid ) { console.log("invalid gameID\n"); break; }
				states.endTime( msgObj.gid );
				gm.makeMove( states.stateList[msgObj.gid], msgObj.move, function( state ) {
					switch( state.gameOver ) {
						case 0:
							// Send the current state to the next player
							if ( state.players[state.currentPlayer].username == "defaultBot" ) {
								states.saveState(msgObj.gid, state);
								makeBotMove( msgObj, state );
							} else {
								var message = { msgType: "playersTurn", state: state, gid: msgObj.gid };
								sendMessage( msgObj.username, message );
								states.saveState(msgObj.gid, state);
								states.startTime( msgObj.gid, state );
							}
							break;
						case 1:
							var message = { msgType: "gameOver", state: state, gid: msgObj.gid };
							sendMessage( msgObj.username, message );
							delete clients.clientList[msgObj.username];
							gm.endLiveGame( msgObj.gid, state, function(res) { /*TODO ERR?*/ } );
							delete states.stateList[msgObj.gid];
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

	ws.on( 'error', function handle( err ) {
		console.log( err );
	} );
} );

/*
 * Makes a bot move (or multiple moves) for a given game
 */
function makeBotMove( msgObj, state ) {
	var message = { msgType: "playersTurn", state: state, gid: msgObj.gid };
	var msgString = JSON.stringify( message );
	var args = [msgString];
	var botFile = "";
	switch ( state.game ) {
		case "mancala":
			botFile = "../bots/mancala/Mancala.exe";
			break;
		case "farkle":
			botFile = "../bots/farkle/lowerLimit";
			break;
	}
	const { execFile } = require('child_process');
	const child = execFile( botFile, args, (error, stdout, stderr ) => {
		if ( error ) console.log( error + " stderr: " + stderr + " stdout: " + stdout );
		gm.makeMove( states.stateList[msgObj.gid], stdout, function( state ) {
			if ( state.players[state.currentPlayer].username == "defaultBot" ) {
				states.saveState(msgObj.gid, state);
				makeBotMove( msgObj, state );
			} else {
				sendMessage( msgObj.username, message );
				states.saveState( msgObj.gid, state );
				states.startTime( msgObj.gid, state );
			}
		} );
	} );
}

/**
 * Returns the state for a given gameID
 * 
 * @param: gid
 * @param: callback, function
 */
exports.getState = function( gid, callback ) {
	callback( states.stateList[gid] );
}

/**
 * Sends a message to a client in the connection list
 * Handles errors by ending any liveGame and removing the connection
 *
 * @param: index, key for clientList hash
 * @param: message, the JSON message to send client
 */
function sendMessage( index, message ) {
	try {
		// Send message
		clients.clientList[index].conn.send(JSON.stringify( message ));
	} catch ( err ) {
		// Connection must have been closed, so end the liveGame
		delete clients.clientList[index];
		gm.endLiveGame( message.gid, message.state, function(res ) { /*ERR?*/ } );
		delete states.stateList[message.gid];
	}
}
