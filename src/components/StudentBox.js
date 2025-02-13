import { Text, Image, View, TouchableNativeFeedback } from "react-native";
import styles from "../styles/take_attendance";
import colors from "../../config/colors";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const StudentBox = ({ item, setPresentStudents, presentStudents }) => {
  const [present, setPresent] = useState(false);

  useEffect(() => {
    if (presentStudents.includes(item.id)) {
      setPresent(true); // Default is checked
    } else {
      setPresent(false);
    }
  }, [presentStudents, item.id]);

  const handelClick = () => {
    if (present) {
      setPresent(false);
      setPresentStudents(presentStudents.filter((id) => id !== item.id));
    } else {
      setPresent(true);
      setPresentStudents([...presentStudents, item.id]);
    }
  };

  // Handle Base64 image or fallback
  const defaultImage = require("../../assets/student.webp"); // Fallback image
  const imageSource = item.base64profile
    ? { uri: `data:image/jpeg;base64,${item.base64profile}` } // Convert Base64 to image
    : defaultImage;

  return (
    <TouchableNativeFeedback onPress={handelClick}>
      <View style={styles.student}>
        <View
          style={[
            styles.box,
            {
              backgroundColor: present ? colors.green : colors.red,
            },
          ]}
        />
        <View style={styles.imageContainer}>
          {/* Render the image */}
          <Image source={imageSource} style={styles.image} />
        </View>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.roll}>Roll No. {item.roll_no}</Text>
        </View>

        <View style={styles.icon}>
          {present ? (
            <FontAwesomeIcon
              size={22}
              icon={faCheckCircle}
              color={colors.green}
            />
          ) : (
            <FontAwesomeIcon
              size={22}
              icon={faTimesCircle}
              color={colors.red}
            />
          )}
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

export default StudentBox;
