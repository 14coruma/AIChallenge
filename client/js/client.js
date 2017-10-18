/**
 * client.js handles the AIChallenge client
 *
 * Created by: Andrew Corum, 6 Oct 2017
 */
'use strict';

// Globals
var bcrypt = require( 'bcryptjs' );
const saltRounds = 10;
var myGameID = "";
var username = "";
var passHash = "";
var game = "";
var websocket;

var startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', function() {
	username = document.getElementById( 'formUsername' ).value;
	game     = document.getElementById( 'selectGame' ).value;

	// Get password and hash it
	var password = document.getElementById( 'formPassword' ).value;
	bcrypt.hash( password, saltRounds, function( err, hash ) {
		passHash = hash;
	} );

	var wsUri = "ws://localhost:8080/";
	websocket = new WebSocket( wsUri );
	websocket.onopen = function( evt ) { onOpen( evt ) };
	websocket.onmessage = function( evt ) { onMessage( evt ) };
	websocket.onerror = function( evt ) { onError( evt ) };

	return false;
} );

function onOpen( evt )
{
	// Open 'waiting' div
	var message = {
		msgType  : "start",
		username : username,
		passHash : passHash,
		gameName : game,
		gameID   : "",
		move     : "",
	};
	websocket.send( JSON.stringify( message ) );
}

function onMessage( evt )
{
	var serverObj = JSON.parse( evt.data );
	switch( serverObj.msgType ) {
		case "gameID":
			myGameID = serverObj.gameID;
			// TODO Show div (Playing... watch <here>, etc.)
			break;
		case "playersTurn":
			// TODO Run bot program. Save result. Send result.
			var message = {
				msgType  : "move",
				username : username,
				passHash : passHash,
				gameName : game,
				gameID   : gameID,
				move     : "5",
			}
			websocket.send( JSON.stringify( message ) );
			break;
		case "gameOver":
			// TODO Show div with gameover info
			websocket.close();
			break;
		default:
			// TODO: Err: Something went wrong
	}
}

function onError( evt )
{
	//TODO '<span style="color: red;">ERROR:</span> ' + evt.data; // Send error msg
}
