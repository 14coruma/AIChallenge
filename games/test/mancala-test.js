var expect = require( "chai" ).expect;
var assert = require( "chai" ).assert;
var mancala = require( "../mancala.js" );

describe( "Game Manager Module", function() {
	// start()
	describe( "start( lgid, usernames, callback )", function() {
		it( "start( 1, ['test123', 'test456'], callback )", function( done ) {
			mancala.start( 1, ['test123', 'test456'], function( state ) {
				expect( state.id ).to.equal( 1 );
				expect( state.game ).to.equal( "mancala" );
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
} );
