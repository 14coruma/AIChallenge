from keras.models import Sequential
from keras.layers import Dense
from keras.models import model_from_json
import numpy as np

# Load json and create model
json_file = open('model.json', 'r')
model_json = json_file.read()
json_file.close()
model = model_from_json(model_json)

# Load weights from model
model.load_weights("model.h5")
print("Loaded model from disk")

# Predict with model
board = np.array([[4,0,0,0,0,1,0,4,4,0,4,4,4,23]])
pred = model.predict(board)
print board
print pred
