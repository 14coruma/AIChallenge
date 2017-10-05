/* signup.js contains the functions that add users to the database
 *
 * Created by: Andrew Corum, 5 Oct 2017
 */

'use strict';

var passHash   = require( 'password-hash' );
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

/*
 * list_instructions returns the signup html page
 */
exports.list_instructions = function( req, res )
{
	var fs = require( "fs" );
	var addUserPage= fs.readFileSync( "./files/html/addUser.html", "utf-8" );
	res.send( addUserPage );
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
	var hashedPassword = passHash.generate( req.body.password );
	var user = new User(
	{
		username: req.body.username,
		password: hashedPassword,
		email: req.body.email,
	} );
	user.save();
	res.send("User Added");
}
