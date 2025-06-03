import HomeHeader from '@/components/HomeHeader';
import ScreeenWrapper from '@/components/ScreeenWrapper';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { Slot, useRouter, useSegments } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/context/UserContext';

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

const subtitleMap = {
  home: 'How can we support you today?',
  community: 'Welcome to the community, this is tailored to your interests',
  message: 'Send and receive text or support from your persons',
};

export default function MainLayout() {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { userProfile } = useUser();
  const userName = userProfile?.name || user?.name || 'User';

  const currentRoute = segments[segments.length - 1];
  const showHeader = !segments.includes('settings') && !segments.includes('profile') && !segments.includes('post');
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
      {showHeader && <HomeHeader user={userProfile} subtitle={subtitle} />}
      <View style={[styles.content]}>
        <Slot />
      </View>

      <View
        style={[
          styles.tabBar,
          {
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.grayLight,
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
              <Icon
                color={focused ? theme.colors.primary : theme.colors.textLight}
                size={24}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: focused ? theme.colors.primary : theme.colors.textLight,
                    fontWeight: focused ? theme.fonts.semibold : theme.fonts.medium,
                  },
                ]}
              >
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
    padding: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
