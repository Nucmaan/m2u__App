import axios from "axios";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { API_URL } from "@env";
import Toast from "react-native-toast-message";
import { setLocalStorage } from "@/myStore/storage";
import useUserAuth from "@/myStore/userAuth";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUser = useUserAuth((state) => state.loginUser); 

  const handleLogin = async () => {
    if (!username) {
      Toast.show({
        type: "error",
        text1: "Missing Username",
        text2: "Please enter your username.",
        position: "top",
      });
      return;
    }

    if (!password) {
      Toast.show({
        type: "error",
        text1: "Missing Password",
        text2: "Please enter your password.",
        position: "top",
      });
      return;
    }
    try {
      setLoading(true);
      //console.log(API_URL);
      const response = await axios.post(`${API_URL}/api/login`, {
        username,
        password,
      });

      if (response.status === 200) {

        const userData = response.data.user;
        loginUser(userData);

        await setLocalStorage("userInfo", response.data.user);

        Toast.show({
          type: "success",
          text1: "Login Successful!",
          text2: "Welcome to MyHome2U!",
          position: "top",
        });

        navigation.replace("User");
      }

      navigation.navigate("index");
    } catch (error) {
      console.log(
        error.response?.data?.message || "An unexpected error occurred."
      );
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2:
          error.response?.data?.message || "Something went wrong. Try again.",
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to MyHome2U</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        placeholderTextColor="#7A7A7A"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#7A7A7A"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />


       <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" /> 
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("signup")}>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F9",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A3B5D",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333333",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: "#1A3B5D",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerText: {
    fontSize: 14,
    color: "#4C8492",
    marginTop: 10,
  },
});
