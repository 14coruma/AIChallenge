var expect = require( "chai" ).expect;
var assert = require( "chai" ).assert;
var userMod = require( "../controllers/user.js" );
var bcrypt = require( 'bcrypt-nodejs' );

describe( "User Module", function() {
	describe( "verifyUser( username, pass123 )", function() {
		it( "Verify test user (test123, pass123))", function( done ) {
			userMod.verifyUser( "test123", "pass123", function( res ) {
				expect( res ).to.equal( true );
				done();
			} );
		} );
		it( "Verify badUser (badUser, pass123))", function( done ) {
			userMod.verifyUser( "badUser", "pass123", function( res ) {
				expect( res ).to.equal( false );
				done();
			} );
		} );
		it( "Verify bad pass (test123, baddPass))", function( done ) {
			userMod.verifyUser( "test123", "badPass", function( res ) {
				expect( res ).to.equal( false );
				done();
			} );
		} );
		it( "Verify bad user bad pass (badUser, badPass))", function( done ) {
			userMod.verifyUser( "badUser", "badPass", function( res ) {
				expect( res ).to.equal( false );
				done();
			} );
		} );
	} );
} );
