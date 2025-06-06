import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Alert, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import PostModal from '../../../components/PostModal';
import { createPost } from '../../slices/postSlice';
import { Video, Audio } from 'expo-av';
import AudioPreview from '@/components/AudioPreview';
import { useAuth } from '@/context/AuthContext';



const postTypes = [
  { id: 'video', label: 'Video', icon: 'video' },
  { id: 'audio', label: 'Audio', icon: 'microphone' },
  { id: 'image', label: 'Image', icon: 'image' },
];

const mediaOptions = {
  video: [
    { id: 'record', label: 'Record Video', action: 'video' },
    { id: 'choose', label: 'Choose from File', action: 'file' },
  ],
  audio: [
    { id: 'record', label: 'Record Audio', action: 'audio' },
    { id: 'choose', label: 'Choose from File', action: 'file' },
  ],
  image: [
    { id: 'take', label: 'Take Picture', action: 'photo' },
    { id: 'choose', label: 'Choose from File', action: 'file' },
  ],
};

export default function CreatePost() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const title = params.title || 'Create Post';
  const communityId = params.communityId || null;
  const userId = user?.userId || null;

  const dispatch = useDispatch();
  const postState = useSelector(state => state.post);
  const token = useSelector(state => state.auth?.token);

  const [text, setText] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState(null);
  const [mediaOptionsVisible, setMediaOptionsVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [postModalAction, setPostModalAction] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);

  const openMediaOptions = (mediaType) => {
    setSelectedMediaType(mediaType);
    setMediaOptionsVisible(true);
  };

  const closeMediaOptions = () => {
    setMediaOptionsVisible(false);
    setSelectedMediaType(null);
  };

  const openPostModal = (action) => {
    setPostModalAction(action);
    setModalVisible(true);
    closeMediaOptions();
  };

  const closePostModal = () => {
    setModalVisible(false);
    setPostModalAction(null);
  };

  const handleMediaSelected = (media) => {
    setMediaFile(media);
  };

  const handleUpload = async () => {
    if (!text.trim() && !mediaFile) {
      Alert.alert('Error', 'Please enter some text or select media to post.');
      return;
    }

    const content = typeof text === 'string' ? text.trim() : '';
    if (content === '' && !mediaFile) {
      Alert.alert('Error', 'Content is empty and no media selected.');
      return;
    }

    const dto = {
      content,
      mediaType: mediaFile ? mediaFile.type : 'text',
      mediaUrl: mediaFile ? mediaFile.uri : null,
      communityId: communityId,
    };

    console.log('Uploading post with dto:', dto);

    let file = null;
    if (mediaFile && mediaFile.uri) {
      file = {
        uri: mediaFile.uri,
        name: `upload.${mediaFile.type === 'image' ? 'jpg' : mediaFile.type === 'video' ? 'mp4' : mediaFile.type === 'audio' ? 'm4a' : 'dat'}`,
        type: mediaFile.type + '/*',
      };
    }

    try {
      console.log('Token used for upload:', token);
      await dispatch(createPost({ userId, dto, file, token })).unwrap();
      Alert.alert('Success', 'Post uploaded successfully!');
      setText('');
      setMediaFile(null);
      router.back();
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', error.message || 'An error occurred while uploading the post.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={theme.colors.blueGradient} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={{ width: 30 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TextInput
          style={[styles.textArea, { color: theme.colors.text }]}
          placeholder="Write your post here..."
          placeholderTextColor={theme.colors.textLight}
          multiline
          numberOfLines={4}
          value={text}
          onChangeText={setText}
        />

        {mediaFile && (
          <View style={styles.mediaPreviewContainer}>
            {mediaFile.type === 'image' && (
              <Image source={{ uri: mediaFile.uri }} style={styles.mediaPreviewImage} />
            )}
            {mediaFile.type === 'video' && (
              <Video
                source={{ uri: mediaFile.uri }}
                useNativeControls
                resizeMode="contain"
                style={styles.mediaPreviewVideo}
                shouldPlay={false}
              />
            )}
            {mediaFile.type === 'audio' && (
              <AudioPreview audioUri={mediaFile.uri} />
            )}
          </View>
        )}

        <Text style={[styles.subtitle, { color: theme.colors.primary }]}>Choose media type</Text>

        <View style={styles.optionsRow}>
          {postTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[styles.optionButton, { borderColor: theme.colors.primary }]}
              onPress={() => openMediaOptions(type.id)}
            >
              {type.id === 'image' || type.id === 'text' ? (
                <MaterialIcons name={type.icon} size={22} color={theme.colors.primary} style={{ marginRight: 6 }} />
              ) : (
                <FontAwesome5 name={type.icon} size={20} color={theme.colors.primary} style={{ marginRight: 6 }} />
              )}
              <Text style={[styles.optionText, { color: theme.colors.primary }]}>{type.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {mediaOptionsVisible && selectedMediaType && (
          <View style={[styles.mediaOptionsDropdown, { borderColor: theme.colors.primary }]}>
            {mediaOptions[selectedMediaType].map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.mediaOptionButton, { borderColor: theme.colors.primary }]}
                onPress={() => openPostModal(option.action)}
              >
                <Text style={[styles.mediaOptionText, { color: theme.colors.primary }]}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleUpload}
          disabled={postState.loading}
        >
          <Text style={styles.uploadButtonText}>{postState.loading ? 'Uploading...' : 'Upload Post'}</Text>
        </TouchableOpacity>
      </ScrollView>

      <PostModal visible={modalVisible} onClose={closePostModal} onMediaSelected={handleMediaSelected} initialAction={postModalAction} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  textArea: {
    borderRadius: 8,
    padding: 12,
    margin: 16,
    fontSize: 16,
    minHeight: 320,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginHorizontal: 12,
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    margin: 6,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  mediaOptionsDropdown: {
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  mediaOptionButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  mediaOptionText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  uploadButton: {
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mediaPreviewContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  mediaPreviewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  mediaPreviewVideo: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  audioPreviewText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    padding: 10,
  },
});
