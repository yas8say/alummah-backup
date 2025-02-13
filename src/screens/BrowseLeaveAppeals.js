import React, { useEffect, useState } from "react";
import { FlatList, LogBox, Text, SafeAreaView, ActivityIndicator } from "react-native";
import LeaveAppealItem from "../components/LeaveAppealItem";
import styles from "../styles/leave_appeal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLeaveApplications } from "../utils/apiUtils";

const BrowseLeaveAppeals = ({ navigation }) => {
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leave applications using the API
  const fetchLeaveApplications = async () => {
    try {
      const group = await AsyncStorage.getItem("selected_student_group");
      if (!group) {
        console.error("No student group found in AsyncStorage");
        setLoading(false);
        return;
      }

      const params = { student_group: group };
      const apiData = await getLeaveApplications(params);

      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        setAppeals(apiData);
        await AsyncStorage.setItem("leave_data", JSON.stringify(apiData));
      } else {
        await loadLeaveDataFromStorage();
      }
    } catch (error) {
      console.error("Error fetching leave applications:", error);
      await loadLeaveDataFromStorage();
    } finally {
      setLoading(false);
    }
  };

  // Load leave data from AsyncStorage if API fails
  const loadLeaveDataFromStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem("leave_data");
      if (storedData) {
        setAppeals(JSON.parse(storedData) || []);
      }
    } catch (error) {
      console.error("Error loading leave data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveApplications();
    LogBox.ignoreLogs(["Setting a timer"]);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color="#000" />
      </SafeAreaView>
    );
  }

  if (appeals.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No leave applications found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={appeals}
        renderItem={({ item }) => (
          <LeaveAppealItem
            id={item.student}
            student={item.student}
            from_date={item.from_date}
            to_date={item.to_date}
            total_leave_days={item.total_leave_days}
            student_name={item.student_name}
            reason={item.reason}
            name={item.name}
            document_base64={item.document_base64}
            status={item.status || ""}
            onPress={() => navigation.navigate("LeaveInfo", { leaveApplication: item })}
          />
        )}
        keyExtractor={(item, index) => `${item.student}_${index}`}
        ListEmptyComponent={<Text>No leave applications found</Text>}
      />
    </SafeAreaView>
  );
};

export default BrowseLeaveAppeals;
