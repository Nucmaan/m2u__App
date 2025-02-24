import { useNavigation } from "expo-router";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { getLocalStorage } from "@/myStore/storage";

export default function _layout() {
  const navigation = useNavigation();

  useEffect(() => {
    GetUserDetails();
  }, [navigation]);

  const GetUserDetails = async () => {
    const userInfo = await getLocalStorage("userInfo");
    if (userInfo) {
      navigation.replace("User");
    }
  };

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
