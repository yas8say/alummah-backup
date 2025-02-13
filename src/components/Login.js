import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import ForgotPasswordModal from "./ForgotPasswordModel";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import styles from "../styles/login";
import { FrappeApp } from "frappe-js-sdk";
import { Linking } from 'react-native';  // Import Linking
import { clearAllData } from "../utils/utils"; // Adjust the path as necessary
import Icon from 'react-native-vector-icons/MaterialIcons';  // Import icon library
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const frappe = new FrappeApp("https://alummah.awami.in/");
const call = frappe.call();

const logAsyncStorageData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    if (data !== null) {
      console.log(`Data for key "${key}":`, JSON.parse(data));
    } else {
      console.log(`No data found for key "${key}"`);
    }
  } catch (error) {
    console.error("Error retrieving data from AsyncStorage:", error);
  }
};

const Login = ({ navigation, role }) => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // New state for password visibility

  const save = async (key, value) => {
    await SecureStore.setItemAsync(key, value);
  };

  // Register for push notifications
  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Permission Denied", "Push notifications permission is required.");
      return null;
    }

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync();
      return tokenData.data;
    } catch (error) {
      console.error("Failed to get push token:", error);
      return null;
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Empty fields", "Please fill out all fields", [
        { text: "Cancel" },
        { text: "OK" },
      ]);
      return;
    }
  
    try {
      await clearAllData(); 
      console.log(role);
      const auth = frappe.auth();
      await auth.loginWithUsernamePassword({ username, password });
  
      const loggedInUser = await auth.getLoggedInUser();
  
      const searchParams = { username: loggedInUser, role: role};
      const userRolesResponse = await call.get(
        "school.al_ummah.api2.get_user_details",
        searchParams
      );
  
      const roles = userRolesResponse.message.roles || [];
      console.log("User Roles:", userRolesResponse.message.user_details);
  
      let userRole = null;
      if (role === "parent" && roles.includes("Guardian")) {
        userRole = "parent";
      } else if (role === "teacher" && roles.includes("Instructor")) {
        userRole = "teacher";
      }
  
      if (!userRole) {
        Alert.alert(
          "Access Denied",
          "The selected role does not match your assigned roles. Please contact support."
        );
        return;
      }
  
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token);
  
      if (token) {
        const updatedFields = { device_id: token };
        await call.post("school.al_ummah.api2.register_device", updatedFields);
      }
  
      const userDetails = {
        username: loggedInUser,
        role: userRole,
        pushToken: token,
      };
  
      // Save `user_details` to AsyncStorage
      const userDetailsData = JSON.stringify(userRolesResponse.message.user_details);
      console.log(userRolesResponse.message.user_details)
      await AsyncStorage.setItem('user_details', userDetailsData);
      console.log("User details saved to AsyncStorage");
  
      // Log the saved data to the console
      await logAsyncStorageData('user_details');
  
      await save("user", JSON.stringify(userDetails));
  
      navigation.reset({
        index: 0,
        routes: [
          { name: userRole === "parent" ? "Parenthome" : "Teacherhome" },
        ],
      });
    } catch (error) {
      console.error("Login failed:", error);
      Alert.alert("Login Failed", "Invalid username or password", [
        { text: "OK" },
      ]);
    }
  };
  

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <SafeAreaView>
          <View style={styles.Box}>
            {role == "parent" && (
              <Image
                style={styles.img}
                source={require("../../assets/parent.png")}
              />
            )}
            {role == "teacher" && (
              <Image
                style={styles.img}
                resizeMode="contain"
                source={require("../../assets/teacher.png")}
              />
            )}
          </View>
          <Text style={styles.head}>Login as a {role}</Text>
          <View style={styles.inpbox}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              onChangeText={setUsername}
              value={username}
              autoCapitalize="none"
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                secureTextEntry={!passwordVisible} // Toggle password visibility
                placeholder="Password"
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                <Icon name={passwordVisible ? "visibility-off" : "visibility"} size={24} color="gray" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.btn}>Sign in</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword", { role: "teacher" })}>
              <Text style={styles.forgot}>Forgot password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("OTPLogin")}>
              <Text style={styles.btn}>Login with OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("SignInScreen")}>
              <Text style={styles.btn}>Login with Google</Text>
            </TouchableOpacity>

            {/* Add Signup link below login */}
            <TouchableOpacity
            onPress={() =>
              role === "teacher"
                ? navigation.navigate("TeacherSignup", { role: "teacher" })
                : navigation.navigate("ParentSignup", { role: "parent" })
            }
          >
            <Text style={styles.signupText}>Don't have an account? Sign up here</Text>
          </TouchableOpacity>
          

          </View>

          <ForgotPasswordModal
            visible={showModal}
            setShowModal={setShowModal}
          />
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;