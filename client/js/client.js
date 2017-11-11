/**
 * client.js handles the AIChallenge client
 *
 * Created by: Andrew Corum, 6 Oct 2017
 */
'use strict';

// Globals
var gid = "";
var username = "";
var password = "";
var game = "";
var bot = "";
var wsUri = "ws://localhost:8080/";
var websocket = new WebSocket( wsUri );
websocket.onmessage = function( evt ) { onMessage( evt ) };
websocket.onerror = function( evt ) { onError( evt ) };

var startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', function() {
	username = document.getElementById( 'formUsername' ).value;
	game = document.getElementById( 'selectGame' ).value;
	bot = document.getElementById('formBot').files[0].path;

	onOpen(null);

	return false;
} );

//websocket.onmessage = function( evt ) { onMessage( evt ) };

function onOpen( evt )
{
	// Open 'waiting' div
	password = document.getElementById( 'formPassword' ).value;
	var message = {
		msgType  : "start",
		username : username,
		passHash : password,
		gameName : game,
		gid      : "",
		move     : "",
	};
	websocket.send( JSON.stringify( message ) );
	console.log("SENT A MESSAGE\n");
}

function onMessage( evt )
{
	var serverObj = JSON.parse( evt.data );
	//console.log( "Got a message: " + JSON.stringify( serverObj ) );
	gid = serverObj.gid;
	switch( serverObj.msgType ) {
		case "playersTurn":
			// TODO Run bot program. Save result. Send result.
			//let move = Math.floor(Math.random() * 10) + 1;
			const { execFile } = require('child_process');
			const child = execFile(bot, (error, stdout, stderr) => {
				if ( error ) console.log(error + " stdout: " + stderr);
				var message = {
					msgType  : "move",
					username : username,
					password : password,
					gameName : game,
					gid      : gid,
					move     : stdout
				}
				websocket.send( JSON.stringify( message ) );
			});
			break;
		case "gameOver":
			// TODO Show div with gameover info
			console.log("GameOver");
//			websocket.close();
			break;
		default:
			// TODO: Err: Something went wrong
	}
}

function onError( evt )
{
	console.log( "ERROR\n");
	//TODO '<span style="color: red;">ERROR:</span> ' + evt.data; // Send error msg
}
