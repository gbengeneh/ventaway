import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function HomeHeader({ user, subtitle }) {
  const { colors } = useTheme();

  return (
      <View style={styles.container}>
        {/* Left: User info */}
        <View style={styles.userSection}>
          <Image
            source={{ uri: user?.avatar || 'https://i.pravatar.cc/100' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.greeting}>Hi, {user?.name || 'User'}</Text>
            <Text style={styles.supportText}>{subtitle}</Text>
          </View>
        </View>

        {/* Right: Icons */}
        <View style={styles.iconSection}>
          <TouchableOpacity style={[styles.iconButton, { borderColor: colors.primary }]}>
            <Feather name="upload" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, { borderColor: colors.primary }]}>
            <Ionicons name="notifications-outline" size={20} color={colors.primary} />
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
    color: '#000', // gray-700
  },
  supportText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#4B5563',
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
