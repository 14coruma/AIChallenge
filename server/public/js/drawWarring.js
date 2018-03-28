/**
 * drawWarring.js draws the game state of Warring Kingdoms * * Created by: Andrew Corum, Feb 24 2018
 */

'use strict';

const MAP_SIZE = 17;

var canvas = document.getElementById( "myCanvas" ),
    ctx = canvas.getContext( "2d" ),
    canvasLeft = canvas.offsetLeft,
    canvasTop = canvas.offsetTop,
    elements = [],
    unitDests = [],
    selectedUnit,
    selectedTile,
    moveObjWarring = { updates:[] },
    playerNumber,
    img1 = new Image,
    img2 = new Image,
    background = new Image;
img1.src = "../images/warring/sprites.png";
img2.src = "../images/warring/ui.png";
background.src = "../images/warring/stone_tex.png";

// Disable image smoothing (looks better without it)
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

function drawWarring( state ) {
	document.getElementById( "formMove" ).value = JSON.stringify( moveObjWarring );
	// Draw background
	var pattern = ctx.createPattern( background, "repeat" );
	ctx.fillStyle = pattern;
	ctx.fillRect( 0, 0, canvas.width, canvas.height );
	ctx.beginPath();
	ctx.lineWidth = "8";
	ctx.strokeStyle = "grey";
	ctx.rect( 16, 16, 544, 544 );
	ctx.stroke();

	elements = [];

	// Reset move if it's not viewing player's turn
	var formUsername = document.getElementById( "formUsername" );
	if ( state.players[1].username == formUsername.value ) {
		playerNumber = 1;
	} else {
		playerNumber = 0;
	}
	if (
			formUsername &&
			state.players[state.currentPlayer].username != formUsername.value
	) {
		ctx.globalAlpha = 0.5;
		ctx.fillRect( 0, 0, canvas.width, canvas.height );
		ctx.globalAlpha = 1.0;
	}

	// Draw player names and scores
	ctx.font = "26px Alagard";
	ctx.textAlign = "left";
	ctx.fillStyle = "red";
	for ( var i = 1; i <= state.players.length; i++ ) {
		ctx.fillText( "P" + i + ": " + state.players[i-1].username, 576, -16 + 64 * i );
		ctx.fillText( "Food: " + state.players[i-1].food, 576, 16 + 64 * i );
	}

	// Create all map elements
	for ( var y = 0; y < state.map.length; y++ ) {
		for ( var x = 0; x < state.map[y].length; x++ ) {
			elements.push( { 
				type1: "map",
				type2: state.map[y][x].type,
				hp: state.map[y][x].hp,
				solid: state.map[y][x].solid,
				style: state.map[y][x].style,
				x: x, y: y,
				width: 32, height: 32,
				top: y * 32 + 16, left: x * 32 + 16,
			} );
		}
	}

	// Create all unit and hp elements
	for ( var i = 0; i < state.players.length; i++ ) {
		for ( var j = 0; j < state.players[i].units.length; j++ ) {
			elements.push( {
				type1: "unit",
				type2: state.players[i].units[j].class,
				hp: state.players[i].units[j].hp,
				player: i, unitIndex: j,
				solid: true,
				x: state.players[i].units[j].x, y: state.players[i].units[j].y,
				width: 32, height: 32,
				top: state.players[i].units[j].y * 32 + 16,
				left: state.players[i].units[j].x * 32 + 16,
			} );
			elements.push( {
				type1: "hp",
				type2: "hp",
				style: state.players[i].units[j].hp,
				width: 32, height: 32,
				top: state.players[i].units[j].y * 32 + 16,
				left: state.players[i].units[j].x * 32 + 16,
			} );
		}
	}

	// Create ui elements for unit training (based on food count)
	var myFood = state.players[playerNumber].food;
	if ( myFood >= 400 ) {
		elements.push( {
			type1: "ui",
			type2: "trainFarmerButton",
			width: 64, height: 64,
			top: 332,  left: 572,
			player: playerNumber,
			pressed: false,
		} );
	}
	if ( myFood >= 450 ) {
		elements.push( {
			type1: "ui",
			type2: "trainSoldierButton",
			width: 64, height: 64,
			top: 332,  left: 638,
			player: playerNumber,
			pressed: false,
		} );
	}
	if ( myFood >= 500 ) {
		elements.push( {
			type1: "ui",
			type2: "trainArcherButton",
			width: 64, height: 64,
			top: 400,  left: 572,
			player: playerNumber,
			pressed: false,
		} );
	}

	// Create UI elements based on selectedUnit unit
	if ( selectedUnit ) {
		elements.push( {
			type1: "ui",
			type2: "moveButton",
			width: 64, height: 64,
			top: 168,  left: 572,
			pressed: false,
		} );
		if ( elements[selectedUnit].type2 == "soldier" ||
		     elements[selectedUnit].type2 == "archer" ) {
			elements.push( {
				type1: "ui",
				type2: "attackButton",
				width: 64, height: 64,
				top: 168, left: 638,
				pressed: false,
			} );
		}
		if ( myFood >= 250 ) {
			elements.push( {
				type1: "ui",
				type2: "buildButton",
				width: 64, height: 64,
				top: 236, left: 572,
				pressed: false,
			} );
		}
		elements.push( {
			type1: "ui",
			type2: "stopButton",
			width: 64, height: 64,
			top: 236, left: 638,
			pressed: false,
		} );
	}

	// Render all elements
	renderElements();

	// Draw user selectedUnit and selectedTile
	if ( selectedUnit >= 0 ) {
		drawElement( {
			type2: "selectedUnit",
			left: elements[selectedUnit].left,
			top: elements[selectedUnit].top,
			width: elements[selectedUnit].width,
			height: elements[selectedUnit].height
		} );
	}
	if ( selectedTile >= 0 ) {
		drawElement( {
			type2: "selectedTile",
			left: elements[selectedTile].left,
			top: elements[selectedTile].top,
			width: elements[selectedTile].width,
			height: elements[selectedTile].height,
		} );
	}

	// Create updates based on unit destinations
	var mapMask = [];
	for ( var row = 0; row < MAP_SIZE; row++ ) {
		mapMask[row] = new Array( MAP_SIZE );
		for ( var col = 0; col < MAP_SIZE; col++ ) {
			mapMask[row][col] = 0;
		}
	}
	for ( var i = 0; i < elements.length; i++ ) {
		if ( elements[i].solid ) {
			mapMask[elements[i].y][elements[i].x] = 1;
		}
	}

	for ( var i = 0; i < unitDests.length; i++ ) {
		var dir = dirTowards(
			state.players[playerNumber].units[unitDests[i].unit].x,
			state.players[playerNumber].units[unitDests[i].unit].y,
			unitDests[i].dest[0],
			unitDests[i].dest[1],
			mapMask
		);
		if ( dir ) {
			moveObjWarring.updates.push({
				type: "move",
				unit: unitDests[i].unit,
				direction: dir
			} );
		} else {
			unitDests.splice( i, 1 );
		}
	}

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
	// Find coordinates for sprite and which image to use
	var sx, sy;
	var size = 16;
	var sImg;
	switch( element.type2 ) {
		case "grass":
			sy = 0; sx = element.style;
			sImg = img1;
			break;
		case "water":
			sy = 24; sx = Math.floor( Math.random() * 4 );
			sImg = img1;
			break;
		case "tree":
			drawElement( {
				type2: "grass", style: 0,
				left: element.left, top: element.top,
				width: element.width, height: element.height,
			} );
			sy = 0; sx = element.style + 4;
			sImg = img1;
			break;
		case "wall":
			drawElement( {
				type2: "grass", style: 1,
				left: element.left, top: element.top,
				width: element.width, height: element.height,
			} );
			switch ( element.style ) {
				case 1:
					sy = 31; sx = 2; break;
				case 2:
					sy = 31; sx = 3; break;
				case 3:
					sy = 31; sx = 4; break;
				case 4:
					sy = 32; sx = 2; break;
				case 5:
					sy = 32; sx = 4; break;
				case 6:
					sy = 33; sx = 2; break;
				case 7:
					sy = 33; sx = 3; break;
				case 8:
					sy = 33; sx = 4; break;
				case 9:
					sy = 31; sx = 1; break;
				case 10:
					sy = 31; sx = 0; break;
				case 11:
					sy = 32; sx = 1; break;
				case 12:
					sy = 32; sx = 0; break;
				default:
					sy = 32; sx = 3; break;
			}
			sImg = img1;
			break;
		case "mountain":
			drawElement( {
				type2: "grass", style: 0,
				left: element.left, top: element.top,
				width: element.width, height: element.height,
			} );
			sy = 1; sx = element.style + 3;
			sImg = img1;
			break;
		case "keep":
			drawElement( {
				type2: "grass", style: 2,
				left: element.left, top: element.top,
				width: element.width, height: element.height,
			} );
			sy = 4; sx = element.style * -2 + 4;
			sImg = img1;
			break;
		case "farmer":
			sy = 35 + element.player; sx = 2;
			sImg = img1;
			break;
		case "soldier":
			sy = 16 + element.player; sx = 2;
			sImg = img1;
			break;
		case "archer":
			sy = 16 + element.player; sx = 0;
			sImg = img1;
			break;
		case "farm":
			drawElement( {
				type2: "grass", style: 2,
				left: element.left, top: element.top,
				width: element.width, height: element.height,
			} );
			sy = 9; sx = 6;
			sImg = img1;
			break;
		case "hp":
			switch( Math.floor( element.style / 10 ) ) {
				case 0:
					sy = 20; sx = 0;
					break;
				case 1:
					sy = 21; sx = 0;
					break;
				case 2:
					sy = 21; sx = 1;
					break;
				case 3:
					sy = 21; sx = 2;
					break;
				case 4:
					sy = 22; sx = 0;
					break;
				case 5:
					sy = 22; sx = 1;
					break;
				case 6:
					sy = 22; sx = 2;
					break;
				case 7:
					sy = 23; sx = 0;
					break;
				case 8:
					sy = 23; sx = 1;
					break;
				default: // case 9:
					sy = 23; sx = 2;
					break;
			}
			sImg = img1;
			break;
		case "path":
			drawElement( {
				type2: "grass", style: 2,
				left: element.left, top: element.top,
				width: element.width, height: element.height,
			} );
			switch( element.style ) {
				case 1:
					sy = 10; sx = 0; break;
				case 2:
					sy = 10; sx = 1; break;
				case 3:
					sy = 10; sx = 2; break;
				case 4:
					sy = 11; sx = 0; break;
				case 5:
					sy = 11; sx = 2; break;
				case 6:
					sy = 12; sx = 0; break;
				case 7:
					sy = 12; sx = 1; break;
				case 8:
					sy = 12; sx = 2; break;
				case 9:
					sy = 9; sx = 0; break;
				case 10:
					sy = 9; sx = 1; break;
				case 11:
					sy = 9; sx = 2; break;
				case 12:
					sy = 9; sx = 3; break;
				default:
					sy = 11; sx = 1; break;
			}
			sImg = img1;
			break;
		case "lake":
			drawElement( {
				type2: "grass", style: 3,
				left: element.left, top: element.top,
				width: element.width, height: element.height,
			} );
			sy = 2; sx = Math.floor( Math.random() * 3 ) + 4;
			sImg = img1
			break;
		case "island":
			drawElement( {
				type2: "water", style: 0,
				left: element.left, top: element.top,
				width: element.width, height: element.height,
			} );
			switch ( element.style ) {
				case 1:
					sy = 1; sx = 6; break;
				case 2:
					sy = 3; sx = 6; break;
				case 3:
					sy = 34; sx = 0; break;
				case 4:
					sy = 34; sx = 1; break;
				default:
					sy = 1; sx = 6; break;
			}
			sImg = img1;
			break;
		case "selectedUnit":
			sy = 42; sx = 3;
			sImg = img1;
			break;
		case "selectedTile":
			sy = 29; sx = 4;
			sImg = img1;
			break;
		case "blueButton":
			sy = 1; sx = 1; size = 32;
			sImg = img2;
			break;
		case "redButton":
			sy = 1; sx = 2; size = 32;
			sImg = img2;
			break;
		case "moveButton":
			drawElement( {
				type2: "blueButton", style: 0,
				left: element.left, top: element.top,
				width: element.width, height: element.height,
			} );
			if ( element.pressed ) {
				ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
				ctx.fillRect( 0, 0, canvas.width, canvas.height );
			}
			sy = 0; sx = 0; size = 32;
			sImg = img2;
			break;
		case "attackButton":
			drawElement( {
				type2: "blueButton", style: 0,
				left: element.left, top: element.top,
				width: element.width, height: element.height,
			} );
			if ( element.pressed ) {
				ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
				ctx.fillRect( 0, 0, canvas.width, canvas.height );
			}
			sy = 0; sx = 1; size = 32;
			sImg = img2;
			break;
		case "buildButton":
			drawElement( {
				type2: "blueButton", style: 0,
				left: element.left, top: element.top,
				width: element.width, height: element.height,
			} );
			if ( element.pressed ) {
				ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
				ctx.fillRect( 0, 0, canvas.width, canvas.height );
			}
			sy = 0; sx = 2; size = 32;
			sImg = img2;
			break;
		case "stopButton":
			drawElement( {
				type2: "redButton", style: 0,
				left: element.left, top: element.top,
				width: element.width, height: element.height,
			} );
			if ( element.pressed ) {
				ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
				ctx.fillRect( 0, 0, canvas.width, canvas.height );
			}
			sy = 1; sx = 0; size = 32;
			sImg = img2;
			break;
		case "trainFarmerButton":
			drawElement( {
				type2: "blueButton", style: 0,
				left: element.left, top: element.top,
				width: element.width, height: element.height,
			} );
			if ( element.pressed ) {
				ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
				ctx.fillRect( 0, 0, canvas.width, canvas.height );
			}
			sy = 35 + element.player; sx = 2;
			sImg = img1;
			break;
		case "trainSoldierButton":
			drawElement( {
				type2: "blueButton", style: 0,
				left: element.left, top: element.top,
				width: element.width, height: element.height,
			} );
			if ( element.pressed ) {
				ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
				ctx.fillRect( 0, 0, canvas.width, canvas.height );
			}
			sy = 16 + element.player; sx = 2;
			sImg = img1;
			break;
		case "trainArcherButton":
			drawElement( {
				type2: "blueButton", style: 0,
				left: element.left, top: element.top,
				width: element.width, height: element.height,
			} );
			if ( element.pressed ) {
				ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
				ctx.fillRect( 0, 0, canvas.width, canvas.height );
			}
			sy = 16 + element.player; sx = 0;
			sImg = img1;
			break;
		default:
			return;
	}

	// draw image
	ctx.drawImage(
		sImg, sx * size, sy * size, size, size,
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
					if ( element.player == playerNumber ) {
						selectedUnit = elements.indexOf(element);
					}
					break;
				case "map":
					if ( !element.solid ) {
						selectedTile = elements.indexOf(element);
					}
					break;
				case "ui":
					switch ( element.type2 ) {
						case "moveButton":
							var mapMask = [];
							for ( var row = 0; row < MAP_SIZE; row++ ) {
								mapMask[row] = new Array( MAP_SIZE );
								for ( var col = 0; col < MAP_SIZE; col++ ) {
									mapMask[row][col] = 0;
								}
							}
							for ( var i = 0; i < elements.length; i++ ) {
								if ( elements[i].solid ) {
									mapMask[elements[i].y][elements[i].x] = 1;
								}
							}
							var startX = elements[selectedUnit].x;
							var startY = elements[selectedUnit].y;
							var endX = elements[selectedTile].x;
							var endY = elements[selectedTile].y;
							unitDests.push( {
								unit: elements[selectedUnit].unitIndex,
								dest: [endX, endY],
							} );
							break;
						case "trainFarmerButton":
							moveObjWarring.updates.push( {
								type: "train", class: "farmer"
							} );
							break;
						case "trainSoldierButton":
							moveObjWarring.updates.push( {
								type: "train", class: "soldier"
							} );
							break;
						case "trainArcherButton":
							moveObjWarring.updates.push( {
								type: "train", class: "archer"
							} );
							break;
						case "buildButton":
							var startX = elements[selectedUnit].x;
							var startY = elements[selectedUnit].y;
							var endX = elements[selectedTile].x;
							var endY = elements[selectedTile].y;
							var dir = false;
							if ( endY - startY == -1 ) dir = "N";
							if ( endX - startX == 1 ) dir = "E";
							if ( endY - startY == 1 ) dir = "S";
							if ( endX - startX == -1 ) dir = "W";
							if ( dir ) {
								moveObjWarring.updates.push( {
									type: "build",
									unit: elements[selectedUnit].unitIndex,
									direction: dir
								} );
							}
							break;
					}
					break;
				default:
					return;
			}
			document.getElementById( "formMove" ).value = JSON.stringify( moveObjWarring );
		}
	});
}, false );

/**
 * Find the direction a unit must take to reach a given destination
 *
 * @param: (ints) startX, startY
 * @param: (ints) endX, endY
 * @param: (2d array) map
 *
 * @return: (char) direction
 *          (bool) false (if no path is found)
 */
function dirTowards( startX, startY, endX, endY, map ) {
	map[startY][startX] = 0;
	var grid = new PF.Grid( map );
	var finder = new PF.AStarFinder();
	var path = finder.findPath( startX, startY, endX, endY, grid );
	if ( path.length <= 1 ) {
		return false;
	}
	if ( path[1][1] - startY == -1 )
		return "N";
	if ( path[1][0] - startX == 1 )
		return "E";
	if ( path[1][1] - startY == 1 )
		return "S";
	if ( path[1][0] - startX == -1 )
		return "W";
	return false;
}
