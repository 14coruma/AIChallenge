/**
 * gameManager.js handles users who want to start a game or are currently
 * playing a game.
 *
 * Created by: Andrew Corum, 9 Oct 2017
 */

'use strict';

var server = require( '../server' );
var userPass = require( './userPass' );
var gamePass = userPass.gamePass;
var db = require( './dbModule' );
var mysql      = require( 'mysql' );
var conn        = mysql.createConnection( {
	host     : 'localhost',
	user     : 'game',
	password : gamePass,
	database : 'AIChallenge',
} );
var testGame = require( '../../games/testGame' );
var mancala = require( '../../games/mancala' );

/**
 * makeMove will validate, perform a given move, and then return the new state
 *
 * @param: (JSON) state
 * @param: (var) move
 *
 * @return: (JSON) game state
 */
exports.makeMove = function( state, move, callback ) {
	switch( state.game ) {
		case "testGame":
			testGame.move( state, move, function( res ) {
				callback( res );
			} );
			break;
		case "mancala":
			mancala.move( state, move, function( res ) {
				callback( res );
			} );
			break;
		default:
			state.error = "INVALID GAME";
			callback( state );
	}
}

/**
 * startGame starts a new game given by gameID and returns initial game state
 *
 * @param: (int) lgid
 * @param: (array) userNames
 *
 * @return: (JSON) game state
 */
exports.startGame = function( lgid, userNames, callback ) {
	var sql = "SELECT game.gameName FROM liveGame INNER JOIN game ON liveGame.gameID = game.id WHERE liveGame.id = ?";
	var inserts = [lgid];
	sql = mysql.format( sql, inserts );
	db.queryDB( conn, sql, function( res ) {
		switch ( res[0].gameName ) {
			case "testGame":
				testGame.start( lgid, userNames, function( state ) {
					callback( state );
				} );
				break;
			case "mancala":
				mancala.start( lgid, userNames, function( state ) {
					callback( state );
				} );
				break;
			default:
				callback( { lgid: lgid, error: "INVALID GAME" } );
		}
	} );
}

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
	var sql = "INSERT INTO gameQueue (gameID, userID) VALUES ((SELECT id FROM game WHERE gameName = ?), (SELECT id FROM user WHERE username = ?))";
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
 * handle requests regarding live games
 *
 * @return: List of live games
 */
exports.liveGames = function( req, res ) {
	switch( req.params.action ) {
		case "list":
			var sql = "SELECT id FROM liveGame";
			db.queryDB( conn, sql, function(dbRes) {
				res.send( dbRes );
			} );
			break;
		case "type":
			var sql = "SELECT game.gameName FROM liveGame INNER JOIN game ON liveGame.gameID = game.id WHERE liveGame.id = ?";
			var inserts = [ req.query.gameID ];
			sql = mysql.format( sql, inserts );
			db.queryDB( conn, sql, function(dbRes) {
				if ( dbRes[0] ) {
					res.send( dbRes[0].gameName );
				} else {
					res.send( false );
				}
			} );
			break;
		case "state":
			//server.getState( req.query.gameID, function( state ) {
			//	res.send( JSON.stringify( state ) );
			//} );

			var sql = "SELECT state FROM liveGame WHERE id = ?";
			var inserts = [ req.query.gameID ];
			sql = mysql.format( sql, inserts );
			db.queryDB( conn, sql, function(dbRes) {
				if ( dbRes[0] ) {
					res.send( dbRes[0].state );
				} else {
					res.send( false );
				}
			} );
			break;
		default:
			res.send( "BAD ACTION" );
	}
}

/**
 * listGames returns a list of all games in the database
 */
exports.listGames = function( req, res ) {
	var sql = "SELECT gameName FROM game";
	db.queryDB( conn, sql, function( dbRes ) {
		res.send( dbRes );
	} );
}

/**
 * endLiveGame resets a live game status to 0
 *
 * @param: lgid, the live game id
 * @param: state, the JSON state of ended game 
 *
 * @return: Success? (bool)
 */
exports.endLiveGame = function( lgid, state, callback ) {
	var sql = "UPDATE liveGame SET live = 0, state = ? WHERE id = ?";
	var inserts = [ JSON.stringify(state), lgid ];
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

/**
 * saveState saves the state of a live game
 */
exports.saveState = function( lgid, state ) {
	var sql = "UPDATE liveGame SET state = ? WHERE id = ?";
	var inserts = [ JSON.stringify(state), lgid ];
	sql = mysql.format( sql, inserts );
	db.queryDB( conn, sql, function(res) { return; } );
}
