/**
 * randomMancala.js contains a bot for mancala that just makes a random move
 *
 * Created by: Andrew Corum, 4/19/2018
 */
"use strict"

// Load data from args
var data = JSON.parse( process.argv[2] );

// Create a move based on the game state
var move = getMove( data.state );

// Print the move to stdout
console.log( move );

/**
 * Creates a legal random move for the bot
 * @param {Object} state - The current mancala game state
 * @returns {number} index of move on mancala board
 */
function getMove( state ) {
	var move;
	var illegalMove = true;

	// Pick a random move until a legal move is chosen
	while ( illegalMove ) {
		// Pick random move from index 0 - 6
		move = Math.floor( Math.random() * 6 );

		// Adjust move if player is on top (player 1)
		move += 7 * state.currentPlayer;

		// Check if there are stones there (the move is legal)
		illegalMove = state.board[move] == 0;
	}

	return move;
}
