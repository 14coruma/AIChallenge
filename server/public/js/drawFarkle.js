/**
 * drawFarkle.js draws the game state of a farkle game
 *
 * Created by: Andrew Corum, Feb 2018
 */

'use strict';
var canvas;
var ctx;

function drawFarkle( state ) {
	canvas = document.getElementById( "myCanvas" );
	ctx = canvas.getContext( "2d" );
	ctx.clearRect( 0, 0, canvas.width, canvas.height );

	// Draw player names and scores
	ctx.font = "18px Arial";
	ctx.textAlign = "left";
	for ( var i = 1; i <= state.players.length; i++ ) {
		ctx.fillText( "P" + i + ": " + state.players[i-1].username, 10, -16 + 48 * i );
		ctx.fillText( "Score: " + state.players[i-1].score, 10, 48 * i );
	}

	let spacer1 = ( canvas.width - 160 ) / state.dice.length;
	var spacer2 = ( canvas.width - 160 ) / state.bank.length;
	if ( state.bank.length > 0 ) ( canvas.widht - 160 ) / state.bank.length;

	// Draw dice
	ctx.fillText( "Roll: ", 32, 144 );
	ctx.textAlign = "center";
	for ( var i = 0; i < state.dice.length; i++ ) {
		ctx.beginPath();
		ctx.rect( 96 + i * spacer1, 128, 32, 32 );
		ctx.stroke();
		ctx.closePath();
		ctx.fillText( state.dice[i], 112 + i * spacer1, 146 );
	}

	// Draw dice bank
	ctx.textAlign = "left";
	ctx.fillText( "Dice Bank: ", 32, 192 );
	ctx.textAlign = "center";
	for ( var i = 0; i < state.bank.length; i++ ) {
		ctx.beginPath();
		ctx.rect( 128 + i * spacer2, 176, 32, 32 );
		ctx.stroke();
		ctx.closePath();
		ctx.fillText( state.bank[i], 144 + i * spacer2, 196 );
	}

	// Draw Score bank
	ctx.textAlign = "left";
	ctx.fillText( "Score Bank: " + state.temp, 32, 240 );

	// Draw Game Over
	if (state.gameOver == 1) {
		ctx.font = "30px Arial";
		ctx.textAlign = "center";
		ctx.fillText( "Game Over", canvas.width / 2, canvas.height / 4 );
		ctx.fillText( state.players[state.winner].username + " Wins!", canvas.width / 2, 3 * canvas.height / 4);
	}
}
