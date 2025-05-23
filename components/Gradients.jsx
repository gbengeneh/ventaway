import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

export const DefaultGradient = ({ style, children }) => {
  const { theme } = useTheme();
  return (
    <LinearGradient
      colors={theme.colors.gradient}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={style}
    >
      {children}
    </LinearGradient>
  );
};

export const BlueGradient = ({ style, children }) => {
  const { theme } = useTheme();
  return (
    <LinearGradient
      colors={theme.colors.blueGradient}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={style}
    >
      {children}
    </LinearGradient>
  );
};
