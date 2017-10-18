/* gameManager.js handles users who want to start a game or are currently
 * playing a game.
 *
 * Created by: Andrew Corum, 9 Oct 2017
 */

'use strict';

var usersPass  = require( './usersPass' );
var signupPass = usersPass.signupPass;
var mysql      = require( 'mysql-model' );
var con        = mysql.createConnection( {
	host     : 'localhost',
	user     : 'game',
	password : gamePass,
	database : 'AIChallenge',
} );

var GameQueue = con.extend( { tableName: "gameQueue" } );

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
	var gq = GameQueue( {
		gameName: gameName,
		username: username,
	} );
	return gq.save();
}
