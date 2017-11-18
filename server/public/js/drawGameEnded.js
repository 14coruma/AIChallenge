/**
 * drawTestGame.js draws the game state of a testGame state
 *
 * Created by: Andrew Corum, 11 Nov 2017
 */

'use strict';

function drawGameEnded( state ) {
	var canvas = document.getElementById( "myCanvas" );
	var ctx = canvas.getContext( "2d" );
	ctx.clearRect( 0, 0, canvas.width, canvas.height );
	ctx.font = "30px Arial";
	ctx.fillText( "Game Ended", 10, 32 );
}
