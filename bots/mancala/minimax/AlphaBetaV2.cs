
// This is my final Mankalah Player!!
// Dec 9, 2016

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;

namespace Mankalah
{
    class AlphaBetaV2 : Player
    {
        public AlphaBetaV2(Position pos, int timeLimit) : base(pos, "AlphaBeta Version 2.0", timeLimit) {
            timer = new Stopwatch();
            timer.Reset();
        }

        public Stopwatch timer;     // The timer the player uses

        // A gloating string
        public override string gloat()
        {
            return "I WIN! :)";
        }

        /* This is the minimax function with alpha beta pruning
         *
         * Inputs:  board, the current state; depth, the desired search depth;
         *          a, the alpha value; b, the beta value; finalDepth, the total search depth
         * Output:  Tuple<int,int> Result:  Item1 = The heuristic of the move.  Item2 = the move number
         */
        private Tuple<int, int> alphaBeta(Board board, int depth, int a, int b, int finalDepth)
        {
            int v = 0;
            int v2 = 0;
            int move = -1;

            if (board.gameOver() || depth == 0)
                return new Tuple<int, int>(0, evaluate(board, finalDepth));

            if (board.whoseMove() == Position.Top)  // Max player's turn
            {
                v = -99999;
                for (int i = 12; i >= 7; i--)   // Try each of the possible moves
                {
                    if (board.legalMove(i) && (move == -1 || timer.ElapsedMilliseconds < getTimePerMove() - 1))
                    {
                        Board board1 = new Board(board);
                        board1.makeMove(i, false);
                        v2 = alphaBeta(board1, depth - 1, a, b, finalDepth).Item2;  // Find value of that move
                        if (v2 > v)     // pick the best move
                        {
                            v = v2;
                            move = i;
                        }
                        a = Math.Max(a, v);
                        if (b <= a) break;
                    }
                }
                return new Tuple<int, int>(move, v);     // Return the result
            }
            else {      // Minimizing player's turn
                v = 99999;
                for (int i = 5; i >= 0; i--)    // Try each of the possible moves
                {
                    if (board.legalMove(i) && (move == -1 || timer.ElapsedMilliseconds < getTimePerMove() - 1))
                    {
                        Board board1 = new Board(board);
                        board1.makeMove(i, false);
                        v2 = alphaBeta(board1, depth - 1, a, b, finalDepth).Item2;  // Find value of that move
                        if (v2 < v)     // Pick the best move
                        {
                            v = v2;
                            move = i;
                        }
                        b = Math.Min(b, v);
                        if (b <= a) break;
                    }
                }
                return new Tuple<int, int>(move, v);    // Return the result
            }
        }


        /* This is the move choosing function
         *
         * Inputs:  board, the current state
         * Output:  move, the chosen move for the given board
         */
        public override int chooseMove(Board b)
        {
            timer.Reset();
            timer.Start();  // Start up the move timer
            Tuple<int, int> Result = new Tuple<int, int>(-2, -2);
            int nextBestMove = -3;
            int i = 1;      // Initialize the depth counter

            // Iterate through search depths until time runs out
            while (timer.ElapsedMilliseconds < getTimePerMove() - 1)
            {
                nextBestMove = Result.Item1;
                Result = alphaBeta(b, i, -9999, 9999, i);
                i++;
                if (i >= 100) break;
            }

            timer.Stop();
            return nextBestMove;
        }


        /* This is the evaluation function
         *
         * Inputs:  board, the current state; depth, the desired search depth;
         * Output:  score, the heuristic at that board state
         */
        public virtual int evaluate(Board b, int depth)
        {
            int score = 0;
            bool allZeros = true;
            int endCaptures = 0;
            int stonesAt = 0;
            score += (b.stonesAt(13) - b.stonesAt(6)) * 100;    // Total Scored so far

            // Look at the Maximizers field
            for (int i = 12; i >= 7; i--)
            {
                stonesAt = b.stonesAt(i);
                if (b.stonesAt(12 - i) > 0)     // Check if the opponents side has all zeros
                    allZeros = false;
                if (stonesAt == 13 - i) // Score for a Go-again
                    if (depth < 30) score += 500;
                endCaptures += stonesAt;
            }
            if (allZeros)               // If the opponent has only zeros, score up the captures
                score += endCaptures * 100;

            allZeros = true;
            endCaptures = 0;

            // Look at the Minimizer's field
            for (int i = 5; i >= 0; i--)
            {
                stonesAt = b.stonesAt(i);
                if (b.stonesAt(12 - i) > 0)     // Check if the opponents side has all zeros
                    allZeros = false;
                if (stonesAt == 6 - i)  // Score for a Go-again
                    if (depth < 30) score -= 500;
                endCaptures += stonesAt;        // If the opponent has only zeros, score up the captures
            }
            if (allZeros)
                score -= endCaptures * 100;

            return score;
        }

        // Return the Player's Avatar
        public String getImage() { return "Fern.png"; }

    }
}

