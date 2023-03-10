from flask import Flask
import tensorflow as tf
import numpy as np

app = Flask(__name__)

model = tf.keras.model.load_model('models/vgg16/fer2013_vgg16')

@app.route('/', methods=['GET'])
def predict_emotion():
    return 
