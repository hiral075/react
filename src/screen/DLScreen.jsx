import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DLScreen = () => {
  const navigation = useNavigation();

  const navigateToImagePrediction = () => {
    navigation.navigate('ImagePredictions'); // Navigate to Image Prediction screen
  };

  const navigateToLandPrediction = () => {
    navigation.navigate('Land Prediction'); // Navigate to Land Prediction screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deep Learning Options</Text>
      <TouchableOpacity onPress={navigateToImagePrediction} style={styles.button}>
        <Text style={styles.buttonText}>Image Prediction</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToLandPrediction} style={styles.button}>
        <Text style={styles.buttonText}>Land Prediction</Text>
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
    marginBottom: 30,
    color: '#202020',
  },
  button: {
    backgroundColor: '#202020',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DLScreen;


// import React from 'react';
// import { StyleSheet, View, Text } from 'react-native';

// const DLScreen = () => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Welcome to the Deep Learning Screen</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//   },
//   text: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//   },
// });

// export default DLScreen;
