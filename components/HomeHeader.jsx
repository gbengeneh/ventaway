import { Feather, Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';


export default function HomeHeader({ user, subtitle }) {
  const { theme } = useTheme(); // ✅ Correct destructuring
  const router = useRouter(); 

  const onUserImagePress = () => {
    router.push('profile');
  };

  return (
    <View style={styles.container}>
      {/* Left: User info */}
      <View style={styles.userSection}>
        <TouchableOpacity onPress={onUserImagePress}>
          <Image
            source={{ uri: user?.avatar || 'https://i.pravatar.cc/100' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View>
          <Text style={[styles.greeting, { color: theme.colors.text }]}>
            Hi, {user?.username || 'User'}
          </Text>
          <Text style={[styles.supportText, { color: theme.colors.text }]}>
            {subtitle}
          </Text>
        </View>
      </View>

      {/* Right: Icons */}
      <View style={styles.iconSection}>
        <TouchableOpacity
          style={[styles.iconButton, { borderColor: theme.colors.primary }]}
          onPress={() => router.push('post/upload')}
        >
          <Feather name="upload" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconButton, { borderColor: theme.colors.primary }]}>
          <Ionicons name="notifications-outline" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  greeting: {
    fontSize: 16,
  },
  supportText: {
    fontSize: 13,
    fontWeight: '600',
    width: 150,
  },
  iconSection: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    borderWidth: 1,
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
