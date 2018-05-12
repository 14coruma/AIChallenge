from keras.models import model_from_json
import numpy as np
import sys
import json

# Load model and weights
json_file = open('model.json', 'r')
model_json = json_file.read()
json_file.close()
model = model_from_json(model_json)
model.load_weights("model.h5")

print model.predict(np.array([[0,0,0,2,0,1,4,4,4,8,4,4,4,99]]))
