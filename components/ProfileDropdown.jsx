import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

const DROPDOWN_ITEMS = [
  "Account",
  "Privacy",
  "Interest",
  "Notification",
  "Language",
  "Appearance",
  "Premium features",
  "Feedback & Ratings",
  "Security",
  "Logout",
];

const ProfileDropdown = ({ visible, onClose }) => {
  const { logout } = useAuth();

  if (!visible) return null;

  const handleItemPress = (item) => {
    if (item === "Logout") {
      logout();
    }
    onClose();
  };

  return (
    <View style={styles.dropdownContainer}>
      {DROPDOWN_ITEMS.map((item) => (
        <TouchableOpacity
          key={item}
          style={styles.dropdownItem}
          onPress={() => handleItemPress(item)}
        >
          <Text style={styles.itemText}>{item}</Text>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    position: "absolute",
    top: 60,
    right: 0,
    width: "50%",
    backgroundColor: "black",
    borderRadius: 8,
    paddingVertical: 10,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  itemText: {
    color: "white",
    fontSize: 16,
  },
});

export default ProfileDropdown;
