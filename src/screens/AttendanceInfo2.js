import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, Linking, ActivityIndicator } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPhone, faHome } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStudentDetails } from "../utils/apiUtils"; // API function
import colors from "../../config/colors";
import styles from "../styles/student_info2"; // Styles

const Attendanceinfo2 = ({ navigation }) => {
  const [student, setStudent] = useState({});
  const [loading, setLoading] = useState(true);

  // Load the student details from AsyncStorage or API
  const loadStudentDetails = async () => {
    try {
      // Retrieve selected student ID from AsyncStorage
      const studentId = await AsyncStorage.getItem("selected_student");

      if (!studentId) {
        setLoading(false);
        return;
      }

      // Check if student data is already cached in AsyncStorage
      const cachedData = await AsyncStorage.getItem(`student_${studentId}`);
      if (cachedData) {
        // If cached data exists, use it
        setStudent(JSON.parse(cachedData));
        setLoading(false); // Stop loading since we have the cached data
      } else {
        // If no cached data, fetch it from the API and only update AsyncStorage
        await fetchAndUpdateAttendanceData(studentId);
      }
    } catch (error) {
      console.error("Error loading student details:", error);
      setLoading(false);
    }
  };

  // Fetch student details from the API and update AsyncStorage (without state update)
  const fetchAndUpdateAttendanceData = async (studentId) => {
    try {
      const apiData = await getStudentDetails({ studentID: studentId });
      if (apiData) {
        // Save the fetched data to AsyncStorage
        await AsyncStorage.setItem("attendance_data", JSON.stringify(apiData));
        // Optionally, save it under the student-specific key
        await AsyncStorage.setItem(`student_${studentId}`, JSON.stringify(apiData));
        // Re-load the data into the component state
        setStudent(apiData);
      }
    } catch (error) {
      console.error("Error fetching student details from API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentDetails(); // Load student details when component mounts
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  // Extract student details with fallback values
  const {
    name = "Unknown Student",
    image = "https://via.placeholder.com/150",
    present_count = 0,
    absent_count = 0,
    leave_count = 0,
    status = "Not Available",
    group_roll_no = "N/A",
    mobile = "0000000000",
    address = "No Address Available",
  } = student;

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <View style={styles.box}>
          <Image style={styles.img} source={{ uri: image }} />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.class}>Group Roll No. {group_roll_no}</Text>
          <Text style={styles.class}>Today's Attendance: {status}</Text>
        </View>
      </View>

      <View style={styles.contactbox}>
        <View style={styles.contact}>
          <Pressable onPress={() => Linking.openURL(`tel:+91 ${mobile}`)} style={styles.modalContact}>
            <View style={styles.contactItem}>
              <FontAwesomeIcon icon={faPhone} size={20} color={colors.lightBlack} />
              <Text style={styles.txt}>+91 {mobile}</Text>
            </View>
          </Pressable>

          <View style={styles.contactItem}>
            <FontAwesomeIcon icon={faHome} size={20} color={colors.lightBlack} />
            <Text style={styles.txt}>{address}</Text>
          </View>
        </View>

        <View style={styles.attendancebox}>
          <Text style={styles.headertxt}>Attendance</Text>
          <View style={styles.infobox}>
            <View style={styles.databox}>
              <Text style={styles.infotxt}>Present</Text>
              <Text style={styles.datatxt}>{present_count}</Text>
            </View>
            <View style={styles.databox}>
              <Text style={styles.infotxt}>Absent</Text>
              <Text style={styles.datatxt}>{absent_count}</Text>
            </View>
            <View style={styles.databox}>
              <Text style={styles.infotxt}>Leave</Text>
              <Text style={styles.datatxt}>{leave_count}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Attendanceinfo2;
