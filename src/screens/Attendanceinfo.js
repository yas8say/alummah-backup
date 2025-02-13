import React from "react";
import { View, Text, Image, Pressable, Button, Linking, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEdit, faPhone, faHome } from "@fortawesome/free-solid-svg-icons";
import colors from "../../config/colors";
import styles from "../styles/student_info"; // Imported styles

const Attendanceinfo = ({ route, navigation }) => {
  const { student } = route.params;
  const {
    student_name,
    student: studentId,
    image,
    present_count,
    absent_count,
    leave_count,
    status,
    group_roll_no,
    mobile,
    address,
  } = student;

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <View style={styles.box}>
          <Image
            style={styles.img}
            source={{
              uri: image || "https://via.placeholder.com/150",
            }}
          />
          <Text style={styles.name}>{student_name}</Text>
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
        <TouchableOpacity 
          style={styles.button}  
          onPress={() =>
            navigation.navigate("AddGuardian", {
              student_id: studentId,
              student_name,
            })
          }
        >
          <View style={styles.btnContent}>
          <Text style={styles.btn}>{"Add Guardian   "}</Text>
            <FontAwesomeIcon icon={faEdit} size={18} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Attendanceinfo;
