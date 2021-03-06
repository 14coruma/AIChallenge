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
var drawing = false;
var wsUri = "ws://localhost:8080/"; // Set ip address to local server
var websocket = new WebSocket( wsUri );
websocket.onmessage = function( evt ) { onMessage( evt ) };
websocket.onerror = function( evt ) { onError( evt ) };
websocket.onclose = function( evt ) { onClose( evt ) };

window.onload = async function() {
	gid = "";
	game = "";
	document.getElementById( 'formMove' ).value = "";
}

window.onbeforeunload = function() {
	websocket.close();
};

/**
 * Send request to server to start a game
 */
function startGame() {
	username = document.getElementById( 'hiddenUsername' ).value;
	password = document.getElementById( 'hiddenPassword' ).value;
	game = document.getElementById( 'selectGame' ).value;
	var gameWarning = document.getElementById( 'selectGameWarning' );
	var loginWarning = document.getElementById( 'loginWarning' );
	if ( game === "" ) {
		gameWarning.style.display = '';
		return;
	} else if ( username === "" ) {
		loginWarning.style.display = '';
		return;
	} else {
		gameWarning.style.display = 'none';
		loginWarning.style.display = 'none';
	}
	var message = {
		msgType  : "start",
		username : username,
		password : password,
		gameName : game,
		gid      : "",
		move     : "",
	};
	websocket.send( JSON.stringify( message ) );
	document.getElementById( 'startBtn' ).disabled = true;
	document.getElementById( 'startBtn' ).innerHTML = "Refresh page to start new game.";
	//drawWaitingImage();
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
	switch( serverObj.msgType ) {
		case "playersTurn":
			document.getElementById( 'makeMoveBtn' ).disabled = false;
			if ( serverObj.state.game == "warring" ) {
				setTimeout( function() { makeMove(); moveObjWarring = {updates:[]}; }, 500 );
			}
			if ( !drawing ) {
				drawGameState( gid );
				drawing = true;
			}
			break;
		case "gameOver":
			drawGameState( gid );
			drawing = false;
			break;
		default:
			// TODO: Err: Something went wrong
	}
}

/**
 * Send a player's move to the websocket
 */
function makeMove() {
	var formMove = document.getElementById( 'formMove' ).value;
	var message = {
		msgType  : "move",
		username : username,
		password : password,
		gameName : game,
		gid      : gid,
		move     : formMove,
	}
	switch( game ) {
		case "farkle":
			resetFarkleBank();
			break;
	}
	websocket.send( JSON.stringify( message ) );
	document.getElementById( 'makeMoveBtn' ).disabled = true;
}

/**
 * Close websocket connection, sending closed message to sever
 */
function onClose() {
	var message = {
		msgType : "close",
		username : username,
		password : password,
	}
	websocket.send( JSON.stringify( message ) );
}
