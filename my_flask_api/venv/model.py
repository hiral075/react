import pandas as pd
from sklearn.ensemble import RandomForestClassifier  # For classification (crop recommendation)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report

class CropRecommendationModel:
    def __init__(self, data_path):
        self.data_path = data_path
        self.scaler = StandardScaler()
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.state_mapping = {}
        self.load_and_prepare_data()

    def load_and_prepare_data(self):
        df = pd.read_csv(self.data_path)

        # Ensure all states are mapped correctly
        self.state_mapping = {state: idx for idx, state in enumerate(df['State'].unique())}
        print("State Mapping:", self.state_mapping)

        df['State'] = df['State'].map(self.state_mapping)

        # Assuming the 'Crop' column is the crop type to recommend
        # Features might include year, state, rainfall, season, area, etc.
        X = df[['Crop_Year', 'State', 'Annual_Rainfall', 'Season', 'Area']]  # Adjust based on actual features
        y = df['Crop']  # Target variable (crop type)

        # Train/test split
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Feature scaling
        self.X_train_scaled = self.scaler.fit_transform(self.X_train)
        self.X_test_scaled = self.scaler.transform(self.X_test)

        # Train the model
        self.model.fit(self.X_train_scaled, self.y_train)

    def predict(self, year, state, rainfall, season, area):
        if state not in self.state_mapping:
            raise ValueError(f"State '{state}' is not in the dataset. Please check the state name.")

        state_num = self.state_mapping[state]
        input_data = pd.DataFrame([[year, state_num, rainfall, season, area]], 
                                  columns=['Crop_Year', 'State', 'Annual_Rainfall', 'Season', 'Area'])
        input_scaled = self.scaler.transform(input_data)
        return self.model.predict(input_scaled)[0]  # Return the recommended crop

    def evaluate(self):
        y_pred = self.model.predict(self.X_test_scaled)
        accuracy = accuracy_score(self.y_test, y_pred)
        report = classification_report(self.y_test, y_pred)

        return {
            'accuracy': accuracy,
            'classification_report': report
        }

# Example usage
data_path = 'crop.csv'  # Replace with your actual dataset path
crop_model = CropRecommendationModel(data_path)

# Predict crop based on user input
year = 1997
state = 'Assam'
season = 'Whole Year'
area = 73814

recommended_crop = crop_model.predict(year, state, season, area)
print(f"Recommended Crop: {recommended_crop}")

# Evaluate the model
evaluation = crop_model.evaluate()
print("Model Evaluation:")
print(evaluation)
