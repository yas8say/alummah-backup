import React, { useCallback } from "react";
import {
  useFonts,
  Poppins_800ExtraBold,
  Poppins_100Thin,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";
import Login from "../components/Login";

function Loginparent({ navigation }) {
  let [fontsLoaded] = useFonts({
    Poppins_800ExtraBold,
    Poppins_500Medium,
    Poppins_100Thin,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    SplashScreen.preventAutoHideAsync();
    return null;
  }

  return (
    <Login
      navigation={navigation}
      role="parent"
      navv="Parenthome"
      onLayout={onLayoutRootView}
    />
  );
}

export default Loginparent;