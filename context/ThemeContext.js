import React, { createContext, useContext, useEffect, useState } from 'react';
import { theme } from '../constants/theme';
import * as SecureStore from 'expo-secure-store';
import { Appearance } from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(null); // null to avoid rendering too early
  const [useDeviceSetting, setUseDeviceSetting] = useState(false);

  // Load stored settings on mount
  useEffect(() => {
    const loadStoredTheme = async () => {
      const storedUseDeviceSetting = await SecureStore.getItemAsync('useDeviceSetting');
      const storedMode = await SecureStore.getItemAsync('themeMode');

      if (storedUseDeviceSetting === 'true') {
        const deviceColorScheme = Appearance.getColorScheme();
        setMode(deviceColorScheme === 'dark' ? 'dark' : 'light');
        setUseDeviceSetting(true);
      } else if (storedMode === 'dark' || storedMode === 'light') {
        setMode(storedMode);
        setUseDeviceSetting(false);
      } else {
        setMode('light'); // fallback default
        setUseDeviceSetting(false);
      }
    };

    loadStoredTheme();
  }, []);

  // Device theme change listener
  useEffect(() => {
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
      const deviceColorScheme = Appearance.getColorScheme();
      setMode(deviceColorScheme === 'dark' ? 'dark' : 'light');
    }
  };

  // Prevent children rendering until mode is determined
  if (!mode) return null;

  const currentTheme = theme[mode];

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        mode,
        toggleTheme,
        useDeviceSetting,
        toggleUseDeviceSetting,
        setUseDeviceSetting,
        setTheme: setMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
