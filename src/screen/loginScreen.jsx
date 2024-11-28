// LoginScreen.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '@react-native-firebase/auth'; // Use Firebase Authentication

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        // Check if the email is verified
        const user = firebase.auth().currentUser;
        if (user.emailVerified) {
          navigation.navigate('MLandDLScreen'); // Navigate to MLandDLScreen if email is verified
        } else {
          Alert.alert('Error', 'Please verify your email before logging in.');
        }
      })
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          Alert.alert('Error', 'No such user.');
        } else if (error.code === 'auth/wrong-password') {
          Alert.alert('Error', 'Incorrect password.');
        } else {
          Alert.alert('Error', error.message);
        }
      });
  };

  const handleRegister = () => {
    navigation.navigate('Signup'); // Navigate to MLandDLScreen for registration
  };

  return (
    <ImageBackground source={require('./assests/aif.png')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.helloText}>HELLO</Text>
        <Text style={styles.signInText}>Login to your account</Text>

        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={handleSignIn} style={styles.signInButtonContainer}>
          <Text style={styles.signIn}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
          <Text style={styles.registerText}>Don't have an account? Create</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  helloText: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  signInText: {
    textAlign: 'center',
    fontSize: 20,
    color: 'black',
    marginBottom: 30,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  signInButtonContainer: {
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  signIn: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
