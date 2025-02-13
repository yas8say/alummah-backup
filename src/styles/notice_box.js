import { StyleSheet } from "react-native";
import colors from "../../config/colors";

const styles = StyleSheet.create({
  noticeBox: {
    margin: 15,
    padding: 15,
    backgroundColor: colors.white,
    borderRadius: 10,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trashIcon: {
    position: "absolute",
    top: -15,
    right: -15,
    backgroundColor: colors.white,
    borderRadius: 50,
    padding: 5,
  },
  content: {
    flex: 1,
  },
  date: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: colors.gray,
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    marginVertical: 5,
    color: colors.black,
  },
  message: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: colors.lightBlack,
  },
  checkIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});

export default styles;
