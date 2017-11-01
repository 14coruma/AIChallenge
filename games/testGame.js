/**
 * testGame contains the functions for a simple test game
 * Used to run tests on gameModule and as a 'proof of concept' for the 
 * project's framework
 *
 * Created by: Andrew Corum, 11/2017
 */

/**
 * start creates then returns initial game state
 *
 * @param: (int) lgid
 * @param: (array) userNames
 *
 * @return: (JSON) state
 */
exports.start = function( lgid, usernames, callback ) {
	var state = { id: lgid, game: "testGame", players: [], currentPlayer: 0, error: "", };
	for ( var i = 0; i < usernames.length; i++ ) {
		state.players.push( { username: usernames[i], score: 0 } );
	}
	callback( state );
}
