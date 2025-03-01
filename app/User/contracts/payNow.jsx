import { View, Text } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { API_URL } from "@env";
import axios from "axios";

export default function payNow() {
  const route = useRoute();
  const { paymentId } = route.params;
  const [billInfo, setBillInfo] = useState({});
  const [hello, setHello] = useState(false);

  const fetchBillInfo = useCallback(async () => {
    setHello(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/bill/${paymentId}`);
      setBillInfo(data.data);
    } catch (error) {
      console.error("Error fetching bill info:", error);
    } finally {
      setHello(false);
    }
  }, [paymentId]);

  useEffect(() => {
    fetchBillInfo();
  }, [fetchBillInfo]);

  return (
    <View>
      <Text>payNow ID : {paymentId}</Text>
      <Text>owner Information</Text>
      <Text>Name : {billInfo?.owner?.username}</Text>
      <Text> email : {billInfo?.owner?.email}</Text>
      <Text> Mobile : {billInfo?.owner?.mobile}</Text>
    </View>
  );
}
