var expect = require( "chai" ).expect;
var assert = require( "chai" ).assert;
var gm = require( "../controllers/gameManager.js" );

describe( "Farkle Testing", function() {
	// Test first roll bank 200
	it( "makeMove( dice: [1, 2, 3, 4, 5, 5], bank: [1, 5, 5] )", function( done ) {
		gm.makeMove( { id: 3, game: "farkle", currentPlayer: 0, temp: 0, gameOver: 0, error: "", players: [
			{ username: 'test123', pos: 0, fail: 0, score: 0 }, { username: 'test456', pos: 1, fail: 0, score: 0 }],
			dice: [1, 2, 3, 4, 5, 5], bank: [] },
			{ bank: [1, 5, 5], done: 0 },
			function( state ) {
				expect( state.id ).to.equal( 3 );
				expect( state.game ).to.equal( "farkle" );
				expect( state.players ).to.have.lengthOf( 2 );
				expect( state.currentPlayer ).to.equal( 0 );
				expect( state.gameOver ).to.equal( 0 );
				expect( state.players[0].score).to.equal( 0 );
				expect( state.players[1].score).to.equal( 0 );
				done();
		} );
	} );

	// Test second roll, done, score 300
	it( "makeMove( dice: [1, 2, 3], bank: [1] )", function( done ) {
		gm.makeMove( { id: 3, game: "farkle", currentPlayer: 0, temp: 0, gameOver: 0, error: "", players: [
			{ username: 'test123', pos: 0, fail: 0, score: 0 }, { username: 'test456', pos: 1, fail: 0, score: 0 }],
			dice: [1, 2, 3], bank: [1, 5, 5] },
			{ bank: [1], done: 1 },
			function( state ) {
				expect( state.id ).to.equal( 3 );
				expect( state.game ).to.equal( "farkle" );
				expect( state.players ).to.have.lengthOf( 2 );
				expect( state.currentPlayer ).to.equal( 1 );
				expect( state.gameOver ).to.equal( 0 );
				expect( state.players[0].score).to.equal( 300 );
				expect( state.players[1].score).to.equal( 0 );
				done();
		} );
	} );

	// Test first roll, done, score 450
	it( "makeMove( dice: [4, 4, 4, 5, 3, 2], bank: [4, 4, 5, 4] )", function( done ) {
		gm.makeMove( { id: 3, game: "farkle", currentPlayer: 1, temp: 0, gameOver: 0, error: "", players: [
			{ username: 'test123', pos: 0, fail: 0, score: 300 }, { username: 'test456', pos: 1, fail: 0, score: 0 }],
			dice: [4, 4, 4, 5, 3, 2], bank: [] },
			{ bank: [4, 4, 5, 4], done: 1 },
			function( state ) {
				expect( state.id ).to.equal( 3 );
				expect( state.game ).to.equal( "farkle" );
				expect( state.players ).to.have.lengthOf( 2 );
				expect( state.currentPlayer ).to.equal( 0 );
				expect( state.gameOver ).to.equal( 0 );
				expect( state.players[0].score).to.equal( 300 );
				expect( state.players[1].score).to.equal( 450 );
				done();
		} );
	} );

	// Test first roll, farkle
	it( "makeMove( dice: [2, 2, 3, 4, 4, 6], bank: [] )", function( done ) {
		gm.makeMove( { id: 3, game: "farkle", currentPlayer: 0, temp: 0, gameOver: 0, error: "", players: [
			{ username: 'test123', pos: 0, fail: 0, score: 300 }, { username: 'test456', pos: 1, fail: 0, score: 450 }],
			dice: [2, 2, 3, 4, 4, 6], bank: [] },
			{ bank: [], done: 0 },
			function( state ) {
				expect( state.id ).to.equal( 3 );
				expect( state.game ).to.equal( "farkle" );
				expect( state.players ).to.have.lengthOf( 2 );
				expect( state.currentPlayer ).to.equal( 1 );
				expect( state.gameOver ).to.equal( 0 );
				expect( state.players[0].score).to.equal( 300 );
				expect( state.players[1].score).to.equal( 450 );
				done();
		} );
	} );

	// Test first roll, illegal move
	it( "makeMove( dice: [2, 2, 3, 4, 4, 6], bank: [5] )", function( done ) {
		gm.makeMove( { id: 3, game: "farkle", currentPlayer: 1, temp: 0, gameOver: 0, error: "", players: [
			{ username: 'test123', pos: 0, fail: 0, score: 300 }, { username: 'test456', pos: 1, fail: 0, score: 450 }],
			dice: [2, 2, 3, 4, 4, 6], bank: [], winner: -1 },
			{ bank: [5], done: 0 },
			function( state ) {
				expect( state.id ).to.equal( 3 );
				expect( state.game ).to.equal( "farkle" );
				expect( state.players ).to.have.lengthOf( 2 );
				expect( state.currentPlayer ).to.equal( 1 );
				expect( state.gameOver ).to.equal( 1 );
				expect( state.players[0].score).to.equal( 300 );
				expect( state.players[1].score).to.equal( 450 );
				expect( state.winner).to.equal( 0 );
				done();
		} );
	} );

	// Test go-again roll
	it( "makeMove( dice: [6, 6, 6, 6, 6, 6], bank: [6, 6, 6, 6, 6, 6] )", function( done ) {
		gm.makeMove( { id: 3, game: "farkle", currentPlayer: 1, temp: 0, gameOver: 0, error: "", players: [
			{ username: 'test123', pos: 0, fail: 0, score: 300 }, { username: 'test456', pos: 1, fail: 0, score: 450 }],
			dice: [6, 6, 6, 6, 6, 6], bank: [], winner: -1 },
			{ bank: [6, 6, 6, 6, 6, 6], done: 0 },
			function( state ) {
				expect( state.id ).to.equal( 3 );
				expect( state.game ).to.equal( "farkle" );
				expect( state.players ).to.have.lengthOf( 2 );
				expect( state.currentPlayer ).to.equal( 1 );
				expect( state.gameOver ).to.equal( 0 );
				expect( state.players[0].score).to.equal( 300 );
				expect( state.players[1].score).to.equal( 450 );
				expect( state.winner).to.equal( -1 );
				expect( state.dice.length).to.equal( 6 );
				expect( state.temp).to.equal( 3000 );
				done();
		} );
	} );
} );

