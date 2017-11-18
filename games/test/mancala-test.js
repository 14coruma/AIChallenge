var expect = require( "chai" ).expect;
var assert = require( "chai" ).assert;
var mancala = require( "../mancala.js" );

describe( "Game Manager Module", function() {
	// start()
	describe( "start( lgid, usernames, callback )", function() {
		it( "start( 2, ['test123', 'test456'], callback )", function( done ) {
			mancala.start( 2, ['test123', 'test456'], function( state ) {
				expect( state.id ).to.equal( 2 );
				expect( state.game ).to.equal( "mancala" );
				expect( state.board ).to.have.lengthOf( 14 );
				expect( state.players ).to.have.lengthOf( 2 );
				expect( state.currentPlayer ).to.equal( 0 );
				expect( state.players[0].username = 'test123' );
				expect( state.players[1].username = 'test456' );
				expect( state.players[0].pos = 0 );
				expect( state.players[1].pos = 1 );
				expect( state.winner ).to.equal( -1 );
				expect( state.gameOver ).to.equal( 0 );
				done();
			} );
		} );
	} );

	// move()
	describe( "move( state, move, callback )", function() {
		// Simple first move
		it( "move( startState, 0, callback )", function( done ) {
			mancala.start( 2, ['test123', 'test456'], function( state ) {
				mancala.move( state, 0, function(state) {
					expect( state.board ).to.have.lengthOf( 14 );
					expect( state.currentPlayer ).to.equal( 1 );
					expect( state.board[0] ).to.equal( 0 );
					expect( state.board[1] ).to.equal( 5 );
					expect( state.board[2] ).to.equal( 5 );
					expect( state.board[3] ).to.equal( 5 );
					expect( state.board[4] ).to.equal( 5 );
					expect( state.board[5] ).to.equal( 4 );
					expect( state.winner ).to.equal( -1 );
					expect( state.gameOver ).to.equal( 0 );
					done();
				} );
			} );
		} );

		// Go-again first move
		it( "move( startState, 2, callback )", function( done ) {
			mancala.start( 2, ['test123', 'test456'], function( state ) {
				mancala.move( state, 2, function(state) {
					expect( state.board ).to.have.lengthOf( 14 );
					expect( state.currentPlayer ).to.equal( 0 );
					expect( state.board[0] ).to.equal( 4 );
					expect( state.board[1] ).to.equal( 4 );
					expect( state.board[2] ).to.equal( 0 );
					expect( state.board[3] ).to.equal( 5 );
					expect( state.board[4] ).to.equal( 5 );
					expect( state.board[5] ).to.equal( 5 );
					expect( state.board[6] ).to.equal( 1 );
					expect( state.winner ).to.equal( -1 );
					expect( state.gameOver ).to.equal( 0 );
					done();
				} );
			} );
		} );
	} );
} );
