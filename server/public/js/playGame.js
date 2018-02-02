/**
 * playGame.js controls human game play
 *
 * Created by: Andrew Corum, 17 Nov 2017
 */

'use strict';

// Globals
var gid = "";
var username = "";
var password = "";
var game = "";
var state = {};
var wsUri = "ws://localhost:8080/";
var websocket = new WebSocket( wsUri );
websocket.onmessage = function( evt ) { onMessage( evt ) };
websocket.onerror = function( evt ) { onError( evt ) };

window.onload = async function() {
	// First update the list of viewable games in the select form
	// updateSelectGame();
}

// TODO: Change to update based on game options (rather than live games)
function updateSelectGame() {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", "/api/liveGames/list", false );
	xmlHttp.send( null );
	let res = JSON.parse( xmlHttp.responseText );
	var selector = document.getElementById( 'selectGame' );
	while ( selector.length > 0 ) {
		selector.remove( 0 );
	}
	for ( var i = 0; i < res.length; i++ ) {
		var option = document.createElement( "option" );
		option.text = "GameID: " + res[i].id;
		option.value = res[i].id;
		selector.appendChild( option );
	}
}

function startGame() {
	// TODO:  Open 'waiting' div
	username = document.getElementById( 'formUsername' ).value;
	password = document.getElementById( 'formPassword' ).value;
	game = document.getElementById( 'selectGame' ).value;
	var message = {
		msgType  : "start",
		username : username,
		password : password,
		gameName : game,
		gid      : "",
		move     : "",
	};
	websocket.send( JSON.stringify( message ) );
	drawWaitingImage();
}

/**
 * Handle a message from the websocket.
 * Enable a players turn or show game over screen
 */
function onMessage( evt )
{
	var serverObj = JSON.parse( evt.data );
	gid = serverObj.gid;
	state = serverObj.state;
	console.log( "Message: " + evt.data);
	switch( serverObj.msgType ) {
		case "playersTurn":
			document.getElementById( 'makeMoveBtn' ).disabled = false;
			drawGameState( gid );
			console.log( "HERE" );
			break;
		case "gameOver":
			drawGameState( gid );
			console.log("GameOver");
//			websocket.close();
			break;
		default:
			// TODO: Err: Something went wrong
	}
}

/**
 * Send a player's move to the websocket
 */
function makeMove() {
	var move = document.getElementById( 'formMove' ).value;
	var message = {
		msgType  : "move",
		username : username,
		password : password,
		gameName : game,
		gid      : gid,
		move     : move,
	}
	websocket.send( JSON.stringify( message ) );
	console.log( JSON.stringify( message ) );
	document.getElementById( 'makeMoveBtn' ).disabled = true;
}
