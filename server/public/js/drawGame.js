/**
 * drawGame.js draws the game state of a currently running game based on its id
 *
 * Created by: Andrew Corum, 11 Nov 2017
 */

'use strict';
var stopDrawing = false;

window.onload = async function() {
	// First update the list of viewable games in the select form
	updateSelectGame();
}

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
 * draw the game state
 */
async function drawGameState(gameID) {
	if ( gameID == -1 ) gameID = document.getElementById( 'selectGame' ).value;
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", "/api/liveGames/type?gameID=" + gameID, false );
	xmlHttp.send( null );
	let gameName = xmlHttp.responseText;
	let res = "";
	while( true ) {
		switch( gameName ) {
			case "testGame":
				xmlHttp.open( "GET", "/api/liveGames/state?gameID=" + gameID, false );
				xmlHttp.send( null );
				res = xmlHttp.responseText;
				if ( res ) {
					let state = JSON.parse( res );
					drawTestGame( state );
				} else {
					console.log( "GAME ENDED" );
					drawGameEnded( -1 );
				}
				break;
			case "mancala":
				xmlHttp.open( "GET", "/api/liveGames/state?gameID=" + gameID, false );
				xmlHttp.send( null );
				res = xmlHttp.responseText;
				if ( res ) {
					let state = JSON.parse( res );
					drawMancala( state );
				} else {
					console.log( "GAME ENDED" );
					drawGameEnded( -1 );
				}
				break;
			default:
				console.log( "gameName, " + gameName + " not recognized" );
		}
		await sleep(200);
	}
}

function sleep( ms ) {
	return new Promise( resolve => setTimeout( resolve, ms ) );
}
