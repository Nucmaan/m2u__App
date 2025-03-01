import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import Toast from "react-native-toast-message";
import useUserAuth from "@/myStore/userAuth";

export default function ContactForm() {
  const user = useUserAuth((state) => state.user);

  const [form, setForm] = useState({
    name: user?.username,
    email: user?.email,
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

   const handleSubmit = async () => {
    if (!form.name || !form.email || !form.subject || !form.message) {
      Toast.show({
        type: "error",
        text1: "Missing fields",
        text2: "Please fill in all required fields.",
        position: "top",
      });
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/sendEmail`, form);

      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: "Message sent successfully!",
          position: "top",
        });
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Something went wrong. Try again.",
        position: "top",
      });
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Get in Touch</Text>

      <TextInput
        style={styles.input}
        placeholder="Your Name"
        placeholderTextColor="#7A7A7A"
        value={form.name}
        onChangeText={(text) => handleChange("name", text)}
        editable={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Your Email"
        placeholderTextColor="#7A7A7A"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
        editable={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Subject"
        placeholderTextColor="#7A7A7A"
        value={form.subject}
        onChangeText={(text) => handleChange("subject", text)}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Your Message"
        placeholderTextColor="#7A7A7A"
        multiline
        numberOfLines={4}
        value={form.message}
        onChangeText={(text) => handleChange("message", text)}
      />

      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Send Message</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F9",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A3B5D",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333333",
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#F47C48",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
