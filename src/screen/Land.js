// Land.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';

const Land = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [prediction, setPrediction] = useState('');

    // Function to pick an image
    const pickImage = () => {
        ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                setSelectedImage(response.assets[0]);
            }
        });
    };

    // Function to predict the land type
    const predictLand = async () => {
        if (!selectedImage) {
            alert('Please select an image first!');
            return;
        }
    
        const formData = new FormData();
        formData.append('image', {
            uri: selectedImage.uri,
            name: 'uploaded_image.jpg',
            type: 'image/jpeg',
        });
    
        try {
            const response = await axios.post('http://192.168.165.13:5000/predict_land_type', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            const { predicted_land_type, confidence } = response.data;
    
            if (confidence !== undefined) {
                setPrediction(`Land Type: ${predicted_land_type} (Confidence: ${confidence.toFixed(2)})`);
            } else {
                setPrediction(`Land Type: ${predicted_land_type}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
        }
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Land Type Prediction</Text>
            {selectedImage && (
                <Image source={{ uri: selectedImage.uri }} style={styles.image} />
            )}
            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Pick an Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={predictLand}>
                <Text style={styles.buttonText}>Predict</Text>
            </TouchableOpacity>
            {prediction !== '' && <Text style={styles.result}>{prediction}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#4caf50',
        padding: 15,
        marginVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    result: {
        fontSize: 18,
        color: '#333',
        marginTop: 20,
    },
});

export default Land;
