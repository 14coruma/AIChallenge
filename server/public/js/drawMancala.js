/**
 * drawMancala.js draws the game state of a mancala game
 *
 * Created by: Andrew Corum, 11 Nov 2017
 */

'use strict';
var canvas = document.getElementById( "myCanvas" ),
    ctx = canvas.getContext( "2d" ),
    canvasLeft = canvas.offsetLeft,
    canvasTop = canvas.offsetTop,
    elements = [],
    move = -1,
    mancalaBack = new Image;
mancalaBack.src = "../images/mancala/wood.jpeg";

/**
 * Draws the current mancala state
 *
 * @param: state, JSON of the current state
 */
function drawMancala( state ) {
	ctx.clearRect( 0, 0, canvas.width, canvas.height );
	// Draw Background
	ctx.drawImage( mancalaBack, 0, 0, canvas.width, canvas.height );

	elements = [];

	// indicate if it's not viewing player's turn
	var formUsername = document.getElementById( "formUsername" );
	if (
			formUsername &&
			state.players[state.currentPlayer].username != formUsername.value
	) {
		ctx.globalAlpha = 0.5;
		ctx.fillRect( 0, 0, canvas.width, canvas.height );
		ctx.globalAlpha = 1.0;
	}

	ctx.font = "28px Arial";
	ctx.textAlign = "left";
	ctx.strokeStyle = "black";
	ctx.lineWidth = 4;
	ctx.strokeText( "P1: " + state.players[0].username, 10, canvas.height - 32 );
	ctx.fillStyle = "blue";
	ctx.fillText( "P1: " + state.players[0].username, 10, canvas.height - 32 );

	ctx.strokeStyle = "black";
	ctx.lineWidth = 4;
	ctx.strokeText( "P2: " + state.players[1].username, 10, 32 );
	ctx.fillStyle = "red";
	ctx.fillText( "P2: " + state.players[1].username, 10, 32 );

	let spacer = ( canvas.width - 64 ) / 8;
	ctx.textAlign = "center";
	// Draw bottom circles
	for ( var i = 0; i < 6; i++ ) {
		var x = 64 + spacer * ( i + 1 );
		var y = 2 * canvas.height / 3;
		if ( move == i ) {
			drawCircle( x, y, 24, "LightBlue", "GoldenRod" );
		} else {
			drawCircle( x, y, 24, "LightBlue", "Green" );
		}
		ctx.fillStyle = "black";
		ctx.fillText( state.board[i], x, y + 8 );
		elements.push({
			id: i,
			type: "bucket",
			width: 48,
			height: 48,
			top: y - 24,
			left: x - 24,
		});
	}
	// Draw top circles
	for ( var i = 7; i < 13; i++ ) {
		var x = canvas.width - 64 - spacer * ( i - 6 );
		var y = canvas.height / 3;
		if ( move == i ) {
			drawCircle( x, y, 24, "Red", "GoldenRod" );
		} else {
			drawCircle( x, y, 24, "Red", "Green" );
		}
		ctx.fillStyle = "black";
		ctx.fillText( state.board[i], x, y + 8 );
		elements.push({
			id: i,
			type: "bucket",
			width: 48,
			height: 48,
			top: y - 24,
			left: x - 24
		});
	}
	// Draw goals
	drawOval( 32, canvas.height / 2, 24, "Red", "Green" );
	ctx.fillText( state.board[13], 32, canvas.height / 2 );
	drawOval( canvas.width - 32, canvas.height / 2, 24, "LightBlue", "Green" );
	ctx.fillText( state.board[6], canvas.width - 32, canvas.height / 2 );

	if (state.gameOver == 1) {
		ctx.font = "38px Arial";
		ctx.textAlign = "center";
		ctx.strokeStyle = "black";
		ctx.lineWidth = 4;
		ctx.strokeText( "Game Over", canvas.width / 2, canvas.height / 4 );
		ctx.fillStyle = "white";
		ctx.fillText( "Game Over", canvas.width / 2, canvas.height / 4 );

		ctx.strokeStyle = "black";
		ctx.lineWidth = 4;
		console.log( state );
		ctx.strokeText( state.players[state.winner].username + " Wins!", canvas.width / 2, 3 * canvas.height / 4);
		ctx.fillStyle = "white";
		ctx.fillText( state.players[state.winner].username + " Wins!", canvas.width / 2, 3 * canvas.height / 4);
		elements = [];
	}
}

/**
 * Draws a circle around (x,y) with given radius & colors
 *
 * @param: x
 * @param: y
 * @param: r, radius
 * @param: color1, fill color
 * @param: color2, outline color
 */
function drawCircle( x, y, r, color1, color2 ) {
		ctx.save();
		ctx.beginPath();
		ctx.arc( x, y, r, 0, 2 * Math.PI, false);
		ctx.fillStyle = color1;
		ctx.fill();
		ctx.lineWidth = 5;
		ctx.strokeStyle = color2;
		ctx.stroke();
		ctx.restore();
}

/**
 * Draws an oval around (x,y) with given radius & colors
 *
 * @param: x
 * @param: y
 * @param: r, radius
 * @param: color1, fill color
 * @param: color2, outline color
 */
function drawOval( x, y, r, color1, color2 ) {
		ctx.save();
		ctx.translate( x, y );
		ctx.scale( 1, 2 );
		ctx.beginPath();
		ctx.arc( 0, 0, r, 0, 2 * Math.PI, false);
		ctx.restore();
		ctx.save();
		ctx.fillStyle = color1;
		ctx.fill();
		ctx.lineWidth = 5;
		ctx.strokeStyle = color2;
		ctx.stroke();
		ctx.restore();
}

// Set up the mouse click handler
canvas.addEventListener( 'click', function( ev ) {
	var x = ev.pageX - canvasLeft,
	    y = ev.pageY - canvasTop;

	// Check for element clicked
	elements.forEach( function( element ) {
		if ( y > element.top && y < element.top + element.height &&
			x > element.left && x < element.left + element.width ) {
			if ( element.type == "bucket" ) {
				move = element.id;
				document.getElementById( "formMove" ).value = move;
			} else {
				return;
			}
		}
	});
}, false );
