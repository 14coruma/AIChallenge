var expect = require( "chai" ).expect;
var assert = require( "chai" ).assert;
var gm = require( "../controllers/gameManager.js" );

describe( "Mancala Testing", function() {
	it( "makeMove( simpleState, 2 ) mancala (valid move)", function( done ) {
		gm.makeMove( { id: 2, game: "mancala", currentPlayer: 0, gameOver: 0, error: "", players: [
			{ username: 'test123', pos: 0, good: true }, { username: 'test456', pos: 1, good: true }],
			board: [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0], },
			0,
			function( state ) {
				expect( state.id ).to.equal( 2 );
				expect( state.game ).to.equal( "mancala" );
				expect( state.players ).to.have.lengthOf( 2 );
				expect( state.board ).to.have.lengthOf( 14 );
				expect( state.board[0] ).to.equal( 0 );
				expect( state.board[1] ).to.equal( 5 );
				expect( state.board[2] ).to.equal( 5 );
				expect( state.board[3] ).to.equal( 5 );
				expect( state.board[4] ).to.equal( 5 );
				expect( state.board[5] ).to.equal( 4 );
				expect( state.currentPlayer ).to.equal( 1 );
				expect( state.gameOver ).to.equal( 0 );
				done();
		} );
	} );
} );

