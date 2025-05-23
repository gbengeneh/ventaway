import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Loading from './Loading';

const Button = ({
  buttonStyle = {},
  textStyle = {},
  icon='',
  title = "",
  onPress = () => {},
  loading = false,
  HasShadow = true,
  GradientComponent = null,
  
}) => {
  const { theme } = useTheme();

  const shadowStyle = HasShadow
    ? {
        shadowColor: theme.colors.dark,
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
      }
    : {};

  const styles = StyleSheet.create({
    button: {
      width: "100%",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
      overflow: 'hidden', // to clip gradient corners
    },
    text: {
      color: theme.colors.textPure,
    },
  });

  if (loading) {
    return (
      <View style={[styles.button, buttonStyle, {backgroundColor: "white"}]}>
        <Loading />
      </View>
    );
  }

  const hasBackgroundColor = buttonStyle.backgroundColor !== undefined;

  if (hasBackgroundColor && !GradientComponent) {
    return (
      <Pressable onPress={onPress} style={[styles.button, buttonStyle, HasShadow && shadowStyle]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          {icon ? <View style={{ marginRight: 8 }}>{icon}</View> : null}
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </View>
      </Pressable>
    );
  }

  if (GradientComponent) {
    return (
      <GradientComponent style={[styles.button, buttonStyle, HasShadow && shadowStyle]}>
        <Pressable onPress={onPress} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            {icon ? <View style={{ marginRight: 8 }}>{icon}</View> : null}
            <Text style={[styles.text, textStyle]}>{title}</Text>
          </View>
        </Pressable>
      </GradientComponent>
    );
  }

  // Default fallback: no gradient, solid background
  return (
    <Pressable onPress={onPress} style={[styles.button, buttonStyle, HasShadow && shadowStyle ]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        {icon ? <View style={{ marginRight: 8 }}>{icon}</View> : null}
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </View>
    </Pressable>
  );
};

export default Button;
