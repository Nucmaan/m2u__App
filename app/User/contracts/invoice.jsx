import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { API_URL } from "@env";
import axios from "axios";

 const colors = {
  primary: "#1A3B5D",
  secondary: "#4C8492",
  accent: "#F47C48",
  background: "#F7F7F9",
  primaryText: "#333333",
  secondaryText: "#7A7A7A",
  border: "#E0E0E0",
  buttonHover: "#16324A",
  successGreen: "#27AE60",
  warningRed: "#E74C3C",
};

export default function Invoice() {
  const route = useRoute();
  const { invoiceId } = route.params;
  const [invoice, setInvoice] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!invoiceId) return;

    let isMounted = true; 

    const fetchInvoice = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/bill/${invoiceId}`);
        if (isMounted) {
          setInvoice(response.data?.data || {});
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInvoice();

    return () => {
      isMounted = false; 
    };
  }, [invoiceId]);

   if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  return (
    <ScrollView contentContainerStyle={{ backgroundColor: colors.background, padding: 20 }}>
      <View style={{ backgroundColor: "#fff", borderRadius: 10, padding: 15, marginBottom: 20, elevation: 5 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.primaryText }}>Invoice: {invoiceId}</Text>
        <Text style={{ fontSize: 18, fontWeight: "600", color: colors.secondaryText, marginVertical: 10 }}>Invoice Details</Text>

        {/* Owner Details */}
        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 16, color: colors.primaryText, fontWeight: "600" }}>Owner Details</Text>
          <Text style={{ color: colors.primaryText }}>Username: {invoice?.owner?.username || "N/A"}</Text>
          <Text style={{ color: colors.primaryText }}>Email: {invoice?.owner?.email || "N/A"}</Text>
        </View>

         <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 16, color: colors.primaryText, fontWeight: "600" }}>User Details</Text>
          <Text style={{ color: colors.primaryText }}>Username: {invoice?.user?.username || "N/A"}</Text>
          <Text style={{ color: colors.primaryText }}>Email: {invoice?.user?.email || "N/A"}</Text>
        </View>

         <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 16, color: colors.primaryText, fontWeight: "600" }}>Property Details</Text>
          <Text style={{ color: colors.primaryText }}>Price: ${invoice?.property?.price || "N/A"}</Text>
        </View>

         <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 16, color: colors.primaryText, fontWeight: "600" }}>Payment Details</Text>
          <Text style={{ color: colors.primaryText }}>Amount: ${invoice?.amount || "N/A"}</Text>
          <Text style={{ color: colors.primaryText }}>Due Date: {invoice?.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "N/A"}</Text>
          <Text style={{ color: colors.primaryText }}>Payment Date: {invoice?.paymentDate ? new Date(invoice.paymentDate).toLocaleDateString() : "N/A"}</Text>
          <Text style={{ color: colors.primaryText }}>Comment: {invoice?.comment || "N/A"}</Text>
        </View>

         <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.accent,
              paddingVertical: 12,
              borderRadius: 5,
              alignItems: "center",
              marginTop: 10,
            }}
            onPress={() => console.log("Download Invoice")}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Download Invoice</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
