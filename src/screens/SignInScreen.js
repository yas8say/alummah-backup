import React, { useEffect } from "react";
import { View, Button, Alert } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as SecureStore from "expo-secure-store";
import * as AuthSession from "expo-auth-session";

const GOOGLE_CLIENT_ID_ANDROID = "619580422153-fl0tkv9iuc2ioehfm7dvd9ihdfqfn11r.apps.googleusercontent.com"; // From Google Cloud
const GOOGLE_CLIENT_ID_WEB = "619580422153-c8lf1jjspda18oqhi5m0ab81m1aopme9.apps.googleusercontent.com"; // Web Client ID for backend verification

export default function SignInScreen() {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_CLIENT_ID_ANDROID, // Use Android Client ID
    webClientId: GOOGLE_CLIENT_ID_WEB, // Web Client ID (for verification)
  });

//   const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
//     clientId: "YOUR_WEB_CLIENT_ID",
//     redirectUri: AuthSession.makeRedirectUri({ scheme: "alummah" })
//   });
        n   
  useEffect(() => {
    if (response?.type === "success") {
      verifyTokenOnBackend(response.params.id_token);
    }
  }, [response]);

  async function verifyTokenOnBackend(idToken) {
    try {
      const res = await fetch("https://your-frappe-backend.com/api/method/auth.verify_google_token", {
        method: "POST",
             body: JSON.stringify({ id_token: idToken }),
      });

      const data = await res.json();

      if (data.success) {
        Alert.alert("Welcome!", `Logged in as ${data.user.email}`);
        await SecureStore.setItemAsync("userToken", data.session_token);
      } else {
        Alert.alert("Authentication Failed", data.error);
      }
    } catch (error) {
      console.error("Error verifying token:", error);
    }
  }

  return (
    <View>
      <Button title="Sign in with Google" disabled={!request} onPress={() => promptAsync()} />
    </View>
  );
}
