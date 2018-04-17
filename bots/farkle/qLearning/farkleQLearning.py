import numpy as np
import random
import tensorflow as tf
import matplotlib.pyplot as plt
import rpyc
import json
import itertools
from collections import deque

def convertAction( action ):
    move = {}
    move["bank"] = []
    move["done"] = 0
    moves = []
    indices = {0, 1, 2, 3, 4, 5, 6, 7}
    for i in range( 0, 6 ):
        moves = list( itertools.combinations( indices, i ) )
        for k in range( 0, len( moves ) ):

    return json.dumps( move );

# def convertAction( action = [] ):
#     move = {}
#     move["bank"] = []
#     move["done"] = action[6]
#     num = 0
#     for numB in action:
#         num += 1
#         for i in range( numB ):
#            move["bank"].append( num ) 
#     return json.dumps( move );

tf.reset_default_graph()

# Connect to the traning server
c = rpyc.connect("localhost", 18861)

# These lines establish the feed-forward part used to choose actions
# input: [numD1, numD2, numD3, numD4, numD5, numD6, numD1, numD2, numD3, numD4, numD5, numD6]
# output: [bank1s?, bank2s?, bank3s?, bank4s?, bank5s?, bank6s?, done?]
inputs1 = tf.placeholder( shape=[1, 12], dtype=tf.float32 )
W = tf.Variable( tf.random_uniform( [12, 128], 0, 0.01 ) )
Qout = tf.matmul( inputs1, W )
predict = tf.argmax( Qout, 1 )

# Below we obtain the loss by taking the sum of squares
# difference between the target and predicion Q values.
nextQ = tf.placeholder( shape=[1, 128], dtype = tf.float32 )
loss = tf.reduce_sum( tf.square( nextQ - Qout ) )
trainer = tf.train.GradientDescentOptimizer( learning_rate = 0.1 )
updateModel = trainer.minimize( loss )

# Traning the network
init = tf.initialize_all_variables()

# Set learning parameters
y = 0.99
e = 0.1
num_episodes = 1

# Create lists to contain total rewards and steps per episode
jList = []
rList = []

with tf.Session() as sess:
    sess.run( init )
    for i in range( num_episodes ):
        # Reset environment and get first new observation
        state = json.loads( c.root.getMessage() )
        # Sort dice into nums
        dice = deque( state["dice"] )
        numsD = [0, 0, 0, 0, 0, 0, 0]
        while len( dice ) != 0:
            numsD[dice.popleft()] += 1
        # Sort bank into nums
        bank = deque( state["bank"] )
        numsB = [0, 0, 0, 0, 0, 0, 0]
        while len( bank ) != 0:
            numsB[bank.popleft()] += 1
        rAll = 0
        done = False
        j = 0
        
        # The Q-Network
        while j < 99 and done == False:
            j += 1
            # Choose an action by greedily (with e chance of random ation) from Q-network
            s = np.concatenate([numsD[1:], numsB[1:]])
            s = np.reshape(s, (1, 12) )
            action, allQ = sess.run( [predict, Qout], feed_dict={inputs1:s})
            print allQ
            if np.random.rand(1) < e:
                print "random action\n"
                action = random.randint( 0, 128 )
            #     action = []
            #     for k in range( 6 ):
            #         action[k] = [random.randint( 0, numsD[k]+1 )]
            #     action[6] = random.randint( 0, 2 )
            print action
            move = convertAction( action )
            c.root.setMessage( move )
            
            # Get new state and reward by feeding the new state
            # through our network
            state = c.root.getMessage()
            # Sort dice into nums
            dice = deque( state["dice"] )
            numsD = [0, 0, 0, 0, 0, 0, 0]
            while len( bank ) != 0:
                nums[bank.popleft()] += 1
            # Sort bank into nums
            bank = deque( state["bank"] )
            numsB = [0, 0, 0, 0, 0, 0, 0]
            while len( bank ) != 0:
                nums[bank.popleft()] += 1
            done = state["gameOver"]
            reward = state["players"][state["currentPlayer"]]["score"] / 10000
            s = np.concatenate([numsD[1:], numsB[1:]])
            s = np.reshape(s, (1, 12 ))
            Q1 = sess.run( Qout, feed_dict={inputs1:s})
            maxQ1 = np.max( Q1 )
            targetQ = allQ
            targetQ[0, a[0]] = reward + y*maxQ1
            
            # train our network using target and predicted Q values
            _,W1 = sess.run( [updateModel, W], feed_dict={inputs1:s, nextQ:targetQ} )
            rAll += reward
            if done == True:
                # Reduce chance of random action as we train the model
                e = 1./((i/50) + 10)
                break
        jList.append( j )
        rList.append( rAll )
print "Percent of succesful episodes: " + str( sum( rList )/num_episodes ) + "%"
