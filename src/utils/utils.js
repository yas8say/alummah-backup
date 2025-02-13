import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const clearAllData = async () => {
  try {
    // Delete specific keys from SecureStore
    const keysToDelete = ["user", "attendanceData"]; // List the keys you want to clear
    for (const key of keysToDelete) {
      await SecureStore.deleteItemAsync(key);
    }

    // Clear all data from AsyncStorage
    await AsyncStorage.clear();

    console.log("All specified persistent data cleared successfully.");
  } catch (error) {
    console.error("Error clearing persistent data:", error);
  }
};