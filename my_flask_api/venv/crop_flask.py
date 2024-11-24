from flask import Flask, request, jsonify
from crop_model import CropModel

app = Flask(__name__)

# Load the trained crop model
crop_model = CropModel.load_model('crop_model.pkl')

@app.route('/recommend_crop', methods=['POST'])
def recommend_crop():
    data = request.get_json()

    try:
        # Extract and validate input data
        features = data['data'][0]
        year = int(features[0])
        season = features[1]
        state = features[2]
        area = float(features[3])
        rainfall = float(features[4])
        fertilizer = float(features[5])

        # Predict crop recommendation
        recommended_crop = crop_model.predict(year, state, season, area, rainfall, fertilizer)
        return jsonify({'recommended_crop': recommended_crop})

    except KeyError as e:
        return jsonify({'error': f'Missing field: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
