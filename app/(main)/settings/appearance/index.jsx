import { useTheme } from '@/context/ThemeContext';
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
      alignItems: 'flex-start',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
    },
    description: {
      fontSize: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      color: theme.colors.text,
    },
    phoneContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 16,
    },
    phoneBox: {
      width: '45%',
      borderWidth: 1,
      borderColor: '#ccc',
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
      backgroundColor: '#007AFF',
      borderColor: '#007AFF',
    },
    deviceSettingBox: {
      marginTop: 20,
      paddingHorizontal: 16,
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

const appLogo = require('@/assets/images/logo.png'); // Adjust path if needed
const appLogo2 = require('@/assets/images/logo2.png'); // Adjust path if needed

const Appearance = () => {
  const { theme, setTheme, useDeviceSetting, setUseDeviceSetting } = useTheme();
 const styles = getStyles(theme);
  const toggleTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    setUseDeviceSetting(false);
  };

  const toggleUseDeviceSetting = () => {
    setUseDeviceSetting(!useDeviceSetting);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.gradientBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.title}>Appearance</Text>
      </LinearGradient>

      <Text style={styles.description}>
        Customize the look and feel of the app by selecting a theme below.
      </Text>

      <View style={styles.phoneContainer}>
        {/* Light Theme Box */}
        <View style={styles.phoneBox}>
          <Image source={appLogo} style={styles.logo} />
          <View style={[styles.previewBox, { backgroundColor: '#fff' }]}>
            <Text style={styles.previewLabel}>Light</Text>
            <TouchableOpacity
              style={[
                styles.circle,
                theme === 'light' && styles.selectedCircle,
              ]}
              onPress={() => toggleTheme('light')}
            />
          </View>
        </View>

        {/* Dark Theme Box */}
        <View style={styles.phoneBox}>
          <Image source={appLogo2} style={styles.logo} />
          <View style={[styles.previewBox, { backgroundColor: '#000' }]}>
            <Text style={[styles.previewLabel, { color: '#fff' }]}>Dark</Text>
            <TouchableOpacity
              style={[
                styles.circle,
                theme === 'dark' && styles.selectedCircle,
              ]}
              onPress={() => toggleTheme('dark')}
            />
          </View>
          
        </View>
      </View>

      <View style={styles.deviceSettingBox}>
        <View style={styles.deviceSettingRow}>
          <Text style={styles.deviceSettingLabel}>Use device setting</Text>
          <Switch value={useDeviceSetting} onValueChange={toggleUseDeviceSetting} />
        </View>
        <Text style={styles.deviceSettingDescription}>
          When enabled, the app theme will follow your device's system settings.
        </Text>
      </View>
    </View>
  );
};


export default Appearance;
