import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const HomeScreen = () => {
  const [year, setYear] = useState('');
  const [state, setState] = useState('Assam'); // Default to a state
  const [rainfall, setRainfall] = useState('');
  const [season, setSeason] = useState('Whole Year'); // Default to a season
  const [area, setArea] = useState('');
  const [fertilizer, setFertilizer] = useState('');
  const [rainfallPrediction, setRainfallPrediction] = useState(null);
  const [yieldPrediction, setYieldPrediction] = useState(null);
  const [cropRecommendation, setCropRecommendation] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [error, setError] = useState(null);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  const states = [
    'Assam', 'Karnataka', 'Kerala', 'Meghalaya', 'West Bengal',
    'Puducherry', 'Goa', 'Andhra Pradesh', 'Tamil Nadu', 'Odisha',
    'Bihar', 'Gujarat', 'Madhya Pradesh', 'Maharashtra', 'Mizoram',
    'Punjab', 'Uttar Pradesh', 'Haryana', 'Himachal Pradesh', 'Tripura',
    'Nagaland', 'Chhattisgarh', 'Uttarakhand', 'Jharkhand', 'Delhi',
    'Manipur', 'Jammu and Kashmir', 'Telangana', 'Arunachal Pradesh', 'Sikkim'];

  const seasons = [
    'Whole Year', 'Kharif', 'Rabi', 'Autumn', 'Summer', 'Winter'];

  const handleRainfallPrediction = async () => {
    setError(null);
    setRainfallPrediction(null);
    setAccuracy(null);

    try {
      const response = await axios.post('http://192.168.36.13:5000/predict_rainfall', {
        data: [[year, state]]
      });

      if (response.data.prediction) {
        setRainfallPrediction(response.data.prediction);
        setAccuracy(response.data.accuracy);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error making prediction. Please try again.');
    }
  };

  const handleYieldPrediction = async () => {
    setError(null);
    setYieldPrediction(null);
    setAccuracy(null);

    try {
      const response = await axios.post('http://192.168.36.13:5000/predict_yield', {
        data: [[year, state, season, area, rainfall, fertilizer]]
      });

      if (response.data.prediction) {
        setYieldPrediction(response.data.prediction);
        setAccuracy(response.data.accuracy);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error making prediction. Please try again.');
    }
  };

  const handleCropRecommendation = async () => {
    setError(null);
    setCropRecommendation(null);

    try {
      const response = await axios.post('http://192.168.36.13:5000/recommend_crop', {
        data: [[year, state, season, area, rainfall, fertilizer]]
      });

      if (response.data.recommended_crop) {
        setCropRecommendation(response.data.recommended_crop);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error making recommendation. Please try again.');
    }
  };

  if (selectedPrediction === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Choose Prediction</Text>
        <TouchableOpacity style={styles.button} onPress={() => setSelectedPrediction('rainfall')}>
          <Text style={styles.buttonText}>Rainfall Prediction</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setSelectedPrediction('yield')}>
          <Text style={styles.buttonText}>Yield Prediction</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setSelectedPrediction('crop')}>
          <Text style={styles.buttonText}>Crop Recommendation</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {selectedPrediction === 'rainfall' ? 'Rainfall Prediction' : selectedPrediction === 'yield' ? 'Yield Prediction' : 'Crop Recommendation'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Year"
        onChangeText={setYear}
        value={year}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Select State:</Text>
      <Picker
        selectedValue={state}
        onValueChange={(itemValue) => setState(itemValue)}
        style={styles.picker}
      >
        {states.map((stateOption, index) => (
          <Picker.Item key={index} label={stateOption} value={stateOption} />
        ))}
      </Picker>

      {selectedPrediction !== 'rainfall' && (
        <>
          <Text style={styles.label}>Select Season:</Text>
          <Picker
            selectedValue={season}
            onValueChange={(itemValue) => setSeason(itemValue)}
            style={styles.picker}
          >
            {seasons.map((seasonOption, index) => (
              <Picker.Item key={index} label={seasonOption} value={seasonOption} />
            ))}
          </Picker>

          <TextInput
            style={styles.input}
            placeholder="Enter Area"
            onChangeText={setArea}
            value={area}
            keyboardType="numeric"
          />
        </>
      )}

      {selectedPrediction === 'yield' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Annual Rainfall"
            onChangeText={setRainfall}
            value={rainfall}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Fertilizer Used"
            onChangeText={setFertilizer}
            value={fertilizer}
            keyboardType="numeric"
          />
        </>
      )}
      {selectedPrediction === 'crop' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Annual Rainfall"
            onChangeText={setRainfall}
            value={rainfall}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Fertilizer Used"
            onChangeText={setFertilizer}
            value={fertilizer}
            keyboardType="numeric"
          />
        </>
      )}

      {selectedPrediction === 'rainfall' && (
        <TouchableOpacity style={styles.button} onPress={handleRainfallPrediction}>
          <Text style={styles.buttonText}>Predict Rainfall</Text>
        </TouchableOpacity>
      )}

      {selectedPrediction === 'yield' && (
        <TouchableOpacity style={styles.button} onPress={handleYieldPrediction}>
          <Text style={styles.buttonText}>Predict Yield</Text>
        </TouchableOpacity>
      )}

      {selectedPrediction === 'crop' && (
        <TouchableOpacity style={styles.button} onPress={handleCropRecommendation}>
          <Text style={styles.buttonText}>Get Crop Recommendation</Text>
        </TouchableOpacity>
      )}

      {error && <Text style={styles.error}>Error: {error}</Text>}

      {selectedPrediction === 'rainfall' && rainfallPrediction !== null && (
        <Text style={styles.result}>Predicted Rainfall: {rainfallPrediction[0]}</Text>
      )}

      {selectedPrediction === 'yield' && yieldPrediction !== null && (
        <Text style={styles.result}>Predicted Yield: {yieldPrediction[0]}</Text>
      )}

      {selectedPrediction === 'crop' && cropRecommendation && (
        <Text style={styles.result}>Recommended Crop: {cropRecommendation}</Text>
      )}

      {accuracy !== null && (
        <Text style={styles.result}>Model Accuracy (R²): {accuracy}</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={() => setSelectedPrediction(null)}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    color: 'green',
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000000', // Black color for the button
    padding: 15,
    borderRadius: 25, // Oval shape
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF', // White text for better contrast on black background
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
