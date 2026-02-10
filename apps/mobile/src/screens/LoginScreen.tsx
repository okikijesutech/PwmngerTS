import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles as themeStyles, PwTheme } from '../theme';
import { loginAccount, syncVaultWithCloud, unlockVault } from '@pwmnger/app-logic';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      // 1. Attempt Online Login
      try {
        await loginAccount(email, password);
        // 2. Sync (Download Vault)
        await syncVaultWithCloud();
      } catch (err: any) {
        console.warn("Online login failed, trying offline unlock:", err);
        // If login fails (e.g. offline), we proceed to try local unlock
        // But if it was a wrong password, local unlock will also fail likely
      }

      // 3. Unlock Local Vault
      await unlockVault(password); // This verifies the password against the stored vault key
      navigation.replace('VaultList');
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={themeStyles.container}>
      <Text style={themeStyles.title}>Welcome Back</Text>
      <Text style={themeStyles.subtitle}>Sign in to your vault</Text>

      <TextInput
        style={themeStyles.input}
        placeholder="Email"
        placeholderTextColor="#64748b"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={themeStyles.input}
        placeholder="Master Password"
        placeholderTextColor="#64748b"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color={PwTheme.colors.primary} />
      ) : (
        <TouchableOpacity style={themeStyles.button} onPress={handleLogin}>
          <Text style={themeStyles.buttonText}>Unlock Vault</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={themeStyles.linkText}>Create a new account</Text>
      </TouchableOpacity>
    </View>
  );
}
