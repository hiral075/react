from flask import Flask, request, jsonify
from rainfall_model import RainfallModel

# Create an instance of the RainfallModel class
rainfall_model = RainfallModel(data_path='crop.csv')  # Ensure the path is correct

app = Flask(__name__)  # Corrected app instance creation

# Rainfall Prediction Route
@app.route('/predict_rainfall', methods=['POST'])
def predict_rainfall():
    try:
        # Get the input data
        data = request.json.get('data', [[]])  # Using .get() with default value to avoid KeyError
        if not data or not isinstance(data[0], list) or len(data[0]) < 2:
            return jsonify({'error': 'Invalid input format. Please provide year and state.'}), 400

        year = int(data[0][0])
        state = data[0][1]

        # Predict rainfall for the input year and state
        prediction = rainfall_model.predict(year, state)

        # Evaluate model accuracy
        metrics = rainfall_model.evaluate()

        return jsonify({
            'prediction': prediction.tolist(),
            'accuracy': metrics['r2_score'],
            'mse': metrics['mean_squared_error'],
            'mae': metrics['mean_absolute_error']
        })

    except ValueError as e:
        # Handle error if the state is not found
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        # Catch-all for other errors
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':  # Corrected main check
    app.run(host='0.0.0.0', port=5000, debug=True)
