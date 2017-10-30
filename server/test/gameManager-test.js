var expect = require( "chai" ).expect;
var assert = require( "chai" ).assert;
var gm = require( "../controllers/gameManager.js" );

describe( "Game Manager Module", function() {
	describe( "addToQueue( gameName, username )", function() {
		it( "Verify test game/user (testGame, test123))", function( done ) {
			gm.addToQueue( "testGame", "test123", function( res ) {
				expect( res ).that.is.a('number');
				done();
				gm.deleteFromQueue( "testGame", "test123", function( res ) {} );
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

	describe( "gameReady( gameID )", function() {
		it( "testGame not ready (0<min)", function( done ) {
			gm.gameReady( 1, function( res ) {
				expect( res ).to.be.false;
				done();
			} );
		} );
		it( "testGame not ready (1<min)", function( done ) {
			gm.addToQueue( "testGame", "test123", function( res ) {
				gm.gameReady( "testGame", function( res ) {
					expect( res ).to.be.false;
					done();
				});
			} );
		} );
		it( "testGame ready (2==min)", function( done ) {
			gm.addToQueue( "testGame", "test123", function( res ) {
				gm.gameReady( "testGame", function( res ) {
					expect( res ).to.be.true;
					done();
				});
			} );
		} );
		it( "testGame ready (3==max)", function( done ) {
			gm.addToQueue( "testGame", "test123", function( res ) {
				gm.gameReady( "testGame", function( res ) {
					expect( res ).to.be.true;
					done();
				});
			} );
		} );
		it( "testGame ready (4>max)", function( done ) {
			gm.addToQueue( "testGame", "test123", function( res ) {
				gm.gameReady( "testGame", function( res ) {
					expect( res ).to.be.true;
					done();
					gm.deleteFromQueue( "testGame", "test123", function( res ) {} );
					gm.deleteFromQueue( "testGame", "test123", function( res ) {} );
					gm.deleteFromQueue( "testGame", "test123", function( res ) {} );
					gm.deleteFromQueue( "testGame", "test123", function( res ) {} );
				});
			} );
		} );
	} );
} );
