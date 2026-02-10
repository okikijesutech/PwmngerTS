import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

export const PwTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#3ecf8e', // Supabase Green
    background: '#020617', // Slate 950
    card: '#0f172a',       // Slate 900
    text: '#f8fafc',       // Slate 50
    border: '#1e293b',     // Slate 800
    notification: '#ff4d4f', // Red
  },
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PwTheme.colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: PwTheme.colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8', // Slate 400
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  button: {
    backgroundColor: PwTheme.colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#020617',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkText: {
    color: '#3ecf8e',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  }
});
