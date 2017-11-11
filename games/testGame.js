/**
 * testGame contains the functions for a simple test game
 * Used to run tests on gameModule and as a 'proof of concept' for the 
 * project's framework
 *
 * Created by: Andrew Corum, 11/2017
 */

// Global constants
const WINNINGSCORE = 100;

/**
 * start creates then returns initial game state
 *
 * @param: (int) lgid
 * @param: (array) userNames
 *
 * @return: (JSON) state
 */
exports.start = function( lgid, usernames, callback ) {
	var state = { id: lgid, game: "testGame", players: [], currentPlayer: 0, gameOver: 0, error: "", };
	for ( var i = 0; i < usernames.length; i++ ) {
		state.players.push( { username: usernames[i], score: 0 } );
	}
	callback( state );
}

/**
 * move checks if a move is validated, updates the state,
 * and then returns the new state
 *
 * @param: (JSON) state
 * @param: (int) move
 *
 * @return: (JSON) state
 */
exports.move = function( state, move, callback ) {
	var validMove = verifyMove( state, move );
	if ( validMove ) {
		callback( updateState( state, parseInt(move) ) );
	} else {
		callback( failPlayer( state ) );
	}
}

/**
 * updateState updates a game state based on a given move
 *
 * @param: (int) move
 * @param: (JSON) state
 *
 * @return: (JSON) new state
 */
function updateState( state, move ) {
	state.players[state.currentPlayer].score += move;
	if ( state.players[state.currentPlayer].score >= WINNINGSCORE ) {
		state.gameOver = 1;
	}
	state = nextPlayer( state );
	return state;
}

/**
 * verifyMove checks if a move is valid
 * and then returns the new state
 *
 * @param: (JSON) state
 * @param: (int) move
 *
 * @return: (bool) valid?
 */
function verifyMove( state, move ) {
	if ( isNaN( move ) ) {
		return false;
	} else {
		return true;
	}
}

/**
 * failPlayer will update the 'good' state of a player
 * Use this if a player makes an illegal move or something of the like
 *
 * @param: (JSON) state
 *
 * @return: (JSON) state
 */
function failPlayer( state, callback ) {
	state.players[state.currentPlayer].good = false;
	state = nextPlayer( state );
	return state;
}

/**
 * nextPlayer returns a state with the 'currentPlayer' updated to be the next player
 *
 * @param: (JSON) state
 *
 * @return: (JSON) state
 */
function nextPlayer( state ) {
	state.currentPlayer = ( state.currentPlayer + 1 ) % state.players.length;
	return state;
}
