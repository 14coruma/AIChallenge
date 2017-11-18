/**
 * manacala.js contains the functions for a mancala game
 *
 * Created by: Andrew Corum, 11/2017
 */

// Global constants
const WINNINGSCORE = 200;

/**
 * start creates then returns initial game state
 *
 * @param: (int) lgid (ie live game id)
 * @param: (array) userNames
 *
 * @return: (JSON) state
 */
exports.start = function( lgid, usernames, callback ) {
	var state = {
		id: lgid, game: "mancala", players: [],
		board: [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0 ],
		currentPlayer: 0, gameOver: 0, winner: -1, error: "",
	};
	for ( var i = 0; i < usernames.length; i++ ) {
		state.players.push( { username: usernames[i], pos: i } );
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
	// pick up the stones
	var stones = state.board[move];
	state.board[move] = 0;
	var capture = 0;
	let playerPos = state.players[state.currentPlayer].pos;

	// distribute the stones
	var pos;
	for ( pos = move + 1; stones > 0; pos++ ) {
		// don't add stone to opponent's score
		if ( playerPos == 1 && pos == 6 ) pos++;
		if ( playerPos == 0 && pos == 13 ) pos++;
		state.board[pos]++;
		stones--;
	}
	pos--;

	// Capture by top
	if ( playerPos == 1 && pos > 6 && pos < 13 && state.board[pos] == 1
		&& state.board[12 - pos] > 0 ) {
		capture = board[12 - pos] + 1;
		board[13] += board[12 - pos];
		board[12 - pos] = 0;
		board[13]++;
		board[pos] = 0;
	}

	// Capture by bottom
	if ( playerPos == 0 && pos >= 0 && pos < 6 && state.board[pos] == 1
		&& board[12 - pos] > 0 ) {
		capture = board[12 - pos] + 1;
		board[6] += board[12 - pos];
		board[12 - pos] = 0;
		board[6]++;
		board[pos] = 0;
	}

	// Update currentPlayer
	state = nextPlayer( state );

	// Check for game over
	state = gameOver( state );
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
	if ( isNaN( move ) )
		return false;
	if ( state.players[state.currentPlayer].pos == 1 && move >= 7 && move <= 12
		&& state.board[move] != 0 )
		return true;
	if ( state.players[state.currentPlayer].pos == 0 && move >= 0 && move <= 5
		&& state.board[move] != 0 )
		return true;
	return false;
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
	state.winner = ( state.currentPlayer + 1 ) % 2;
	state.error = "Illegal move";
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
	var playerPos = state.players[state.currentPlayer].pos;

	if ( playerPos == 1 ) {
		if ( pos != 13 )
			state.currentPlayer = 0;
	} else {
		if ( pos != 6 )
			state.currentPlayer = 1;
	}

	return state;
}

/**
 * gameOver returns state updated with whether or not the game is over
 *
 * @param: (JSON) state
 *
 * @return: (JSON) state
 */
function gameOver( state ) {
	var bottomDone = true;
	var topDone = true;
	for ( var i = 0; i < 6; i++ ) {
		if ( state.board[i] != 0 ) {
			bottomDone = false;
			break;
		}
	}
	for ( var i = 7; i < 13; i++ ) {
		if ( state.board[i] != 0 ) {
			topDone = false;
			break;
		}
	}

	if ( bottomDone || topDone ) {
		state.gameOver = 1;
		state.winner = winner( state );
	}
	return state;
}

/**
 * winner calculates who is the winner for a game over state
 *
 * @param: (JSON) state
 *
 * @return: (int) winner position (0 or 1)
 */
function winner( state ) {
	var p1Count = 0;
	for ( var i = 7; i <= 13; i++ ) p1Count += state.board[i];
	var p0Count = 0;
	for ( var i = 0; i <= 6; i++ ) p0Count += state.board[i];
	if ( p1Count > p0Count ) return 1;
	if ( p0Count > p1Count ) return 0;
	return 2;
}
