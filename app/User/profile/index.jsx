import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import useUserAuth from "@/myStore/userAuth";

export default function UserProfile() {
  const user = useUserAuth((state) => state.user);
  const logoutUser = useUserAuth((state) => state.logoutUser);
  const navigation = useNavigation();
  const [profilePic, setProfilePic] = useState(
    user?.avatar || "https://via.placeholder.com/150"
  );

  const handleLogout = async () => {
    await logoutUser();
    navigation.replace("Authentication");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F7F7F9",
        alignItems: "center",
        paddingTop: 40,
      }}
    >
      <View
        style={{
          width: "90%",
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 20,
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <TouchableOpacity >
          <Image
            source={{ uri: profilePic }}
            style={{
              width: 110,
              height: 110,
              borderRadius: 55,
              borderWidth: 4,
              borderColor: "#F47C48",
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#1A3B5D",
            marginTop: 12,
          }}
        >
          {user?.username || "User's Name"}
        </Text>
        <Text style={{ fontSize: 16, color: "#7A7A7A", marginTop: 5 }}>
          {user?.email || "N/A"}
        </Text>

        {/* Additional Details - Redesigned */}
        <View
          style={{
            width: "100%",
            backgroundColor: "#1A3B5D",
            padding: 15,
            borderRadius: 12,
            marginTop: 15,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#F7F7F9",
              marginBottom: 5,
            }}
          >
            User Details
          </Text>

          <View
            style={{
              backgroundColor: "#F7F7F9",
              borderRadius: 8,
              padding: 10,
              paddingHorizontal: 15,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#1A3B5D" }}>
              Role:{" "}
              <Text style={{ fontWeight: "400", color: "#333" }}>
                {user?.role || "N/A"}
              </Text>
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#1A3B5D",
                marginTop: 5,
              }}
            >
              Mobile:{" "}
              <Text style={{ fontWeight: "400", color: "#333" }}>
                {user?.mobile || "N/A"}
              </Text>
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#1A3B5D",
                marginTop: 5,
              }}
            >
              Joined:{" "}
              <Text style={{ fontWeight: "400", color: "#333" }}>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </Text>
            </Text>
          </View>
        </View>

         <View style={{ marginTop: 20, width: "100%" }}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#F47C48",
              padding: 12,
              borderRadius: 8,
              justifyContent: "center",
            }}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <MaterialIcons name="edit" size={22} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 16, marginLeft: 10 }}>
              Edit Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#E74C3C",
              padding: 12,
              borderRadius: 8,
              justifyContent: "center",
              marginTop: 10,
            }}
            onPress={handleLogout}
          >
            <AntDesign name="logout" size={22} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 16, marginLeft: 10 }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
