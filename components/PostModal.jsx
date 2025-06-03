import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, Modal, Alert, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import * as DocumentPicker from "expo-document-picker";

export default function PostModal({
  visible,
  onClose,
  onMediaSelected,
  initialAction,
}) {
  const [modalVisible, setModalVisible] = useState(visible);
  const [selectedAction, setSelectedAction] = useState(initialAction || null);
  const [facing, setFacing] = useState(CameraType);
  const cameraRef = useRef(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioRecording, setAudioRecording] = useState(null);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  useEffect(() => {
    setSelectedAction(initialAction || null);
  }, [initialAction]);

  useEffect(() => {
    if (modalVisible && selectedAction) {
      if (selectedAction === "audio") {
        startAudioRecording();
      } else if (selectedAction === "video") {
        startVideoRecording();
      }
    }
  }, [modalVisible, selectedAction]);

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAction(null);
    onClose && onClose();
  };

  const toggleCameraFacing = () => {
    setFacing((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };
  // AUDIO
  const startAudioRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setAudioRecording(recording);
      setIsRecordingAudio(true);
    } catch (err) {
      console.error("Audio start error:", err);
    }
  };

  const stopAudioRecording = async () => {
    try {
      setIsRecordingAudio(false);
      await audioRecording.stopAndUnloadAsync();
      const uri = audioRecording.getURI();
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Audio saved!", uri);
      onMediaSelected && onMediaSelected({ type: "audio", uri });
      closeModal();
    } catch (err) {
      console.error("Audio stop error:", err);
    }
  };

  // VIDEO
  const startVideoRecording = async () => {
    if (cameraRef.current) {
      setIsRecordingVideo(true);
      const video = await cameraRef.current.recordAsync();
      await MediaLibrary.saveToLibraryAsync(video.uri);
      Alert.alert("Video saved!", video.uri);
      onMediaSelected && onMediaSelected({ type: "video", uri: video.uri });
      setIsRecordingVideo(false);
      closeModal();
    }
  };

  const stopVideoRecording = () => {
    if (cameraRef.current && isRecordingVideo) {
      cameraRef.current.stopRecording();
    }
  };

  // PHOTO
  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      await MediaLibrary.saveToLibraryAsync(photo.uri);
      Alert.alert("Picture saved!", photo.uri);
      onMediaSelected && onMediaSelected({ type: "image", uri: photo.uri });
      closeModal();
    }
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
      });
      if (result.assets && result.assets.length > 0) {
        Alert.alert("File Selected", result.assets[0].uri);
        onMediaSelected &&
          onMediaSelected({ type: "file", uri: result.assets[0].uri });
        closeModal();
      } else if (result.uri) {
        Alert.alert("File Selected", result.uri);
        onMediaSelected && onMediaSelected({ type: "file", uri: result.uri });
        closeModal();
      }
    } catch (err) {
      console.error("File pick error:", err);
    }
  };

  const renderCameraView = (actionType) => (
    <CameraView
      style={styles.camera}
      ref={cameraRef}
      facing={facing}
    >
      <View style={styles.controls}>
        {actionType === "video" ? (
          isRecordingVideo ? (
            <Button title="Stop Video" onPress={stopVideoRecording} />
          ) : (
            <Button title="Start Video" onPress={startVideoRecording} />
          )
        ) : (
          <Button title="Take Picture" onPress={takePicture} />
        )}
        <Button title="Close" onPress={closeModal} />
      </View>
    </CameraView>
  );

  const renderContent = () => {
    if (
      !cameraPermission?.granted &&
      (selectedAction === "video" || selectedAction === "photo")
    ) {
      return (
        <View style={styles.inner}>
          <Text>We need camera permission to continue</Text>
          <Button title="Grant Permission" onPress={requestCameraPermission} />
        </View>
      );
    }

    switch (selectedAction) {
      case "audio":
        return (
          <View style={styles.inner}>
            <Text>🎙️ Audio Recorder</Text>
            {isRecordingAudio ? (
              <Button title="Stop Recording" onPress={stopAudioRecording} />
            ) : (
              <Button title="Start Recording" onPress={startAudioRecording} />
            )}
            <Button title="Close" onPress={closeModal} />
          </View>
        );
      case "video":
        return renderCameraView("video");
      case "photo":
        return renderCameraView("photo");
      default:
        return (
          <View style={styles.inner}>
            <Text>Select an option</Text>
            <Button
              title="Record Audio"
              onPress={() => setSelectedAction("audio")}
            />
            <Button
              title="Record Video"
              onPress={() => setSelectedAction("video")}
            />
            <Button
              title="Take Picture"
              onPress={() => setSelectedAction("photo")}
            />
            <Button title="Select File" onPress={pickFile} />
            <Button title="Close" onPress={closeModal} />
          </View>
        );
    }
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      onRequestClose={closeModal}
    >
      {renderContent()}
    </Modal>
  );
}

const styles = StyleSheet.create({
  inner: { flex: 1, justifyContent: "center", alignItems: "center" },
  camera: { flex: 1 },
  controls: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
});
