import { FlatList, SafeAreaView, Text, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../../config/colors";
import RecordListItem from "../components/RecordListItem"; // Component to render each student item
import styles from "../styles/take_attendance"; // Import styles
import { fetchAttendanceRecords } from "../utils/apiUtils"; // API utility function

const AttendanceRecord = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const loadSelectedGroup = async () => {
    try {
      const group = await AsyncStorage.getItem("selected_student_group");
      if (group) {
        setSelectedGroup(group);
      }
    } catch (error) {
      console.error("Failed to load selected student group:", error);
    }
  };

  const fetchAttendanceData = async () => {
    if (!selectedGroup) return;

    try {
      const params = {
        based_on: "Student Group",
        student_group: selectedGroup,
      };

      const apiData = await fetchAttendanceRecords(params);
      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        await AsyncStorage.setItem("attendance_data", JSON.stringify(apiData));
        setStudents(apiData);
      }
    } catch (error) {
      console.warn("Failed to fetch data from API. Falling back to local data.");
    }
  };

  const loadAttendanceDataFromStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem("attendance_data");
      if (storedData) {
        setStudents(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to load attendance data from storage:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSelectedGroup();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      loadAttendanceDataFromStorage();
      fetchAttendanceData();
    }
  }, [selectedGroup]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (students.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No students available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={students}
        renderItem={({ item }) => (
          <RecordListItem
            student={item}
            navigation={navigation}
            onPress={() => {
              navigation.navigate("StudentDetails", { studentId: item.student });
            }}
          />
        )}
        keyExtractor={(item) => item.student.toString()} // Ensure unique key
      />
    </SafeAreaView>
  );
};

export default AttendanceRecord;