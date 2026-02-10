import './polyfills';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { unlockVault, isUnlocked } from '@pwmnger/app-logic';
import { setStorageBackend } from '@pwmnger/storage';
import { mobileStorage } from './src/utils/mobileStorageAdapter';

// Configure shared storage to use SecureStore
setStorageBackend(mobileStorage);


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import VaultListScreen from './src/screens/VaultListScreen';
import { PwTheme } from './src/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={PwTheme}>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="VaultList" component={VaultListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
});
