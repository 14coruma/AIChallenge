using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;

namespace Mankalah
{
   /*****************************************************************
    * A Mankalah player.  This is the base class for players.
    * You'll derive a player from this base. Be sure your player
    * works correctly both as TOP and as BOTTOM.
    *****************************************************************/
    public abstract class Player
    {
        private String name;
        //private Position position;
        private int timePerMove;	// time allowed per move in msec

        /*
         * constructor. Parameters are position (TOP/BOTTOM) the player
         * is to play, the player's name, and maxTimePerMove--the time
         * your player is allowed to use per move, in milliseconds. 
         * (This is not enforced, but your player will be disqualified 
         * if it takes too long.) If you have any tasks to do before 
         * play begins, you can override this constructor.
         */
        public Player(Position pos, String n, int maxTimePerMove)
        {
            name = n;
            //position = pos;
	        timePerMove = maxTimePerMove;
            //timer = new Stopwatch();
            //timer.Reset();
            //Console.Write("Player " + name + " playing on ");
            //if (pos == Position.Top) Console.WriteLine("top.");
            //if (pos == Position.Bottom) Console.WriteLine("bottom.");
            //if (pos != Position.Top && position != Position.Bottom)
            //{
            //    Console.Write("...an illegal side of the board.");
            //    Environment.Exit(1);
            //}
        }

        /*
         * Evaluate: return a number saying how much we like this board. 
         * TOP is MAX, so positive scores should be better for TOP.
         * This default just counts the score so far. Override to improve!
         */
        public virtual int evaluate(Board b)
        {
            int score = 0;
            bool allZeros = true;
            int endCaptures = 0;
            int stonesAt = 0;
            score += (b.stonesAt(13) - b.stonesAt(6)) * 100;

            for (int i = 12; i >= 7; i--)
            {
                stonesAt = b.stonesAt(i);
                if (b.stonesAt(12 - i) > 0)
                    allZeros = false;
                //if (stonesAt == 0)
                //    score += 2 * b.stonesAt(12 - i);
                endCaptures += stonesAt;
            }
            if (allZeros)
                score += endCaptures * 100;

            allZeros = true;
            endCaptures = 0;

            for (int i = 5; i >= 0; i--)
            {
                stonesAt = b.stonesAt(i);
                if (b.stonesAt(12 - i) > 0)
                    allZeros = false;
                //if (stonesAt == 0)
                //    score -= 2 * b.stonesAt(12 - i);
                endCaptures += stonesAt;
            }
            if (allZeros)
                score -= endCaptures * 100;

            return score;
        }

        public String getName() { return name; }

        public int getTimePerMove() { return timePerMove; }

        /*
         * Provide a photo of yourself (or your avatar) for the
         * tournament. You can return either
         * 1. the url of a photo "http://www.example.com/photo.jpg"
         * 2. the filename of a photo "photo.jpg"
         */
        //public virtual String getImage() { return String.Empty; }

        /*
         * Override with your own choosemove function
         */
        public abstract int chooseMove(Board b);

        /*
         * Override with your own personalized gloat.
         */
        public virtual String gloat() { return "I win."; }
    }
}


