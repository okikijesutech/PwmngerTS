import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles as themeStyles, PwTheme } from '../theme';
import { registerAccount, createNewVault, syncVaultWithCloud, loginAccount } from '@pwmnger/app-logic';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
        Alert.alert('Error', 'Please fill all fields');
        return;
    }
    if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
    }

    setLoading(true);
    try {
      // 1. Register on Server
      await registerAccount(email, password);
      
      // 2. Login to get Token
      await loginAccount(email, password);

      // 3. Initialize Local Vault
      await createNewVault(password);

      // 4. Push to Cloud
      await syncVaultWithCloud();

      Alert.alert("Success", "Account created!", [
          { text: "OK", onPress: () => navigation.replace('VaultList') }
      ]);
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={themeStyles.container}>
      <Text style={themeStyles.title}>Create Account</Text>
      <Text style={themeStyles.subtitle}>secure zero-knowledge storage</Text>

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
      <TextInput
        style={themeStyles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#64748b"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color={PwTheme.colors.primary} />
      ) : (
        <TouchableOpacity style={themeStyles.button} onPress={handleRegister}>
          <Text style={themeStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={themeStyles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}
