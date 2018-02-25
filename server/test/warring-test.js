'use strict';

var expect = require( "chai" ).expect;
var assert = require( "chai" ).assert;
var gm = require( "../controllers/gameManager.js" );
var warring = require( "../../games/warring.js" );

// Define mainMap variable
var mainMap = [    	[    		{ "type": "mountain", "solid": true },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	],    	[    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false },    		{ "type": "grass", "solid": false }    	]    ]    

describe( "Warring Kings Testing", function() {
	// Test start
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
			expect( state.map.length).to.equal( 10 );
			expect( state.map[0].length).to.equal( 10 );
			done();
		} );
	} );

	// Test unit movement
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
				map: mainMap,
			},
			// Define updates
			{ player: 0, updates: [{ type: "move", unit: 0, direction: "N" }] },
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
				map: mainMap,
			},
			// Define updates
			{ player: 1, updates: [{ type: "move", unit: 0, direction: "E" }] },
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
				map: mainMap,
			},
			// Define updates
			{ player: 0, updates: [{ type: "move", unit: 0, direction: "W" }] },
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
				map: mainMap,
			},
			// Define updates
			{ player: 0, updates: [{ type: "move", unit: 0, direction: "S" }] },
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
} );
