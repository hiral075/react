import numpy as np  # Add this line to import numpy
from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from flask_cors import CORS
from io import BytesIO
import os
import traceback

app = Flask(__name__)
CORS(app)

land_type_model = None

# Correct file path (absolute or relative path)
land_type_model_path = "C:/Users/sandeep/newlogin/my_flask_api/models/land_classification_model.keras"  # Update with correct path

@app.route('/predict_land_type', methods=['POST'])
def predict_land_type():
    try:
        file = request.files.get('image')
        if not file:
            return jsonify({"error": "No file uploaded"}), 400

        img = load_img(BytesIO(file.read()), target_size=(224, 224))
        img_array = img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)  # Now numpy is imported, this should work

        global land_type_model
        if land_type_model is None:
            if os.path.exists(land_type_model_path):
                land_type_model = tf.keras.models.load_model(land_type_model_path)
                print("Land Type Classification model loaded successfully.")
            else:
                return jsonify({"error": f"Model file not found at {land_type_model_path}"}), 400

        prediction = land_type_model.predict(img_array)
        land_types = ['agri', 'barren_land', 'grass_land', 'urban']
        predicted_class_index = np.argmax(prediction[0])
        predicted_land_type = land_types[predicted_class_index]

        return jsonify({"predicted_land_type": predicted_land_type})
    
    except Exception as e:
        print(f"Error occurred during land type prediction: {e}")
        traceback.print_exc()
        return jsonify({"error": "Land type prediction failed"}), 500

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0')
