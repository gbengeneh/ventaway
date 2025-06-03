import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommunities } from '@/app/slices/communitySlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

export default function Upload() {
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const communities = useSelector((state) => state.community.communities);

  useEffect(() => {
    dispatch(fetchCommunities());
  }, [dispatch]);

  const renderOption = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.optionButton,
          {
            borderColor: theme.colors.primary,
            borderWidth: 1,
            margin: 5,
          },
        ]}
        onPress={() => router.push({ pathname: 'post/create', params: { title: item.name } })}
      >
        <Text style={[styles.optionText, { color: theme.colors.text }]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header with back button and title with shared background */}
      <LinearGradient start={{x: 0, y: 1}} end={{x: 1, y: 0}} colors={theme.colors.blueGradient} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Post</Text>
        <View style={{ width: 40 }} /> {/* Placeholder for alignment */}
      </LinearGradient>

      {/* Subtitle */}
      <Text style={[styles.subtitle, { color: theme.colors.text }]}>
        Choose a post or interest to create
      </Text>

      {/* Box container with special border radius */}
      <View
        style={[
          styles.optionsBox,
          {
            borderColor: theme.colors.primary,
            borderWidth: 1,
            borderTopRightRadius: theme.radius.xxl,
            borderBottomLeftRadius: theme.radius.xxl,
            borderTopLeftRadius: theme.radius.md,
            borderBottomRightRadius: theme.radius.md,
          },
        ]}
      >
        <FlatList
          data={communities}
          renderItem={renderOption}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.optionsList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  padding: 0,
  
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
   
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
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  optionsBox: {
    flex: 1,
    padding: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
  },
  optionsList: {
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
