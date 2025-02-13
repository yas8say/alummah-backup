import { StyleSheet } from "react-native";
import colors from "../../config/colors";

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  head: {
    height: "35%",
    backgroundColor: colors.green,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    alignItems: "center",
  },
  box: {
    height: "80%",
    width: "80%",
    backgroundColor: colors.white,
    marginTop: "25%", // Increased by 20% (previously 5%)
    elevation: 10,
    shadowColor: colors.lightGreen,
    borderRadius: 15,
    alignItems: "center",
    paddingVertical: 20,
  },
  img: {
    height: 90,
    width: 90,
    borderRadius: 50,
  },
  name: {
    marginTop: 10,
    fontFamily: "Poppins_500Medium",
    fontSize: 22,
  },
  class: {
    fontFamily: "Poppins_300Light",
    fontSize: 15,
    color: colors.blue,
    marginTop: -5,
  },
  contactbox: {
    alignItems: "center",
    width: "100%",
    height: 100,
    marginTop: "20%", // Moved down by 20%
  },
  contact: {
    marginTop: 30, // Increased by 20px
    width: "80%",
    height: 100,
    backgroundColor: colors.white,
    elevation: 10,
    shadowColor: colors.lightPrimary,
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  contactItem: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 2,
  },
  txt: {
    fontSize: 16,
    marginLeft: 10,
    fontFamily: "Poppins_500Medium",
    color: colors.lightBlack,
  },
  attendancebox: {
    height: 150,
    width: "80%",
    marginTop: 35, // Increased by 20px
    backgroundColor: colors.white,
    elevation: 10,
    shadowColor: colors.lightPrimary,
    borderRadius: 10,
    paddingVertical: 10,
  },
  headertxt: {
    fontFamily: "Poppins_500Medium",
    fontSize: 22,
    borderBottomColor: colors.lightPrimary,
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  infobox: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10, // Increased by 10px
  },
  databox: {
    alignItems: "center",
    backgroundColor: colors.white,
    height: 80,
    width: 80,
    borderRadius: 10,
    elevation: 25,
    shadowColor: colors.lightGreen,
    justifyContent: "center",
  },
  infotxt: {
    fontFamily: "Poppins_400Regular",
    opacity: 0.6,
    fontSize: 15,
  },
  datatxt: {
    fontFamily: "Poppins_500Medium",
    opacity: 0.7,
    fontSize: 25,
    color: colors.black,
  },
  // Guardian Information Section Styles

  guardianSection: {
    margin: 32,
    width: "85%",
    backgroundColor: colors.white,
    borderRadius: 15,
    elevation: 5,
    padding: 20,
    shadowColor: colors.lightGreen,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  headertxt: {
    fontSize: 22,
    fontFamily: "Poppins_600SemiBold",
    color: colors.black,
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.grey,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
  },
  relationPickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  relation: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: colors.darkGrey,
  },
  picker: {
    width: 150,
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: colors.lightGrey,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.green,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 5,
  },
  submitText: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: "white",
    marginLeft: 8,
  },
  button: {
    marginTop: 20, 
    left: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    width: "50%",
    borderRadius: 40,
    backgroundColor: colors.primary,
    // marginTop: 15, // Added margin for spacing between button and picker
  },
    btn: {
      fontSize: 16,
      color: colors.white,
      fontFamily: "Poppins_500Medium",
    },
    btnContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    
});

export default styles;
