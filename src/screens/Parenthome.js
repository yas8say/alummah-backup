import { View, Text, Image, Alert } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/home";
import Logout from "../components/Logout";
import NavItem from "../components/NavItem";
import { Picker } from "@react-native-picker/picker"; // Picker for dropdown

export default function Parenthome({ navigation }) {
  const [student, setStudent] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentGroup, setSelectedStudentGroup] = useState(null);  // For storing student group

  // Load user details from AsyncStorage
  const loadUserDetails = async () => {
    try {
      const userDetailsData = await AsyncStorage.getItem('user_details');
      if (userDetailsData) {
        const parsedUserDetails = JSON.parse(userDetailsData);
        setUserDetails(parsedUserDetails);
        setStudent(parsedUserDetails); // Set student details

        // Also load the previously selected student and group
        const savedStudent = await AsyncStorage.getItem('selected_student');
        const savedStudentGroup = await AsyncStorage.getItem('selected_student_group');
        
        if (savedStudent) {
          setSelectedStudent(savedStudent);
        }
        if (savedStudentGroup) {
          setSelectedStudentGroup(savedStudentGroup);
        }
      } else {
        Alert.alert("Error", "User details not available.");
      }
    } catch (err) {
      console.error("Error loading user details:", err);
      Alert.alert("Error", "Failed to load user details.");
    }
  };

  // Save selected student and group to AsyncStorage
  const saveSelectedStudent = async (studentId, studentGroup) => {
    try {
      await AsyncStorage.setItem('selected_student', studentId);
      await AsyncStorage.setItem('selected_student_group', studentGroup);
      console.log("__________",studentGroup)
      setSelectedStudent(studentId);
      setSelectedStudentGroup(studentGroup);
    } catch (err) {
      console.error("Error saving selected student and group:", err);
      Alert.alert("Error", "Failed to save selected student and group.");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await loadUserDetails(); // Load user details when the component mounts
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    })();
  }, []);

  return (
    <View style={styles.main}>
      <View style={[styles.container, { height: 200 }]}>
        <View style={styles.infobox}>
          <View style={styles.imgbox}>
            {student?.base64profile ? (
              <Image
                style={styles.img}
                source={{ uri: `data:image/jpeg;base64,${student?.base64profile}` }}
              />
            ) : (
              <Text>No Image Available</Text>
            )}
          </View>
          <View style={styles.basic}>
            <Text style={styles.name}>{student?.name || "TEST"}</Text>
            <Text style={styles.address}>{student?.address || "Address not available"}</Text>
          </View>
        </View>
      </View>

      {/* Picker for selecting student */}
      <Picker
        style={styles.picker}
        selectedValue={selectedStudent || (userDetails?.student_list[0]?.student || null)} // Default to the first student if no selection
        onValueChange={(itemValue) => {
          const selectedStudentObj = userDetails?.student_list.find(
            (item) => item.student === itemValue
          );
          const studentGroup = selectedStudentObj?.student_group;

          setSelectedStudent(itemValue);
          setSelectedStudentGroup(studentGroup);
          saveSelectedStudent(itemValue, studentGroup); // Save both student and group
        }}
      >
        {userDetails?.student_list?.map((studentItem) => (
          <Picker.Item
            key={studentItem.student}
            label={studentItem.student_name || "Unnamed Student"}
            value={studentItem.student} // Use the student ID (value)
          />
        ))}
      </Picker>

      <View style={{ marginTop: "40%" }}>
        <NavItem
          img={require("../../assets/activity.png")}
          title="Attendance Record"
          navigation={navigation}
          path="Studentinfo2"
          routeParams={{ student, studentGroup: selectedStudentGroup }} // Pass student and studentGroup
        />
        <NavItem
          img={require("../../assets/paper.png")}
          title="Browse notices"
          navigation={navigation}
          path="PreviousNotices"
        />
        <NavItem
          img={require("../../assets/appeal.png")}
          title="Appeal leave"
          navigation={navigation}
          path="AppealLeave"
        />
      </View>

      <Logout navigation={navigation} />
    </View>
  );
}
