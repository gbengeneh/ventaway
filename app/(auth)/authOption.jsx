import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Button from '../../components/Button';
import { useTheme } from '../../context/ThemeContext';
import { useRouter } from 'expo-router';
import { BlueGradient } from '../../components/Gradients';

const AuthOption = () => {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={{ width: 300, height: 300 }}
      />
      <Button
        title="SIGN UP"
        GradientComponent={BlueGradient}
        buttonStyle={{
          marginVertical: 10,
          width: 250,
          height: 40,
        }}
        textStyle={{
          color: theme.colors.textPure,
          fontSize: 14,
          fontWeight: 'bold',
        }}
        onPress={() => {
          router.push('/(auth)/signUp');
        }}
      />
      <Button
        title="LOGIN"
        buttonStyle={{
          backgroundColor: theme.colors.dark,
          borderWidth: 1,
          borderColor: theme.colors.primary,
          borderWidth: 2,
          marginVertical: 10,
          width: 250,
          height: 40,
        }}
        textStyle={{
          color: theme.colors.primary,
          fontSize: 14,
          fontWeight: 'bold',
        }}
        onPress={() => {
          router.push('/(auth)/login');
        }}
      />
    </View>
  );
};

export default AuthOption;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
  },
});
