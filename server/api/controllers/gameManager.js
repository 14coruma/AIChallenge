/* gameManager.js handles users who want to start a game or are currently
 * playing a game.
 *
 * Created by: Andrew Corum, 9 Oct 2017
 */

'use strict';

var bcrypt = require('bcrypt');
const saltRounds = 10;
var usersPass  = require( './usersPass' );
var signupPass = usersPass.signupPass;
var mysql      = require( 'mysql-model' );
var con        = mysql.createConnection( {
	host     : 'localhost',
	user     : 'signup',
	password : signupPass,
	database : 'AIChallenge',
} );

var User = con.extend( { tableName: "user" } );

/*TODO: startGame() which calls verifyUser() */

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
	bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
		var user = new User(
		{
			username: req.body.username,
			password: hash,
			email: req.body.email,
		} );
		user.save();
	} );
	var fs = require( "fs" );
	var startersPage = fs.readFileSync( "./public/html/starters.html", "utf-8" ); 
	res.send( startersPage );
}
