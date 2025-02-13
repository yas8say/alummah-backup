import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import PropTypes from "prop-types";
import styles from "../styles/leave_appeal";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import colors from "../../config/colors";
import Icon from "./LeaveAppealIcon";
import { useNavigation } from "@react-navigation/native";
import { FrappeApp } from "frappe-js-sdk"; // Import Frappe SDK

const LeaveAppealItem = ({
  student,
  from_date,
  to_date,
  total_leave_days,
  student_name,
  reason,
  name,
  document_base64,
  status,
}) => {
  const [appealStatus, setAppealStatus] = useState(status);
  const navigation = useNavigation();

  // Initialize FrappeApp
  const frappe = new FrappeApp("https://alummah.awami.in/");
  const call = frappe.call();

  // Function to send leave appeal data to Frappe backend
  const sendToFrappeBackend = async (status) => {
    try {
      const updatedFields = {
        name,
        // student_group: "FIRST-A",
        // student,
        // student_name,
        // from_date,
        // to_date,
        status: status, // Add the status
      };

      const result = await call.get("school.al_ummah.api2.update_leave_status", updatedFields);
      console.log("API Response:", result);
      Alert.alert("Success", "Leave appeal updated successfully.");
    } catch (error) {
      console.error("Error sending data to API:", error);
      Alert.alert("Error", "Failed to update leave appeal.");
    }
  };

  // Handle when user presses approve or reject
  const handleAppealStatusChange = (newStatus) => {
    setAppealStatus(newStatus); // Update the appeal status
    sendToFrappeBackend(newStatus); // Send updated data to backend
  };

  const handlePress = () => {
    console.log("Navigating to LeaveInfo with leaveId:", student);
    navigation.navigate("LeaveInfo", { leaveApplication: { student, from_date, to_date, total_leave_days, student_name, status, reason, name, document_base64 } }); // Pass data directly
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.box}>
        <View style={styles.header}>
        <Image source={require("../../assets/student.webp")} style={styles.image} />

          <View style={styles.headerInfo}>
            <Text style={styles.name}>{student_name}</Text>
            <Text style={styles.date}>
              From: {from_date} - To: {to_date}
            </Text>
          </View>
        </View>
        <View style={styles.body}>
          <Text style={styles.bodyText}>Total Leave Days: {total_leave_days}</Text>
          {appealStatus ? (
            <Text
              style={[
                styles.statusText,
                {
                  color: appealStatus === "approved" ? colors.green : colors.red,
                },
              ]}
            >
              {appealStatus}
            </Text>
          ) : (
            <View style={styles.iconContainer}>
              <Icon
                icon={faTimes}
                onPress={() => handleAppealStatusChange("rejected")}
                color={{ dark: colors.red, light: colors.lightRed }}
              />
              <Icon
                icon={faCheck}
                onPress={() => handleAppealStatusChange("approved")}
                color={{ dark: colors.green, light: colors.lightGreen }}
              />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

LeaveAppealItem.propTypes = {
  student: PropTypes.string.isRequired,
  from_date: PropTypes.string.isRequired,
  to_date: PropTypes.string.isRequired,
  total_leave_days: PropTypes.number.isRequired,
  student_name: PropTypes.string.isRequired,
  reason: PropTypes.string,
  name: PropTypes.string.isRequired,
  document_base64: PropTypes.string,
  status: PropTypes.string,
};

export default LeaveAppealItem;
