import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Button from "../../components/Button";
import { BlueGradient } from "../../components/Gradients";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const ResetPassword = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please fill in both fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    // Add password reset logic here

    Alert.alert("Success", "Password has been reset successfully");
    router.push("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/(auth)/recoveryCode")}
      >
        <Ionicons name="chevron-back" size={24} color="white" />
      </TouchableOpacity>

      <Text
        style={[
          styles.header,
          { color: theme.colors.textDark, fontSize: 18, fontWeight: "bold" },
        ]}
      >
        Choose New Password
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.textDark }]}>
          New Password
        </Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.colors.primary, color: theme.colors.textDark },
          ]}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Enter new password"
          placeholderTextColor={theme.colors.gray}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.textDark }]}>
          Confirm Password
        </Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.colors.primary, color: theme.colors.textDark },
          ]}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
          placeholderTextColor={theme.colors.gray}
        />
      </View>

      <Button
        title="Reset Password"
        GradientComponent={BlueGradient}
        HasShadow={true}
        buttonStyle={{
          marginVertical: 10,
          color: theme.colors.textDark,
          width: 320,
          height: 50,
          borderColor: "black",
          borderWidth: 2,
          marginTop: 50,
        }}
        textStyle={{
          color: theme.colors.textDark,
          fontSize: 20,
          fontWeight: "bold",
        }}
        onPress={handleReset}
      />

      <TouchableOpacity onPress={() => router.push("/(auth)/signUp")}>
        <Text style={[styles.loginText, { color: theme.colors.gray }]}>
          Don't have an account?{" "}
          <Text
            style={[
              styles.loginText,
              { color: theme.colors.primary, fontSize: 20, fontWeight: "bold" },
            ]}
          >
            {" "}
            Sign Up
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
    marginTop: 40,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#007bff",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  header: {
    marginBottom: 40,
    textAlign: "center",
  },
  inputGroup: {
    width: "100%",
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
  },
   loginText: {
    marginTop: 130,
    fontWeight: "600",
  },
});
