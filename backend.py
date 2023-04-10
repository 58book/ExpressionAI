from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin
import base64
import tensorflow as tf
import numpy as np

app = Flask(__name__)
#CORS(app)

model = tf.keras.models.load_model('models/vgg16/fer2013_vgg16')
expressions = {0: 'Angry', 1: 'Disgust', 2: 'Fear', 3: 'Happy', 4: 'Sad', 5: 'Surprise', 6:'Neutral'}

#@cross_origin
@app.route('/evaluate', methods=['GET', 'POST'])
def predict_emotion():
    img_b64 = request.get_json()['input_image'].split(',')[1]
    img_decode = base64.b64decode(img_b64)
    img_b64 = img_b64.replace('/', '_').replace('+', '-')
    img = tf.io.decode_image(img_decode)
    #img = tf.image.rgb_to_grayscale(img)
    img = tf.image.resize_with_pad(img, 48, 48)
    img = tf.expand_dims(img, axis=0)
    probs = np.ravel(model.predict(img))
    pred = np.argmax(probs)
    resp = make_response({'image_shape': img.shape.as_list(), 'expression': expressions[pred]})
    resp.headers['Access-Control-Allow-Origin'] = '*'
    print(resp.headers)
    return resp
