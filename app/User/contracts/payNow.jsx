import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { API_URL } from "@env";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useNavigation } from "expo-router";

export default function PayNow() {
  
    const navigation = useNavigation();
  
  const route = useRoute();
  const { paymentId } = route.params;
  const [billInfo, setBillInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchBillInfo = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/bill/${paymentId}`);
      setBillInfo(data.data);
    } catch (error) {
      console.error("Error fetching bill info:", error);
    }
  }, [paymentId]);

  const handlePayBill = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/api/bill/paynow/${paymentId}`, {
        amount: billInfo.amount,
        comment: "Bill paid",
      });

      if (response.status === 200) {
        navigation.replace("index");
        Toast.show({
          type: "success",
          text1: response.data.message,
          position: "top",
        });
        fetchBillInfo();
      } else {
        Toast.show({
          type: "error",
          text1: response.data.message,
          position: "top",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error, please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillInfo();
  }, [fetchBillInfo]);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: "#F7F7F9" }}>
       <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#1A3B5D",
            marginBottom: 10,
          }}
        >
          Owner Information
        </Text>
        <Text style={{ fontSize: 16, color: "#333333" }}>Name: {billInfo?.owner?.username}</Text>
        <Text style={{ fontSize: 16, color: "#333333" }}>Email: {billInfo?.owner?.email}</Text>
        <Text style={{ fontSize: 16, color: "#333333" }}>Mobile: {billInfo?.owner?.mobile}</Text>
      </View>

       <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#1A3B5D",
            marginBottom: 10,
          }}
        >
          Payment Information
        </Text>
        <Text style={{ fontSize: 16, color: "#333333" }}>Amount Due: ${billInfo.amount}</Text>
      </View>

       <TouchableOpacity
        style={{
          backgroundColor: "#F47C48",
          paddingVertical: 15,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        }}
        onPress={handlePayBill}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Pay Now
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
