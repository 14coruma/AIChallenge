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
 * gameReady checks to see if there are enough people in the queue to start a game
 *
 * @param: gameName
 *
 * @return: (bool, int, array) ready?, liveGameID, userNames
 */
exports.gameReady = function( gameName, callback ) {
	var sql = "SELECT count(*) FROM gameQueue WHERE gameID = (SELECT id FROM game WHERE gameName = ?);";
	var inserts = [ gameName ];
	sql = mysql.format( sql, inserts );
	db.queryDB( conn, sql, function( res ) {
		var sql = "SELECT minPlayers FROM game WHERE gameName = ?;";
		var inserts = [ gameName ];
		sql = mysql.format( sql, inserts );
		var count = res[0]["count(*)"];
		db.queryDB( conn, sql, function( res ) {
			if ( res[0] && count >= res[0]["minPlayers"] ) {
				var minPlayers = res[0]["minPlayers"];
				var sql = "SELECT user.username FROM gameQueue INNER JOIN user ON gameQueue.userID = user.id WHERE gameID = (SELECT id FROM game WHERE gameName = ?) LIMIT ?";
				var inserts = [ gameName, minPlayers ];
				sql = mysql.format( sql, inserts );
				db.queryDB( conn, sql, function( res ) {
					var userNames = res.map( function (obj) { return obj.username; } );
					var sql = "DELETE FROM gameQueue WHERE gameID = (SELECT id FROM game WHERE gameName = ?) LIMIT ?";
					var inserts = [ gameName, minPlayers ];
					sql = mysql.format( sql, inserts );
					db.queryDB( conn, sql, function( res ) { } );
					var sql = "INSERT INTO liveGame (gameID) values ((SELECT id FROM game WHERE gameName = ?))";
					var inserts = [ gameName ];
					sql = mysql.format( sql, inserts );
					db.queryDB( conn, sql, function( res ) {
						callback( true, res["insertId"], userNames );
					} );
				} );
			} else {
				callback( false, -1, [] );
			}
		} );
	} );
	return;
}

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
 * deleteLiveGame removes a live game from the database
 *
 * @return: Success? (bool)
 */
exports.deleteLiveGame = function( lgid, callback ) {
	var sql = "DELETE FROM liveGame WHERE id = ?";
	var inserts = [ lgid ];
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
