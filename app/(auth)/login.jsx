import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Button from '../../components/Button';
import { BlueGradient } from '../../components/Gradients';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../slices/authSlice';

const Login = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);

  useEffect(() => {
    // Clear error when component unmounts or inputs change
    return () => {
      dispatch(clearError());
      setLocalError(null);
    };
  }, [dispatch, email, password]);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password');
      return;
    }
    setLocalError(null);
    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        router.push('/(main)/home'); // Navigate to home or dashboard after login
      })
      .catch((err) => {
        // error handled by redux state in useEffect
        console.error('Login error caught in catch:', err);
        setLocalError(err.message || 'Login failed');
      });
  };

  useEffect(() => {
    if (error || localError) {
      const errMsg = error || localError;
      if (typeof errMsg === 'string') {
        const lowerError = errMsg.toLowerCase();
        if (
          lowerError.includes('invalid credentials') ||
          lowerError.includes('invalid email') ||
          lowerError.includes('invalid password') ||
          lowerError.includes('incorrect email') ||
          lowerError.includes('incorrect password') ||
          lowerError.includes('user not found')
        ) {
          Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
        } else if (lowerError.includes('account locked')) {
          Alert.alert('Account Locked', 'Your account has been locked. Please contact support.');
        } else {
          Alert.alert('Error', errMsg);
        }
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    }
  }, [error, localError]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
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

      <Text style={[styles.orText, { color: theme.colors.primary }]}>OR</Text>

      <Text style={[styles.inputHeader, { color: theme.colors.textDark, fontSize: 16, fontWeight: 'bold' }]}>
        Input Your Correct Details Below
      </Text>

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

      <View style={{ width: '100%', alignItems: 'flex-end' }}>
        <TouchableOpacity onPress={() => router.push('/(auth)/forgetPassword')}>
          <Text style={[styles.forgetPasswordText]}>
            Forget Password?
          </Text>
        </TouchableOpacity>
      </View>

      <Button
        title={loading ? 'Logging In...' : 'LOGIN'}
        GradientComponent={BlueGradient}
        HasShadow={true}
        buttonStyle={{
          marginVertical: 10,
          color: theme.colors.textDark,
          width: 320,
          height: 50,
          borderColor: "black",
          borderWidth: 2,
        }}
        textStyle={{
          color: theme.colors.textDark,
          fontSize: 20,
          fontWeight: 'bold',
        }}
        onPress={handleLogin}
        disabled={loading}
      />

      <TouchableOpacity onPress={() => router.push('/(auth)/signUp')}>
        <Text style={[styles.loginText, { color: theme.colors.gray }]}>
          Don't have an account? <Text style={[styles.loginText, { color: theme.colors.primary, fontSize: 20, fontWeight: "bold" }]}> Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginVertical: 14,
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
  loginText: {
    marginTop: 20,
    fontWeight: '600',
  },
  forgetPasswordText: {
    color: 'red',
    paddingBottom: 20,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'right',
  },
});

