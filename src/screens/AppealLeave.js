import { useState, useEffect } from "react";
import BoxAndButton from "../components/BoxAndButton";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FrappeApp } from "frappe-js-sdk";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import * as FileSystem from 'expo-file-system';


const frappe = new FrappeApp("https://alummah.awami.in/");
const call = frappe.call();

const AppealLeave = () => {
  const [formData, setFormData] = useState({
    from_date: "",
    to_date: "",
    message: "",
    student_group: "",  // Only store the group
    student: "",        // Only store the student ID
  });

  const navigation = useNavigation();

  // Function to load student data from AsyncStorage
  const loadStudentInfo = async () => {
    try {
      const savedStudent = await AsyncStorage.getItem('selected_student');
      const savedStudentGroup = await AsyncStorage.getItem('selected_student_group');

      if (savedStudent && savedStudentGroup) {
        console.log("Student Data:", savedStudent); // Log the student data
        console.log("Group Data:", savedStudentGroup); // Log the group data

        setFormData((prevData) => ({
          ...prevData,
          student: savedStudent,
          student_group: savedStudentGroup,
        }));
      } else {
        Alert.alert("Error", "Student data not found in AsyncStorage.");
      }
    } catch (err) {
      console.error("Error loading student info:", err);
      Alert.alert("Error", "Failed to load student info.");
    }
  };

  useEffect(() => {
    loadStudentInfo(); // Load the student information from AsyncStorage on component mount
  }, []);

  const handleChange = (field, value) => {
    let updatedData = { ...formData, [field]: value };

    const currentDate = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    const fromDate = new Date(updatedData.from_date);
    const toDate = new Date(updatedData.to_date);

    if (field === "to_date" && !updatedData.from_date) {
      Alert.alert("Error", "Please fill in the 'From Date' before selecting the 'To Date'.");
      updatedData.to_date = ""; // Reset the invalid to_date
    } else if (field === "from_date" || field === "to_date") {
      // Check if From Date is in the past
      if (field === "from_date" && value < currentDate) {
        Alert.alert("Error", "From date cannot be in the past");
        updatedData.from_date = ""; // Reset the invalid from_date
      }
      // Check if To Date is before From Date
      else if (field === "to_date" && value < updatedData.from_date) {
        Alert.alert("Error", "To date cannot be before the From date");
        updatedData.to_date = ""; // Reset the invalid to_date
      }
      // Check if To Date is in the past
      else if (field === "to_date" && value < currentDate) {
        Alert.alert("Error", "To date cannot be in the past");
        updatedData.to_date = ""; // Reset the invalid to_date
      }
      // Calculate total days if both dates are valid
      else if (updatedData.from_date && updatedData.to_date && toDate >= fromDate) {
        const diffTime = Math.abs(new Date(toDate) - new Date(fromDate));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include the start day
        updatedData.total_days = diffDays.toString();
      } else {
        updatedData.total_days = ""; // Clear total_days if invalid dates
      }
    }

    setFormData(updatedData);
  };

  const handleSubmit = async () => {
    const { from_date, to_date, student_group, student, image, reason } = formData;

    console.log("Form data before submit:", formData); // Log formData to debug

    try {
      // Convert the image URI to base64
      const imageBase64 = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Use the student data loaded from AsyncStorage
      const updatedFields = {
        student: student,  // Student ID
        from_date,
        to_date,
        student_group: student_group,  // Student group
        reason: reason,
        image: imageBase64, // Send the image as a base64 string
      };

      console.log("Submitting leave application with data:", updatedFields);

      // Call the backend API
      const result = await call.post(
        "school.al_ummah.api2.submit_leave_application",
        updatedFields
      );

      console.log("API response:", result);

      if (result.status === "success") {
        const message = typeof result.message === 'string' ? result.message : JSON.stringify(result.message);
        Alert.alert("Success", message);
        setFormData({
          from_date: "",
          to_date: "",
          student_group: "",
          student: "",
          image: null,  // Reset the image
        });
      } else {
        const message = typeof result.message === 'string' ? result.message : JSON.stringify(result.message);
        Alert.alert("Error", message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "An error occurred while submitting the leave application.");
    }
  };

  return (
    <BoxAndButton
      formData={formData}
      handleChange={handleChange}
      icon={faPaperPlane}
      btnText="Appeal leave"
      handleSubmit={handleSubmit}
    />
  );
};

export default AppealLeave;
