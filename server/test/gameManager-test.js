var expect = require( "chai" ).expect;
var assert = require( "chai" ).assert;
var gm = require( "../controllers/gameManager.js" );

describe( "Game Manager Module", function() {
	describe( "addToQueue( gameName, username )", function() {
		it( "Verify test game/user (testGame, test123))", function( done ) {
			gm.addToQueue( "testGame", "test123", function( res ) {
				expect( res ).to.be.true;
				done();
			} );
		} );
		it ( "Fail badGame, good user (badGame, test123))", function( done ) {
			gm.addToQueue( "badGame", "test123", function( res ) {
				expect( res ).to.be.false;
				done();
			} );
		} );
		it( "Fail good game, bad user (testGame, badUser))", function( done ) {
			gm.addToQueue( "testGame", "badUser", function( res ) {
				expect( res ).to.be.false;
				done();
			} );
		} );
		it ( "Fail bad game, bad user (badGame, badUser))", function( done ) {
			gm.addToQueue( "badGame", "badUser", function( res ) {
				expect( res ).to.be.false;
				done();
			} );
		} );
	} );
} );
