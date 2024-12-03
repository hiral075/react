import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const ImagePredictionScreen = () => {
  const [folder, setFolder] = useState('');
  const [subfolder, setSubfolder] = useState('');
  const [imageName, setImageName] = useState('');
  const [imagePath, setImagePath] = useState(null);
  const [predictedImageName, setPredictedImageName] = useState('');
  const [groundTruthImageName, setGroundTruthImageName] = useState('');

  const handleLoadImage = () => {
    // Construct the dynamic path as a URI
    const imageUri = `http://192.168.165.13:3000/assests/${folder}/${subfolder}/${imageName}`;

    // Test if the image path is valid by setting it (assume server serves images correctly)
    setImagePath({ uri: imageUri });
  };

  const handlePredictImage = async () => {
    try {
      const response = await axios.post('http://192.168.165.13:3000/predict', {
        currentImageName: imageName,
      });
      setPredictedImageName(response.data.predictedName);
    } catch (error) {
      console.error('Prediction error:', error);
    }
  };

  const handleGroundTruth = async () => {
    try {
      const response = await axios.post('http://192.168.165.13:3000/groundTruth', {
        currentImageName: imageName,
      });
      setGroundTruthImageName(response.data.groundTruthName);
    } catch (error) {
      console.error('Ground truth error:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Enter Folder Name:</Text>
      <TextInput
        style={styles.input}
        value={folder}
        onChangeText={setFolder}
        placeholder="e.g., folder1"
      />
      <Text style={styles.label}>Enter Subfolder Name:</Text>
      <TextInput
        style={styles.input}
        value={subfolder}
        onChangeText={setSubfolder}
        placeholder="e.g., subfolder1"
      />
      <Text style={styles.label}>Enter Image Name (with extension):</Text>
      <TextInput
        style={styles.input}
        value={imageName}
        onChangeText={setImageName}
        placeholder="e.g., image1.png"
      />
      <Button title="Load Image" onPress={handleLoadImage} />
      <Button title="Predict Image Name" onPress={handlePredictImage} />
      <Button title="Get Ground Truth" onPress={handleGroundTruth} />
      {imagePath && <Image source={imagePath} style={styles.image} />}
      {predictedImageName && (
        <Text style={styles.resultText}>Predicted Image Name: {predictedImageName}</Text>
      )}
      {groundTruthImageName && (
        <Text style={styles.resultText}>Ground Truth Image Name: {groundTruthImageName}</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  label: { fontSize: 16, marginVertical: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
  image: { width: 200, height: 200, marginTop: 20 },
  resultText: { fontSize: 18, marginTop: 10, color: 'green' },
});

export default ImagePredictionScreen;
