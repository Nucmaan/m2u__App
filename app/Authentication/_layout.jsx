import { useNavigation } from "expo-router";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import useUserAuth from "@/myStore/userAuth";

export default function _layout() {
  const navigation = useNavigation();
  const [isHydrated, setIsHydrated] = useState(false);
  const user = useUserAuth((state) => state.user);

  useEffect(() => {
    if (user) {

      setIsHydrated(true);
      navigation.replace("User");

    }
  }, [user, navigation]);


  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
