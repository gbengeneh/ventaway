import { useTheme } from '@/context/ThemeContext';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    gradientBox: {
      paddingVertical: 20,
      paddingHorizontal: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 18,
    },
    description: {
      fontSize: 26,
      paddingHorizontal: 16,
      paddingVertical: 12,
      color: theme.colors.text,
      fontWeight: '500',
      textAlign: 'center',
     paddingTop: 50

    },
    phoneContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 16,
      paddingVertical: 30,
    },
    phoneBox: {
      width: '45%',
      borderWidth: 1,
      borderColor: '#ccc',
      backgroundColor: "#3e3e3e",
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
    },
    phoneBox1: {
      width: '45%',
      borderWidth: 1,
      borderColor: '#ccc',
      backgroundColor: "#e5e5e5",
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
    },
    logo: {
      width: 80,
      height: 80,
      resizeMode: 'contain',
      marginBottom: 12,
    },
    previewBox: {
      width: '100%',
      height: 100,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    previewLabel: {
      fontSize: 18,
      marginBottom: 8,
      color: theme.colors.text,
    },
    circle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#ccc',
    },
    selectedCircle: {
      backgroundColor: '#1a74eb',
      borderColor: '#007AFF',
    },
    deviceSettingBox: {
      marginTop: 20,
      paddingHorizontal: 16,
      backgroundColor: "#e5e5e5",
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 1,
        height: 2,
      },
    },
    deviceSettingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    deviceSettingLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    deviceSettingDescription: {
      marginTop: 8,
      fontSize: 14,
      color: theme.colors.textSecondary ?? '#666',
    },
  });

const appLogo = require('@/assets/images/logo.png');
const appLogo2 = require('@/assets/images/logo2.png');

const Appearance = () => {
  const {
    theme,
    setTheme,
    useDeviceSetting,
    setUseDeviceSetting,
     toggleUseDeviceSetting,
  } = useTheme();

  const styles = getStyles(theme);

  const handleThemeChange = async (selectedTheme) => {
    await SecureStore.setItemAsync('useDeviceSetting', 'false');
    await SecureStore.setItemAsync('themeMode', selectedTheme);
    setUseDeviceSetting(false);
    setTheme(selectedTheme);
  };



const toggleUseDeviceSettingHandler = async () => {
  await toggleUseDeviceSetting(); // this handles theme and store update properly
};


  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.colors.blueGradient}
        style={styles.gradientBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.title}>Appearance</Text>
      </LinearGradient>

      <Text style={styles.description}>
       Appearance Display
      </Text>

      <View style={styles.phoneContainer}>
        {/* Light Theme */}
        <View style={styles.phoneBox1}>
          <Image source={appLogo2} style={styles.logo} />
          <View style={[styles.previewBox, { backgroundColor: '#ffffff' }]}>
            <Text style={styles.previewLabel}>Light</Text>
            <TouchableOpacity
              style={[
                styles.circle,
                theme.mode === 'light' && styles.selectedCircle,
              ]}
              onPress={() => handleThemeChange('light')}
            />
          </View>
        </View>

        {/* Dark Theme */}
        <View style={styles.phoneBox}>
          <Image source={appLogo} style={styles.logo} />
          <View style={[styles.previewBox, { backgroundColor: '#000' }]}>
            <Text style={[styles.previewLabel, { color: '#fff' }]}>Dark</Text>
            <TouchableOpacity
              style={[
                styles.circle,
                theme.mode === 'dark' && styles.selectedCircle,
              ]}
              onPress={() => handleThemeChange('dark')}
            />
          </View>
        </View>
      </View>

      <View style={styles.deviceSettingBox}>
        <View style={styles.deviceSettingRow}>
          <Text style={styles.deviceSettingLabel}>Use device setting</Text>
          <Switch value={useDeviceSetting} onValueChange={toggleUseDeviceSettingHandler} />
        </View>
        <Text style={styles.deviceSettingDescription}>
          When enabled, the app theme will follow your device's system settings.
        </Text>
      </View>
    </View>
  );
};

export default Appearance;
