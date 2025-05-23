import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const blueIconBg = '#007AFF';
const lightBlueIconBg = '#5AC8FA';
const redIconBg = '#FF3B30';

const settingsSections = [
  {
    items: [
      { label: 'Edit Profile', icon: Ionicons, name: 'person-outline', bgColor: blueIconBg, route: '/(main)/settings/edit_profile' },
      { label: 'Notification Setting', icon: Ionicons, name: 'notifications-outline', bgColor: blueIconBg, route: '/(main)/settings/notification_setting' },
      { label: 'Privacy Setting', icon: MaterialIcons, name: 'privacy-tip', bgColor: blueIconBg, route: '/(main)/settings/privacy_setting' },
    ],
  },
  {
    items: [
      { label: 'Appearance', icon: Feather, name: 'sun', bgColor: lightBlueIconBg, route: '/(main)/settings/appearance' },
      { label: 'Report a Problem', icon: MaterialCommunityIcons, name: 'alert-circle-outline', bgColor: lightBlueIconBg, route: '/(main)/settings/report_a_problem' },
      { label: 'Support', icon: Ionicons, name: 'help-circle-outline', bgColor: lightBlueIconBg, route: '/(main)/settings/support' },
    ],
  },
  {
    items: [
      { label: 'Delete Account', icon: MaterialIcons, name: 'delete-outline', bgColor: redIconBg, route: '/(main)/settings/delete_account' },
    ],
  },
];

export default function Settings() {
  const router = useRouter();

  const handlePress = (route) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.gradientBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.title}>Settings</Text>
      </LinearGradient>

      {settingsSections.map((section, index) => (
        <View key={index} style={styles.section}>
          {section.items.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity key={idx} style={styles.item} onPress={() => handlePress(item.route)}>
                <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>
                  <IconComponent name={item.name} size={20} color="#fff" />
                </View>
                <Text style={styles.itemLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
          {index < settingsSections.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradientBox: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemLabel: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginTop: 8,
  },
});
