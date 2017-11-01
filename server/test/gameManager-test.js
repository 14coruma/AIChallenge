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
			gm.gameReady( 1, function( ready, gameID, userNames ) {
				expect( ready ).to.be.false;
				expect( gameID ).to.equal( -1 );
				expect( userNames ).to.have.lengthOf( 0 );
				done();
			} );
		} );
		it( "testGame not ready (1<min)", function( done ) {
			gm.addToQueue( "testGame", "test123", function( ready ) {
				gm.gameReady( "testGame", function( ready, gameID, userNames ) {
					expect( ready ).to.be.false;
					expect( gameID ).to.equal( -1 );
					expect( userNames ).to.have.lengthOf( 0 );
					done();
				});
			} );
		} );
		it( "testGame ready (2==min)", function( done ) {
			gm.addToQueue( "testGame", "test123", function( ready ) {
				gm.gameReady( "testGame", function( ready, gameID, userNames ) {
					expect( ready ).to.be.true;
					expect( gameID ).to.be.above( 0 );
					expect( userNames ).to.have.lengthOf( 2 );
					expect( userNames[0] ).to.be.a( 'string' );
					done();
				});
			} );
		} );
		// Not doing max testing for now
		/*it( "testGame ready (1<min)", function( done ) {
			gm.addToQueue( "testGame", "test123", function( ready ) {
				gm.gameReady( "testGame", function( ready, gameID, userNames ) {
					expect( ready ).to.be.false;
					expect( gameID ).to.equal( -1 );
					expect( userNames ).to.have.lengthOf( 0 );
					done();
				});
			} );
		} );
		it( "testGame ready (3==max)", function( done ) {
			gm.addToQueue( "testGame", "test123", function( ready ) {
			gm.addToQueue( "testGame", "test123", function( ready ) {
				gm.gameReady( "testGame", function( ready, gameID, userNames ) {
					expect( ready ).to.be.true;
					expect( gameID ).to.equal( 0 );
					expect( userNames ).to.have.lengthOf( 3 );
					done();
				} );
			} );
			} );
		} );
		*/
		// Not doing max testing for now, just add min to a game
		it( "testGame ready (4>min)", function( done ) {
			gm.addToQueue( "testGame", "test123", function( ready ) {
			gm.addToQueue( "testGame", "test123", function( ready ) {
			gm.addToQueue( "testGame", "test123", function( ready ) {
			gm.addToQueue( "testGame", "test123", function( ready ) {
				gm.gameReady( "testGame", function( ready, gameID, userNames ) {
					expect( ready ).to.be.true;
					expect( gameID ).to.be.above( 0 );
					expect( userNames ).to.have.lengthOf( 2 ); // Change this to 3 for max testing
					done();
					gm.deleteFromQueue( "testGame", "test123", function( ready, gameID, userNames ) {} );
					gm.deleteFromQueue( "testGame", "test123", function( ready, gameID, userNames ) {} );
				} );
			} );
			} );
			} );
			} );
		} );
	} );
} );
