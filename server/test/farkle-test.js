var expect = require( "chai" ).expect;
var assert = require( "chai" ).assert;
var gm = require( "../controllers/gameManager.js" );

describe( "Farkle Testing", function() {
	it( "makeMove( dice: [1, 2, 3, 4, 5, 5], bank: [1, 5, 5] )", function( done ) {
		gm.makeMove( { id: 3, game: "farkle", currentPlayer: 0, gameOver: 0, error: "", players: [
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

	it( "makeMove( dice: [1, 2, 3], bank: [1] )", function( done ) {
		gm.makeMove( { id: 3, game: "farkle", currentPlayer: 0, gameOver: 0, error: "", players: [
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
} );

