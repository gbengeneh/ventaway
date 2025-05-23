import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from '@expo/vector-icons';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreeenWrapper from '@/components/ScreeenWrapper';
import HomeHeader from '@/components/HomeHeader';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const tabs = [
  {
    name: 'Home',
    icon: ({ color, size }) => (
      <Ionicons name="home" size={size} color={color} />
    ),
    route: '/(main)/home',
  },
  {
    name: 'Community',
    icon: ({ color, size }) => (
      <MaterialCommunityIcons name="account-group" size={size} color={color} />
    ),
    route: '/(main)/community',
  },
  {
    name: 'Message',
    icon: ({ color, size }) => (
      <Ionicons name="chatbubble-ellipses" size={size} color={color} />
    ),
    route: '/(main)/message',
  },
  {
    name: 'Settings',
    icon: ({ color, size }) => (
      <FontAwesome5 name="cog" size={size} color={color} />
    ),
    route: '/(main)/settings',
  },
];

// Mapping subtitle text based on route
const subtitleMap = {
  home: 'Welcome back!',
  community: 'Chat with other users',
  message: 'Check your messages',
};

export default function MainLayout() {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { theme } = useTheme();

  const currentRoute = segments[segments.length - 1];
 const showHeader = !segments.includes('settings'); 
  const subtitle = subtitleMap[currentRoute] || 'How can we support you today?';

  const activeTab =
    tabs.find((tab) =>
      segments.includes(tab.route.split('/').pop())
    )?.name || 'Home';

  const handleTabPress = (tab) => {
    router.push(tab.route);
  };

  return (
    <ScreeenWrapper bg={theme.colors.background}>  
      {/* Header (not shown in settings) */}
      {showHeader && <HomeHeader user={user} subtitle={subtitle} />}

      {/* Main content */}
      <View style={styles.content}>
        <Slot />
      </View>

      {/* Bottom tab navigation */}
      <View
        style={[
          styles.tabBar,
          {
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const focused = activeTab === tab.name;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => handleTabPress(tab)}
              activeOpacity={0.7}
            >
              <Icon color={focused ? '#007AFF' : '#8e8e93'} size={24} />
              <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScreeenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    color: '#8e8e93',
    marginTop: 4,
  },
  tabLabelFocused: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
