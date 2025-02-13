import { View, Text, Image, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker"; // Picker for dropdown
import styles from "../styles/home";
import NavItem from "../components/NavItem";
import Logout from "../components/Logout";

export default function TeacherHome({ navigation }) {
  const [teacher, setTeacher] = useState({});
  const [loading, setLoading] = useState(true);
  const [studentGroups, setStudentGroups] = useState([]); // Student groups list
  const [selectedGroup, setSelectedGroup] = useState(""); // Selected group

  // Load user details from AsyncStorage
  const loadUserDetails = async () => {
    try {
      const userDetailsData = await AsyncStorage.getItem("user_details");
      if (userDetailsData) {
        const userDetails = JSON.parse(userDetailsData);

        // Update teacher state
        setTeacher({
          name: userDetails.name,
          image: userDetails.base64profile,
        });

        // Set student groups
        if (userDetails.student_groups?.length) {
          setStudentGroups(userDetails.student_groups);
          setSelectedGroup(userDetails.student_groups[0]); // Default to first group
          await AsyncStorage.setItem("selected_student_group", userDetails.student_groups[0]);
        }
      } else {
        Alert.alert("Error", "No user details found.");
      }
    } catch (error) {
      console.error("Error loading user details:", error);
      Alert.alert("Error", "Failed to load user details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserDetails();
  }, []);

  // Handle selection change
  const handleGroupChange = async (group) => {
    setSelectedGroup(group);
    await AsyncStorage.setItem("selected_student_group", group);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.main}>
      {/* Teacher Info */}
      <View style={[styles.container, { height: 175 }]}>
        <View style={styles.infobox}>
          <View style={styles.imgbox}>
            {teacher?.image ? (
              <Image
                style={styles.img}
                source={{ uri: `data:image/jpeg;base64,${teacher.image}` }}
              />
            ) : (
              <Text>No Image Available</Text>
            )}
          </View>
          <View style={styles.basic}>
            <Text style={styles.name}>{teacher?.name || "No Name Available"}</Text>
          </View>
        </View>
      </View>
            {/* Picker for Student Groups */}
            <Picker style={styles.picker}
        selectedValue={selectedGroup}
        onValueChange={handleGroupChange}
      >
        {studentGroups.map((group, index) => (
          <Picker.Item key={index} label={group} value={group} />
        ))}
      </Picker>

      {/* Navigation Items */}
      <View style={{ marginTop: "40%" }}>
        <NavItem
          img={require("../../assets/Create.png")}
          title="Take attendance"
          navigation={navigation}
          path="Attendance"
        />
        <NavItem
          img={require("../../assets/activity.png")}
          title="Attendance Record"
          navigation={navigation}
          path="AttendanceRecord"
        />
        <NavItem
          img={require("../../assets/plus.png")}
          title="Create notice"
          navigation={navigation}
          path="CreateNotice"
        />
        <NavItem
          img={require("../../assets/paper.png")}
          title="Previous notices"
          navigation={navigation}
          path="PreviousNotices"
        />
        <NavItem
          img={require("../../assets/ereader.png")}
          title="Browse leave appeals"
          navigation={navigation}
          path="BrowseLeaveAppeals"
        />
      </View>

      <Logout navigation={navigation} />
    </View>
  );
}
