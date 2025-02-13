import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import colors from "../../config/colors";
import { resetPassword } from "../utils/apiUtils";
import { useFonts, Poppins_400Regular, Poppins_500Medium } from "@expo-google-fonts/poppins";
// import styles from "../styles/login";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
  });

  if (!fontsLoaded) {
    return null; // Prevent rendering before fonts are loaded
  }

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }
    try {
      const response = await resetPassword({ user: email });
      const serverMessage = JSON.parse(response._server_messages);
      console.log(serverMessage)
      const message = serverMessage.message || "Check your email for reset instructions.";
      Alert.alert("Success", message);
    } catch (error) {
      Alert.alert("Error", "Failed to send reset email. Please try again.");
    }
  };
  

  return (
    <View style={styles.container}>
    <Text style={styles.head}>Reset your password.</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor={colors.lightBlack}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.btn}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      alignItems: "center",
      //justifyContent: "center",
    },
    input: {
      backgroundColor: colors.loginBackground,
      color: colors.lightBlack,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 40,
      marginBottom: 20,
      width: "80%",
      fontFamily: "Poppins_400Regular",
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      width: "80%",
      borderRadius: 40,
      elevation: 3,
      backgroundColor: colors.primary,
      marginTop: 10,
    },
    btn: {
      fontSize: 16,
      color: colors.white,
      fontFamily: "Poppins_500Medium",
    },
    head: {
    fontFamily: "Poppins_800ExtraBold",
    fontSize: 20,
    textAlign: "center",
    marginTop: 25,
    color: colors.primary,
    },
  });