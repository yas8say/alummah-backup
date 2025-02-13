import { FrappeApp } from "frappe-js-sdk";
import AttendanceModal from "../components/AttendanceModal";
import { ScrollView, SafeAreaView, View, Text, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import styles from "../styles/take_attendance";
import StudentBox from "../components/StudentBox";
import { faAngleDoubleRight, faTimes, faSync } from "@fortawesome/free-solid-svg-icons";
import colors from "../../config/colors";
import Button from "../components/Button";
import { fetchAttendanceRecords } from "../utils/apiUtils"; // Remove deleteAttendanceDataFile

const frappe = new FrappeApp("https://alummah.awami.in/");
const call = frappe.call();

const Attendance = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [presentStudents, setPresentStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  // Load user details from AsyncStorage
  const loadUserDetails = async () => {
    try {
      const userDetailsData = await AsyncStorage.getItem("user_details");
      if (userDetailsData) {
        const parsedUserDetails = JSON.parse(userDetailsData);
        setUserDetails(parsedUserDetails);
      } else {
        console.log("User details not found in AsyncStorage.");
      }
    } catch (error) {
      console.error("Error loading user details:", error);
    }
  };

  // Load attendance data from AsyncStorage
  const loadAttendanceData = async () => {
    setLoading(true);
    try {
      const attendanceData = await AsyncStorage.getItem("attendance_data");
      if (attendanceData) {
        const parsedData = JSON.parse(attendanceData);
        const studentData = parsedData?.attendance || [];

        if (studentData.length > 0) {
          setStudents(studentData);
          setPresentStudents(studentData.map((student) => student.student));
          console.log("Loaded attendance data from AsyncStorage.");
        } else {
          console.log("Attendance data is empty. Fetching from API...");
          await fetchAndSaveAttendanceData(true);
        }
      } else {
        console.log("Attendance data not found in AsyncStorage. Fetching from API...");
        await fetchAndSaveAttendanceData(true);
      }
    } catch (error) {
      console.error("Error loading attendance data:", error);
      Alert.alert("Error", "Failed to load attendance data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance data from API and save to AsyncStorage
  const fetchAndSaveAttendanceData = async (isRetry = false) => {
    try {
      const group = await AsyncStorage.getItem("selected_student_group"); // Get selected student group
      if (!group) {
        Alert.alert("Error", "Student group information is missing.");
        return;
      }
      console.log(group)

      const params = {
        based_on: "Batch",
        student_group: group, // Use the selected student group
      };

      const attendanceRecords = await fetchAttendanceRecords(params);

      if (!attendanceRecords || attendanceRecords.length === 0) {
        console.log("No attendance data found from API.");

        if (isRetry) {
          Alert.alert("No Data", "No attendance records found for the selected class.");
        }

        setStudents([]);
        return;
      }

      // Save attendance data to AsyncStorage
      await AsyncStorage.setItem("attendance_data", JSON.stringify({ attendance: attendanceRecords }));
      console.log("Attendance data saved successfully.");

      setStudents(attendanceRecords);
      setPresentStudents(attendanceRecords.map((student) => student.student));
    } catch (error) {
      console.error("Error fetching and saving attendance data:", error);
      Alert.alert("Error", "Failed to fetch attendance data.");
    }
  };

  useEffect(() => {
    loadUserDetails();
  }, []);

  useEffect(() => {
    if (userDetails) {
      loadAttendanceData();
    }
  }, [userDetails]);

  const handleSubmitAttendance = async () => {
    const studentsPresent = students
      .filter((student) => presentStudents.includes(student.student))
      .map((student) => ({
        student: student.student,
        student_name: student.student_name,
        group_roll_number: student.group_roll_number,
        disabled: false,
        checked: true,
      }));

    const studentsAbsent = students
      .filter((student) => !presentStudents.includes(student.student))
      .map((student) => ({
        student: student.student,
        student_name: student.student_name,
        group_roll_number: student.group_roll_number,
        disabled: false,
        checked: false,
      }));

    const formattedDate = new Date().toISOString().split("T")[0];

    Alert.alert(
      "Update Attendance?",
      `Present: ${studentsPresent.length} \nAbsent: ${studentsAbsent.length}`,
      [
        {
          text: "Yes",
          onPress: async () => {
            const group = await AsyncStorage.getItem("selected_student_group"); // Get selected student group
            const updatedFields = {
              students_present: JSON.stringify(studentsPresent),
              students_absent: JSON.stringify(studentsAbsent),
              student_group: group, // Use the selected student group
              date: formattedDate,
            };

            try {
              const result = await call.post(
                "school.al_ummah.api2.mark_attendance",
                updatedFields
              );

              const serverMessages = JSON.parse(result._server_messages);
              const successMessage = JSON.parse(serverMessages[0]);

              if (successMessage.message === "Attendance has been marked successfully.") {
                Alert.alert("Success", successMessage.message);
                navigation.navigate("Teacherhome");
              } else {
                Alert.alert("Error", "There was an issue marking attendance.");
              }
            } catch (error) {
              console.error("Error marking attendance:", error);
              Alert.alert("Error", "There was an issue with the API request.");
            }
          },
        },
        {
          text: "No",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : students && students.length > 0 ? (
          students.map((student) => (
            <StudentBox
              key={student.student}
              setPresentStudents={setPresentStudents}
              presentStudents={presentStudents}
              item={{
                id: student.student,
                name: student.student_name,
                roll_no: student.group_roll_number,
                base64profile: student.base64profile, // Pass the Base64 profile image
              }}
            />
          ))
        ) : (
          <Text>No students available</Text>
        )}

        <View style={styles.buttons}>
          <Button
            onPress={() => navigation.navigate("Teacherhome")}
            text="Cancel"
            icon={faTimes}
            color={colors.red}
            styles={styles}
          />
          <Button
            onPress={() => handleSubmitAttendance()}
            text="Next"
            icon={faAngleDoubleRight}
            color={colors.primary}
            styles={styles}
          />
          <Button
            onPress={() => fetchAndSaveAttendanceData()}
            text="Refresh"
            icon={faSync}
            color={colors.primary}
            styles={styles}
          />
        </View>
      </ScrollView>

      <AttendanceModal
        handleSubmit={handleSubmitAttendance}
        presentStudents={presentStudents}
        visible={showModal}
        setShowModal={setShowModal}
        allStudentsId={students.map((student) => student.student)}
      />
    </SafeAreaView>
  );
};

export default Attendance;