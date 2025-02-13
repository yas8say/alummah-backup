import React, { useState, useEffect } from "react";
import Loginparent from "./src/screens/Loginparent";
import Loginteacher from "./src/screens/Loginteacher";
import Welcome from "./src/screens/Welcome";
import colors from "./config/colors";
import Teacherhome from "./src/screens/Teacherhome";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Takeattendance from "./src/screens/TakeAttendance";
import Parenthome from "./src/screens/Parenthome";
import CreateNotice from "./src/screens/CreateNotice";
import PreviousNotices from "./src/screens/PreviousNotices";
import LeaveAppeals from "./src/screens/BrowseLeaveAppeals";
import AppealLeave from "./src/screens/AppealLeave";
import AttendanceRecord from "./src/screens/AttendanceRecord";
import * as SecureStore from "expo-secure-store";
import Attendanceinfo from "./src/screens/Attendanceinfo";
import Attendanceinfo2 from "./src/screens/AttendanceInfo2";
import LeaveInfo from "./src/screens/LeaveInfo";  // Import LeaveInfo
import NoticeInfo from "./src/screens/NoticeInfo";
import TeacherSignup from "./src/screens/TeacherSignup";
import ParentSignup from "./src/screens/ParentSignup";
import AddGuardianScreen from "./src/screens/AddGuardianScreen";
import { Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ForgotPassword from "./src/screens/ForgotPassword";
import OTPLogin from "./src/screens/OTPLogin";


import {
  useFonts,
  Poppins_800ExtraBold,
  Poppins_100Thin,
  Poppins_500Medium,
  Poppins_400Regular,
  Poppins_300Light,
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";

// Import the NotificationContext
import { NotificationProvider } from './src/context/NotificationContext'; 
import SignInScreen from "./src/screens/SignInScreen";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ["alummah://", "https://al-ummah.vercel.app"],
  config: {
    screens: {
      TeacherSignup: {
        path: "teacher-signup/:token", 
        parse: {
          token: (token) => token,  // Ensure token is properly parsed
        },
      },
    },
  },
};


export default function App() {
  const [date, setDate] = useState(null);
  const [defaultScreen, setDefaultScreen] = useState("Welcome");

  const getToken = async () => {
    const token = await SecureStore.getItemAsync("user");
    if (token) {
      console.log(token);
      const role = JSON.parse(token).role;
      if (role === "parent") {
        setDefaultScreen("Parenthome");
      } else {
        setDefaultScreen("Teacherhome");
      }
    }
  };

  useEffect(() => {
    getToken();
    const today = new Date();
    const currentDate =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      today.getDate().toString().padStart(2, "0");
    setDate(currentDate);
  }, []);

  let [fontsLoaded] = useFonts({
    Poppins_800ExtraBold,
    Poppins_500Medium,
    Poppins_100Thin,
    Poppins_400Regular,
    Poppins_300Light,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // While fonts are loading, render nothing or a placeholder.
  }

  return (
    // Wrap your entire app with NotificationProvider
    <NotificationProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator initialRouteName={defaultScreen}>
          <Stack.Screen
            name="Attendance"
            component={Takeattendance}
            options={{
              title: "Attendance: " + date,
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: colors.white,
            }}
          />
          <>
            <Stack.Screen
              name="Welcome"
              component={Welcome}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Loginp"
              component={Loginparent}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Logint"
              component={Loginteacher}
              options={{
                headerShown: false,
              }}
            />
          </>
          <Stack.Screen
            name="Teacherhome"
            component={Teacherhome}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Parenthome"
            component={Parenthome}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AttendanceRecord" // Update to PascalCase
            component={AttendanceRecord}
            options={{
              title: "AttendanceRecord",
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: colors.white,
            }}
          />
          <Stack.Screen
            name="CreateNotice"
            component={CreateNotice}
            options={{
              title: "Create Notice",
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: colors.white,
            }}
          />
          <Stack.Screen
            name="PreviousNotices"
            component={PreviousNotices}
            options={{
              title: "Previous Notices",
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: colors.white,
            }}
          />
          <Stack.Screen
            name="BrowseLeaveAppeals"
            component={LeaveAppeals}
            options={{
              title: "Leave Appeals",
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: colors.white,
            }}
          />
          <Stack.Screen
            name="AppealLeave"
            component={AppealLeave}
            options={{
              title: "Appeal leave",
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: colors.white,
            }}
          />
        <Stack.Screen name="TeacherSignup" component={TeacherSignup} />
          <Stack.Screen 
          name="ParentSignup" 
          component={ParentSignup} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="OTPLogin" component={OTPLogin} />
        <Stack.Screen name="SignInScreen" component={SignInScreen} />


          {/* <Stack.Screen 
          name="ForgotPassword" 
          component={ParentSignup} 
          options={{ headerShown: false }} 
        /> */}
          <Stack.Screen
            name="LeaveInfo"  // Add the LeaveInfo screen
            component={LeaveInfo}
            options={{
              title: "Leave Info",
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: colors.white,
            }}
          />
          <Stack.Screen
            name="Studentinfo"
            component={Attendanceinfo}
            options={{
              title: "",
              headerTransparent: true,
              headerTintColor: colors.white,
            }}
          />
            <Stack.Screen
            name="Studentinfo2"
            component={Attendanceinfo2}
            options={{
              title: "",
              headerTransparent: true,
              headerTintColor: colors.white,
            }}
          />
          <Stack.Screen name="AddGuardian" component={AddGuardianScreen} />
        <Stack.Screen
          name="NoticeInfo"
          component={NoticeInfo}
          options={{
            title: "Notice Details",
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: colors.white,
          }}
        />
        </Stack.Navigator>
      </NavigationContainer>
    </NotificationProvider>
  );
}