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
var trainingMode = false;
var game = "";
var bot = "";
var wsUri = "ws://localhost:8080/";
var websocket = new WebSocket( wsUri );
const { execFile } = require('child_process');

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

function onOpen( evt )
{
	// TODO: Open 'waiting' div
	password = document.getElementById( 'formPassword' ).value;
	trainingMode = document.getElementById( 'trainingMode' ).value;
	var message = {
		msgType  : "start",
		username : username,
		password : password,
		gameName : game,
		gid      : "",
		move     : "",
		training : trainingMode,
	};
	websocket.send( JSON.stringify( message ) );
	console.log("SENT A MESSAGE\n");
}

function onMessage( evt )
{
	var serverObj = JSON.parse( evt.data );
	var objString = JSON.stringify( serverObj );
	var args = [objString];
	gid = serverObj.gid;
	switch( serverObj.msgType ) {
		case "playersTurn":
			const child = execFile(bot, args, (error, stdout, stderr) => {
				if ( error ) console.log(error + " stderr: " + stderr + " stdout: " + stdout);
				var message = {
					msgType  : "move",
					username : username,
					password : password,
					gameName : game,
					gid      : gid,
					move     : stdout,
					training : trainingMode,
				}
				websocket.send( JSON.stringify( message ) );
			});
			break;
		case "gameOver":
			// TODO Show div with gameover info
			execFile(bot, args, (error, stdout, stderr) => {
				if ( error ) console.log(error + " stderr: " + stderr + " stdout: " + stdout); } );
			console.log("GameOver");
			if ( trainingMode ) {
				onOpen(null);
			}
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
