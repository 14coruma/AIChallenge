var expect = require( "chai" ).expect;
var gm = require( "../controllers/gameManager.js" );

describe( "Game Manager Module", function() {
	describe( "addToQueue( gameName, username )", function() {
		it( "Verify test game/user (testGame, test123))", function() {
			var verified0 = gm.addToQueue( "testGame", "test123" );
			var verified1 = gm.addToQueue( "testGame", "badUser" );
			var verified2 = gm.addToQueue( "badGame", "test123" );
			var verified3 = gm.addToQueue( "badGame", "badUser" );

			expect( verified0 ).to.equal( true );
			expect( verified1 ).to.equal( false );
			expect( verified2 ).to.equal( false );
			expect( verified3 ).to.equal( false );
		} );
	} );
} );
