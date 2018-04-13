/* login.js contains the functions that allows users to login to a session on
 * the site
 *
 * Created by: Andrew Corum, 12 Apr 2018
 */

'use strict';

var blocks = require( './htmlBlocks.js' );
var fs = require( "fs" );
var bcrypt = require('bcrypt-nodejs');
var userPass  = require( './userPass' );
var db = require( './dbModule' );
var signupPass = userPass.signupPass;
var mysql      = require( 'mysql' );
var conn        = mysql.createConnection( {
	host     : 'localhost',
	user     : 'signup',
	password : signupPass,
	database : 'AIChallenge',
} );

/*
 * loginUser attempts to log a user into their session. Parms stored in req.body
 *
 * @param: username
 * @param: password, the provided password (hash is stored)
 */
exports.loginUser = function( req, res )
{
	var sql = 'SELECT id, password FROM user WHERE username = ?';
	var inserts = [ req.body.username ];
	sql = mysql.format( sql, inserts );
	db.queryDB( conn, sql, function( dbRes ) { 
		bcrypt.compare( req.body.password, dbRes[0]["password"], function( err, bcryptRes ) {
			if ( bcryptRes === true ) {
				req.session.userID = dbRes[0]["id"];
				req.session.username = req.body.username;
				req.session.auth = true;
				res.redirect( '/' );
			} else {
				req.session.auth = false;
				res.send( "Incorrect login creds!" );
			}
		} );
		return;
	} );
}
