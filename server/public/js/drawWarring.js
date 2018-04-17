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
    warringState,
    selectedUnit = { eIndex: 0, uIndex: 0 },
    selectedTile = 0,
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
	warringState = state;
	var formMove = document.getElementById( "formMove" );
	if ( formMove ) {
		formMove.value = JSON.stringify( moveObjWarring );
	}
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
	var hiddenUsername = document.getElementById( "hiddenUsername" );
	if ( hiddenUsername ) {
		if ( state.players[1].username == hiddenUsername.value ) {
			playerNumber = 1;
		} else {
			playerNumber = 0;
		}
		if (
				hiddenUsername &&
				state.players[state.currentPlayer].username != hiddenUsername.value
		) {
		}
	} else {
		playerNumber = 0;
	}

	// Draw player names and scores
	ctx.font = "20px Alagard";
	ctx.textAlign = "left";
	ctx.fillStyle = "red";
	for ( var i = 1; i <= state.players.length; i++ ) {
		ctx.fillText( "P" + i + ": " + state.players[i-1].username, 576, -16 + 64 * i );
		ctx.fillText( "Food: " + state.players[i-1].food, 576, 16 + 64 * i );
	}
	ctx.fillText( "Turn " + state.turn, 16, 584 );

	// Create all map elements
	var myKeep, myFarm; // Used for farmer movement direction
	for ( var y = 0; y < state.map.length; y++ ) {
		for ( var x = 0; x < state.map[y].length; x++ ) {
			var type = state.map[y][x].type;
			if ( type == "keep" && state.map[y][x].style == playerNumber )
				myKeep = { x: x, y: y };
			if ( type == "farm" && state.map[y][x].style == playerNumber )
				myFarm = { x: x, y: y };
			elements.push( { 
				type1: "map",
				type2: type,
				hp: state.map[y][x].hp,
				solid: state.map[y][x].solid,
				style: state.map[y][x].style,
				x: x, y: y,
				width: 32, height: 32,
				top: y * 32 + 16, left: x * 32 + 16,
			} );
			if ( (type == "wall" || type == "keep") && state.map[y][x].hp <= 100 ) {
				elements.push( {
					type2: "fire", style: 0,
					left: x * 32 + 16, top: y * 32 + 16,
					solid: false, hp: 0,
					x: x, y: y,
					width: 32, height: 32,
				} );
			}
		}
	}

	// Create all unit and status elements
	var hasFarmer = false;
	for ( var i = 0; i < state.players.length; i++ ) {
		for ( var j = 0; j < state.players[i].units.length; j++ ) {
			var unit = state.players[i].units[j];
			if ( unit.class == "farmer" && i == playerNumber ) {
				for ( var k = 0; k < unitDests.length; k++ ) {
					if ( state.players[playerNumber].units[unitDests[k].unit].class == "farmer" )
						unitDests.splice( k, 1 );
				}
				hasFarmer = true;
				if ( unit.hasFood ) {
					unitDests.push( {
						unit: j, attack: false,
						dest: [myKeep.x, myKeep.y],
					} );
				} else {
					unitDests.push( {
						unit: j, attack: false,
						dest: [myFarm.x, myFarm.y],
					} );
				}
			}
			elements.push( {
				type1: "unit",
				type2: unit.class,
				hp: unit.hp, range: unit.range,
				player: i, unitIndex: j,
				solid: unit.class != "dead",
				x: unit.x, y: unit.y,
				width: 32, height: 32,
				top: unit.y * 32 + 16,
				left: unit.x * 32 + 16,
			} );
			elements.push( {
				type1: "status",
				type2: "hp",
				style: unit.hp,
				width: 32, height: 32,
				top: unit.y * 32 + 16,
				left: unit.x * 32 + 16,
			} );
			elements.push( {
				type1: "status",
				type2: "hasFood",
				hasFood: unit.hasFood,
				width: 32, height: 32,
				top: unit.y * 32 + 16,
				left: unit.x * 32 + 16,
			} );
		}
	}

	// Create ui elements for unit training (based on food count)
	var myFood = state.players[playerNumber].food;
	if ( myFood >= 400 && !hasFarmer ) {
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
	if ( selectedUnit.eIndex > 0 ) {
		elements.push( {
			type1: "ui",
			type2: "moveButton",
			width: 64, height: 64,
			top: 168,  left: 572,
			pressed: false,
		} );
		if ( state.players[playerNumber].units[selectedUnit.uIndex].class == "soldier" ||
		     state.players[playerNumber].units[selectedUnit.uIndex].class == "archer" ) {
			elements.push( {
				type1: "ui",
				type2: "attackButton",
				width: 64, height: 64,
				top: 168, left: 638,
				pressed: false,
			} );
		}
		if ( myFood >= 150 ) {
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
	if ( selectedUnit.eIndex > 0 ) {
		drawElement( {
			type2: "selectedUnit",
			left:   elements[selectedUnit.eIndex].left,
			top:    elements[selectedUnit.eIndex].top,
			width:  elements[selectedUnit.eIndex].width,
			height: elements[selectedUnit.eIndex].height
		} );
	}
	if ( selectedTile >= 0 ) {
		drawElement( {
			type2: "selectedTile",
			left:   elements[selectedTile].left,
			top:    elements[selectedTile].top,
			width:  elements[selectedTile].width,
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
		if ( state.players[playerNumber].units[unitDests[i].unit].class == "dead" ) continue;
		var attackDir = unitDests[i].attack ? canAttack( state, playerNumber, unitDests[i].unit ) : false;
		// If unit is in attack mode and can attack...then attack
		if ( attackDir ) {
			moveObjWarring.updates.push( {
				type: "attack",
				unit: unitDests[i].unit,
				direction: attackDir,
			} );
		} else { // Otherwise just move
			mapMask[unitDests[i].dest[1]][unitDests[i].dest[0]] = 0;
			var dir = dirTowards(
				state.players[playerNumber].units[unitDests[i].unit].x,
				state.players[playerNumber].units[unitDests[i].unit].y,
				unitDests[i].dest[0],
				unitDests[i].dest[1],
				mapMask
			);
			if ( dir ) {
				moveObjWarring.updates.push( {
					type: "move",
					unit: unitDests[i].unit,
					direction: dir,
				} );
				moveObjWarring.updates.push( {
					type: "attack",
					unit: unitDests[i].unit,
					direction: dir,
				} );
			} else {
				unitDests.splice( i, 1 );
			}
		}
	}

	// Check if stationary units can attack
	for ( var i = 0; i < state.players[playerNumber].units.length; i++ ) {
		if ( state.players[playerNumber].units[i].class == "dead" )
			continue;
		var attackDir = canAttack( state, playerNumber, i );
		if ( attackDir ) {
			moveObjWarring.updates.push( {
				type: "attack",
				unit: i,
				direction: attackDir,
			} );
		}
	}

	// Draw Game Over
	if (state.gameOver == 1) {
		ctx.font = "48px Alagard";
		ctx.textAlign = "center";
		ctx.fillText( "Game Over", canvas.width / 2, canvas.height / 4 );
		ctx.fillText( state.players[state.winner].username + " Wins!", canvas.width / 2, 3 * canvas.height / 4);
		elements = [];
		unitDests = [];
		selectedUnit = { eIndex: 0, uIndex: 0 };
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
		case "rubble":
			drawElement( {
				type2: "grass", style: 1,
				left: element.left, top: element.top,
				width: element.width, height: element.height,
			} );
			sy = 4; sx = 0;
			sImg = img1;
			break;
		case "fire":
			sy = 33; sx = Math.floor( Math.random() * 2 );
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
		case "hasFood":
			if ( element.hasFood ) {
				sy = 21; sx = 6;
			} else {
				sy = 34; sx = 6;
			}
			sImg = img1;
			break;
		case "hp":
			sImg = img1;
			if ( element.style <= 0 ) {
				sy = 34; sx = 6;
				break;
			}
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
					if ( element.player == playerNumber && element.type2 != "dead" ) {
						selectedUnit = {
							uIndex: element.unitIndex,
							eIndex: elements.indexOf( element ),
						};
					}
					break;
				case "map":
					if ( !element.solid || element.type2 == "wall" || element.type2 == "keep" ) {
						selectedTile = elements.indexOf( element );
					}
					break;
				case "ui":
					switch ( element.type2 ) {
						case "stopButton":
							for ( var i = 0; i < unitDests.length; i++ ) {
								if ( unitDests[i].unit == selectedUnit.uIndex ) {
									unitDests.splice( i, 1 );
								}
							}
							break;
						case "moveButton":
							var startX = warringState.players[playerNumber].units[selectedUnit.uIndex].x;
							var startY = warringState.players[playerNumber].units[selectedUnit.uIndex].y;
							var endX   = elements[selectedTile].x;
							var endY   = elements[selectedTile].y;
							unitDests.push( {
								unit: selectedUnit.uIndex,
								attack: false,
								dest: [endX, endY],
							} );
							break;
						case "attackButton":
							var startX = warringState.players[playerNumber].units[selectedUnit.uIndex].x;
							var startY = warringState.players[playerNumber].units[selectedUnit.uIndex].y;
							var endX   = elements[selectedTile].x;
							var endY   = elements[selectedTile].y;
							unitDests.push( {
								unit: selectedUnit.uIndex,
								attack: true,
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
							var startX = warringState.players[playerNumber].units[selectedUnit.uIndex].x;
							var startY = warringState.players[playerNumber].units[selectedUnit.uIndex].y;
							var endX   = elements[selectedTile].x;
							var endY   = elements[selectedTile].y;
							var dir = false;
							if ( endY - startY == -1 ) dir = "N";
							if ( endX - startX == 1 ) dir = "E";
							if ( endY - startY == 1 ) dir = "S";
							if ( endX - startX == -1 ) dir = "W";
							if ( dir ) {
								moveObjWarring.updates.push( {
									type: "build",
									unit: selectedUnit.uIndex,
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

/**
 * Check if a unit can attack an enemy unit. Return dir if attack is possible
 *
 * @param: (obj) current game state
 * @param: (int) player number
 * @param: (int) unit index
 *
 * @return: (char) direction
 *          (bool) false (if cannot attack)
 */
function canAttack( state, playerNumber, unitIndex ) {
	var unit = state.players[playerNumber].units[unitIndex];
	var eUnits = state.players[(playerNumber+1)%2].units;
	for ( var i = 1; i <= unit.range; i++ ) {
		for ( var eIndex = 0; eIndex < eUnits.length; eIndex++ ) {
			if ( eUnits[eIndex].class == "dead" ) continue;
			if ( eUnits[eIndex].y + i == unit.y && eUnits[eIndex].x == unit.x )
				return "N";
			if ( eUnits[eIndex].x - i == unit.x && eUnits[eIndex].y == unit.y )
				return "E";
			if ( eUnits[eIndex].y - i == unit.y && eUnits[eIndex].x == unit.x )
				return "S";
			if ( eUnits[eIndex].x + i == unit.x && eUnits[eIndex].y == unit.y )
				return "W";
		}
	}
	return false;
}
