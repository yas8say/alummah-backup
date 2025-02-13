import { Text, SafeAreaView } from "react-native";
import styles from "../styles/welcome";
import LoginAs from "../components/LoginAs";

function Welcome({ navigation }) {
  return (
    <SafeAreaView style={styles.maincontainer}>
      <Text style={styles.head}>Login as</Text>
      <LoginAs
        role="A parent"
        image={require("../../assets/parent1.png")}
        onPress={() => navigation.navigate("Loginp", { role: "parent" })}  // or "Logint"
        />
      <LoginAs
        role="A teacher"
        image={require("../../assets/teacher.png")}
        onPress={() => navigation.navigate("Logint", { role: "teacher" })}  // Pass role as parameter
      />
    </SafeAreaView>
  );
}

export default Welcome;
