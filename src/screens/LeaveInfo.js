import React, { useState } from "react";
import { View, Text, SafeAreaView, ScrollView, StyleSheet, Image, Modal, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";

const LeaveInfo = () => {
  const route = useRoute();
  const { leaveApplication } = route.params;
  const { student, student_name, from_date, to_date, total_leave_days, reason, name, document_base64 } = leaveApplication;
  const [isModalVisible, setIsModalVisible] = useState(false);

  if (!leaveApplication) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No leave application data available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.detailBox}>
          <Text style={styles.title}>Leave Information</Text>
          <Text style={styles.detailText}>Student ID: {student}</Text>
          <Text style={styles.detailText}>Student Name: {student_name}</Text>
          <Text style={styles.detailText}>From Date: {from_date}</Text>
          <Text style={styles.detailText}>To Date: {to_date}</Text>
          <Text style={styles.detailText}>Total Leave Days: {total_leave_days}</Text>
          <Text style={styles.detailText}>Reason: {reason}</Text>
          <Text style={styles.detailText}>ID: {name}</Text>

          {document_base64 && (
            <View style={styles.documentBox}>
              <Text style={styles.subTitle}>Attached Document:</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <Image
                  source={{
                    uri: document_base64.startsWith("data:image")
                      ? document_base64
                      : `data:image/jpeg;base64,${document_base64}`,
                  }}
                  style={styles.documentImage}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal for enlarged image */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: `data:image/jpeg;base64,${document_base64}` }}
            style={styles.modalImage}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingBottom: 20,
  },
  detailBox: {
    backgroundColor: "#f4f4f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  documentBox: {
    marginTop: 10,
    alignItems: "center",
  },
  documentImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalImage: {
    width: 300,
    height: 300,
    borderRadius: 8,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 5,
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default LeaveInfo;
