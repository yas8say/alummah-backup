import React, { useEffect, useState } from "react";
import { ScrollView, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as SecureStore from "expo-secure-store"; // For retrieving role from SecureStore
import * as FileSystem from "expo-file-system"; // For file system operations

const noticeDataFilePath = `${FileSystem.documentDirectory}notices_data.json`; // Path to the file

const NoticeInfo = ({ route, navigation }) => {
  const { notice, onDelete } = route.params;
  const [role, setRole] = useState(null); // State to hold the user's role

  // Fetch user role from SecureStore
  const getRoleFromSecureStore = async () => {
    try {
      const userDetails = await SecureStore.getItemAsync("user");
      if (userDetails) {
        const parsedUserDetails = JSON.parse(userDetails);
        setRole(parsedUserDetails.role); // Set the role from SecureStore
      }
    } catch (error) {
      console.error("Error fetching role from SecureStore:", error);
    }
  };

  useEffect(() => {
    getRoleFromSecureStore(); // Fetch the role when the component mounts
  }, []);

  const handleDelete = async () => {
    try {
      if (onDelete && notice.name) {
        console.log("Deleting notice with name:", notice.name);
        await onDelete(notice.name); // Call the delete function passed from PreviousNotices
        navigation.goBack(); // Go back after successful deletion
      } else {
        console.log("Delete handler or notice name is missing");
      }
    } catch (error) {
      console.error("Error deleting notice:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{notice.notice_heading || "No Title"}</Text>
      <Text style={styles.date}>{notice.date || "No Date"}</Text>
      <Text style={styles.message}>{notice.notice_message || "No Message"}</Text>

      {/* Conditionally render the delete button if role is "teacher" */}
      {role === "teacher" && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    lineHeight: 24,
  },
  deleteButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#FF6347", // Red color for delete
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default NoticeInfo;
