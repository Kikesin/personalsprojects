import os
import pandas as pd
import numpy as np
import tensorflow as tf


from tensorflow.keras.preprocessing.image import ImageDataGenerator
from keras.models import Sequential
from tensorflow.keras import layers
from tensorflow.keras.models import Model
from tensorflow.keras.applications.inception_v3 import InceptionV3
from keras.layers import Dense, InputLayer, Dropout, Conv2D, MaxPooling2D, Flatten, GlobalAveragePooling2D
from keras.callbacks import EarlyStopping as ES
from IPython.display import clear_output as cls


import plotly.express as px
import matplotlib.pyplot as plt




def plot_class_distribution(class_dis, class_names, title="Distribution of classes"):
    import os
    import plotly.express as px
    fig = px.pie(names=class_names, values=class_dis, hole=0.3)
    fig.update_layout({"title":{"text": title, "x":0.50}})
    fig.show()
def plot_class_weights(class_weights, class_names):
    import matplotlib.pyplot as plt
    class_indices = list(class_weights.keys())
    weights = list(class_weights.values())

    plt.figure(figsize=(11, 5))
    plt.bar(class_indices, weights, color='skyblue')
    plt.xlabel('Índice de Clase')
    plt.ylabel('Peso de Clase')
    plt.title('Pesos de Clase')
    plt.xticks(class_indices, [class_names[i] for i in class_indices], rotation=90)
    plt.grid(axis='y', linestyle='--', alpha=0.5)
        # Etiqueta de datos
    for i, weight in enumerate(weights):
        plt.text(class_indices[i], weight, f'{weight:.2f}', ha='center', va='bottom')
    plt.show()
    
def plot_images(data, class_names):
    import numpy as np
    import matplotlib.pyplot as plt
    import tensorflow as tf
    from IPython.display import clear_output as cls
    r, c = 3, 4
    imgLen = r*c
    
    plt.figure(figsize=(20, 15))
    i = 1
    
    for images, labels in iter(data):
        
        
        id = np.random.randint(len(images))
#         img = images[id].numpy().astype('uint8')
        img = tf.expand_dims(images[id], axis=0)
        lab = class_names[np.argmax(labels[id])]
        
        plt.subplot(r, c, i)
        plt.imshow(img[0])
        plt.title(lab)
        plt.axis('off')
        cls()
        
        i+=1
        if i > imgLen:
            break
    plt.show()


def predictImages(data, class_names, model):
    
    r, c = 3, 4
    imgLen = r*c
    plt.figure(figsize=(20, 15))
    i = 1
    
    for images, labels in iter(data):
        
        id = np.random.randint(len(images))
        img = tf.expand_dims(images[id], axis=0)
        
        plt.subplot(r, c, i)
        plt.imshow(img[0])
        
        predicted = model.predict(img)
        predicted = class_names[np.argmax(predicted)]
        actual = class_names[np.argmax(labels[id])]
        
        plt.title(f"Actual: {actual}\nPredicted: {predicted}")
        plt.axis('off')
        cls()
        
        i+=1
        if i > imgLen:
            break
            
    plt.show()
