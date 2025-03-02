import axios from "axios"; 
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import useUserAuth from "@/myStore/userAuth";
import Toast from "react-native-toast-message";
import { useNavigation } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { API_URL } from "@env";

export default function EditProfile() {
  const user = useUserAuth((state) => state.user);

  const [username, setUsername] = useState(user.username);
  const [email] = useState(user.email);
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState(user.mobile || "");

  const [image, setImage] = useState(user?.avatar);
  const [imageType, setImageType] = useState("");
  const [imageName, setImageName] = useState("");

  const [loading, setLoading] = useState(false);

  const updateUser = useUserAuth((state) => state.updateUser);

  const navigation = useNavigation();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const uriParts = asset.uri.split(".");
      const fileType = uriParts[uriParts.length - 1];

      setImage(asset.uri);
      setImageType(asset.mimeType || `image/${fileType}`); // Ensure proper MIME type
      setImageName(asset.fileName || `avatar.${fileType}`); // Ensure file name exists
    }
  };


const handleSaveChanges = async () => {
  console.log("Save changes clicked");

  const formData = new FormData();
  formData.append("id", user._id);
  if (username) formData.append("username", username);
  if (password) formData.append("password", password);
  if (mobile) formData.append("mobile", mobile);

  if (image && image !== user.avatar) {
    formData.append("avatar", {
      uri: image,
      type: imageType || "image/jpeg", // Ensure correct MIME type
      name: imageName || `avatar-${Date.now()}.jpg`, // Default file name
    });
  }

   for (let pair of formData._parts) {
    console.log(pair);
  }

  try {
    setLoading(true);
    const response = await axios.put(`${API_URL}/api/user`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    if (response.status === 201) {
      updateUser(response.data.userInfo);
      Toast.show({
        type: "success",
        text1: "Your account has been updated successfully",
        position: "top",
      });
      navigation.replace("index");
    }
  } catch (error) {
    console.log(error);
    Toast.show({
      type: "error",
      text1: "Error",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f5f5f5" }}>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{ uri: image }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 4,
              borderColor: "#f47c48",
              marginBottom: 10,
            }}
          />
        </TouchableOpacity>
      </View>

      <TextInput
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          paddingHorizontal: 15,
          paddingVertical: 10,
          marginBottom: 15,
          borderWidth: 1,
          borderColor: "#ddd",
          fontSize: 16,
          color: "#333",
        }}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          paddingHorizontal: 15,
          paddingVertical: 10,
          marginBottom: 15,
          borderWidth: 1,
          borderColor: "#ddd",
        }}
      >
        <TextInput
          style={{ fontSize: 16, color: "#777", paddingTop: 5 }}
          editable={false}
          value={email}
        />
      </View>

      <TextInput
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          paddingHorizontal: 15,
          paddingVertical: 10,
          marginBottom: 15,
          borderWidth: 1,
          borderColor: "#ddd",
          fontSize: 16,
          color: "#333",
        }}
        placeholder="Mobile"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />

      <TextInput
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          paddingHorizontal: 15,
          paddingVertical: 10,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: "#ddd",
          fontSize: 16,
          color: "#333",
        }}
        placeholder="New Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#f47c48",
          paddingVertical: 15,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={handleSaveChanges}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            {
              loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                "Save Changes"
              )
            }
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
