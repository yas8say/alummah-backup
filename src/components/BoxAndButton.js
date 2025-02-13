import React, { useState } from "react";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Image,
  Alert,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import styles from "../styles/box_and_button";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const BoxAndButton = ({ icon, formData, handleChange, btnText, handleSubmit }) => {
  const [isFromDatePickerVisible, setFromDatePickerVisible] = useState(false);
  const [isToDatePickerVisible, setToDatePickerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const showFromDatePicker = () => setFromDatePickerVisible(true);
  const hideFromDatePicker = () => setFromDatePickerVisible(false);

  const showToDatePicker = () => setToDatePickerVisible(true);
  const hideToDatePicker = () => setToDatePickerVisible(false);

  const handleFromDateConfirm = (date) => {
    handleChange("from_date", date.toISOString().split("T")[0]); // Format as YYYY-MM-DD
    hideFromDatePicker();
  };

  const handleToDateConfirm = (date) => {
    handleChange("to_date", date.toISOString().split("T")[0]); // Format as YYYY-MM-DD
    hideToDatePicker();
  };

  const pickImage = async () => {
    // Request permission to access media library and camera
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
  
    if (!permissionResult.granted || !cameraPermission.granted) {
      Alert.alert("Permission Denied", "You need to allow access to both media library and camera.");
      return;
    }
  
    // Show options for gallery or camera
    Alert.alert("Choose an option", "Select a source", [
      {
        text: "Camera",
        onPress: async () => {
          const cameraResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
          });
          if (!cameraResult.canceled) {
            setSelectedImage(cameraResult.uri); // Save the selected image URI
            handleChange("image", cameraResult.uri); // Update formData with image URI
            console.log("Selected Image URI (Camera):", cameraResult.uri);
          }
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const galleryResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
          });
          if (!galleryResult.canceled) {
            setSelectedImage(galleryResult.assets[0].uri); // Save the selected image URI
            handleChange("image", galleryResult.assets[0].uri); // Update formData with image URI
            console.log("Selected Image URI (Gallery):", galleryResult.assets[0].uri);
          }
        },
      },
    ]);
  };

  const removeImage = () => {
    setSelectedImage(null); // Clear the selected image
    handleChange("image", null); // Clear the image from formData
  };

  return (
    <ScrollView style={styles.container}>
      {/* From Date Picker */}
      <TouchableOpacity onPress={showFromDatePicker}>
        <TextInput
          style={[styles.input, { marginBottom: 10 }]}  // Reduce space between fields
          placeholder="From Date (YYYY-MM-DD)"
          value={formData.from_date}
          editable={false} // Prevent manual input
          pointerEvents="none" // Block input interaction
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isFromDatePickerVisible}
        mode="date"
        onConfirm={handleFromDateConfirm}
        onCancel={hideFromDatePicker}
      />

      {/* To Date Picker */}
      <TouchableOpacity onPress={showToDatePicker}>
        <TextInput
          style={[styles.input, { marginBottom: 0, marginTop: 0 }]}  // Reduce space between fields
          placeholder="To Date (YYYY-MM-DD)"
          value={formData.to_date}
          editable={false} // Prevent manual input
          pointerEvents="none" // Block input interaction
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isToDatePickerVisible}
        mode="date"
        onConfirm={handleToDateConfirm}
        onCancel={hideToDatePicker}
      />

      <TextInput
        style={[styles.input, { height: 100, marginBottom: 5 }]} // Adjust height and margin
        placeholder="Reason for Leave"
        value={formData.reason}
        onChangeText={(value) => handleChange("reason", value)}
        multiline={true} // Allow multiline input
        numberOfLines={4} // Limit the number of lines (optional)
        textAlignVertical="top" // Ensure the text starts at the top of the input box
      />

      {/* Total Days */}
      <TextInput
        style={[styles.input, { marginBottom: 10 }]}  // Reduce space between fields
        placeholder="Total Days"
        keyboardType="numeric"
        value={formData.total_days}
        onChangeText={(value) => handleChange("total_days", value)}
      />

      {/* Image Picker */}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.btnTxt}>Attach Medical Certificate (Optional)</Text>
      </TouchableOpacity>
      
      {selectedImage && (
        <View style={{ marginTop: 10, alignItems: "center" }}>
          <Image
            source={{ uri: selectedImage }}
            style={{ width: 200, height: 200, borderRadius: 10 }}
          />
          {/* Remove Image Button */}
          <TouchableOpacity onPress={removeImage} style={{ marginTop: 10 }}>
            <Text style={{ color: 'red' }}>Remove Image🗑️</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.btnTxt}>{btnText}</Text>
        <FontAwesomeIcon icon={icon} size={20} style={styles.icon} />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BoxAndButton;
