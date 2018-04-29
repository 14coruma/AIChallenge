from keras.models import Sequential
from keras.layers import Dense
from tensorflow.python.client import device_lib
import numpy as np

print(device_lib.list_local_devices())

# Define model and shape
model = Sequential()
model.add(Dense(units=32, activation='relu', input_dim=14))
model.add(Dense(units=1, activation='sigmoid'))

# Nice visualization of model shape
from keras.utils import plot_model
plot_model(model, to_file='model.png', show_shapes=True)

# Choose optimizer and loss functions
model.compile(
    loss='mean_squared_error',
    optimizer='rmsprop',
    metrics=['accuracy']
)

# Load data from file
boards = np.load("trainingData/boards.dat")
results = np.load("trainingData/results.dat")

# Train
model.fit(boards, results, verbose=1, epochs=6, batch_size=32)

# Evaluate model fit
score = model.evaluate(boards, results, batch_size=128)
print score

# Save model (JSON) and weights (HDF5)
from keras.models import model_from_json
model_json = model.to_json()
with open("model.json", "w") as json_file:
    json_file.write(model_json)
model.save_weights("model.h5");
print("Saved model to disk")

# Predict new data
# pred = model.predict(np.array([[0,0,0,0,2,1,0,0,0,0,1,0,0,44]]))
# print pred 

# Output weights
# layer0 = model.get_layer(index=3)
# print layer0.get_weights()
