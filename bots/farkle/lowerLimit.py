import sys
import json
import itertools
import time
from collections import deque

def diceLeft( nums ):
    for i in range( 0, len( nums ) ):
        if nums[i] > 0:
            return True
    return False;

# Calculates the score of a given move
def calcScore( bank ):
    # Sort bank into nums
    bankCopy = deque( bank )
    nums = [0, 0, 0, 0, 0, 0, 0]
    while len( bankCopy ) != 0:
        nums[bankCopy.popleft()] += 1

    # Start score tally
    score = 0

    # Six of any number
    if len( bank ) == 6:
        try:
            nums.index(6)
            return 3000
        except:
            pass

    # two triplets
    if len( bank ) == 6:
        try:
            triplet1 = nums.index(3)
            tempNums = nums[:]
            tempNums[triplet1:triplet1+1] = []
            try: 
                tempNums.index(3)
                return 2500
            except:
                pass
        except:
            pass

    # Five of any number
    if len( bank ) >= 5:
        try:
            nums[nums.index(5)] = 0
            score += 2000
        except:
            pass

    # Four of any number with a pair
    if len( bank ) == 6:
        try:
            index = nums.index(4)
            tempNums = nums[:]
            tempNums[index:index+1] = []
            try:
                tempNums.index(2)
                return 1500
            except:
                pass
        except:
            pass

    # Three pairs
    if len( bank ) == 6:
        try:
            index = nums.index(2)
            tempNums = nums[:]
            tempNums[index:index+1] = []
            try:
                index = tempNums.index(2)
                tempNums[index:index+1] = []
                try:
                    tempNums.index(2)
                    return 1500
                except:
                    pass
            except:
                pass
        except:
            pass

    # 1-6 straight
    if len( bank ) == 6:
        straight = True
        for i in range( 1, 7 ):
            if nums[i] != 1:
                straight = False
                break
        if straight:
            return 1500

    # Four of any number
    if len( bank ) >= 4:
        try:
            index = nums.index(4)
            nums[index] = 0
            score += 1000
        except:
            pass

    # Three of a number
    if len( bank ) >= 3:
        try:
            index = nums.index(3)
            if index == 1:
                nums[1] = 0
                score += 300
            else:
                nums[index] = 0
                score += index * 100
        except:
            pass

    # Single 5s
    score += 50 * nums[5]
    nums[5] = 0

    # Single 1s
    score += 100 * nums[1]
    nums[1] = 0

    if score == 0 or diceLeft( nums ):
        return -1
    else:
        return score

# Returns a move string based on state data json
def move( data ):
    myBankScore = calcScore( data["bank"] );
    if myBankScore < 0:
        myBankScore = 0
    myScore = myBankScore + data["temp"]
    bestMove = []
    bestScore = -1
    for i in range( 1, len( data["dice"] ) + 1 ):
        moves = list( itertools.combinations( data["dice"], i ) )
        for k in range( 0, len( moves ) ):
            score = calcScore( moves[k] ) + myScore
            if score > bestScore:
                bestMove = moves[k]
                bestScore = score
    done = "0"
    if bestScore == -1:
        return json.dumps( '{"bank":[], "done":1}')
    elif bestScore >= 200:
        done = "1"
    bestMove = [str(x) for x in bestMove]
    moveStr = '{"bank":[%s], "done":%s}' % ( ','.join( ''.join( bestMove ) ), done )
    moveObj = json.loads( moveStr )
    return json.dumps( moveObj );

# Main code
data = json.loads( sys.argv[1] )

time.sleep( 1.5 )

print move( data["state"] )
