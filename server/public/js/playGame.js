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
var wsUri = "ws://153.106.86.30:8080/"; // Set ip address to local server
var websocket = new WebSocket( wsUri );
websocket.onmessage = function( evt ) { onMessage( evt ) };
websocket.onerror = function( evt ) { onError( evt ) };
websocket.onclose = function( evt ) { onClose( evt ) };

window.onload = async function() {
	// First update the list of viewable games in the select form
	// updateSelectGame();
}

window.onbeforeunload = function() {
	websocket.close();
};

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

/**
 * Send request to server to start a game
 */
function startGame() {
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
	switch( serverObj.msgType ) {
		case "playersTurn":
			document.getElementById( 'makeMoveBtn' ).disabled = false;
			if ( serverObj.state.game == "warring" ) {
				setTimeout( function() { makeMove(); moveObjWarring = {updates:[]}; }, 400 );
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
