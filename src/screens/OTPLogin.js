import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { OTPWidget } from "@msg91comm/sendotp-react-native";
import { jwtDecode } from "jwt-decode";

const widgetId = "35626468366d333833333535"; // Replace with your actual widget ID
const tokenAuth = "440500TXWDRKARZN67a1d9c1P1"; // Replace with your actual MSG91 Auth Token

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [reqId, setReqId] = useState(null); // Stores request ID for OTP verification

  // Initialize MSG91 OTP Widget
  useEffect(() => {
    OTPWidget.initializeWidget(widgetId, tokenAuth);
  }, []);

  // Send OTP using MSG91
  const sendOTP = async () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Please enter a valid phone number.");
      return;
    }
  
    try {
      const response = await OTPWidget.sendOTP({ identifier: phoneNumber });
      console.log("OTP Sent Response:", response);
  
      if (response && response.message) {  // MSG91 stores reqId in "message"
        setReqId(response.message);
        Alert.alert("OTP Sent", "Check your phone for the OTP.");
      } else {
        Alert.alert("Error", "Failed to send OTP. Try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "Failed to send OTP.");
    }
  };



  const confirmOTP = async () => {
    if (!otp || !reqId) {
      Alert.alert("Error", "Please enter the OTP.");
      return;
    }
  
    console.log("🟢 Checking reqId before verifying OTP...");
    console.log("Stored reqId for verification:", reqId);
    console.log("Entered OTP:", otp);
  
    try {
      const response = await OTPWidget.verifyOTP({ reqId: String(reqId), otp: String(otp) });
  
      console.log("🔴 OTP Verification Response:", response);
  
      if (response && response.message) {
        try {
            const decoded = jwtDecode(response.message);
            console.log("🔑 Decoded JWT Token:", decoded);
  
          if (decoded && decoded.requestId === reqId) {
            Alert.alert("✅ Success", "You are logged in!");
          } else {
            Alert.alert("❌ Error", "Verification failed. Invalid token.");
          }
        } catch (error) {
          console.error("❌ JWT Decoding Error:", error);
          Alert.alert("Error", "Failed to decode response.");
        }
      } else {
        Alert.alert("Error", `Verification failed: ${response.message}`);
      }
    } catch (error) {
      console.error("❌ Invalid code:", error);
      Alert.alert("Error", "Invalid OTP.");
    }
  };
  
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MSG91 OTP Authentication</Text>

      {/* Phone Number Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter phone number (with country code)"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TouchableOpacity onPress={sendOTP} style={styles.button}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>

      {/* OTP Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
      />

      <TouchableOpacity onPress={confirmOTP} style={styles.button}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#BEBDB8",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#841584",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

