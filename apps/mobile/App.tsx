import './polyfills';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { unlockVault, isUnlocked } from '@pwmnger/app-logic';

export default function App() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(isUnlocked());

  const handleUnlock = async () => {
    if (!password) {
      Alert.alert('Error', 'Please enter your master password');
      return;
    }

    setLoading(true);
    try {
      await unlockVault(password);
      setUnlocked(true);
      Alert.alert('Success', 'Vault Unlocked!');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to unlock vault');
    } finally {
      setLoading(false);
    }
  };

  if (unlocked) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Vault Unlocked 🔒</Text>
        <Text>Welcome back to PwmngerTS Mobile</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PwmngerTS 🔐</Text>
      <Text style={styles.subtitle}>Native Mobile Vault</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Master Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Unlock Vault" onPress={handleUnlock} />
        )}
      </View>
      <StatusBar style="auto" />
    </View>
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
