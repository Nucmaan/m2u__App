import useUserAuth from "@/myStore/userAuth";
import { Tabs, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function _layout() {
  const navigation = useNavigation();
  const [isHydrated, setIsHydrated] = useState(false);
  const user = useUserAuth((state) => state.user);

  useEffect(() => {
    if (user) {
      setIsHydrated(true);
      if (user?.role !== "User") {
        navigation.replace("Authentication");
      }
    }
  }, [user, navigation]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1A3B5D",
          borderTopWidth: 1,
          borderTopColor: "#E0E0E0",
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: {
            color: "#F47C48",
          },
          tabBarIcon: ({ focused }) => (
            <View>
              {focused ? (
                <Entypo name="home" size={26} color="#F47C48" />
              ) : (
                <AntDesign name="home" size={24} color="#7D7D7D" />
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="bookings"
        options={{
          tabBarLabel: "booking",
          tabBarLabelStyle: {
            color: "#F47C48",
          },
          tabBarIcon: ({ focused }) => (
            <View>
              {focused ? (
                <FontAwesome5
                  name="clipboard-check"
                  size={26}
                  color="#F47C48"
                />
              ) : (
                <FontAwesome5 name="clipboard" size={26} color="#7D7D7D" />
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="contracts"
        options={{
          tabBarLabel: "contracts",
          tabBarLabelStyle: {
            color: "#F47C48",
          },
          tabBarIcon: ({ focused }) => (
            <View>
              {focused ? (
                <MaterialIcons name="bookmark" size={26} color="#F47C48" />
              ) : (
                <MaterialIcons
                  name="bookmark-outline"
                  size={26}
                  color="#7D7D7D"
                />
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "profile",
          tabBarLabelStyle: {
            color: "#F47C48",
          },
          tabBarIcon: ({ focused }) => (
            <View>
              {focused ? (
                <Entypo name="user" size={26} color="#F47C48" />
              ) : (
                <AntDesign name="user" size={26} color="#7D7D7D" />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
