/* user.js contains the functions that pertain to user handling
 *
 * Created by: Andrew Corum, 9 Oct 2017
 */

'use strict';

var bcrypt = require('bcrypt-nodejs');
var userPass  = require( './userPass' );
var verifyPass = userPass.verifyPass;
var db = require( './dbModule' );
var mysql      = require( 'mysql' );
var conn        = mysql.createConnection( {
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
exports.verifyUser = function( username, testPass, callback )
{
	var sql = 'SELECT password FROM user WHERE username = ?';
	var inserts = [username];
	sql = mysql.format( sql, inserts );
	db.queryDB( conn, sql, function( res ) {
		if ( res[0] != undefined ) {
			var passHash = res[0].password;
			// Verify hash using bcrypt
			bcrypt.compare( testPass, passHash, function( err, res ) {
				if ( err ) throw err;
				callback( res )
			} );
		} else {
			callback( false )
		}
		return;
	} );
}
