# btd_mancala.py Builds the Training Data for mancala
# Creates data by executing random games and recording the outcome
#
# usage: python btd_mancala.py <num games>
#

import sys
import numpy as np
import random
import math

class Mancala:
    board = np.array([4,4,4,4,4,4,0,4,4,4,4,4,4,0])
    gameOver = False
    winner = -1
    player = 0
    length = 0

    def __init__(self):
        self.board = np.array([4,4,4,4,4,4,0,4,4,4,4,4,4,0])
        self.gameOver = False
        self.winner = -1
        self.player = random.randint(0, 1)
        self.length = 0

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
                self.winner = 0.5

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
        # Check for game over
        self.checkGameOver()

    def randMove(self):
        legalMove = False
        while not legalMove:
            move = random.randint(0, 5) + self.player * 7
            if self.board[move] > 0:
                legalMove = True
                self.updateState(move)
                self.length += 1

class Node:
    def __init__(self, value=None, next=None):
        self.value = value
        self.next = next

class LinkedList:
    def __init__(self):
        self.head = None
        self.size = 0
    def __delete__(self, instance):
        while self.head.next:
            next_node = self.head.next
            del self.head
            self.head = next_node
    def push(self, value):
        new_node = Node(value)
        new_node.next = self.head
        self.head = new_node
        self.size += 1
    def pop(self):
        new_head = self.head.next
        del self.head
        self.head = new_head
        self.size -= 1
    def toNumpy(self):
        array = None
        if type(self.head.value) is int or type(self.head.value) is float:
            array = [None] * self.size 
        else:
            array = [ [None] * len(self.head.value) ] * self.size
        current_node = self.head
        for i in range(0, self.size):
            array[i] = current_node.value
            current_node = current_node.next
        return np.array(array)

if __name__ == '__main__':
    # Build the training data
    # boards = np.zeros(shape=(0,14))
    # results = np.zeros(shape=0)
    boards = LinkedList()
    results = LinkedList()
    np_boards = np.array([])
    np_results = np.array([])

    lastRow = 0
    for i in range(0, int(sys.argv[1])):
        game = Mancala() 
        while not game.gameOver:
            game.randMove()
            boards.push(np.array(game.board))

        # Update results
        for j in range(0, game.length):
            results.push(game.winner)

        # periodically move memory from linked list to numpy
        if i % 10000 == 0:
            if np_boards.size > 0:
                np_boards = np.vstack((np_boards, boards.toNumpy()))
                np_results = np.append(np_results, results.toNumpy())
            else:
                np_boards = boards.toNumpy()
                np_results = results.toNumpy()
            del boards
            del results
            boards = LinkedList()
            results = LinkedList()

        # Update progress bar
        sys.stdout.write("Game {}/{}".format(i+1, sys.argv[1]))
        sys.stdout.flush()
        sys.stdout.write("\b" * 80)
    sys.stdout.write("\n")
    
    np_boards = np.vstack((np_boards, boards.toNumpy()))
    np_results = np.append(np_results, results.toNumpy())
    print("{} states evaluated.".format(np_boards.size/14))

    # Save data
    fh = open("boards.dat", "w")
    np.save(fh, np_boards)
    fh.close()
    fh = open("results.dat", "w")
    np.save(fh, np_results)
    fh.close()
