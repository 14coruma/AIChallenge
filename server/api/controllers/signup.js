'use strict';

var mysql = require( 'mysql' );
var con = mysql.createConnection( {
	host     : 'localhost',
	user     : 'signup',
	password : 'HNy68yjyDp4YbyDr',
	database : 'AIChallenge',
} );

//var User = connection.extend( { tableName: "user" } );

exports.list_instructions = function( req, res )
{
	var fs = require( "fs" );
	var addUserPage= fs.readFileSync( "./files/html/addUser.html", "utf-8" );
	res.send( addUserPage );
}

exports.add_user = function( req, res )
{
//	var user = new User(
//	{
//		username: req.body.username,
//	} );
//	user.save();

con.connect(function(err) {
	if (err) throw err;
		var sql = "INSERT INTO user (username) VALUES ('test')";
		con.query(sql, function (err, result) {
		if (err) throw err;
			console.log(result.affectedRows + " record(s) updated");
		});
	} );
	res.send("User Added");
}
