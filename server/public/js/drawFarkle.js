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
    moveObjFarkle = { bank: [], done: 0 },
    farkleBack = new Image,
    rDiceImg = new Image,
    wDiceImg = new Image,
    greenButtons = new Image;
farkleBack.src = "../images/farkle/Boards.JPG";
rDiceImg.src = "../images/farkle/diceRed_border.png";
wDiceImg.src = "../images/farkle/diceWhite_border.png";
greenButtons.src = "../images/farkle/greenSheet.png";

function drawFarkle( state ) {
	ctx.clearRect( 0, 0, canvas.width, canvas.height );
	// Draw background
	ctx.drawImage( farkleBack, 0, 0, canvas.width, canvas.height );

	elements = [];

	// Reset move if it's not viewing player's turn
	var formUsername = document.getElementById( "formUsername" );
	if (
			formUsername &&
			state.players[state.currentPlayer].username != formUsername.value
	) {
		moveObjFarkle = { bank: [], done: 0 };
		ctx.globalAlpha = 0.3;
		ctx.fillRect( 0, 0, canvas.width, canvas.height );
		ctx.globalAlpha = 1.0;
	}

	// Draw player names and scores
	ctx.font = "28px Arial";
	ctx.textAlign = "left";
	for ( var i = 1; i <= state.players.length; i++ ) {
		ctx.strokeStyle = "black";
		ctx.lineWidth = 4;
		ctx.strokeText( "P" + i + ": " + state.players[i-1].username, 10, -16 + 54 * i );
		ctx.fillStyle = "white";
		ctx.fillText( "P" + i + ": " + state.players[i-1].username, 10, -16 + 54 * i );

		ctx.strokeStyle = "black";
		ctx.lineWidth = 4;
		ctx.strokeText( "Score: " + state.players[i-1].score, 10, 8 + 54 * i );
		ctx.fillStyle = "white";
		ctx.fillText( "Score: " + state.players[i-1].score, 10, 8 + 54 * i );
	}

	// Calculate tempDice = state.dice - move.bank
	var tempBank = moveObjFarkle.bank.slice();
	var tempDice = state.dice.slice();
	while ( tempBank.length > 0 ) {
		tempDice.splice( tempDice.indexOf( tempBank[0] ), 1 );
		tempBank.shift();
	}

	let spacer1 = ( canvas.width - 160 ) / tempDice.length;
	var spacer2 = ( canvas.width - 160 ) / ( state.bank.length + moveObjFarkle.bank.length + 1 );

	// Draw dice
	ctx.strokeStyle = "black";
	ctx.lineWidth = 4;
	ctx.strokeText( "Roll: ", 32, 156 );
	ctx.fillStyle = "white";
	ctx.fillText( "Roll: ", 32, 156 );

	ctx.textAlign = "center";
	for ( var i = 0; i < tempDice.length; i++ ) {
		elements.push( {
			id: i,
			type: "dice",
			value: tempDice[i],
			width: 48,
			height: 48,
			top: 140,
			left: 108 + i * spacer1,
		} );
	}

	// Draw dice bank (including move bank)
	ctx.textAlign = "left";
	ctx.strokeStyle = "black";
	ctx.lineWidth = 4;
	ctx.strokeText( "Dice Bank: ", 32, 216 );
	ctx.fillStyle = "white";
	ctx.fillText( "Dice Bank: ", 32, 216 );

	ctx.textAlign = "center";
	for ( var i = 0; i < state.bank.length; i++ ) {
		elements.push( {
			type: "white",
			value: state.bank[i],
			width: 48,
			height: 48,
			top: 200,
			left: 172 + i * spacer2,
		} );
	}
	for ( var i = 0; i < moveObjFarkle.bank.length; i++ ) {
		elements.push( {
			id: i,
			type: "bank",
			value: moveObjFarkle.bank[i],
			width: 48,
			height: 48,
			top: 200,
			left: 172 + (i + state.bank.length) * spacer2,
		} );
	}

	// Draw Score bank
	ctx.textAlign = "left";
	ctx.strokeStyle = "black";
	ctx.lineWidth = 4;
	ctx.strokeText( "Score Bank: " + state.temp, 32, 276 );
	ctx.fillStyle = "white";
	ctx.fillText( "Score Bank: " + state.temp, 32, 276 );

	// Draw "Done?" button
	ctx.drawImage(
		greenButtons, 0, 143*moveObjFarkle.done, 190, 49,
		48, 320, 190, 49
	);
	var text = moveObjFarkle.done ? "Done!" : "Continue...";
	ctx.strokeStyle = "black";
	ctx.lineWidth = 4;
	ctx.strokeText( text, 68, 348 );
	ctx.fillStyle = "white";
	ctx.fillText( text, 68, 348 );

	elements.push( {
		type: "done",
		width: 190,
		height: 49,
		top: 320,
		left: 48,
	} );

	// Draw Game Over
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
		ctx.strokeText( state.players[state.winner].username + " Wins!", canvas.width / 2, 3 * canvas.height / 4);
		ctx.fillStyle = "white";
		ctx.fillText( state.players[state.winner].username + " Wins!", canvas.width / 2, 3 * canvas.height / 4);
		elements = [];
	}

	renderFarkle();
}

