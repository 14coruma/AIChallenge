using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json.Linq;

namespace Mankalah
{
	public class Mankala {
		private static int timeLimit = 1000;   // turn time in msec
		private static Player bot = new AlphaBetaV2(Position.Top, timeLimit);   // TOP player (MAX)

		public static void Main(String[] args)
		{
			dynamic json = JObject.Parse(args[0]);
			Board board;
			if (json.currentPlayer == 0)
				board = new Board(Position.Top);
			else
				board = new Board(Position.Bottom);
			for (int i = 0; i < 14; i++) {
				board.board[i] = json.board[i];
			}
			int move = bot.chooseMove(board);
			Console.WriteLine(move);
		}
	}
}

