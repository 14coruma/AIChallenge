'use strict';

var expect = require( "chai" ).expect;
var assert = require( "chai" ).assert;
var gm = require( "../controllers/gameManager.js" );
var warring = require( "../../games/warring.js" );

// Define mainMap variable
var mainMap = [    	[    		{ "type": "mountain", "solid": true },    		{ "type": "grass", "solid": false },    		{ "type": "keep", "style": 0, "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "mountain", "solid": true },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "mountain", "solid": true },    		{ "type": "keep", "style": 1, "solid": true },    		{ "type": "wall", "solid": true, "hp": 120 }    	]    ];

describe( "Warring Kings Testing", function() {
	/*
	 * Test start
	 */
	it( "start( 0, [test123, test456], NULL )", function( done ) {
		warring.start( 0, ["test123", "test456"], function( state ) {
			expect( state.id ).to.equal( 0 );
			expect( state.game ).to.equal( "warring" );
			expect( state.players ).to.have.lengthOf( 2 );
			expect( state.gameOver ).to.equal( 0 );
			expect( state.players[0].food).to.equal( 400 );
			expect( state.players[1].food).to.equal( 400 );
			expect( state.players[0].units.length).to.equal( 1 );
			expect( state.players[1].units[0].hp).to.equal( 40 );
			expect( state.currentPlayer).to.equal( 0 );
			expect( state.map.length).to.equal( 10 );
			expect( state.map[0].length).to.equal( 10 );
			done();
		} );
	} );

	/*
	 * Test unit movement
	 */
	it( "makeMove( unit --> empty space )", function( done ) {
		gm.makeMove(
			// Set state
			{ id: 1, game: "warring", gameOver: 0, error: "", players: [
				{ username: 'test123', fail: 0, food: 400, units: [
					{ class: "farmer", x: 2, y: 2, hp: 40 },
				] },
				{ username: 'test456', fail: 0, food: 400, units: [
					{ class: "farmer", x: 8, y: 8, hp: 40 },
				] }],
				map: mainMap, currentPlayer: 0,
			},
			// Define updates
			{ updates: [{ type: "move", unit: 0, direction: "N" }] },
			function( state ) {
				expect( state.id ).to.equal( 1 );
				expect( state.game ).to.equal( "warring" );
				expect( state.players ).to.have.lengthOf( 2 );
				expect( state.gameOver ).to.equal( 0 );
				expect( state.players[0].food).to.equal( 400 );
				expect( state.players[1].food).to.equal( 400 );
				expect( state.players[0].units.length).to.equal( 1 );
				expect( state.players[1].units[0].hp).to.equal( 40 );
				expect( state.players[0].units[0].x).to.equal( 2 );
				expect( state.players[0].units[0].y).to.equal( 1 );
				done();
		} );
	} );
	it( "makeMove( unit -/> off map )", function( done ) {
		gm.makeMove(
			// Set state
			{ id: 1, game: "warring", gameOver: 0, error: "", players: [
				{ username: 'test123', fail: 0, errors: 0, food: 400, units: [
					{ class: "farmer", x: 2, y: 2, hp: 40 },
				] },
				{ username: 'test456', fail: 0, errors: 0, food: 400, units: [
					{ class: "farmer", x: 9, y: 9, hp: 40 },
				] }],
				map: mainMap, currentPlayer: 1,
			},
			// Define updates
			{ updates: [{ type: "move", unit: 0, direction: "E" }] },
			function( state ) {
				expect( state.id ).to.equal( 1 );
				expect( state.game ).to.equal( "warring" );
				expect( state.players ).to.have.lengthOf( 2 );
				expect( state.gameOver ).to.equal( 0 );
				expect( state.players[0].food).to.equal( 400 );
				expect( state.players[1].food).to.equal( 400 );
				expect( state.players[0].units.length).to.equal( 1 );
				expect( state.players[1].units[0].hp).to.equal( 40 );
				expect( state.players[1].units[0].x).to.equal( 9 );
				expect( state.players[1].units[0].y).to.equal( 9 );
				expect( state.players[1].errors).to.equal( 1 );
				done();
		} );
	} );
	it( "makeMove( unit -/> obstacle )", function( done ) {
		gm.makeMove(
			// Set state
			{ id: 1, game: "warring", gameOver: 0, error: "", players: [
				{ username: 'test123', fail: 0, errors: 0, food: 400, units: [
					{ class: "farmer", x: 1, y: 0, hp: 40 },
				] },
				{ username: 'test456', fail: 0, errors: 0, food: 400, units: [
					{ class: "farmer", x: 8, y: 8, hp: 40 },
				] }],
				map: mainMap, currentPlayer: 0,
			},
			// Define updates
			{ updates: [{ type: "move", unit: 0, direction: "W" }] },
			function( state ) {
				expect( state.id ).to.equal( 1 );
				expect( state.game ).to.equal( "warring" );
				expect( state.players ).to.have.lengthOf( 2 );
				expect( state.gameOver ).to.equal( 0 );
				expect( state.players[0].food).to.equal( 400 );
				expect( state.players[1].food).to.equal( 400 );
				expect( state.players[0].units.length).to.equal( 1 );
				expect( state.players[0].units[0].hp).to.equal( 40 );
				expect( state.players[0].units[0].x).to.equal( 1 );
				expect( state.players[0].units[0].y).to.equal( 0 );
				expect( state.players[0].errors).to.equal( 1 );
				done();
		} );
	} );
	it( "makeMove( unit -/> unit )", function( done ) {
		gm.makeMove(
			// Set state
			{ id: 1, game: "warring", gameOver: 0, error: "", players: [
				{ username: 'test123', fail: 0, errors: 0, food: 400, units: [
					{ class: "farmer", x: 8, y: 7, hp: 40 },
				] },
				{ username: 'test456', fail: 0, errors: 0, food: 400, units: [
					{ class: "farmer", x: 8, y: 8, hp: 40 },
				] }],
				map: mainMap, currentPlayer: 0,
			},
			// Define updates
			{ updates: [{ type: "move", unit: 0, direction: "S" }] },
			function( state ) {
				expect( state.id ).to.equal( 1 );
				expect( state.game ).to.equal( "warring" );
				expect( state.players ).to.have.lengthOf( 2 );
				expect( state.gameOver ).to.equal( 0 );
				expect( state.players[0].food).to.equal( 400 );
				expect( state.players[1].food).to.equal( 400 );
				expect( state.players[0].units.length).to.equal( 1 );
				expect( state.players[0].units[0].hp).to.equal( 40 );
				expect( state.players[0].units[0].x).to.equal( 8 );
				expect( state.players[0].units[0].y).to.equal( 7 );
				expect( state.players[0].errors).to.equal( 1 );
				done();
		} );
	} );

	/**
	 * Test unit movement
	 */
	it( "makeMove( unit -atk-> unit )", function( done ) {
		gm.makeMove(
			// Set state
			{ id: 1, game: "warring", gameOver: 0, error: "", players: [
				{ username: 'test123', fail: 0, food: 400, units: [
					{ class: "soldier", x: 2, y: 2, hp: 40, attack: 10 },
				] },
				{ username: 'test456', fail: 0, food: 400, units: [
					{ class: "soldier", x: 3, y: 2, hp: 40, attack: 10 },
				] }],
				map: mainMap, currentPlayer: 0,
			},
			// Define updates
			{ updates: [{ type: "attack", unit: 0, direction: "E" }] },
			function( state ) {
				expect( state.id ).to.equal( 1 );
				expect( state.game ).to.equal( "warring" );
				expect( state.players ).to.have.lengthOf( 2 );
				expect( state.gameOver ).to.equal( 0 );
				expect( state.players[0].food).to.equal( 400 );
				expect( state.players[1].food).to.equal( 400 );
				expect( state.players[0].units.length).to.equal( 1 );
				expect( state.players[1].units[0].hp).to.equal( 30 );
				expect( state.players[0].units[0].x).to.equal( 2 );
				expect( state.players[0].units[0].y).to.equal( 2 );
				done();
		} );
	} );
	it( "makeMove( unit -atk-> unit (dead) )", function( done ) {
		gm.makeMove(
			// Set state
			{ id: 1, game: "warring", gameOver: 0, error: "", players: [
				{ username: 'test123', fail: 0, food: 400, units: [
					{ class: "soldier", x: 2, y: 2, hp: 40, attack: 10 },
				] },
				{ username: 'test456', fail: 0, food: 400, units: [
					{ class: "soldier", x: 3, y: 2, hp: 7, attack: 10 },
				] }],
				map: mainMap, currentPlayer: 0,
			},
			// Define updates
			{ updates: [{ type: "attack", unit: 0, direction: "E" }] },
			function( state ) {
				expect( state.id ).to.equal( 1 );
				expect( state.game ).to.equal( "warring" );
				expect( state.players ).to.have.lengthOf( 2 );
				expect( state.gameOver ).to.equal( 0 );
				expect( state.players[0].food).to.equal( 400 );
				expect( state.players[1].food).to.equal( 400 );
				expect( state.players[1].units.length).to.equal( 0 );
				expect( state.players[0].units[0].x).to.equal( 2 );
				expect( state.players[0].units[0].y).to.equal( 2 );
				done();
		} );
	} );
	it( "makeMove( unit -atk-> wall )", function( done ) {
		gm.makeMove(
			// Set state
			{ id: 1, game: "warring", gameOver: 0, error: "", players: [
				{ username: 'test123', fail: 0, food: 400, units: [
					{ class: "soldier", x: 2, y: 2, hp: 40, attack: 10 },
				] },
				{ username: 'test456', fail: 0, food: 400, units: [
					{ class: "soldier", x: 9, y: 8, hp: 7, attack: 10 },
				] }],
				map: mainMap, currentPlayer: 1,
			},
			// Define updates
			{ updates: [{ type: "attack", unit: 0, direction: "S" }] },
			function( state ) {
				expect( state.id ).to.equal( 1 );
				expect( state.game ).to.equal( "warring" );
				expect( state.players ).to.have.lengthOf( 2 );
				expect( state.gameOver ).to.equal( 0 );
				expect( state.players[0].food).to.equal( 400 );
				expect( state.players[1].food).to.equal( 400 );
				expect( state.players[1].units.length).to.equal( 1 );
				expect( state.players[1].units[0].x).to.equal( 9 );
				expect( state.players[1].units[0].y).to.equal( 8 );
				expect( state.map[9][9].hp ).to.equal( 110 );
				expect( state.map[9][9].solid ).to.equal( true );
				done();
		} );
	} );
	it( "makeMove( unit -atk-> wall (broken) )", function( done ) {
		gm.makeMove(
			// Set state
			{ id: 1, game: "warring", gameOver: 0, error: "", players: [
				{ username: 'test123', fail: 0, food: 400, units: [
					{ class: "soldier", x: 2, y: 2, hp: 40, attack: 10 },
				] },
				{ username: 'test456', fail: 0, food: 400, units: [
					{ class: "soldier", x: 9, y: 8, hp: 7, attack: 120 },
				] }],
				map: mainMap, currentPlayer: 1,
			},
			// Define updates
			{ updates: [{ type: "attack", unit: 0, direction: "S" }] },
			function( state ) {
				expect( state.id ).to.equal( 1 );
				expect( state.game ).to.equal( "warring" );
				expect( state.players ).to.have.lengthOf( 2 );
				expect( state.gameOver ).to.equal( 0 );
				expect( state.players[0].food).to.equal( 400 );
				expect( state.players[1].food).to.equal( 400 );
				expect( state.players[1].units.length).to.equal( 1 );
				expect( state.players[1].units[0].x).to.equal( 9 );
				expect( state.players[1].units[0].y).to.equal( 8 );
				expect( state.map[9][9].solid ).to.equal( false );
				done();
		} );
	} );
	it( "makeMove( unit -atk-> empty )", function( done ) {
		gm.makeMove(
			// Set state
			{ id: 1, game: "warring", gameOver: 0, error: "", players: [
				{ username: 'test123', fail: 0, errors: 0, food: 400, units: [
					{ class: "soldier", x: 2, y: 2, hp: 40, attack: 10 },
				] },
				{ username: 'test456', fail: 0, errors: 0, food: 400, units: [
					{ class: "soldier", x: 9, y: 8, hp: 7, attack: 10 },
				] }],
				map: mainMap, currentPlayer: 0,
			},
			// Define updates
			{ updates: [{ type: "attack", unit: 0, direction: "S" }] },
			function( state ) {
				expect( state.id ).to.equal( 1 );
				expect( state.game ).to.equal( "warring" );
				expect( state.players ).to.have.lengthOf( 2 );
				expect( state.gameOver ).to.equal( 0 );
				expect( state.players[0].food).to.equal( 400 );
				expect( state.players[1].food).to.equal( 400 );
				expect( state.players[1].units.length).to.equal( 1 );
				expect( state.players[0].units[0].x).to.equal( 2 );
				expect( state.players[0].units[0].y).to.equal( 2 );
				expect( state.map[2][3].solid ).to.equal( false );
				expect( state.players[0].errors ).to.equal( 1 );
				done();
		} );
	} );
	it( "makeMove( unit -atk-> off map )", function( done ) {
		gm.makeMove(
			// Set state
			{ id: 1, game: "warring", gameOver: 0, error: "", players: [
				{ username: 'test123', fail: 0, errors: 0, food: 400, units: [
					{ class: "soldier", x: 2, y: 2, hp: 40, attack: 10 },
				] },
				{ username: 'test456', fail: 0, errors: 0, food: 400, units: [
					{ class: "soldier", x: 9, y: 8, hp: 7, attack: 10 },
				] }],
				map: mainMap, currentPlayer: 1,
			},
			// Define updates
			{ updates: [{ type: "attack", unit: 0, direction: "E" }] },
			function( state ) {
				expect( state.id ).to.equal( 1 );
				expect( state.game ).to.equal( "warring" );
				expect( state.players ).to.have.lengthOf( 2 );
				expect( state.gameOver ).to.equal( 0 );
				expect( state.players[0].food).to.equal( 400 );
				expect( state.players[1].food).to.equal( 400 );
				expect( state.players[1].units.length).to.equal( 1 );
				expect( state.players[1].units[0].x).to.equal( 9 );
				expect( state.players[1].units[0].y).to.equal( 8 );
				expect( state.players[1].errors ).to.equal( 1 );
				done();
		} );
	} );
	it( "makeMove( farmer -atk-> unit )", function( done ) {
		gm.makeMove(
			// Set state
			{ id: 1, game: "warring", gameOver: 0, error: "", players: [
				{ username: 'test123', fail: 0, errors: 0, food: 400, units: [
					{ class: "soldier", x: 2, y: 2, hp: 40, attack: 10 },
				] },
				{ username: 'test456', fail: 0, errors: 0, food: 400, units: [
					{ class: "farmer", x: 3, y: 2, hp: 7 },
				] }],
				map: mainMap, currentPlayer: 1,
			},
			// Define updates
			{ updates: [{ type: "attack", unit: 0, direction: "W" }] },
			function( state ) {
				expect( state.id ).to.equal( 1 );
				expect( state.game ).to.equal( "warring" );
				expect( state.players ).to.have.lengthOf( 2 );
				expect( state.gameOver ).to.equal( 0 );
				expect( state.players[0].food).to.equal( 400 );
				expect( state.players[1].food).to.equal( 400 );
				expect( state.players[1].units.length ).to.equal( 1 );
				expect( state.players[0].units[0].hp ).to.equal( 40 );
				expect( state.players[1].units[0].hp ).to.equal( 7 );
				expect( state.players[1].errors ).to.equal( 1 );
				done();
		} );
	} );

	/**
	 * Test unit training
	 */
	it( "makeMove( player0 -train-> worker )", function( done ) {
		gm.makeMove(
			// Set state
			{ id: 1, game: "warring", gameOver: 0, error: "", players: [
				{ username: 'test123', fail: 0, errors: 0, food: 450, units: [
					{ class: "soldier", x: 2, y: 2, hp: 30, attack: 10 },
				] },
				{ username: 'test456', fail: 0, errors: 0, food: 400, units: [
					{ class: "farmer", x: 3, y: 2, hp: 7 },
				] }],
				map: mainMap, currentPlayer: 0,
			},
			// Define updates
			{ updates: [{ type: "train", class: "farmer" }] },
			function( state ) {
				expect( state.players[0].food).to.equal( 50 );
				expect( state.players[1].food).to.equal( 400 );
				expect( state.players[0].units.length ).to.equal( 2 );
				expect( state.players[0].units[1].hp ).to.equal( 40 );
				expect( state.players[0].units[1].x ).to.equal( 3 );
				expect( state.players[0].units[1].y ).to.equal( 0 );
				expect( state.players[0].errors ).to.equal( 0 );
				done();
		} );
	} );
	it( "makeMove( player0 -train-> soldier )", function( done ) {
		gm.makeMove(
			// Set state
			{ id: 1, game: "warring", gameOver: 0, error: "", players: [
				{ username: 'test123', fail: 0, errors: 0, food: 450, units: [
					{ class: "soldier", x: 2, y: 2, hp: 30, attack: 10 },
				] },
				{ username: 'test456', fail: 0, errors: 0, food: 400, units: [
					{ class: "farmer", x: 3, y: 2, hp: 7 },
				] }],
				map: mainMap, currentPlayer: 0,
			},
			// Define updates
			{ updates: [{ type: "train", class: "soldier" }] },
			function( state ) {
				expect( state.players[0].food).to.equal( 0 );
				expect( state.players[1].food).to.equal( 400 );
				expect( state.players[0].units.length ).to.equal( 2 );
				expect( state.players[0].units[1].hp ).to.equal( 60 );
				expect( state.players[0].units[1].x ).to.equal( 3 );
				expect( state.players[0].units[1].y ).to.equal( 0 );
				expect( state.players[0].errors ).to.equal( 0 );
				done();
		} );
	} );
	it( "makeMove( player0 -train-> archer (too expensive) )", function( done ) {
		gm.makeMove(
			// Set state
			{ id: 1, game: "warring", gameOver: 0, error: "", players: [
				{ username: 'test123', fail: 0, errors: 0, food: 450, units: [
					{ class: "soldier", x: 2, y: 2, hp: 30, attack: 10 },
				] },
				{ username: 'test456', fail: 0, errors: 0, food: 400, units: [
					{ class: "farmer", x: 3, y: 2, hp: 7 },
				] }],
				map: mainMap, currentPlayer: 0,
			},
			// Define updates
			{ updates: [{ type: "train", class: "archer" }] },
			function( state ) {
				expect( state.players[0].food).to.equal( 450 );
				expect( state.players[1].food).to.equal( 400 );
				expect( state.players[0].units.length ).to.equal( 1 );
				expect( state.players[0].errors ).to.equal( 1 );
				done();
		} );
	} );
	it( "makeMove( player1 -train-> archer (no space) )", function( done ) {
		mainMap[9][9] = { type: "wall", hp: 120, solid: true };
		mainMap[9][7] = { type: "wall", hp: 120, solid: true };
		gm.makeMove(
			// Set state
			{ id: 1, game: "warring", gameOver: 0, error: "", players: [
				{ username: 'test123', fail: 0, errors: 0, food: 450, units: [
					{ class: "soldier", x: 2, y: 2, hp: 30, attack: 10 },
				] },
				{ username: 'test456', fail: 0, errors: 0, food: 500, units: [
					{ class: "farmer", x: 3, y: 2, hp: 7 },
				] }],
				map: mainMap, currentPlayer: 1,
			},
			// Define updates
			{ updates: [{ type: "train", class: "archer" }] },
			function( state ) {
				expect( state.players[0].food).to.equal( 450 );
				expect( state.players[1].food).to.equal( 500 );
				expect( state.players[1].units.length ).to.equal( 1 );
				expect( state.players[1].errors ).to.equal( 1 );
				done();
		} );
	} );

	/**
	 * Test building
	 */
	it( "makeMove( player0 -build-> wall )", function( done ) {
		gm.makeMove(
			// Set state
			{ id: 1, game: "warring", gameOver: 0, error: "", players: [
				{ username: 'test123', fail: 0, errors: 0, food: 450, units: [
					{ class: "soldier", x: 2, y: 2, hp: 30, attack: 10 },
				] },
				{ username: 'test456', fail: 0, errors: 0, food: 400, units: [
					{ class: "farmer", x: 3, y: 2, hp: 7 },
				] }],
				map: mainMap, currentPlayer: 0,
			},
			// Define updates
			{ updates: [{ type: "build", unit: 0, direction: "S" }] },
			function( state ) {
				expect( state.players[0].food).to.equal( 200 );
				expect( state.players[1].food).to.equal( 400 );
				expect( state.players[0].units.length ).to.equal( 1 );
				expect( state.players[0].errors ).to.equal( 0 );
				expect( state.map[3][2].type ).to.equal( "wall" );
				expect( state.map[3][2].solid ).to.equal( true );
				done();
		} );
	} );
	it( "makeMove( player0 -build-> wall (obstructed) )", function( done ) {
		gm.makeMove(
			// Set state
			{ id: 1, game: "warring", gameOver: 0, error: "", players: [
				{ username: 'test123', fail: 0, errors: 0, food: 450, units: [
					{ class: "soldier", x: 2, y: 2, hp: 30, attack: 10 },
				] },
				{ username: 'test456', fail: 0, errors: 0, food: 400, units: [
					{ class: "farmer", x: 0, y: 5, hp: 7 },
				] }],
				map: mainMap, currentPlayer: 1,
			},
			// Define updates
			{ updates: [{ type: "build", unit: 0, direction: "W" }] },
			function( state ) {
				expect( state.players[0].food).to.equal( 450 );
				expect( state.players[1].food).to.equal( 400 );
				expect( state.players[1].errors ).to.equal( 1 );
				done();
		} );
	} );

	/**
	 * Test auto farm and food dropoff
	 */
	it( "makeMove( player0 -move-> on farm )", function( done ) {
		mainMap[3][2] = { type: "farm", solid: "false" };
		gm.makeMove(
			// Set state
			{ id: 1, game: "warring", gameOver: 0, error: "", players: [
				{ username: 'test123', fail: 0, errors: 0, food: 450, units: [
					{ class: "farmer", x: 2, y: 2, hp: 30, attack: 10, hasFood: false },
				] },
				{ username: 'test456', fail: 0, errors: 0, food: 400, units: [
					{ class: "farmer", x: 3, y: 2, hp: 7 },
				] }],
				map: mainMap, currentPlayer: 0,
			},
			// Define updates
			{ updates: [{ type: "move", unit: 0, direction: "S" }] },
			function( state ) {
				expect( state.players[0].food).to.equal( 450 );
				expect( state.players[1].food).to.equal( 400 );
				expect( state.players[0].errors ).to.equal( 0 );
				expect( state.players[0].units[0].hasFood ).to.equal( true );
				done();
		} );
	} );
	it( "makeMove( player1 -move-> near keep w/ food )", function( done ) {
		mainMap[9][9] = { type: "grass", solid: "false" };
		gm.makeMove(
			// Set state
			{ id: 1, game: "warring", gameOver: 0, error: "", players: [
				{ username: 'test123', fail: 0, errors: 0, food: 450, units: [
					{ class: "farmer", x: 2, y: 2, hp: 30, attack: 10, hasFood: false },
				] },
				{ username: 'test456', fail: 0, errors: 0, food: 400, units: [
					{ class: "farmer", x: 8, y: 9, hp: 7, hasFood: true },
				] }],
				map: mainMap, currentPlayer: 1,
			},
			// Define updates
			{ updates: [{ type: "move", unit: 0, direction: "E" }] },
			function( state ) {
				expect( state.players[0].food).to.equal( 450 );
				expect( state.players[1].food).to.equal( 600 );
				expect( state.players[1].errors ).to.equal( 0 );
				expect( state.players[1].units[0].hasFood ).to.equal( false );
				done();
		} );
	} );
} );
