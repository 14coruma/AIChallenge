import numpy as np
import random
import tensorflow as tf
import matplotlib.pyplot as plt
import rpyc
import json
import itertools
from collections import deque

tf.reset_default_graph()

# Connect to the traning server
c = rpyc.connect("localhost", 18861)

# These lines establish the feed-forward part used to choose actions
# input: [numD1, numD2, numD3, numD4, numD5, numD6, numD1, numD2, numD3, numD4, numD5, numD6]
# output: [bank1s?, bank2s?, bank3s?, bank4s?, bank5s?, bank6s?, done?]
inputs1 = tf.placeholder( shape=[1, 14], dtype=tf.float32 )
W = tf.Variable( tf.random_uniform( [14, 6], 0, 0.01 ) )
Qout = tf.matmul( inputs1, W )
predict = tf.argmax( Qout, 1 )

# Below we obtain the loss by taking the sum of squares
# difference between the target and predicion Q values.
nextQ = tf.placeholder( shape=[1, 6], dtype = tf.float32 )
loss = tf.reduce_sum( tf.square( nextQ - Qout ) )
trainer = tf.train.GradientDescentOptimizer( learning_rate = 0.1 )
updateModel = trainer.minimize( loss )

# Traning the network
init = tf.initialize_all_variables()

# Set learning parameters
y = 0.99
e = 0.1
num_episodes = 100

# Create lists to contain total rewards and steps per episode
jList = []
rList = []

with tf.Session() as sess:
    sess.run( init )
    for i in range( num_episodes ):
        # Reset environment and get first new observation
        print "Episode " + str( i )
        state = json.loads( c.root.getMessage() )
        rAll = 0
        done = False
        j = 0
        
        # The Q-Network
        while j < 99 and done == False:
            j += 1
            # Choose an action by greedily (with e chance of random ation) from Q-network
            s = []
            board = state["board"]
            myPos = state["currentPlayer"]
            if myPos == 0:
                s = board
            else:
                s = np.concatenate( [board[7:], board[0:7]] )
            s = np.reshape(s, (1, 14) )
            action, allQ = sess.run( [predict, Qout], feed_dict={inputs1:s})
            if np.random.rand(1) < e:
                action[0] = random.randint( 0, 5 )
                while s[0][action[0]] <= 0:
                    action[0] = random.randint( 0, 5 )
            print s[0]
            print action[0] + myPos*7
            c.root.setMessage( str(action[0] + myPos*7) )
            
            # Get new state and reward by feeding the new state
            # through our network
            state = json.loads( c.root.getMessage() )
            # print state
            done = state["gameOver"] == 1
            reward = ( state["board"][myPos*6+7] - state["board"][(myPos*6+13)%14] ) / 48
            board = state["board"]
            myPos = state["currentPlayer"]
            if myPos == 0:
                s = board
            else:
                s = np.concatenate( [board[7:], board[0:7]] )
            s = np.reshape(s, (1, 14) )
            Q1 = sess.run( Qout, feed_dict={inputs1:s})
            maxQ1 = np.max( Q1 )
            targetQ = allQ
            targetQ[0, action[0]] = reward + y*maxQ1
            
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
