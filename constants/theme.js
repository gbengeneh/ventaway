export const lightTheme = {
  colors: {
    primary: '#01B5D5',
    primaryDark: '#00F3C2',
    background: '#ffffff',
    secondary: '#17B9FB',
    dark: '#3e3e3e',
    darkLight: '#fff',
    gray: '#1E1E1E',
    inactive: '#2b7b9d',
    grayLight: '#f5f5f5',
    text: '#494949',
    textLight: '#7c7c7c',
    textDark: '#1d1d1d',
    textPure: '#ffffff',
    rose: '#f5c2c7',
    roseLight: '#f5c2c7',
    gradient: [ '#01B5D5','#DDF3E2'],  // gradient colors here
    blueGradient: ['#01B5D5', '#17C9FB'],
    success: 'green',
    cardBackground: '#D3D3D3',
  },
  fonts: {
    medium: '500',
    semibold: '600',
    bold: '700',
    extraBold: '800',
  },
  radius: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 22,
  },
}

export const darkTheme = {
  colors: {
    primary: '#01B5D5',
    primaryDark: '#01B5D5',
    background: '#000000',

    // Base grays
    dark: '#3e3e3e',
    darkLight: '#fff',
    gray: '#cccccc',       // lighter gray
    grayLight: '#e5e5e5',   // also lightened

    inactive: '#2b7b9d',

    // ✅ Updated text colors for better contrast
    text: '#a4a4a4',        // used for most text
    textLight: '#b0b0b0',   // lighter subtext
    textDark: '#ffffff',    // for inverted or darker background
    textPure: '#ffffff',

    rose: '#f5c2c7',
    roseLight: '#f5c2c7',

    gradient: ['#01B5D5', '#00F3C2'],
    blueGradient: ['#01B5D5', '#17C9FB'],
    cardBackground: '#d3d3d3', // dark card background
  },
  fonts: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extraBold: '800',
  },
  radius: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 22,
  },
};

export const theme = {
  light: lightTheme,
  dark: darkTheme,
}
