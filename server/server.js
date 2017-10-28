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
var userModule = require( './controllers/user.js' );
 
wss.on( 'connection', function connection( ws ) {
	ws.on( 'message', function incoming( message ) {
		var clientObj = JSON.parse( message );
		switch( clientObj.msgType ) {
			case "start":
				var validUser = userModule.verifyUser( clientObj.username, clientObj.passHash );
				if ( !validUser ) { /* TODO: Err: invalid login*/ break; }

				var gameID = addToQueue( clientObj.gameName, clientObj.username );
				if ( gameID == -1 ) { /* TODO: Err: invalid game*/ break; }
				var gameIDMsg = { msgType : "gameID", gameID : gameID, }; 
				ws.send( JSON.stringify( gameIDMsg ) );

				// Add current connection to the clients[] array
				clients.push( { connection : ws, username : clientObj.username } );

				if ( gameReady( gameID ) ) { // TODO: fn
					var gameState = startGame( gameID ); // TODO: fn retval JSON

					// Send state to player 1
					ws.send( JSON.stringify( gameState ) );
				}
				break;
			case "move":
				// TODO: Handle move
				var validGameID = verifyGameID( clientObj.gameID );
				if ( !validGameID ) { /* TODO: Err: invalid gameID*/ break; }

				var gameState = makeMove( clientObj.gameID, clientObj.move, clientObj.username );
				switch( gameState.gameOver ) {
					case 0:
						// Send the current state to the next player
						getClientConn( clients, gameState.nextPlayer ).send(
							JSON.stringify( gameState )
						);
						break;
					case 1:
						// TODO: Send game over msg to game clients
						// TODO: End connection with clients, remove from clients[] array
						break;
					default:
						// TODO: Err: Something went wrong with the game state
				}
				break;
			default:
				// TODO: Err: invalid msgType
		}
	} );
} );

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
			return 0;
		}
	}
}

/**
 * Verifies a user's login info
 * 
 * @param: (string) username
 * @param: (string) passHash
 *
 * @return: (bool) pass or fail
 *
function verifyUser( username, passHash ) {
	
	return false;
} */
