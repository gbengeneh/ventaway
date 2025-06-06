import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Video, Audio as AudioPlayer } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import { Audio } from "expo-av";

const CustomImagePicker = ({ visible, onClose, onMediaSelected, initialAction }) => {
  const [image, setImage] = useState(null);
  const [videoPreviewUri, setVideoPreviewUri] = useState(null);
  const [videoCaption, setVideoCaption] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioRecording, setAudioRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showLibraryOption, setShowLibraryOption] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initialAction === "photo") {
        launchPhotoCamera();
      } else if (initialAction === "video") {
        launchVideoCamera();
      } else if (initialAction === "audio") {
        resetAudio();
      } else {
        // Show library option if no initialAction or unknown
        setShowLibraryOption(true);
      }
    } else {
      setShowLibraryOption(false);
    }
  }, [visible, initialAction]);

  const launchPhotoCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Permission to access camera is required!");
      onClose();
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImage(asset.uri);
      onMediaSelected && onMediaSelected({ type: "image", uri: asset.uri });
    } else {
      onClose();
    }
  };

  const launchVideoCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Permission to access camera is required!");
      onClose();
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setVideoPreviewUri(asset.uri);
      onMediaSelected && onMediaSelected({ type: "video", uri: asset.uri });
    } else {
      onClose();
    }
  };

  const pickFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Permission to access media library is required!");
      onClose();
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      if (asset.type === "image") {
        setImage(asset.uri);
        onMediaSelected && onMediaSelected({ type: "image", uri: asset.uri });
      } else if (asset.type === "video") {
        setVideoPreviewUri(asset.uri);
        onMediaSelected && onMediaSelected({ type: "video", uri: asset.uri });
      }
      setShowLibraryOption(false);
    } else {
      onClose();
    }
  };

  const resetAudio = () => {
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
    setAudioUri(null);
    setIsRecordingAudio(false);
    setAudioRecording(null);
  };

  const startAudioRecording = async () => {
    try {
      if (audioRecording) {
        try {
          await audioRecording.stopAndUnloadAsync();
        } catch {}
        setAudioRecording(null);
        setIsRecordingAudio(false);
      }
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Permission to access microphone is required!");
        onClose();
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setAudioRecording(recording);
      setIsRecordingAudio(true);
      setAudioUri(null);
    } catch (error) {
      console.error("Failed to start audio recording", error);
    }
  };

  const stopAudioRecording = async () => {
    try {
      await audioRecording.stopAndUnloadAsync();
      const uri = audioRecording.getURI();
      setAudioUri(uri);
      setIsRecordingAudio(false);
      setAudioRecording(null);
    } catch (error) {
      console.error("Failed to stop audio recording", error);
    }
  };

  const playAudio = async () => {
    if (!audioUri) return;
    try {
      const { sound: playbackObject } = await AudioPlayer.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );
      setSound(playbackObject);
      setIsPlayingAudio(true);
      playbackObject.setOnPlaybackStatusUpdate((status) => {
        if (!status.isPlaying) {
          setIsPlayingAudio(false);
          playbackObject.unloadAsync();
          setSound(null);
        }
      });
    } catch (error) {
      console.error("Error playing audio", error);
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlayingAudio(false);
    }
  };

  const confirmAudio = async () => {
    if (!audioUri) return;
    try {
      await MediaLibrary.saveToLibraryAsync(audioUri);
      Alert.alert("Audio saved!", audioUri);
      onMediaSelected && onMediaSelected({ type: "audio", uri: audioUri });
      closeModal();
    } catch (error) {
      console.error("Failed to save audio", error);
    }
  };

  const cancelAudio = () => {
    resetAudio();
    closeModal();
  };

  const closeModal = () => {
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
    setImage(null);
    setVideoPreviewUri(null);
    setImageCaption("");
    setVideoCaption("");
    setIsRecordingAudio(false);
    setAudioRecording(null);
    setAudioUri(null);
    setIsPlayingAudio(false);
    setShowLibraryOption(false);
    onClose();
  };

  const renderContent = () => {
    if (image) {
      return (
        <View style={styles.previewContainer}>
          <Text style={styles.header}>🖼️ Preview Image</Text>
          <Image source={{ uri: image }} style={styles.image} />

          <Text style={styles.label}>Add a Caption (optional):</Text>
          <TextInput
            placeholder="Describe the image..."
            value={imageCaption}
            onChangeText={setImageCaption}
            style={styles.captionInput}
            multiline
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={async () => {
                await MediaLibrary.saveToLibraryAsync(image);
                onMediaSelected &&
                  onMediaSelected({
                    type: "image",
                    uri: image,
                    caption: imageCaption,
                  });
                closeModal();
              }}
            >
              <Text style={styles.buttonText}>✅ Use Image</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => {
                setImage(null);
                closeModal();
              }}
            >
              <Text style={styles.buttonText}>❌ Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (videoPreviewUri) {
      return (
        <View style={styles.previewContainer}>
          <Text style={styles.header}>🎬 Preview Your Video</Text>

          <Video
            source={{ uri: videoPreviewUri }}
            useNativeControls
            resizeMode="contain"
            style={styles.video}
            shouldPlay
          />

          <Text style={styles.label}>Add a Caption (optional):</Text>
          <TextInput
            placeholder="What's this video about?"
            value={videoCaption}
            onChangeText={setVideoCaption}
            style={styles.captionInput}
            multiline
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={async () => {
                await MediaLibrary.saveToLibraryAsync(videoPreviewUri);
                onMediaSelected &&
                  onMediaSelected({
                    type: "video",
                    uri: videoPreviewUri,
                    caption: videoCaption,
                  });
                closeModal();
              }}
            >
              <Text style={styles.buttonText}>✅ Use Video</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.retakeButton]}
              onPress={() => {
                setVideoPreviewUri(null);
                launchVideoCamera();
              }}
            >
              <Text style={styles.buttonText}>🎥 Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => {
                setVideoPreviewUri(null);
                closeModal();
              }}
            >
              <Text style={styles.buttonText}>❌ Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (isRecordingAudio) {
      return (
        <View style={styles.audioContainer}>
          <Text style={styles.audioTitle}>🎙️ Audio Recorder</Text>
          <TouchableOpacity onPress={stopAudioRecording} style={[styles.controlButton, styles.recordButton]}>
            <Text style={{ fontSize: 64, color: "red" }}>■</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={closeModal} style={styles.controlButton}>
            <Text style={{ fontSize: 36 }}>✕</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (audioUri) {
      return (
        <View style={styles.previewContainer}>
          <Text style={styles.header}>🎙️ Preview Audio</Text>
          <TouchableOpacity onPress={isPlayingAudio ? stopAudio : playAudio} style={[styles.controlButton, styles.playButton]}>
            <Text style={{ fontSize: 48 }}>{isPlayingAudio ? "⏸" : "▶️"}</Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={confirmAudio}
            >
              <Text style={styles.buttonText}>✅ Use Audio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={cancelAudio}
            >
              <Text style={styles.buttonText}>❌ Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (showLibraryOption) {
      return (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={pickFromLibrary}>
            <Text style={styles.optionText}>📁 Pick from Library</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={closeModal}>
            <Text style={styles.optionText}>❌ Cancel</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null; // No UI to show
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>{renderContent()}</View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  previewContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    borderRadius: 10,
  },
  video: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
  captionInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    width: "100%",
    minHeight: 60,
    textAlignVertical: "top",
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    alignSelf: "flex-start",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  retakeButton: {
    backgroundColor: "#2196F3",
  },
  cancelButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  audioContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  audioTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  controlButton: {
    marginVertical: 10,
  },
  recordButton: {
    marginBottom: 20,
  },
  playButton: {
    marginVertical: 20,
  },
  optionsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  optionButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "100%",
  },
  optionText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default CustomImagePicker;
