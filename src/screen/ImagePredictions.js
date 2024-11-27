import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';

const ImagePredictions = () => {
  const [imageName, setImageName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [serverMessage, setServerMessage] = useState('');
  const [predictedImageName, setPredictedImageName] = useState('');
  const [groundTruthName, setGroundTruthName] = useState('');

  const loadImage = () => {
    if (imageName.trim() === '') {
      alert('Please enter an image name!');
      return;
    }

    setImageUrl(`http://192.168.201.13:3000/assests/${imageName}`);
  };

  const testServerConnection = async () => {
    try {
      const response = await fetch('http://192.168.201.13:3000/test');
      const message = await response.text();
      setServerMessage(message);
    } catch (error) {
      setServerMessage('Failed to connect to the server!');
      console.error('Error connecting to the server:', error);
    }
  };

  const predictImageName = async () => {
    try {
      const response = await fetch('http://192.168.201.13:3000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentImageName: imageName }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction');
      }

      const data = await response.json();
      setPredictedImageName(data.predictedName);
    } catch (error) {
      console.error('Error predicting image name:', error);
      setPredictedImageName('Prediction failed!');
    }
  };

  const fetchGroundTruth = async () => {
    try {
      const response = await fetch('http://192.168.201.13:3000/groundTruth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentImageName: imageName }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ground truth');
      }

      const data = await response.json();
      setGroundTruthName(data.groundTruthName);
    } catch (error) {
      console.error('Error fetching ground truth:', error);
      setGroundTruthName('Ground truth unavailable!');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Image Viewer</Text>

      <Button title="Test Server" onPress={testServerConnection} />
      {serverMessage ? <Text style={styles.serverMessage}>{serverMessage}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Enter image name (e.g., image1.jpg)"
        value={imageName}
        onChangeText={setImageName}
      />

      <Button title="Load Image" onPress={loadImage} />

      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.placeholder}>No image loaded</Text>
      )}

      <Button title="Predict Image Name" onPress={predictImageName} />
      <Button title="Fetch Ground Truth" onPress={fetchGroundTruth} />

      {predictedImageName ? (
        <Text style={styles.prediction}>Predicted Name: {predictedImageName}</Text>
      ) : null}
      {groundTruthName ? (
        <Text style={styles.result}>Ground Truth Name: {groundTruthName}</Text>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  serverMessage: {
    fontSize: 16,
    color: 'blue',
    marginVertical: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  placeholder: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  prediction: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  result: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'orange',
  },
});

export default ImagePredictions;
