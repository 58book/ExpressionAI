import tensorflow as tf
import pandas as pd
import numpy as np

test_df = pd.read_csv('/Users/rounakchawla/ExpressionAI/data/fer2013/icml_face_data.csv')

test_df = test_df[test_df['Usage'] == 'PublicTest']

test_df = test_df.apply(lambda row: 
                    pd.Series([int(row['emotion']), np.reshape(np.array(row['pixels'].split()), (48, 48, 1)).astype(np.float32).tolist()], 
                        index=('emotion', 'pixels')), axis=1) 

test_images = tf.image.grayscale_to_rgb(tf.convert_to_tensor(test_df['pixels'].tolist(), dtype=tf.float32))
test_labels = tf.convert_to_tensor(test_df['emotion'].tolist(), dtype=tf.int32)

test_images = tf.keras.applications.vgg16.preprocess_input(test_images)

model = tf.keras.models.load_model('/Users/rounakchawla/ExpressionAI/models/vgg16/fer2013_vgg16')

preds = model.predict(test_images)

print(preds[1])

pred_vector = tf.argmax(preds, axis=1)

print(tf.math.confusion_matrix(test_labels, pred_vector, num_classes=7))

test_loss, test_acc = model.evaluate(test_images, tf.keras.utils.to_categorical(test_labels))

print(f'Test Loss: {test_loss}, Test Accuracy: {test_acc}')