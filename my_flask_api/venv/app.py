from flask import Flask, request, jsonify
from rainfall_model import RainfallModel
from yield_model import YieldModel
from crop_model import CropModel

# Create instances of the model classes
rainfall_model = RainfallModel(data_path='crop.csv')
yield_model = YieldModel(data_path='crop.csv')
crop_model = CropModel(data_path='crop.csv')

app = Flask(__name__)

# Utility function to check if a value is numeric
def is_number(value):
    try:
        float(value)
        return True
    except ValueError:
        return False

@app.route('/predict_rainfall', methods=['POST'])
def predict_rainfall():
    try:
        data = request.json.get('data')
        if not data or len(data[0]) < 2:
            return jsonify({'error': 'Invalid input data for rainfall prediction'}), 400

        year = int(data[0][0])
        state = data[0][1].strip()

        prediction = rainfall_model.predict(year, state)
        metrics = rainfall_model.evaluate()

        return jsonify({
            'prediction': prediction.tolist(),
            'accuracy': metrics.get('r2_score'),
            'mse': metrics.get('mean_squared_error'),
            'mae': metrics.get('mean_absolute_error')
        })
    except ValueError as e:
        return jsonify({'error': f"Value error: {str(e)}"}), 400
    except Exception as e:
        return jsonify({'error': f"Unexpected error: {str(e)}"}), 500

@app.route('/predict_yield', methods=['POST'])
def predict_yield():
    try:
        data = request.json.get('data')
        if not data or len(data[0]) < 6:
            return jsonify({'error': 'Invalid input data for yield prediction'}), 400

        year, state, season, area, rainfall, fertilizer = data[0]

        # Validate numeric inputs
        area = float(area) if is_number(area) else 0.0
        rainfall = float(rainfall) if is_number(rainfall) else 0.0
        fertilizer = float(fertilizer) if is_number(fertilizer) else 0.0

        prediction = yield_model.predict(int(year), state.strip(), season.strip(), area, rainfall, fertilizer)
        metrics = yield_model.evaluate()

        return jsonify({
            'prediction': prediction.tolist(),
            'accuracy': metrics.get('r2_score'),
            'mse': metrics.get('mean_squared_error'),
            'mae': metrics.get('mean_absolute_error')
        })
    except ValueError as e:
        return jsonify({'error': f"Value error: {str(e)}"}), 400
    except Exception as e:
        return jsonify({'error': f"Unexpected error: {str(e)}"}), 500

@app.route('/recommend_crop', methods=['POST'])
def recommend_crop():
    try:
        data = request.json.get('data')
        if not data or len(data[0]) < 6:
            return jsonify({'error': 'Invalid input data for crop recommendation'}), 400

        # Extract and validate input values
        year = int(data[0][0])
        state = data[0][1].strip()
        season = data[0][2].strip()
        area = float(data[0][3]) if is_number(data[0][3]) else 0.0
        rainfall = float(data[0][4]) if is_number(data[0][4]) else 0.0
        fertilizer = float(data[0][5]) if is_number(data[0][5]) else 0.0

        # Call the crop prediction model
        predicted_crop = crop_model.predict(year, state, season, area, rainfall, fertilizer)

        return jsonify({'recommended_crop': predicted_crop})
    except ValueError as e:
        return jsonify({'error': f"Value error in input data: {str(e)}"}), 400
    except Exception as e:
        return jsonify({'error': f"Unexpected error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
