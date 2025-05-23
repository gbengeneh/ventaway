import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '../../../context/AuthContext';


export default function HomeScreen() {
  const { user } = useAuth();

  return (
      <ScrollView contentContainerStyle={styles.content}>
        {/* Your screen content goes here */}
      </ScrollView> 
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    top: 2,
    backgroundColor: 'white',
  },
  content: {
    padding: 16,
  },
});
