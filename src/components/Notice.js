import { View, Text } from "react-native";
import styles from "../styles/previous_notice";

const Notice = ({ item }) => {
  // Destructure the properties from the item
  const { name, notice_heading, notice_message, date } = item || {};

  return (
    <View style={styles.box}>
      <Text style={styles.message}>
        {name || "No Message"}
      </Text>
      <Text style={styles.title}>
        {notice_heading || "No Title"}
      </Text>
      <Text style={styles.date}>
        {date || "No Date"}
      </Text>
      <Text style={styles.message}>
        {notice_message || "No Message"}
      </Text>
    </View>
  );
};

export default Notice;
