import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MLandDLScreen = () => {
  const navigation = useNavigation();

  const navigateToML = () => {
    navigation.navigate('Home'); // Navigate to HomeScreen
  };

  const navigateToDL = () => {
    navigation.navigate('ImagePredictions');
  };

  return (
    <View style={styles.container}>
      {/* Watermark Image in the Center */}
      <Image 
        source={require('./assests/ai1.jpg')} // Adjust the path if needed
        style={styles.watermark}
      />

      {/* Content */}
      <Text style={styles.title}>AI  FARMING!!!</Text>
      <TouchableOpacity onPress={navigateToML} style={styles.button}>
        <Text style={styles.buttonText}>Machine Learning(ML)</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToDL} style={styles.button}>
        <Text style={styles.buttonText}>Deep Learning(DL)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  watermark: {
    position: 'absolute', // Allows the image to float on the screen
    width: 600, // Adjust the size of the watermark
    height: 600,
    opacity: 0.9, // Light visibility
    // resizeMode: 'contain', // Maintain aspect ratio
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#202020',
    position: 'absolute', // Allow positioning relative to the parent
    top: 50, // Moves the title to 20 units from the top of the screen
    left: 0, // Optional: Adjust horizontal alignment if needed
    right: 0, // Optional: Ensures centering horizontally
    textAlign: 'center', // Keeps the text centered
  },
  
  button: {
    backgroundColor: '#202020',
    paddingVertical: 15,
  paddingHorizontal: 40,
  borderRadius: 25, // Set borderRadius to half of the height to make it oval
  marginVertical: 10,
  },  
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MLandDLScreen;
