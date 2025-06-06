import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

export default function AudioPreview({ audioUri }) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Clean up when audioUri changes or component unmounts
    return () => {
      if (sound) {
        sound.unloadAsync();
        setSound(null);
      }
    };
  }, [audioUri]);

  const onPlayPausePress = async () => {
    if (!sound) {
      // Load and play the audio
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate(status => {
        if (!status.isPlaying) {
          setIsPlaying(false);
        }
      });
    } else {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  if (!audioUri) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>🎙️ Audio selected</Text>
      <TouchableOpacity style={styles.button} onPress={onPlayPausePress}>
        <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  label: { fontSize: 16, marginRight: 10 },
  button: {
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
});
