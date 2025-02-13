import React, { useEffect, useState } from "react";
import { FlatList, LogBox, Text, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Notice from "../components/Notice";
import styles from "../styles/previous_notice";
import { useNavigation } from "@react-navigation/native";
import { FrappeApp } from "frappe-js-sdk";
import { fetchNoticeRecords } from "../utils/apiUtils";

// Initialize the frappe app instance
const frappe = new FrappeApp("https://alummah.awami.in/");
const call = frappe.call();

const PreviousNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [studentGroup, setStudentGroup] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false); // To prevent infinite fetch loop

  // Load student group from AsyncStorage
  const loadStudentGroup = async () => {
    try {
      const group = await AsyncStorage.getItem("selected_student_group"); // Get selected student group
      if (group) {
        setStudentGroup(group);
      } else {
        Alert.alert("Error", "Student group information is missing.");
      }
    } catch (error) {
      console.error("Failed to load student group:", error);
    }
  };

  // Fetch notices from the API
  const fetchNoticeData = async () => {
    if (!studentGroup || isDataFetched) return;

    try {
      const params = { student_group: studentGroup };
      const apiData = await fetchNoticeRecords(params);
      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        await AsyncStorage.setItem("notices_data", JSON.stringify({ notices: apiData }));
        setNotices(apiData);
      } else {
        console.warn("API returned no data, using local data.");
        await loadNotices();
      }
    } catch (error) {
      console.warn("API call failed, using local data:", error);
      await loadNotices();
    } finally {
      setIsDataFetched(true); // Prevent further API calls
      setLoading(false);
    }
  };

  // Load notices from AsyncStorage
  const loadNotices = async () => {
    try {
      const storedNotices = await AsyncStorage.getItem("notices_data");
      if (storedNotices) {
        setNotices(JSON.parse(storedNotices).notices || []);
      } else {
        setNotices([]);
      }
    } catch (error) {
      console.error("Error loading notices:", error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await loadStudentGroup();
    };
    initialize();
    LogBox.ignoreLogs(["Setting a timer"]); // Ignore specific log warnings
  }, []);

  useEffect(() => {
    if (studentGroup && !isDataFetched) {
      fetchNoticeData();
    }
  }, [studentGroup, isDataFetched]);

  const handleDeleteNotice = async (noticeId) => {
    try {
      await call.post("school.al_ummah.api2.delete_notice", { name: noticeId });
      await loadNotices(); // Refresh the list of notices after deletion
    } catch (error) {
      console.error("Error deleting notice:", error);
    }
  };

  const handlePress = (item) => {
    navigation.navigate("NoticeInfo", {
      notice: item,
      onDelete: handleDeleteNotice,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={notices}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handlePress(item)}>
          <Notice item={item} />
        </TouchableOpacity>
      )}
      ListEmptyComponent={<Notice item={{ notice_heading: "No Notices Found", date: "", notice_message: "" }} />}
    />
  );
};

export default PreviousNotices;
