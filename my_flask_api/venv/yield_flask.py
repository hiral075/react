from flask import Flask, request, jsonify
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

class YieldModel:
    def __init__(self, data_path):
        self.data_path = data_path
        self.scaler = StandardScaler()
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.state_mapping = {}
        self.season_mapping = {}
        self.load_and_prepare_data()

    def load_and_prepare_data(self):
        # Load the data
        df = pd.read_csv(self.data_path)

        # Strip leading/trailing spaces in categorical columns
        df['State'] = df['State'].str.strip()
        df['Season'] = df['Season'].str.strip()

        # Map categorical variables to numeric values
        self.state_mapping = {state: idx for idx, state in enumerate(df['State'].unique())}
        self.season_mapping = {season: idx for idx, season in enumerate(df['Season'].unique())}

        df['State'] = df['State'].map(self.state_mapping)
        df['Season'] = df['Season'].map(self.season_mapping)

        # Features and target variable
        X = df[['Crop_Year', 'State', 'Season', 'Area', 'Annual_Rainfall', 'Fertilizer']]
        y = df['Yield']

        # Train/test split
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Feature scaling
        self.X_train_scaled = self.scaler.fit_transform(self.X_train)
        self.X_test_scaled = self.scaler.transform(self.X_test)

        # Train the model
        self.model.fit(self.X_train_scaled, self.y_train)

    def predict(self, year, state, season, area, rainfall, fertilizer):
        # Convert categorical data to numeric
        if state not in self.state_mapping:
            raise ValueError(f"State '{state}' is not in the dataset. Please check the state name.")
        if season not in self.season_mapping:
            raise ValueError(f"Season '{season}' is not in the dataset. Please check the season name.")

        state_num = self.state_mapping[state]
        season_num = self.season_mapping[season]

        input_data = pd.DataFrame([[year, state_num, season_num, area, rainfall, fertilizer]],
                                   columns=['Crop_Year', 'State', 'Season', 'Area', 'Annual_Rainfall', 'Fertilizer'])
        input_scaled = self.scaler.transform(input_data)

        return self.model.predict(input_scaled)

    def evaluate(self):
        y_pred = self.model.predict(self.X_test_scaled)
        r2 = r2_score(self.y_test, y_pred)
        mse = mean_squared_error(self.y_test, y_pred)
        mae = mean_absolute_error(self.y_test, y_pred)

        return {
            'r2_score': r2,
            'mean_squared_error': mse,
            'mean_absolute_error': mae
        }

# Create Flask app
app = Flask(__name__)

# Create an instance of the YieldModel class
yield_model = YieldModel(data_path='crop.csv')  # Ensure the path to your dataset is correct

# Yield Prediction Route
@app.route('/predict_yield', methods=['POST'])
def predict_yield():
    try:
        data = request.json['data'][0]
        
        # Ensure correct data types
        year = int(data[0])
        state = data[1]  # Categorical, ensure correct encoding
        season = data[2]  # Categorical, ensure correct encoding
        area = float(data[3])
        rainfall = float(data[4])
        fertilizer = float(data[5])

        # Prepare input data - adjust encoding for categorical features if necessary
        # Assume encode_state and encode_season are functions to handle encoding
        state_encoded = encode_state(state)  
        season_encoded = encode_season(season)

        # Create input array for the model
        input_data = np.array([[year, state_encoded, season_encoded, area, rainfall, fertilizer]])
        
        # Debug output
        print(f"Input data for prediction: {input_data}")

        # Make the prediction
        prediction = yield_model.predict(input_data)

        # Debug output for prediction
        print(f"Model prediction: {prediction}")

        # Calculate accuracy (or retrieve from model if applicable)
        accuracy = 0.95  # Replace with your actual accuracy calculation
        
        crop_recommendation = recommend_crop(data)

        return jsonify({
            'prediction': prediction.tolist(),
            'accuracy': accuracy,
            'crop_recommendation': crop_recommendation
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)