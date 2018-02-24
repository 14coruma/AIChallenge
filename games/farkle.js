/**
 * farkle.js contains the functions for a farkle game
 *
 * Created by: Andrew Corum, 2/2018
 */

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
		id: lgid, game: "farkle", players: [],
		bank: [], dice: [], temp: 0,
		currentPlayer: 0, gameOver: 0, winner: -1, error: "",
	};
	for ( var i = 0; i < usernames.length; i++ ) {
		state.players.push( { username: usernames[i], score: 0, fail: 0 } );
	}
	for ( var i = 0; i < 6; i++ ) {
		state.dice[i] = Math.floor( Math.random() * 6 + 1);
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
	if ( typeof move == "string" ) {
		move = JSON.parse( move );
	}
	var validMove = verifyMove( state, move );
	if ( validMove ) {
		callback( updateState( state, move ) );
	} else {
		callback( failPlayer( state ) );
	}
}

/**
 * updateState updates a game state based on a given move
 *
 * @param: (JSON) move
 * @param: (JSON) state
 *
 * @return: (JSON) new state
 */
function updateState( state, move ) {
	if ( calcScore( move.bank ) == -1 ) { // Farkle
		// switch player
		do {
			state.currentPlayer++;
			state.currentPlayer = state.currentPlayer % state.players.length;
		} while ( state.players[state.currentPlayer].fail != 0 );
		// reset bank & temp score
		state.bank = [];
		state.temp = 0;
		// reroll dice
		for ( var i = 0; i < 6; i++ ) {
			state.dice[i] = Math.floor( Math.random() * 6 + 1);
		}
	} else if ( move.done == 1 ) { // Done
		// update bank
		state.bank = state.bank.concat(move.bank);
		// Add up score
		state.players[state.currentPlayer].score += calcScore( state.bank ) + state.temp;
		// switch player
		do {
			state.currentPlayer++;
			state.currentPlayer = state.currentPlayer % state.players.length;
		} while ( state.players[state.currentPlayer].fail != 0 );
		// reset bank & temp
		state.bank = [];
		state.temp = 0;
		// reroll dice
		for ( var i = 0; i < 6; i++ ) {
			state.dice[i] = Math.floor( Math.random() * 6 + 1);
		}
	} else { // Continue play
		// update bank
		state.bank = state.bank.concat(move.bank);
		// Add temp score for if all 6 dice have been banked
		if ( state.bank.length == 6 ) {
			state.temp += calcScore( state.bank );
			state.bank = [];
		}
		// reroll remaining dice
		state.dice = [];
		for ( var i = 0; i < (6 - state.bank.length); i++ ) {
			state.dice[i] = Math.floor( Math.random() * 6 + 1);
		}
	}

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
	// Make sure move is an object with 'bank' and 'done'
	if ( typeof move != "object" ) return false;
	if ( typeof move.bank != "object" ) return false;
	if ( typeof move.done != "number" ) return false;

	// Check that bank is subset of dice
	var bank = move.bank.slice();
	var dice = state.dice.slice();
	while ( bank.length > 0 ) {
		if ( dice.indexOf( bank[0] ) == -1 ) return false;
		dice.splice( dice.indexOf( bank[0] ), 1 );
		bank.shift();
	}

	return true;
}

/**
 * Calculate the score of the dice, returning -1 if non-scoring dice exist
 *
 * @param: (array) bank
 *
 * @return: (int) score
 */
function calcScore( bank ) {
	// Sort bank into nums
	var bankCopy = bank.slice();
	var nums = [0, 0, 0, 0, 0, 0, 0];
	while ( bankCopy.length != 0 ) {
		nums[bankCopy.shift()]++;
	}

	// Start score tally
	var score = 0;

	// Six of any number
	if ( bank.length == 6 && nums.indexOf(6) != -1 ) return 3000;

	// two triplets
	if ( bank.length == 6 && nums.indexOf(3) != -1 ) {
		var triplet1 = nums.indexOf(3);
		let tempNums = nums.splice(triplet1, 1);
		if ( tempNums.indexOf(3) != -1 ) return 2500;
	}

	// Five of any number
	if ( bank.length >= 5 && nums.indexOf(5) != -1 ) {
		nums[nums.indexOf(5)] = 0;
		score += 2000;
	}

	// Four of any number with a pair
	if ( bank.length == 6 && nums.indexOf(4) != -1 ) {
		var index = nums.indexOf(4);
		let tempNums = nums.splice(index, 1);
		if (tempNums.indexOf(2) != -1 ) return 1500;
	}

	// Three pairs
	if ( bank.length == 6 && nums.indexOf(2) != -1 ) {
		var index = nums.indexOf(2);
		var tempNums = nums.splice(index, 1);
		index = tempNums.indexOf(2);
		if (index != -1) {
			tempNums = tempNums.splice(index, 1);
			if (tempNums.indexOf(2) != -1) return 1500;
		}
	}

	// 1-6 straight
	if ( bank.length == 6 ) {
		var straight = true;
		for ( var i = 1; i < 7; i++ ) {
			if (nums[i] != 1) {
				straight = false;
				break;
			}
		}
		if (straight) return 1500;
	}

	// Four of any number
	if ( bank.length >= 4 && nums.indexOf(4) != -1 ) {
		var index = nums.indexOf(4);
		nums[index] = 0;
		score += 1000;
	}

	// Three of a number
	if ( bank.length >= 3 && nums.indexOf(3) != -1 ) {
		var index = nums.indexOf(3);
		if ( index == 1 ) {
			nums[1] = 0;
			score += 300;
		} else {
			nums[index] = 0;
			score += index * 100;
		}
	}

	// Single 5s
	score += 50 * nums[5];

	// Single 1s
	score += 100 * nums[1];

	if ( score == 0 ) {
		return -1;
	} else {
		return score;
	}
}

/**
 * failPlayer will update the 'fail' state of a player
 * Use this if a player makes an illegal move or something of the like
 *
 * @param: (JSON) state
 *
 * @return: (JSON) state
 */
function failPlayer( state, callback ) {
	state.players[state.currentPlayer].fail = 1;

	// End game if <= 1 good players left
	var goodPlayers = 0;
	var goodIndex = -1;
	for ( var i = 0; i < state.players.length; i++ ) {
		if ( state.players[i].fail == 0 ) {
			goodIndex = i;
			goodPlayers++;
		}
	}
	if ( goodPlayers <= 1 ) {
		state.gameOver = 1;
		state.winner = goodIndex;
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
	var bestScore = 0;
	for ( var i = 0; i < state.players.length; i++ ) {
		var score = state.players[i].score;
		if ( score >= 10000 ) {
			state.gameOver = 1;
			if ( score >= bestScore ) {
				bestScore = score;
				state.winner = i;
			}
		}
	}

	return state;
}
