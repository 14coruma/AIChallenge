var expect = require( "chai" ).expect;
var userMod = require( "../api/controllers/user.js" );
var bcrypt = require( 'bcrypt' );
const saltRounds = 10;

describe( "User Module", function() {
	describe( "verifyUser( username, passHash )", function() {
		it( "Verify test user (test123, hash(pass123))", function() {
			var passHash;
			bcrypt.hash( "pass123", saltRounds, function( err, hash ) {
				passHash = hash;
			} );
			var verified0 = userMod.verifyUser( "test123", passHash );
			var verified1 = userMod.verifyUser( "badUser", passHash );
			var verified2 = userMod.verifyUser( "test123", "badPass" );
			var verified3 = userMod.verifyUser( "badUser", "badPass" );

			expect( verified0 ).to.equal( true );
			expect( verified1 ).to.equal( false );
			expect( verified2 ).to.equal( false );
			expect( verified3 ).to.equal( false );
		} );
	} );
} );
