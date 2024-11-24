import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder

# Sample data for states (replace this with your actual data)
data = {
    'state': [
        'Assam', 'Karnataka', 'Kerala', 'Meghalaya', 'West Bengal',
        'Puducherry', 'Goa', 'Andhra Pradesh', 'Tamil Nadu', 'Odisha',
        'Bihar', 'Gujarat', 'Madhya Pradesh', 'Maharashtra', 'Mizoram',
        'Punjab', 'Uttar Pradesh', 'Haryana', 'Himachal Pradesh', 'Tripura',
        'Nagaland', 'Chhattisgarh', 'Uttarakhand', 'Jharkhand', 'Delhi',
        'Manipur', 'Jammu and Kashmir', 'Telangana', 'Arunachal Pradesh', 'Sikkim'
    ]
}

df = pd.DataFrame(data)

# Create and train the label encoder
state_encoder = LabelEncoder()
df['state_encoded'] = state_encoder.fit_transform(df['state'])

# Save the trained state encoder
joblib.dump(state_encoder, 'state_encoder.pkl')

print("State encoder saved as 'state_encoder.pkl'")

# Optional: Display the mapping of states to encoded values
state_mapping = dict(zip(state_encoder.classes_, state_encoder.transform(state_encoder.classes_)))
print("State mapping:", state_mapping)
