'use strict';

var passHash = require( 'password-hash' );
var usersPass = require( './usersPass' );
var signupPass = usersPass.signupPass;
var mysql = require( 'mysql-model' );
var con = mysql.createConnection( {
	host     : 'localhost',
	user     : 'signup',
	password : signupPass,
	database : 'AIChallenge',
} );

var User = con.extend( { tableName: "user" } );

exports.list_instructions = function( req, res )
{
	var fs = require( "fs" );
	var addUserPage= fs.readFileSync( "./files/html/addUser.html", "utf-8" );
	res.send( addUserPage );
}

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
