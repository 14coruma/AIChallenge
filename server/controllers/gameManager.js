/**
 * gameManager.js handles users who want to start a game or are currently
 * playing a game.
 *
 * Created by: Andrew Corum, 9 Oct 2017
 */

'use strict';

var userPass  = require( './userPass' );
var gamePass = userPass.gamePass;
var db = require( './dbModule' );
var mysql      = require( 'mysql' );
var conn        = mysql.createConnection( {
	host     : 'localhost',
	user     : 'game',
	password : gamePass,
	database : 'AIChallenge',
} );

/**
 * addToQueue adds a user to the gameQueue table.
 *
 * @param: (string) gameName
 * @param: (string) username
 * @param: (fn) callback, a function to catch the results of the db query
 *
 * @return: (string) gameID
 */
exports.addToQueue = function( gameName, username, callback ) {
	var sql = "INSERT INTO gameQueue (gameID, userID) VALUES ((SELECT id FROM game WHERE gameName = ?), (SELECT id FROM user WHERE username = ?));";
	var inserts = [ gameName, username ];
	sql = mysql.format( sql, inserts );
	db.queryDB( conn, sql, function(res) {
		if ( res && res.insertId > 0) {
			callback( res.insertId );
		} else {
			callback( false );
		}
	} );
	return;
}

/**
 * deleteFromQueue removes a user from the gameQueue table
 *
 * @return: Success? (bool)
 */
exports.deleteFromQueue = function( gameName, username, callback ) {
	var sql = "DELETE FROM gameQueue WHERE gameID = (SELECT id FROM game WHERE gameName = ?) AND userID = (SELECT id FROM user WHERE username = ?);";
	var inserts = [ gameName, username ];
	sql = mysql.format( sql, inserts );
	db.queryDB( conn, sql, function(res) {
		if ( res ) {
			callback( res.affetedRows == 1 );
		} else {
			callback( false );
		}
	} );
	return;
}
