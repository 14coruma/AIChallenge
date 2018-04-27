# btd_mancala.py Builds the Training Data for mancala
# Creates data by executing random games and recording the outcome
#
# usage: python btd_mancala.py <num games>
#

import sys
import numpy as np
import random

class Mancala:
    board = np.array([4,4,4,4,4,4,0,4,4,4,4,4,4,0])
    gameOver = False
    winner = -1
    player = 0

    def __init__(self):
        self.board = np.array([4,4,4,4,4,4,0,4,4,4,4,4,4,0])
        self.gameOver = False
        self.winner = -1
        self.player = 0 # Bottom player first

    def checkGameOver(self):
        bottomDone = True
        topDone = True
        for i in range(0, 6):
            if self.board[i] != 0:
                bottomDone = False
                break;
        for i in range(7, 13):
            if self.board[i] != 0:
                topDone = False;
                break;
        if bottomDone or topDone:
            self.gameOver = True
            topScore = 0
            for i in range(7, 14):
                topScore += self.board[i]
            bottomScore = 0
            for i in range(0, 7):
                bottomScore += self.board[i]
            if topScore > bottomScore:
                self.winner = 1
            elif bottomScore > topScore:
                self.winner = 0
            else:
                self.winner = 2

    def updateState(self, move):
        # Pick up the stones
        stones = self.board[move]
        self.board[move] = 0
        # Distribute the stones
        pos = move + 1
        while stones > 0:
            # Don't add stone to opponent's score
            if self.player == 1 and pos == 6:
                pos += 1
            if self.player == 0 and pos == 13:
                pos += 1
            if pos == 14:
                pos = 0
            self.board[pos] += 1
            pos += 1
            stones -= 1
        pos -= 1
        # Check for capture by top
        if self.player == 1 and pos > 6 and pos < 13 and self.board[pos] == 1 and self.board[12-pos] > 0:
            capture = self.board[12-pos] + 1
            self.board[13] += self.board[12-pos]
            self.board[12-pos] = 0
            self.board[13] += 1
            self.board[pos] = 0
        # Check for capture by bottom
        if self.player == 0 and pos >= 0 and pos < 6 and self.board[pos] == 1 and self.board[12-pos] > 0:
            capture = self.board[12-pos] + 1
            self.board[6] += self.board[12-pos] + 1
            self.board[12-pos] = 0
            self.board[6] += 1
            self.board[pos] = 0
        # Update current player
        if self.player == 1 and pos != 13:
            self.player = 0
        elif pos != 6:
            self.player = 1
        # Check for game over
        self.checkGameOver()

    def randMove(self):
        legalMove = False
        while not legalMove:
            move = random.randint(0, 5) + self.player * 7
            if self.board[move] > 0:
                legalMove = True
                self.updateState(move)

# Build the training data
boards = np.zeros(shape=(0,14))
results = np.zeros(shape=0)

lastRow = 0
for i in range(0, int(sys.argv[1])):
    game = Mancala() 
    while not game.gameOver:
        game.randMove()
        boards = np.append(boards, np.array(game.board).reshape(1,14), 0)

    # Ignore tie games for now
    if game.winner == 2:
        continue;

    for j in range(lastRow, boards.shape[0]):
        results = np.append(results, np.array([game.winner]))
    lastRow = boards.shape[0]

# Save data
fh = open("boards.dat", "w")
np.save(fh, boards)
fh.close()
fh = open("results.dat", "w")
np.save(fh, results)
fh.close()
