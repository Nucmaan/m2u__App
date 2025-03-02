import { Slot } from "expo-router";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <>
      <Slot />
      <StatusBar
        backgroundColor="#1A3B5D"
      />
      <Toast />
    </>
  );
}
