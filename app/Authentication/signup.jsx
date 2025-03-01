import axios from "axios";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { API_URL } from "@env";
 
export default function SignupScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegistration = async () => {
    if (!username) {
      Toast.show({
        type: "error",
        text1: "Missing Username",
        text2: "Please enter your username.",
        position: "top",
      });
      return;
    }

    if (!email) {
      Toast.show({
        type: "error",
        text1: "Missing email",
        text2: "Please enter your email.",
        position: "top",
      });
      return;
    }
    if (!password) {
      Toast.show({
        type: "error",
        text1: "Missing password",
        text2: "Please enter your password.",
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/register`, {
        username,
        email,
        password,
      });

      Toast.show({
        type: "success",
        text1: "You have registered check your email address",
        text2: "Welcome to MyHome2U!",
        position: "top",
      });

      navigation.navigate("index");
    } catch (error) {
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
      <Text style={styles.title}>Create an Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        placeholderTextColor="#7A7A7A"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#7A7A7A"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#7A7A7A"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.signupButton}
        onPress={handleRegistration}
        disabled={loading}  
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" /> 
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("login")}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
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
  signupButton: {
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
  loginText: {
    fontSize: 14,
    color: "#4C8492",
    marginTop: 10,
  },
});
