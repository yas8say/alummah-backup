import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { addGurdianToStudent } from "../utils/apiUtils";
import styles from "../styles/student_info"; // Reuse styles

const AddGuardianScreen = ({ route, navigation }) => {
  const { student_id, student_name } = route.params;
  const [guardianName, setGuardianName] = useState("");
  const [relation, setRelation] = useState("Mother");
  const [phoneNumber, setPhoneNumber] = useState(""); // New state for phone number

  // Validate phone number (10 digits)
  const isValidPhoneNumber = (number) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(number);
  };

  const handleSubmit = async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number.");
      return; // Stop submission if the phone number is invalid
    }

    const params = {
      student_id,
      student_name,
      guardian_name: guardianName,
      relation,
      phone_number: phoneNumber, // Add phone number to params
    };

    try {
      await addGurdianToStudent(params);
      Alert.alert("Success", "Guardian information saved successfully.");
      navigation.goBack(); // Navigate back after submission
    } catch (error) {
      console.error("Error saving guardian information:", error);
      Alert.alert("Error", "Failed to save guardian information.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.guardianSection}>
        <Text style={styles.headertxt}>Add Guardian</Text>

        {/* Guardian Name Input */}
        <TextInput
          style={styles.input}
          placeholder="Guardian Name"
          value={guardianName}
          onChangeText={setGuardianName}
        />

        {/* Phone Number Input */}
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad" // Set keyboard to phone type
        />

        {/* Relation Picker */}
        <View style={styles.relationPickerContainer}>
          <Text style={styles.relation}>Relation:</Text>
          <Picker
            selectedValue={relation}
            onValueChange={setRelation}
            style={styles.picker}
          >
            <Picker.Item label="Mother" value="Mother" />
            <Picker.Item label="Father" value="Father" />
            <Picker.Item label="Others" value="Others" />
          </Picker>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <FontAwesomeIcon icon={faUserPlus} size={18} color="white" />
          <Text style={styles.submitText}> Add Guardian</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddGuardianScreen;
