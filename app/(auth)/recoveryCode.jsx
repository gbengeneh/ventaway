import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Button from "../../components/Button";
import { BlueGradient } from "../../components/Gradients";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const RecoveryCode = () => {
  const { theme } = useTheme();
  const router = useRouter();

  // State to hold each digit of the 6-digit code
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  // Refs for each input to focus next input on entry
  const inputs = Array(6)
    .fill(0)
    .map(() => useRef(null));

  // Handle input change for each digit
  const handleChange = (text, index) => {
    if (/^\d?$/.test(text)) {
      // only allow single digit number or empty
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);
      if (text && index < 5) {
        inputs[index + 1].current.focus();
      }
    }
  };

  // Handle backspace to focus previous input
  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputs[index - 1].current.focus();
    }
  };

  // Combine code digits for verification
  const verificationCode = code.join("");

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/(auth)/forgetPassword")}
      >
        <Ionicons name="chevron-back" size={24} color="white" />
      </TouchableOpacity>

      <Text
        style={[
          styles.inputHeader,
          { color: theme.colors.textDark, fontSize: 16, fontWeight: "bold" },
        ]}
      >
        Input the 6 Digit Recovery Code
      </Text>

      <View style={styles.codeInputContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={inputs[index]}
            style={[
              styles.codeInput,
              {
                borderColor: theme.colors.primary,
                color: theme.colors.textDark,
              },
            ]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            autoFocus={index === 0}
            textAlign="center"
          />
        ))}
      </View>

      <Button
        title="Verify"
        GradientComponent={BlueGradient}
        HasShadow={true}
        buttonStyle={{
          marginVertical: 10,
          color: theme.colors.textDark,
          width: 320,
          height: 50,
          borderColor: "black",
          borderWidth: 2,
        }}
        textStyle={{
          color: theme.colors.textDark,
          fontSize: 20,
          fontWeight: "bold",
        }}
        onPress={() => {
          // Add verification logic here
          if (verificationCode.length === 6) {
            // Proceed to next step or show success
            router.push("/(auth)/ResetPassword");
          } else {
            alert("Please enter the 6-digit code");
          }
        }}
      />

      <TouchableOpacity
        onPress={() => alert("Resend code functionality coming soon")}
      >
        <Text style={[styles.resendText, { color: theme.colors.primary }]}>
          Resend code
        </Text>
      </TouchableOpacity>

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

export default RecoveryCode;

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
  inputHeader: {
    fontSize: 16,
    marginBottom: 48,
    textAlign: "center",
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 140,
  },
  codeInput: {
    width: 40,
    height: 50,
    borderWidth: 2,
    borderRadius: 8,
    fontSize: 24,
    paddingHorizontal: 0,
  },
  resendText: {
    marginTop: 20,
    fontWeight: "600",
  },
  loginText: {
    marginTop: 130,
    fontWeight: "600",
  },
});
