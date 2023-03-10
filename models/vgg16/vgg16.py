import tensorflow as tf
import pandas as pd
import numpy as np

BATCH_SIZE = 32

df = pd.read_csv('/Users/rounakchawla/ExpressionAI/data/fer2013/train.csv')

df = df.apply(lambda row: 
                    pd.Series([int(row['emotion']), np.reshape(np.array(row['pixels'].split()), (48, 48, 1)).astype(np.float32).tolist()], 
                        index=('emotion', 'pixels')), axis=1) 


train_df = df[1:27001]
val_df = df[27001:]

train_ds = tf.data.Dataset.from_tensor_slices((tf.convert_to_tensor(train_df['pixels'].tolist(), dtype=tf.float32), tf.keras.utils.to_categorical(tf.convert_to_tensor(train_df['emotion'].tolist(), dtype=tf.int32), num_classes=7))).shuffle(27000).batch(BATCH_SIZE)
val_ds = tf.data.Dataset.from_tensor_slices((tf.convert_to_tensor(val_df['pixels'].tolist(), dtype=tf.float32), tf.keras.utils.to_categorical(tf.convert_to_tensor(val_df['emotion'].tolist(), dtype=tf.int32), num_classes=7))).shuffle(1000).batch(BATCH_SIZE)

vgg_conv_base = tf.keras.applications.vgg16.VGG16(
    weights='imagenet',
    include_top=False)

vgg_conv_base.trainable = True
for layer in vgg_conv_base.layers[:-4]:
    layer.trainable = False

inputs = tf.keras.Input(shape=(48,48,1))
x = tf.keras.layers.Lambda(tf.image.grayscale_to_rgb)(inputs)
x = tf.keras.applications.vgg16.preprocess_input(x)
x = vgg_conv_base(x)
x = tf.keras.layers.Flatten()(x)
x = tf.keras.layers.Dense(512, activation='relu')(x)
x = tf.keras.layers.Dropout(0.3)(x)
outputs = tf.keras.layers.Dense(7, activation='softmax')(x)
model = tf.keras.Model(inputs, outputs)
model.summary()

model.compile(loss='categorical_crossentropy', optimizer=tf.keras.optimizers.RMSprop(learning_rate=1e-5), metrics=['accuracy'])

history = model.fit(train_ds, epochs=20, validation_data=val_ds)

model.save('models/vgg16/fer2013_vgg16')


