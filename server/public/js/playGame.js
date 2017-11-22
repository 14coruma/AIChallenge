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
	console.log( "SENT A MESSAGE\n" );
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
			drawGameState();
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

/**
 * draw the game state
 */
async function drawGameState() {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", "/api/liveGames/type?gameID=" + gid, false );
	xmlHttp.send( null );
	let gameName = xmlHttp.responseText;
	var res;
	while( true ) {
		switch( gameName ) {
			case "testGame":
				xmlHttp.open( "GET", "/api/liveGames/state?gameID=" + gid, false );
				xmlHttp.send( null );
				res = xmlHttp.responseText;
				if ( res ) {
					let state = JSON.parse( res );
					drawTestGame( state );
				} else {
					console.log( "GAME ENDED" );
					drawGameEnded();
				}
				break;
			case "mancala":
				xmlHttp.open( "GET", "/api/liveGames/state?gameID=" + gid, false );
				xmlHttp.send( null );
				res = xmlHttp.responseText;
				if ( res ) {
					let state = JSON.parse( res );
					drawMancala( state );
				} else {
					console.log( "GAME ENDED" );
					drawGameEnded();
				}
				break;
			default:
				console.log( "gameName: " + gameName + " not recognized" );
		}
		await sleep(200);
	}
}

/**
 * simple sleep function for async functions
 */
function sleep( ms ) {
	return new Promise( resolve => setTimeout( resolve, ms ) );
}
