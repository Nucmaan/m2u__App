import { Slot } from "expo-router";
import Toast from "react-native-toast-message"; // ✅ Import Toast

export default function RootLayout() {
  return (
    <>
      <Slot />
      <Toast />
    </>
  );
}
