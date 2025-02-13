import { FrappeApp } from "frappe-js-sdk";
import * as FileSystem from "expo-file-system";

// Initialize FrappeApp instance
const frappe = new FrappeApp("https://alummah.awami.in/");
const call = frappe.call();

// Helper for API calls
const makeApiCall = async (endpoint, payload = {}) => {
  try {
    const response = await call.post(endpoint, payload);
    console.log("API Response:", response);
    if (response && response.message) {
      return response.message; // Ensure response structure
    } else {
      throw new Error("Data is missing in the response.");
    }
  } catch (error) {
    console.error(`Error in API call to ${endpoint}:`, error);
    throw error;
  }
};

export const resetPassword = async (params) => {
  const response = await call.post("frappe.core.doctype.user.user.reset_password", params);
  console.log("API Response:", response._server_messages);
  return response; // Return the entire response
};

export const getStudentDetails = async (params) => {
  return makeApiCall("school.al_ummah.api2.get_student_app_data", params);
};
export const getDivisions = async (params) => {
  return makeApiCall("school.al_ummah.api2.get_divisions", params);
};

export const sendOtp = async (params) => {
  return makeApiCall("school.al_ummah.api2.send_otp", params);
};
export const verifyOtp = async (params) => {
  return makeApiCall("school.al_ummah.api2.verify_otp_and_register", params);
};


export const addGurdianToStudent = async (params) => {
  return makeApiCall("school.al_ummah.api2.add_guardian_to_student", params);
};

// Fetch attendance records
export const fetchAttendanceRecords = async (params) => {
  return makeApiCall("school.al_ummah.api2.get_student_attendance_records", params);
};
export const fetchNoticeRecords = async (params) => {
  return makeApiCall("school.al_ummah.api2.get_notice_list", params);
};

export const getLeaveApplications = async (params) => {
  return makeApiCall("school.al_ummah.api2.get_leave_application_list", params);
};

// Fetch student record
export const fetchStudentRecord = async (params) => {
  return makeApiCall("school.al_ummah.api2.get_student_app_data", params);
};

// File path for attendance data
const attendanceDataFilePath = `${FileSystem.documentDirectory}attendance_data.json`;

// Delete attendance data file
export const deleteAttendanceDataFile = async () => {
  try {
    const fileExists = await FileSystem.getInfoAsync(attendanceDataFilePath);
    if (fileExists.exists) {
      await FileSystem.deleteAsync(attendanceDataFilePath);
      console.log("Attendance data file deleted successfully.");
    } else {
      console.log("Attendance data file does not exist.");
    }
  } catch (error) {
    console.error("Error deleting attendance data file:", error);
  }
};
