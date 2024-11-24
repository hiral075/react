import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
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
      <Text style={styles.title}>Welcome!!!</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MLandDLScreen;
