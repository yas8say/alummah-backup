import { StatusBar, StyleSheet, Platform } from "react-native";
import colors from "../../config/colors";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  Box: {
    height: 300,
    width: "100%",
    backgroundColor: colors.loginBackground,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  inpbox: {
    flex: 1,
    marginTop: "10%",
    alignItems: "center",
  },
  img: {
    height: "100%",
    width: "100%",
  },
  head: {
    fontFamily: "Poppins_800ExtraBold",
    fontSize: 32,
    textAlign: "center",
    marginTop: 25,
    color: colors.primary,
  },
  input: {
    backgroundColor: colors.loginBackground,
    color: colors.lightBlack,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 40,
    marginBottom: 20,
    width: "80%",
    fontFamily: "Poppins_400Regular",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    width: "80%",
    borderRadius: 40,
    elevation: 3,
    backgroundColor: colors.primary,
    marginTop: 10, // Added margin for spacing between button and picker
  },
  btn: {
    fontSize: 16,
    color: colors.white,
    fontFamily: "Poppins_500Medium",
  },
  forgot: {
    color: colors.primary,
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    marginTop: 15,
  },
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBox: {
    height: 140,
    width: "90%",
    borderRadius: 15,
    backgroundColor: colors.white,
    padding: 15,
  },
  modalContact: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  modalContactIcon: {
    color: colors.lightBlack,
  },
  modalContactText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: colors.lightBlack,
    marginLeft: 10,
  },
  modalHead: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
    color: colors.black,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    left: 40,
  },
  eyeIcon: {
    position: "absolute",
    left: 280,
    padding: 10,
    bottom: 20,
  },
  whiteCard: {
    backgroundColor: "lightgrey",
    width: "90%",
    height: "110%",
    marginBottom: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginTop: -90,
    alignSelf: "center", // Center the card
  },
  dbutton: {
    left: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    width: "80%",
    borderRadius: 40,
    backgroundColor: colors.primary,
    // marginTop: 15, // Added margin for spacing between button and picker
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 10, 
    fontWeight: "bold",
    textAlign: "center", // Center align the title
  },
  picker: {
    height: 70,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: -20,
    width: "100%", // Ensure picker takes full width
  },
  error: {
    marginTop: -15,
    color: "red",
    fontSize: 12,
    textAlign: "center", // Center align error message
  },
  divisionsList: {
    marginTop: 16,
  },
  divisionItem: {
    flexDirection: "row",
    width: "90%",
    left: 20,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    padding: 1,
    borderRadius: 40,
    marginBottom: 8,
  },
  divisionText: {
    left: 10,
    fontSize: 16,
    color: "#333",
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    color: "#ff4444",
  },
  
});

export default styles;
