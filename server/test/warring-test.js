'use strict';

var expect = require( "chai" ).expect;
var assert = require( "chai" ).assert;
var gm = require( "../controllers/gameManager.js" );
var warring = require( "../../games/warring.js" );

// Define mainMap variable
var mainMap = [    	[    		{ "type": "mountain", "solid": true },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "wall", "solid": true, "hp": 120 }    	]    ];

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
			expect( state.players[0].gold).to.equal( 400 );
			expect( state.players[1].gold).to.equal( 400 );
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
				{ username: 'test123', fail: 0, gold: 400, units: [
					{ class: "worker", x: 2, y: 2, hp: 40 },
				] },
				{ username: 'test456', fail: 0, gold: 400, units: [
					{ class: "worker", x: 8, y: 8, hp: 40 },
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
				expect( state.players[0].gold).to.equal( 400 );
				expect( state.players[1].gold).to.equal( 400 );
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
				{ username: 'test123', fail: 0, errors: 0, gold: 400, units: [
					{ class: "worker", x: 2, y: 2, hp: 40 },
				] },
				{ username: 'test456', fail: 0, errors: 0, gold: 400, units: [
					{ class: "worker", x: 9, y: 9, hp: 40 },
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
				expect( state.players[0].gold).to.equal( 400 );
				expect( state.players[1].gold).to.equal( 400 );
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
				{ username: 'test123', fail: 0, errors: 0, gold: 400, units: [
					{ class: "worker", x: 1, y: 0, hp: 40 },
				] },
				{ username: 'test456', fail: 0, errors: 0, gold: 400, units: [
					{ class: "worker", x: 8, y: 8, hp: 40 },
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
				expect( state.players[0].gold).to.equal( 400 );
				expect( state.players[1].gold).to.equal( 400 );
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
				{ username: 'test123', fail: 0, errors: 0, gold: 400, units: [
					{ class: "worker", x: 8, y: 7, hp: 40 },
				] },
				{ username: 'test456', fail: 0, errors: 0, gold: 400, units: [
					{ class: "worker", x: 8, y: 8, hp: 40 },
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
				expect( state.players[0].gold).to.equal( 400 );
				expect( state.players[1].gold).to.equal( 400 );
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
				{ username: 'test123', fail: 0, gold: 400, units: [
					{ class: "soldier", x: 2, y: 2, hp: 40, attack: 10 },
				] },
				{ username: 'test456', fail: 0, gold: 400, units: [
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
				expect( state.players[0].gold).to.equal( 400 );
				expect( state.players[1].gold).to.equal( 400 );
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
				{ username: 'test123', fail: 0, gold: 400, units: [
					{ class: "soldier", x: 2, y: 2, hp: 40, attack: 10 },
				] },
				{ username: 'test456', fail: 0, gold: 400, units: [
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
				expect( state.players[0].gold).to.equal( 400 );
				expect( state.players[1].gold).to.equal( 400 );
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
				{ username: 'test123', fail: 0, gold: 400, units: [
					{ class: "soldier", x: 2, y: 2, hp: 40, attack: 10 },
				] },
				{ username: 'test456', fail: 0, gold: 400, units: [
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
				expect( state.players[0].gold).to.equal( 400 );
				expect( state.players[1].gold).to.equal( 400 );
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
				{ username: 'test123', fail: 0, gold: 400, units: [
					{ class: "soldier", x: 2, y: 2, hp: 40, attack: 10 },
				] },
				{ username: 'test456', fail: 0, gold: 400, units: [
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
				expect( state.players[0].gold).to.equal( 400 );
				expect( state.players[1].gold).to.equal( 400 );
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
				{ username: 'test123', fail: 0, errors: 0, gold: 400, units: [
					{ class: "soldier", x: 2, y: 2, hp: 40, attack: 10 },
				] },
				{ username: 'test456', fail: 0, errors: 0, gold: 400, units: [
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
				expect( state.players[0].gold).to.equal( 400 );
				expect( state.players[1].gold).to.equal( 400 );
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
				{ username: 'test123', fail: 0, errors: 0, gold: 400, units: [
					{ class: "soldier", x: 2, y: 2, hp: 40, attack: 10 },
				] },
				{ username: 'test456', fail: 0, errors: 0, gold: 400, units: [
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
				expect( state.players[0].gold).to.equal( 400 );
				expect( state.players[1].gold).to.equal( 400 );
				expect( state.players[1].units.length).to.equal( 1 );
				expect( state.players[1].units[0].x).to.equal( 9 );
				expect( state.players[1].units[0].y).to.equal( 8 );
				expect( state.players[1].errors ).to.equal( 1 );
				done();
		} );
	} );
	it( "makeMove( worker -atk-> unit )", function( done ) {
		gm.makeMove(
			// Set state
			{ id: 1, game: "warring", gameOver: 0, error: "", players: [
				{ username: 'test123', fail: 0, errors: 0, gold: 400, units: [
					{ class: "soldier", x: 2, y: 2, hp: 40, attack: 10 },
				] },
				{ username: 'test456', fail: 0, errors: 0, gold: 400, units: [
					{ class: "worker", x: 3, y: 2, hp: 7 },
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
				expect( state.players[0].gold).to.equal( 400 );
				expect( state.players[1].gold).to.equal( 400 );
				expect( state.players[1].units.length ).to.equal( 1 );
				expect( state.players[0].units[0].hp ).to.equal( 40 );
				expect( state.players[1].units[0].hp ).to.equal( 7 );
				expect( state.players[1].errors ).to.equal( 1 );
				done();
		} );
	} );
} );
