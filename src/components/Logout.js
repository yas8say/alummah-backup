import { TouchableOpacity } from "react-native";
import styles from "../styles/logout";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import * as SecureStore from "expo-secure-store";
import { FrappeApp } from "frappe-js-sdk";
import { clearAllData } from "../utils/utils"; // Adjust the path as necessary

// Initialize Frappe SDK instance
const frappe = new FrappeApp("https://alummah.awami.in/");
const call = frappe.call();

const Logout = ({ navigation }) => {
  const logout = async () => {
    try {
      const auth = frappe.auth();
      auth
      .logout()
      .then(() => console.log('Logged out.'))
      .catch((error) => console.error(error));
      // Show immediate navigation to avoid UI being stuck
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });

      const user = await SecureStore.getItemAsync("user");
      if (user) {
        const userDetails = JSON.parse(user);
        const pushToken = userDetails.pushToken;

        if (pushToken) {
          try {
            // Attempt to unregister the device token
            const result = await call.post("school.al_ummah.api2.unregister_device", {
              device_id: pushToken,
            });

            console.log("Device unregistered successfully.");
          } catch (apiError) {
            console.warn("Failed to unregister device token:", apiError);
          }
        }
      }

      // Clear all persistent data
      await clearAllData();

      // Also clear "user" from SecureStore as a fallback
      await SecureStore.deleteItemAsync("user");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={logout}
      style={styles.touchableOpacityStyle}
    >
      <FontAwesomeIcon icon={faSignOutAlt} size={20} color="white" />
    </TouchableOpacity>
  );
};

export default Logout;