// Set up the mouse click handler
canvas.addEventListener( 'click', function( ev ) {
	var x = ev.pageX - canvasLeft,
	    y = ev.pageY - canvasTop;

	// Check for element clicked
	elements.forEach( function( element ) {
		if ( y > element.top && y < element.top + element.height &&
			x > element.left && x < element.left + element.width ) {
			switch ( element.type ) {
				case "dice":
					moveObjFarkle.bank.push( element.value );
					break;
				case "bank":
					var index = moveObjFarkle.bank.indexOf( element.value );
					moveObjFarkle.bank.splice( index, 1 );
					break;
				case "done":
					moveObjFarkle.done = moveObjFarkle.done ? 0 : 1;
					break;
				default:
					return;
			}
			document.getElementById( "formMove" ).value = JSON.stringify( moveObjFarkle );
		}
	});
}, false );

/**
 * renderFarkle() draws all of the elements in the array
 */
function renderFarkle() {
	for ( var i = 0; i < elements.length; i++ ) {
		drawFarkleElement( elements[i] );
	}
}

/**
 * drawFarkleElement() draws an image for a single Element
 *
 * @param: (obj) element
 */
function drawFarkleElement( element ) {
	// Find coordinates for sprite and which image to use
	var sx, sy, img;
	switch ( element.type ) {
		case "dice":
		case "bank":
			img = rDiceImg;
			if ( element.value == 1 ) {
				sy = 136; sx = 0;
			} else if ( element.value == 2 ) {
				sy = 68; sx = 68;
			} else if ( element.value == 3 ) {
				sy = 0; sx = 68;
			} else if ( element.value == 4 ) {
				sy = 136; sx = 68;
			} else if ( element.value == 5 ) {
				sy = 68; sx = 0;
			} else if ( element.value == 6 ) {
				sy = 0; sx = 0;
			}
			break;
		case "white":
			img = wDiceImg;
			if ( element.value == 1 ) {
				sy = 136; sx = 0;
			} else if ( element.value == 2 ) {
				sy = 68; sx = 68;
			} else if ( element.value == 3 ) {
				sy = 0; sx = 68;
			} else if ( element.value == 4 ) {
				sy = 136; sx = 68;
			} else if ( element.value == 5 ) {
				sy = 68; sx = 0;
			} else if ( element.value == 6 ) {
				sy = 0; sx = 0;
			}
			break;
		default:
			return;
	}

	// draw image
	ctx.drawImage(
		img, sx, sy, 68, 68,
		element.left, element.top, element.width, element.height
	);
}

/**
 * Empty out the moveObjFarkle.bank
 * Call this when a player makes his/her move to refresh bank
 */
function resetFarkleBank() {
	moveObjFarkle.bank = [];
	document.getElementById( "formMove" ).value = JSON.stringify( moveObjFarkle );
}
