import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView } from "react-native";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { sendOtp, verifyOtp, getDivisions } from "../utils/apiUtils";
import styles from "../styles/login";
import Icon from "react-native-vector-icons/MaterialIcons"; // Ensure this library is installed
import { Picker } from '@react-native-picker/picker';
import FontAwesome from "react-native-vector-icons/FontAwesome"; // Import FontAwesome

const Signup = ({ navigation, role, title, token = "" }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [otpAutoFill, setOtpAutoFill] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [addedDivisions, setAddedDivisions] = useState([]); // State to store added divisions

  useEffect(() => {
    const timer = setTimeout(() => {
      setOtpAutoFill("123456"); // Mock OTP
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const fetchDivisions = async (selectedClass) => {
    if (!selectedClass) {
      alert("Please select a program first.");
      return;
    }

    try {
      const response = await getDivisions({ program: selectedClass });
      setDivisions(response);
    } catch (error) {
      console.error("Error fetching divisions:", error);
    }
  };

  const handleSendOtp = async (values, { setSubmitting }) => {
    try {
      const response = await sendOtp({ phone: values.phone, email: values.email, token: values.token, role });

      console.log("API Response:", response); // Debugging

      if (response && response.success) {  // Ensure response contains success: true
        setClasses(response.classes || []); // Store classes in state (if available)
        Alert.alert("Success", "OTP sent successfully.");
        setCurrentStep(2);  // Move to step 2 only if success is true
      } else {
        Alert.alert("Error", response?.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Send OTP Error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (values, { setSubmitting }) => {
    try {
      const { email, fullName, phone, otp, password, token } = values;

      console.log({
        email,
        fullName,
        phone,
        otp,
        password,
        role,
        addedDivisions, // Send the list of added divisions
        token,
      });

      const response = await verifyOtp({
        email,
        fullName,
        phone,
        otp,
        password,
        role,
        addedDivisions, // Pass the list of added divisions
        token,
      });

      if (response) {
        Alert.alert("Success", "OTP verified and account created!");
        setCurrentStep(1); // Reset form or navigate away
      }
    } catch (error) {
      Alert.alert("Error", "Failed to verify OTP. Please try again.");
    } finally {
      setSubmitting(false); // Ensure isSubmitting is set to false
    }
  };

  const StepOneSchema = Yup.object().shape({
    token: Yup.string().required("Token is required"),
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
  });

  const StepTwoSchema = Yup.object().shape({
    otp: Yup.string().length(6, "OTP must be 6 digits").required("OTP is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={[styles.container, { flex: 1 }]}>
        <Text style={styles.head}>{title} Signup</Text>

        {/* Role-Specific Image Section */}
        <View style={styles.Box}>
          {role === "parent" && (
            <Image
              style={styles.img}
              source={require("../../assets/parent.png")}
            />
          )}
          {role === "teacher" && (
            <Image
              style={styles.img}
              resizeMode="contain"
              source={require("../../assets/teacher.png")}
            />
          )}
        </View>

        <Formik
          initialValues={{
            fullName: "",
            email: "",
            phone: "",
            otp: otpAutoFill,
            password: "",
            confirmPassword: "",
            selectedClass: null,
            selectedDivision: selectedDivision,
            token: token,
          }}
          validationSchema={currentStep === 1 ? StepOneSchema : StepTwoSchema}
          onSubmit={(values, actions) => {
            if (currentStep === 1) {
              handleSendOtp(values, actions);
            } else if (currentStep === 2) {
              setCurrentStep(3);
            } else if (currentStep === 3) {
              // Pass the addedDivisions list to handleVerifyOtp
              handleVerifyOtp({ ...values, addedDivisions }, actions);
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <View style={styles.inpbox}>
              {/* Full Name */}
              {currentStep === 1 && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter token"
                    onChangeText={handleChange("token")}
                    onBlur={handleBlur("token")}
                    value={values.token}
                  />
                  {touched.token && errors.token && (
                    <Text style={styles.error}>{errors.token}</Text>
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    onChangeText={handleChange("fullName")}
                    onBlur={handleBlur("fullName")}
                    value={values.fullName}
                  />
                  {touched.fullName && errors.fullName && (
                    <Text style={styles.error}>{errors.fullName}</Text>
                  )}

                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.error}>{errors.email}</Text>
                  )}

                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    keyboardType="number-pad"
                    onChangeText={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                    value={values.phone}
                  />
                  {touched.phone && errors.phone && (
                    <Text style={styles.error}>{errors.phone}</Text>
                  )}
                </>
              )}

              {/* OTP, Password, and Division for step 2 */}
              {currentStep === 2 && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="OTP"
                    keyboardType="number-pad"
                    onChangeText={handleChange("otp")}
                    onBlur={handleBlur("otp")}
                    value={values.otp}
                  />
                  {touched.otp && errors.otp && <Text style={styles.error}>{errors.otp}</Text>}

                  {/* Password Field */}
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      secureTextEntry={!passwordVisible}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                      <Icon name={passwordVisible ? "visibility-off" : "visibility"} size={24} color="gray" />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

                  {/* Confirm Password Field */}
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm Password"
                      secureTextEntry={!confirmPasswordVisible}
                      onChangeText={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      value={values.confirmPassword}
                    />
                    <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
                      <Icon name={confirmPasswordVisible ? "visibility-off" : "visibility"} size={24} color="gray" />
                    </TouchableOpacity>
                  </View>
                  {touched.confirmPassword && errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}
                </>
              )}

              {/* Step 3: Select Class and Division for Teachers */}
              {currentStep === 3 && role === "teacher" && classes.length > 0 && (
                <View style={styles.whiteCard}>
                  <Text style={styles.cardTitle}>Select Class & Division:</Text>
                  <Picker
                    selectedValue={values.selectedClass}
                    onValueChange={(itemValue) => {
                      handleChange("selectedClass")(itemValue);
                      fetchDivisions(itemValue);
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select a Program" value={null} />
                    {classes.map((classItem, index) => (
                      <Picker.Item key={index} label={classItem.name} value={classItem.name} />
                    ))}
                  </Picker>

                  <Picker
                    selectedValue={values.selectedDivision}
                    onValueChange={(itemValue) => {
                      handleChange("selectedDivision")(itemValue);
                      setSelectedDivision(itemValue);
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select a Division" value={null} />
                    {divisions.map((div, index) => (
                      <Picker.Item key={index} label={div.name} value={div.name} />
                    ))}
                  </Picker>

                  <TouchableOpacity
                    style={styles.dbutton}
                    onPress={() => {
                      if (values.selectedDivision) {
                        setAddedDivisions([...addedDivisions, values.selectedDivision]);
                      }
                    }}
                  >
                    <Text style={styles.btn}>Add Division</Text>
                  </TouchableOpacity>

                  <View style={styles.divisionsList}>
                    {addedDivisions.map((division, index) => (
                      <View key={index} style={styles.divisionItem}>
                        <Text style={styles.divisionText}>{division}</Text>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => {
                            const updatedDivisions = addedDivisions.filter((_, i) => i !== index);
                            setAddedDivisions(updatedDivisions);
                          }}
                        >
                          <FontAwesome name="trash" size={20} color="#ff4444" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              
              <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          // disabled={isSubmitting} // Disable button when isSubmitting is true
        >
          <Text style={styles.btn}>
            {currentStep === 1 ? "Submit" : currentStep === 2 ? "Next" : "Submit"}
          </Text>
        </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default Signup;