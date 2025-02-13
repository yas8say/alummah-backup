import { Text, Image, View, TouchableOpacity } from "react-native";
import styles from "../styles/take_attendance";
import colors from "../../config/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

const RecordListItem = ({ student, navigation }) => {
  const {
    student_name,
    base64profile,
    group_roll_number,
    status,
    student: studentId,
  } = student;

  console.log("Student details:", student); // Log student for debugging

  const handleClick = () => {
    navigation.navigate("Studentinfo", {
      student: student,
    });
  };

  // Determine the image source
  const defaultImage = require("../../assets/student.webp");
  const imageSource = base64profile
    ? { uri: `data:image/jpeg;base64,${base64profile}` }
    : defaultImage;

  return (
    <TouchableOpacity onPress={handleClick}>
      <View style={styles.student}>
        <View
          style={[
            styles.box,
            {
              backgroundColor: colors.primary,
            },
          ]}
        />
        <View style={styles.imageContainer}>
          {/* Display Base64 profile image or fallback */}
          <Image source={imageSource} style={styles.image} />
        </View>
        <View>
          <Text style={styles.name}>{student_name}</Text>
          <Text style={styles.roll}>Roll No: {group_roll_number}</Text>
          <Text style={styles.status}>Status: {status}</Text>
          {/* Ensure all text content is inside <Text> */}
        </View>

        <View style={styles.icon}>
          <FontAwesomeIcon
            size={22}
            icon={faAngleRight}
            color={colors.primary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecordListItem;
