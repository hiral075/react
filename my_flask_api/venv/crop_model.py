import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
import pickle

class CropModel:
    def __init__(self, data_path):
        self.data = pd.read_csv(data_path)
        self.model = RandomForestClassifier(random_state=42)
        self.label_encoders = {}
        self.train()

    def train(self):
        self.preprocess_data()

        # Separate features and target variable
        X = self.data.drop(columns=['Crop'])
        y = self.data['Crop']

        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Train the model
        self.model.fit(X_train, y_train)

        # Save feature names for use in inference
        self.feature_names_in_ = X_train.columns

    def preprocess_data(self):
        # Encode categorical variables
        for col in ['State', 'Season']:
            # Strip whitespace from the column values
            self.data[col] = self.data[col].str.strip()
            le = LabelEncoder()
            self.data[col] = le.fit_transform(self.data[col])
            self.label_encoders[col] = le  # Save encoder for prediction

        # Fill any missing values
        self.data.fillna(0, inplace=True)

    def predict(self, year, state, season, area, rainfall, fertilizer):
        # Verify label encoders are loaded
        if not self.label_encoders:
            print("Label encoders not found. Please train the model.")
            return None

        # Print the classes known to the label encoder for debugging
        print("Known classes for State:", self.label_encoders['State'].classes_)
        print("Known classes for Season:", self.label_encoders['Season'].classes_)

        # Standardize the input
        state = state.strip().title()  # Capitalize the first letter of each word
        season = season.strip().title()  # Capitalize the first letter of each word

        try:
            # Encode state and season
            state_encoded = self.label_encoders['State'].transform([state])[0]
            season_encoded = self.label_encoders['Season'].transform([season])[0]
        except ValueError as e:
            print(f"Error encoding input data: {e}")
            return None

        # Prepare input
        input_data = pd.DataFrame([[year, state_encoded, season_encoded, area, rainfall, fertilizer]],
                                  columns=['Crop_Year', 'State', 'Season', 'Area', 'Annual_Rainfall', 'Fertilizer'])

        # Align input columns with the trained model's feature set
        input_data = pd.get_dummies(input_data).reindex(columns=self.feature_names_in_, fill_value=0)

        # Make prediction
        predicted_crop = self.model.predict(input_data)
        return predicted_crop[0]

    def save_model(self, model_path='crop_model.pkl'):
        with open(model_path, 'wb') as f:
            pickle.dump(self, f)

    @staticmethod
    def load_model(model_path='crop_model.pkl'):
        with open(model_path, 'rb') as f:
            return pickle.load(f)
