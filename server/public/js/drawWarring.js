/**
 * drawWarring.js draws the game state of Warring Kingdoms
 *
 * Created by: Andrew Corum, Feb 24 2018
 */

'use strict';
var canvas = document.getElementById( "myCanvas" ),
    ctx = canvas.getContext( "2d" ),
    canvasLeft = canvas.offsetLeft,
    canvasTop = canvas.offsetTop,
    elements = [],
    moveObj = { type: "move", units: [] },
    img = new Image;
img.src = "../images/warring/sprites.png";

// Disable image smoothing (looks better without it)
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

function drawWarring( state ) {
//	ctx.clearRect( 0, 0, canvas.width, canvas.height );
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
	/*ctx.font = "18px Arial";
	ctx.textAlign = "left";
	for ( var i = 1; i <= state.players.length; i++ ) {
		ctx.fillText( "P" + i + ": " + state.players[i-1].username, 10, -16 + 48 * i );
		ctx.fillText( "Score: " + state.players[i-1].score, 10, 48 * i );
	}*/

	// Create all map elements
	for ( var y = 0; y < state.map.length; y++ ) {
		for ( var x = 0; x < state.map[y].length; x++ ) {
			elements.push( { 
				type1: "map",
				type2: state.map[y][x].type,
				hp: state.map[y][x].hp,
				style: state.map[y][x].style,
				width: 32, height: 32,
				top: y * 32 + 16, left: x * 32 + 16,
			} );
		}
	}

	// Create all unit elements
	for ( var i = 0; i < state.players.length; i++ ) {
		for ( var j = 0; j < state.players[i].units.length; j++ ) {
			elements.push( {
				type1: "unit",
				type2: state.players[i].units[j].class,
				hp: state.players[i].units[j].hp,
				player: i,
				width: 32, height: 32,
				top: state.players[i].units[j].y * 32 + 16,
				left: state.players[i].units[j].x * 32 + 16,
			} );
		}
	}

	// Render all elements
	renderElements();

	// Draw Game Over
	if (state.gameOver == 1) {
		ctx.font = "30px Arial";
		ctx.textAlign = "center";
		ctx.fillText( "Game Over", canvas.width / 2, canvas.height / 4 );
		ctx.fillText( state.players[state.winner].username + " Wins!", canvas.width / 2, 3 * canvas.height / 4);
		elements = [];
	}
}

/**
 * renderElements() draws all of the elements in the array
 */
function renderElements() {
/*	elements.forEach( function( element ) {
		drawElement( element );
	} );*/
	for ( var i = 0; i < elements.length; i++ ) {
		drawElement( elements[i] );
	}
}

/**
 * drawElement() draws an image for a single Element
 *
 * @param: (obj) element
 */
function drawElement( element ) {
	// Find coordinates for sprite
	var sx, sy;
	switch( element.type2 ) {
		case "grass":
			sy = 0; sx = element.style;
			break;
		case "keep":
			drawElement( {
				type2: "grass", style: 0,
				left: element.left, top: element.top,
				width: element.width, height: element.height,
			} );
			sy = 4; sx = element.style * -2 + 4;
			break;
		case "farmer":
			sy = 35 + element.player; sx = 2;
			break;
		default:
			return;
	}

	// draw image
	ctx.drawImage(
		img, sx * 16, sy * 16, 16, 16,
		element.left, element.top, element.width, element.height
	);
}

/**
 * Set up the mouse click handler
 */
canvas.addEventListener( 'click', function( ev ) {
	var x = ev.pageX - canvasLeft,
	    y = ev.pageY - canvasTop;

	// Check for element clicked
	elements.forEach( function( element ) {
		if ( y > element.top && y < element.top + element.height &&
			x > element.left && x < element.left + element.width ) {
			switch ( element.type1 ) {
				case "unit":
					moveObj.updates.push( element.type1 );
					break;
				default:
					return;
			}
			document.getElementById( "formMove" ).value = JSON.stringify( moveObj );
		}
	});
}, false );
