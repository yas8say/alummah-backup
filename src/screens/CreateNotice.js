import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { FrappeApp } from "frappe-js-sdk";
import BoxAndButtonWithTitleInput from "../components/BoxAndButtonWithTitleInput";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

// Initialize FrappeApp
const frappe = new FrappeApp("https://alummah.awami.in/");
const call = frappe.call();

const CreateNotice = () => {
  const [text, setText] = useState("");
  const [title, setTitle] = useState(""); // For the notice title

  const handleSubmit = async () => {
    if (text.length === 0 || title.length === 0) {
      Alert.alert("Error", "Please enter both title and notice message.");
      return;
    }

    try {
      const group = await AsyncStorage.getItem("selected_student_group"); // Get selected student group
      if (!group) {
        Alert.alert("Error", "Student group information is missing.");
        return;
      }
      console.log(group)

      const updatedFields = { 
        notice_heading: title,  // The notice title
        notice_message: text,   // The message content from the user
        student_group: group,  // Pass the student group from AsyncStorage
      };

      // Send the updatedFields object in the request body
      const result = await call.post("school.al_ummah.api2.submit_notice", updatedFields);

      console.log(result); 
      const responseMessage = result.message?.message || "Unknown error";
      const responseStatus = result.message?.status || "error";
  
      if (responseStatus === "success") {
        Alert.alert("Success", responseMessage);
        setText(""); // Clear the input after submission
        setTitle(""); // Clear the title input
      } else {
        Alert.alert("Error", responseMessage);
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "An error occurred while submitting the notice.");
    }
  };

  return (
    <BoxAndButtonWithTitleInput
      text={text}
      setText={setText}
      title={title}
      setTitle={setTitle}
      icon={faUpload}
      btnText="Publish Notice"
      handleSubmit={handleSubmit}
    />
  );
};

export default CreateNotice;