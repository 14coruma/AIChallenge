/* signup.js contains the functions that add users to the database
 *
 * Created by: Andrew Corum, 5 Oct 2017
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
 * list_instructions returns the signup html page
 */
exports.list_instructions = function( req, res )
{
	var fs = require( "fs" );
	var signupPage = fs.readFileSync( "./public/html/signup.html", "utf-8" );
	res.send( signupPage );
}

/*
 * add_user adds a new user to the database. Params stored in req.body
 *
 * @param: username
 * @param: password, the provided password (hash is stored)
 * @param: email
 */
exports.add_user = function( req, res )
{
	// Hash using bcrypt
	bcrypt.hash( req.body.password, null, null, function( err, hash ) {
		var sql = 'INSERT INTO user (username, password, email) values (?, ?, ?)';
		var inserts = [ req.body.username, hash, req.body.email ];
		sql = mysql.format( sql, inserts );
		db.queryDB( conn, sql, function( res ) { return; } );
	} );
	var fs = require( "fs" );
	var startersPage = fs.readFileSync( "./public/html/starters.html", "utf-8" ); 
	res.send( startersPage );
}
