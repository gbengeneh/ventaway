import React, { createContext, useContext, useEffect, useState } from 'react';
import { theme } from '../constants/theme';
import * as SecureStore from 'expo-secure-store';
import { Appearance } from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  const [useDeviceSetting, setUseDeviceSetting] = useState(false);

  useEffect(() => {
    (async () => {
      const storedMode = await SecureStore.getItemAsync('themeMode');
      const storedUseDeviceSetting = await SecureStore.getItemAsync('useDeviceSetting');
      if (storedUseDeviceSetting === 'true') {
        setUseDeviceSetting(true);
        const colorScheme = Appearance.getColorScheme();
        setMode(colorScheme === 'dark' ? 'dark' : 'light');
      } else if (storedMode && (storedMode === 'light' || storedMode === 'dark')) {
        setMode(storedMode);
        setUseDeviceSetting(false);
      } else {
        setMode('light');
        setUseDeviceSetting(false);
      }
    })();

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (useDeviceSetting) {
        setMode(colorScheme === 'dark' ? 'dark' : 'light');
      }
    });

    return () => subscription.remove();
  }, [useDeviceSetting]);

  const toggleTheme = async () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    setUseDeviceSetting(false);
    await SecureStore.setItemAsync('themeMode', newMode);
    await SecureStore.setItemAsync('useDeviceSetting', 'false');
  };

  const toggleUseDeviceSetting = async () => {
    const newUseDeviceSetting = !useDeviceSetting;
    setUseDeviceSetting(newUseDeviceSetting);
    await SecureStore.setItemAsync('useDeviceSetting', newUseDeviceSetting ? 'true' : 'false');
    if (newUseDeviceSetting) {
      const colorScheme = Appearance.getColorScheme();
      setMode(colorScheme === 'dark' ? 'dark' : 'light');
    }
  };

  const currentTheme = theme[mode] ?? theme['light'];

  return (
    <ThemeContext.Provider value={{ 
      theme: currentTheme, 
      mode, 
      toggleTheme, 
      useDeviceSetting, 
      toggleUseDeviceSetting, 
      setUseDeviceSetting, 
      setTheme: setMode 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
