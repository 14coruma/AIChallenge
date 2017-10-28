/* gameManager.js handles users who want to start a game or are currently
 * playing a game.
 *
 * Created by: Andrew Corum, 9 Oct 2017
 */

'use strict';

var userPass  = require( './userPass' );
var gamePass = userPass.gamePass;
var mysql      = require( 'mysql' );
var conn        = mysql.createConnection( {
	host     : 'localhost',
	user     : 'game',
	password : gamePass,
	database : 'AIChallenge',
} );

/*
 * addToQueue adds a user to the gameQueue table.
 *
 * @param: (string) gameName
 * @param: (string) username
 *
 * @return: (string) gameID
 */
exports.addToQueue = function( gameName, username )
{
	conn.connect();
	var sql = 'INSERT INTO gameQueue (gameName, username) values (?, ?)';
	var inserts = [ gameName, username ];
	sql = mysql.format( sql, inserts );
	var rows;
	conn.query( sql, function( error, results, fields ) {
		rows = results;
	} );
	conn.end();
	return rows;
}
