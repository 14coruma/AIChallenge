/* user.js contains the functions that pertain to user handling
 *
 * Created by: Andrew Corum, 9 Oct 2017
 */

'use strict';

var bcrypt = require('bcrypt-nodejs');
var userPass  = require( './userPass' );
var verifyPass = userPass.verifyPass;
var mysql      = require( 'mysql' );
var con        = mysql.createConnection( {
	host     : 'localhost',
	user     : 'user',
	password : verifyPass,
	database : 'AIChallenge',
} );

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
	var passHash;
	con.query(
		'SELECT * FROM user WHERE username = ? AND password = ?',
		[username, testPassHash],
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
