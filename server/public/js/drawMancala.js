/**
 * drawMancala.js draws the game state of a mancala game
 *
 * Created by: Andrew Corum, 11 Nov 2017
 */

'use strict';
var canvas;
var ctx;

function drawMancala( state ) {
	canvas = document.getElementById( "myCanvas" );
	ctx = canvas.getContext( "2d" );
	ctx.clearRect( 0, 0, canvas.width, canvas.height );
	ctx.font = "18px Arial";
	ctx.textAlign = "left";
	ctx.fillText( "P1: " + state.players[0].username, 10, canvas.height - 32 );
	ctx.fillText( "P2: " + state.players[1].username, 10, 32 );

	let spacer = ( canvas.width - 64 ) / 8;
	// Draw bottom circles
	for ( var i = 0; i < 6; i++ ) {
		var x = 64 + spacer * ( i + 1 );
		var y = 2 * canvas.height / 3;
		drawCircle( x, y, 24 );
		ctx.fillText( state.board[i], x, y );
	}
	// Draw top circles
	for ( var i = 7; i < 13; i++ ) {
		var x = canvas.width - 64 - spacer * ( i - 6 );
		var y = canvas.height / 3;
		drawCircle( x, y, 24 );
		ctx.fillText( state.board[i], x, y );
	}
	drawOval( 24, canvas.height / 2, 24 );
	ctx.fillText( state.board[13], 24, canvas.height / 2 );
	drawOval( canvas.width - 24, canvas.height / 2, 24 );
	ctx.fillText( state.board[6], canvas.width - 24, canvas.height / 2 );

	if (state.gameOver == 1) {
		ctx.font = "30px Arial";
		ctx.textAlign = "center";
		ctx.fillText( "Game Over", canvas.width / 2, canvas.height / 4 );
		ctx.fillText( state.players[state.winner].username + " Wins!", canvas.width / 2, canvas.height / 2);
	}
}

function drawCircle( x, y, r ) {
		ctx.save();
		ctx.beginPath();
		ctx.arc( x, y, r, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'green';
		ctx.fill();
		ctx.lineWidth = 5;
		ctx.strokeStyle = "#003300";
		ctx.stroke();
		ctx.restore();
}

function drawOval( x, y, r ) {
		ctx.save();
		ctx.translate( x, y );
		ctx.scale( 1, 2 );
		ctx.beginPath();
		ctx.arc( 0, 0, r, 0, 2 * Math.PI, false);
		ctx.restore();
		ctx.save();
		ctx.fillStyle = 'green';
		ctx.fill();
		ctx.lineWidth = 5;
		ctx.strokeStyle = "#003300";
		ctx.stroke();
		ctx.restore();
}
