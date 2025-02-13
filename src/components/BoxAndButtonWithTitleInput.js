import React from "react";
import { TextInput, TouchableOpacity, Text, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import styles from "../styles/box_and_button"; // Assuming you have a styles file

const BoxAndButtonWithTitleInput = ({
  text,
  setText,
  title,
  setTitle,
  icon,
  btnText,
  handleSubmit,
}) => {
  return (
    <View style={styles.container}>
      {/* Title Input for the notice */}
      <TextInput
        style={[styles.input, { marginBottom: 10, fontSize: 18 }]} // Adjusted margin and font size for title
        placeholder="Enter Notice Title"
        value={title}
        onChangeText={setTitle}
      />

      {/* Text Input for the notice message */}
      <TextInput
        style={[styles.input, { height: 150, marginBottom: 10 }]} // Adjusted size for the notice message box
        placeholder="Enter your notice here"
        value={text}
        onChangeText={setText}
        multiline={true} // Allow multiline input
        numberOfLines={6} // Limit the number of lines (optional)
        textAlignVertical="top" // Ensure the text starts at the top of the input box
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.btnTxt}>{btnText}</Text>
        <FontAwesomeIcon icon={icon} size={20} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

export default BoxAndButtonWithTitleInput;
