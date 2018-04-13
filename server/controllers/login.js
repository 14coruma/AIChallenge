/* login.js contains the functions that allows users to login to a session on
 * the site
 *
 * Created by: Andrew Corum, 12 Apr 2018
 */

'use strict';

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
 * show_login_page returns the login html page
 */
exports.show_login_page = function( req, res )
{
	var fs = require( "fs" );
	var loginPage = fs.readFileSync( "./public/html/login.html", "utf-8" );
	res.send( loginPage );
}

/*
 * loginUser attempts to log a user into their session. Parms stored in req.body
 *
 * @param: username
 * @param: password, the provided password (hash is stored)
 */
exports.loginUser = function( req, res )
{
	var sql = 'SELECT password FROM user WHERE username = ?';
	var inserts = [ req.body.username ];
	sql = mysql.format( sql, inserts );
	db.queryDB( conn, sql, function( dbRes ) { 
		bcrypt.compare( req.body.password, dbRes[0]["password"], function( err, bcryptRes ) {
			if ( bcryptRes === true ) {
				req.session.username = req.body.username;
				req.session.authenticated = true;
				res.redirect( '/' );
			} else {
				req.session.authenticated = false;
				res.send( "Incorrect login creds!" );
			}
		} );
		return;
	} );
}
