/**
 * drawFarkle.js draws the game state of a farkle game
 *
 * Created by: Andrew Corum, Feb 2018
 */

'use strict';
var canvas = document.getElementById( "myCanvas" ),
    ctx = canvas.getContext( "2d" ),
    canvasLeft = canvas.offsetLeft,
    canvasTop = canvas.offsetTop,
    elements = [],
    moveObj = { bank: [], done: 0 };

function drawFarkle( state ) {
	ctx.clearRect( 0, 0, canvas.width, canvas.height );
	elements = [];

	// Reset move if it's not viewing player's turn
	var formUsername = document.getElementById( "formUsername" );
	if (
			formUsername &&
			state.players[state.currentPlayer].username != formUsername.value
	) {
		moveObj = { bank: [], done: 0 };
		ctx.globalAlpha = 0.3;
		ctx.fillRect( 0, 0, canvas.width, canvas.height );
		ctx.globalAlpha = 1.0;
	}

	// Draw player names and scores
	ctx.font = "18px Arial";
	ctx.textAlign = "left";
	for ( var i = 1; i <= state.players.length; i++ ) {
		ctx.fillText( "P" + i + ": " + state.players[i-1].username, 10, -16 + 48 * i );
		ctx.fillText( "Score: " + state.players[i-1].score, 10, 48 * i );
	}

	// Calculate tempDice = state.dice - move.bank
	var tempBank = moveObj.bank.slice();
	var tempDice = state.dice.slice();
	while ( tempBank.length > 0 ) {
		tempDice.splice( tempDice.indexOf( tempBank[0] ), 1 );
		tempBank.shift();
	}

	let spacer1 = ( canvas.width - 160 ) / tempDice.length;
	var spacer2 = ( canvas.width - 160 ) / ( state.bank.length + moveObj.bank.length + 1 );

	// Draw dice
	ctx.fillText( "Roll: ", 32, 144 );
	ctx.textAlign = "center";
	for ( var i = 0; i < tempDice.length; i++ ) {
		ctx.beginPath();
		ctx.rect( 96 + i * spacer1, 128, 32, 32 );
		ctx.stroke();
		ctx.closePath();
		ctx.fillText( tempDice[i], 112 + i * spacer1, 146 );
		elements.push( {
			id: i,
			type: "dice",
			value: tempDice[i],
			width: 32,
			height: 32,
			top: 128,
			left: 96 + i * spacer1,
		} );
	}

	// Draw dice bank (including move bank)
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
	for ( var i = 0; i < moveObj.bank.length; i++ ) {
		ctx.strokeStyle = "Green";
		ctx.beginPath();
		ctx.rect( 128 + (i + state.bank.length) * spacer2, 176, 32, 32 );
		ctx.stroke();
		ctx.closePath();
		ctx.fillText( moveObj.bank[i], 144 + (i + state.bank.length) * spacer2, 196 );
		ctx.strokeStyle = "Black";
		elements.push( {
			id: i,
			type: "bank",
			value: moveObj.bank[i],
			width: 32,
			height: 32,
			top: 176,
			left: 128 + (i + state.bank.length) * spacer2,
		} );
	}

	// Draw Score bank
	ctx.textAlign = "left";
	ctx.fillText( "Score Bank: " + state.temp, 32, 240 );

	// Draw "Done?" button
	ctx.strokeStyle = moveObj.done ? "Green" : "Black";
	ctx.beginPath();
	ctx.rect( 64, 304, 96, 32 );
	ctx.stroke();
	ctx.closePath();
	ctx.fillText( "Done?", 68, 324 );
	ctx.strokeStyle = "Black";
	elements.push( {
		type: "done",
		width: 96,
		height: 32,
		top: 304,
		left: 68,
	} );

	// Draw Game Over
	if (state.gameOver == 1) {
		ctx.font = "30px Arial";
		ctx.textAlign = "center";
		ctx.fillText( "Game Over", canvas.width / 2, canvas.height / 4 );
		ctx.fillText( state.players[state.winner].username + " Wins!", canvas.width / 2, 3 * canvas.height / 4);
		elements = [];
	}
}

// Set up the mouse click handler
canvas.addEventListener( 'click', function( ev ) {
	var x = ev.pageX - canvasLeft,
	    y = ev.pageY - canvasTop;

	// Check for element clicked
	elements.forEach( function( element ) {
		if ( y > element.top && y < element.top + element.height &&
			x > element.left && x < element.left + element.width ) {
			console.log( moveObj );
			switch ( element.type ) {
				case "dice":
					moveObj.bank.push( element.value );
					break;
				case "bank":
					var index = moveObj.bank.indexOf( element.value );
					moveObj.bank.splice( index, 1 );
					break;
				case "done":
					moveObj.done = moveObj.done ? 0 : 1;
					break;
				default:
					return;
			}
			document.getElementById( "formMove" ).value = JSON.stringify( moveObj );
		}
	});
}, false );

/**
 * Empty out the moveObj.bank
 * Call this when a player makes his/her move to refresh bank
 */
function resetFarkleBank() {
	moveObj.bank = [];
	document.getElementById( "formMove" ).value = JSON.stringify( moveObj );
}
