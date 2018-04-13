/* siteManager.js contains the functions handle the siteVars and status
 *
 * Created by: Andrew Corum, 13 Apr 2018
 */

'use strict';

var fs = require( "fs" );
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
 * Checks if site is in maintenance mode
 *
 * @param: callback
 *
 * @return: callback( true/false )
 */
exports.maintenanceMode = function( callback )
{
	var sql = 'SELECT data FROM siteVar WHERE var = ?';
	var inserts = [ "maintenance" ];
	sql = mysql.format( sql, inserts );
	db.queryDB( conn, sql, function( dbRes ) { 
		callback( dbRes[0]["data"] );
	} );
}
