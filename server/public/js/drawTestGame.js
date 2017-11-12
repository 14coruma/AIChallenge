/**
 * drawTestGame.js draws the game state of a testGame state
 *
 * Created by: Andrew Corum, 11 Nov 2017
 */

'use strict';

function drawTestGame( state ) {
	var canvas = document.getElementById( "myCanvas" );
	var ctx = canvas.getContext( "2d" );
	ctx.clearRect( 0, 0, canvas.width, canvas.height );
	ctx.font = "30px Arial";
	ctx.fillText( "P1: " + state.players[0].username, 10, 32 );
	ctx.fillText( "Score: " + state.players[0].score, 10, 64 );
	ctx.fillText( "P2: " + state.players[1].username, 10, 100 );
	ctx.fillText( "Score: " + state.players[1].score, 10, 132 );
}
