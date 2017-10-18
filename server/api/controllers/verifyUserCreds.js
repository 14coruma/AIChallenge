/* verifyUserCreds.js contains the functions that verify users credentials
 * by matching them to the database
 *
 * Created by: Andrew Corum, 9 Oct 2017
 */

'use strict';

var bcrypt = require('bcrypt');
var usersPass  = require( './usersPass' );
var signupPass = usersPass.signupPass;
var mysql      = require( 'mysql-model' );
var con        = mysql.createConnection( {
	host     : 'localhost',
	user     : 'signup',
	password : verifyPass,
	database : 'AIChallenge',
} );

var User = con.extend( { tableName: "user" } );

/*
 * verifyUser verifies that a user is in the DB and has entered the
 * correct password.
 *
 * @param: username
 * @param: testPassHash, the provided password hash to test
 *
 * @return: (bool) verified
 */
exports.verifyUser = function( username, testPassHash )
{
	var passHash = "Unlikely Hash";
	con.query(
		'SELECT * FROM user WHERE username = ? AND password = ?',
		[username, passHash],
		function( err, res ) {
			if ( err ) throw err;
			passHash = res[0].password;
		}
	);

	// Verify hash using bcrypt
	var verified = false;
	bcrypt.compare( passHash, testPassHash, function( err, res ) {
		if ( err ) throw err;
		verified = res;
	} );
	return verified;
}
