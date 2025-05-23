import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView, TextInput, TouchableOpacity, Image, View, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Button from '../../components/Button';
import { BlueGradient } from '../../components/Gradients';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../slices/authSlice';

const SignUp = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);

  useEffect(() => {
    // Clear error when component unmounts or inputs change
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, name, email, password]);

  const testApiCall = async () => {
    try {
      const response = await fetch('http://192.168.0.198:3005/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'Test1234!',
        }),
      });
      const data = await response.json();
      Alert.alert('API Test Success', JSON.stringify(data));
    } catch (err) {
      Alert.alert('API Test Failed', err.message);
    }
  };

  const handleSignUp = () => {
    if (!name || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    dispatch(register({ name, email, password }))
      .unwrap()
      .then(() => {
        router.push('/(auth)/login');
      })
      .catch((err) => {
        // error handled by redux state in useEffect
        console.error('Signup error caught in catch:', err);
      });
  };

  useEffect(() => {
    if (error) {
      if (typeof error === 'string') {
        if (error.toLowerCase().includes('email already exist')) {
          alert('Email already exists. Please use a different email.');
        } else {
          alert(error);
        }
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    }
  }, [error]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{
        padding: 20,
        alignItems: 'center',
        paddingBottom: 60, // extra space at the bottom
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={require('../../assets/images/logo2.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Button
        icon={<Image source={require('../../assets/images/apple.png')} style={styles.icon} />}
        title="Sign Up with Apple ID"
        buttonStyle={[styles.socialButton, { backgroundColor: '#fff', borderColor: theme.colors.primary }]}
        textStyle={{ color: theme.colors.textDark, fontWeight: 'bold', fontSize: 16 }}
        onPress={() => {
          // Handle Apple ID sign up
        }}
      />

      <Button
        title="Sign Up with Gmail"
        buttonStyle={[styles.socialButton, { backgroundColor: '#fff', borderColor: theme.colors.primaryDark }]}
        textStyle={{ color: theme.colors.textDark, fontWeight: 'bold', fontSize: 16 }}
        onPress={() => {
          // Handle Gmail sign up
        }}
        icon={<Image source={require('../../assets/images/gmail.png')} style={styles.icon} />}
      />

      <Text style={[styles.orText, { color: theme.colors.textDark }]}>OR</Text>

      <Text style={[styles.inputHeader, { color: theme.colors.textDark, fontSize: 16, fontWeight: 'bold' }]}>
        Input Your Correct Details Below
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.textDark }]}>Enter Full Name</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.colors.primary, color: theme.colors.textDark }]}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.textDark }]}>Enter Email Address</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.colors.primary, color: theme.colors.textDark }]}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.textDark }]}>Choose Password</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.colors.primary, color: theme.colors.textDark }]}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.textDark }]}>Confirm Password</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.colors.primary, color: theme.colors.textDark }]}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {error && (
        <Text style={{ color: 'red', marginBottom: 10, fontWeight: 'bold' }}>
          {error}
        </Text>
      )}

      <Button
        title={loading ? 'Signing Up...' : 'SIGN UP'}
        GradientComponent={BlueGradient}
        HasShadow={true}
        buttonStyle={{
          marginVertical: 10,
          color: theme.colors.textDark,
          width: 320,
          height: 50,
          borderColor: 'black',
          borderWidth: 2,
          opacity: loading ? 0.7 : 1,
        }}
        textStyle={{
          color: theme.colors.textDark,
          fontSize: 20,
          fontWeight: 'bold',
        }}
        onPress={handleSignUp}
        disabled={loading}
      />

      <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
        <Text style={[styles.loginText, { color: theme.colors.textDark }]}>
          Already have an account? <Text style={[styles.loginText, { color: theme.colors.primary, fontSize: 20, fontWeight: 'bold' }]}> Login</Text>
        </Text>
      </TouchableOpacity>

      <Button
        title="Test API Call"
        buttonStyle={{
          marginVertical: 10,
          width: 320,
          height: 50,
          backgroundColor: '#4CAF50',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        textStyle={{
          color: '#fff',
          fontSize: 18,
          fontWeight: 'bold',
        }}
        onPress={testApiCall}
      />
    </ScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  socialButton: {
    width: '100%',
    borderWidth: 2,
    borderRadius: 8,
    marginVertical: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  gradientBorder: {
    borderRadius: 8,
    padding: 2,
  },
  icon: {
    width: 25,
    height: 25,
  },
  orText: {
    marginVertical: 12,
    fontWeight: 'bold',
  },
  inputHeader: {
    fontSize: 16,
    marginBottom: 8,
  },
  inputGroup: {
    width: '100%',
    marginVertical: 6,
  },
  label: {
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  signUpButton: {
    width: '100%',
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 8,
  },
  loginText: {
    marginTop: 20,
    fontWeight: '600',
  },
});
