#!/usr/bin/python2.7
import numpy as np
import sys, os
import json
import time

TIME_LIMIT = 1000

stderr = sys.stderr
stdout = sys.stdout
sys.stderr = open(os.devnull, 'w')
sys.stdout = open(os.devnull, 'w')
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
from keras.models import model_from_json

# Load model and weights
json_file = open('/home/andrew/workspace/SeniorProject/AIChallenge/bots/mancala/keras/2-model/model.json', 'r')
model_json = json_file.read()
json_file.close()
model = model_from_json(model_json)
model.load_weights("/home/andrew/workspace/SeniorProject/AIChallenge/bots/mancala/keras/2-model/model.h5")

current_time = lambda: int(round(time.time()*1000))

def evaluate(b):
    np_board = np.zeros((1,14))
    for i in range(0, 14):
        np_board[0][i] = b.board[i]
    return model.predict(np_board)[0][0]

class Board:
    def __init__(self):
        self.player = 0
        self.board = [4,4,4,4,4,4,0,4,4,4,4,4,4,0]
    def __getitem__(self, key):
        return self.board[key]
    def __setitem__(self, key, value):
        self.board[key] = value
    def legalMove(self, move):
        if self.player == 1 and move >= 7 and move <= 12 and self.board[move] != 0:
            return True
        if self.player == 0 and move >= 0 and move <= 5 and self.board[move] != 0:
            return True
        return False
    def gameOver(self):
        bottomDone = True
        topDone = True
        for i in range(0, 6):
            if self.board[i] != 0:
                bottomDone = False
        for i in range(7, 13):
            if self.board[i] != 0:
                topDone = False
        return bottomDone or topDone
    def makeMove(self, move):
        if not self.legalMove(move):
            return -1
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
            self.board[13] += capture
            self.board[12-pos] = 0
            self.board[pos] = 0
        # Check for capture by bottom
        if self.player == 0 and pos >= 0 and pos < 6 and self.board[pos] == 1 and self.board[12-pos] > 0:
            capture = self.board[12-pos] + 1
            self.board[6] += capture
            self.board[12-pos] = 0
            self.board[pos] = 0
        # Update current player
        if self.player == 1 and pos != 13:
            self.player = 0
        elif pos != 6:
            self.player = 1

def alphaBeta(board, depth, a, b, finalDepth):
    v = -1
    v2 = -1
    move = -1

    if board.gameOver() or depth == 0:
        return (0, evaluate(board))
    if board.player == 1: # Max player's turn
        v = -99999
        for i in range(12, 6, -1):
            if board.legalMove(i): # TODO: Add consideration for time limit
                board1 = Board()
                board1.board = board.board[:]
                board1.makeMove(i)
                v2 = alphaBeta(board1, depth-1, a, b, finalDepth)[1] # Find move's value
                if v2 > v: # Pick best move
                    v = v2
                    move = i
                a = max(a, v)
                if b <= a:
                    break
        return (move, v)
    else: # Min player's turn
        v = 99999
        for i in range(5, -1, -1):
            if board.legalMove(i): # TODO: Add consideration fro time limit
                board1 = Board()
                board1.board = board.board[:]
                board1.makeMove(i)
                v2 = alphaBeta(board1, depth-1, a, b, finalDepth)[1] # Find move's value
                if v2 < v: # Pick best move
                    v = v2
                    move = i
                b = min(b, v)
                if b <= a:
                    break
        return (move, v)

def chooseMove(board):
    start = current_time()
    result = (-1, -1)
    nextBestMove = -1
    depth = 1

    # Iterate through search depths until time runs out
    while current_time() - start < TIME_LIMIT:
        nextBestMove = result[0]
        result = alphaBeta(board, depth, -9999, 9999, depth)
        depth += 1
        if depth > 100:
            break
    sys.stderr = stderr
    sys.stdout = stdout
    return nextBestMove

# Read state from argv
data = json.loads(sys.argv[1])

# Create game board (player 0 == bottom)
board = Board()
board.player = data["state"]["currentPlayer"]
for i in range(0, len(data["state"]["board"])):
    board.board[i] = data["state"]["board"][i]

# Output move choice
print chooseMove(board)
