import React, { useState } from 'react';
import { StyleSheet, Text, ScrollView, TextInput, TouchableOpacity, Image, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Button from '../../components/Button';
import { BlueGradient } from '../../components/Gradients';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const ForgetPassword = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/(auth)/login')}
      >
        <Ionicons name="chevron-back" size={24} color="white" />
      </TouchableOpacity>

      <Text style={[styles.inputHeader, { color: theme.colors.textDark, fontSize: 16, fontWeight: 'bold' }]}>
       Input your verified email address 
      </Text>
      <Text style={[styles.inputHeadersub, { color: theme.colors.textDark, fontSize: 16, fontWeight: 'bold' }]}>
       john*****@gmail.com
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.textDark }]}>Email Address</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.colors.primary, color: theme.colors.textDark }]}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <Button
        title="Next"
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
        onPress={() => router.push('/(auth)/recoveryCode')}
      />

      <TouchableOpacity onPress={() => router.push('/(auth)/signUp')}>
        <Text style={[styles.loginText, { color: theme.colors.gray }]}>
          Don't have an account? <Text  style={[styles.loginText, { color: theme.colors.primary, fontSize: 20, fontWeight: "bold" }]}> Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal:20,
    paddingTop: 30,
    marginTop:40,
  },
 backButton: {
  position: 'absolute',
  top: 10,
  left: 10,
  backgroundColor: '#007bff',
  borderRadius: 25,         // Half of width/height for a circle
  width: 50,
  height: 50,
  justifyContent: 'center', // Center icon vertically
  alignItems: 'center',     // Center icon horizontally
  zIndex: 10,
},
  inputHeader: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  inputHeadersub: {
    fontSize: 16,
    marginBottom: 98,
    textAlign: 'center',
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
    marginBottom: 60,
  },
  loginText: {
    marginTop: 130,
    fontWeight: '600',
  },
});
