import useUserAuth from "@/myStore/userAuth";
import axios from "axios";
import { API_URL } from "@env";
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "expo-router";

const UserContractPage = () => {
  const navigation = useNavigation();
  const [userContracts, setUserContracts] = useState([]);
  const [userBills, setUserBills] = useState([]);
  const [userInvoices, setUserInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useUserAuth((state) => state.user);
  const isFocused = useIsFocused();
  const [activeTab, setActiveTab] = useState("Contracts");

  const getUserBills = useCallback(async () => {
    if (!user || !user._id) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/bill`);
      const unpaidBill = response.data.data.filter(
        (bill) =>
          bill.status !== "Paid" && bill.user && bill.user._id === user._id
      );
      setUserBills(unpaidBill);
    } catch (error) {
      setError("Failed to fetch bills.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getUserContracts = useCallback(async () => {
    if (!user || !user._id) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/contracts/usercontract/${user._id}`
      );
      setUserContracts(response.data.contracts);
    } catch (error) {
      setUserContracts([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getUserInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/bill`);
      const filteredPayments = response.data.data.filter(
        (payment) =>
          payment.user &&
          payment.user._id === user?._id &&
          payment.status === "Paid"
      );
      setUserInvoices(filteredPayments);
    } catch (error) {
      setError("Failed to fetch invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getUserContracts();
      getUserBills();
      getUserInvoices();
    }
  }, [isFocused, getUserContracts, getUserBills]);

  const renderContractItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.property.title}</Text>
      <Text style={styles.text}>
        Contract Period: {new Date(item.startDate).toDateString()} -{" "}
        {new Date(item.endDate).toDateString()}
      </Text>
      {item.property.houseType === "Buy" ? (
        <Text style={styles.text}>Price: ${item.property.price}</Text>
      ) : (
        <Text style={styles.text}>Monthly Rent: ${item.property.price}</Text>
      )}
      <Text style={styles.text}>
        Owner: {item.owner.username || "N/A"} | Phone:{" "}
        {item.owner.mobile || "N/A"}
      </Text>
      <View style={styles.statusBadge}>
        <Text style={[styles.statusText, styles[item.status.toLowerCase()]]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  const renderBillItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Bill Due: ${item.amount}</Text>
      <Text style={styles.text}>Status: {item.status}</Text>
      <Text style={styles.text}>
        Due Date: {new Date(item.dueDate).toDateString()}
      </Text>
      <TouchableOpacity
        style={styles.payNowButton}
        onPress={() =>
          navigation.navigate("payNow", {
            paymentId: item._id,
          })
        }
      >
        <Text style={styles.payNowButtonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );

  const renderInvoiceItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Paid Invoice: ${item.amount}</Text>
      <Text style={styles.text}>Status: {item.status}</Text>
      <Text style={styles.text}>
        Paid Date: {new Date(item.paymentDate).toDateString()}
      </Text>
      <TouchableOpacity
      style={styles.payNowButton}
      onPress={() =>
        navigation.navigate("invoice", {
          invoiceId: item._id,
        })
      }
    >
      <Text style={styles.payNowButtonText}>view Invoice</Text>
    </TouchableOpacity>
    </View>
  );


  return (
    <View style={styles.container}>
       <View style={styles.tabContainer}>
        {["Contracts", "Pending Bills", "Paid Invoices"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

       {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1A3B5D" />
        </View>
      ) : (
        <FlatList
          data={
            activeTab === "Contracts"
              ? userContracts
              : activeTab === "Pending Bills"
              ? userBills
              : userInvoices
          }
          renderItem={
            activeTab === "Contracts"
              ? renderContractItem
              : activeTab === "Pending Bills"
              ? renderBillItem
              : renderInvoiceItem
          }
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            <Text style={styles.noDataText}>
              No {activeTab.toLowerCase()} found
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F9", 
    padding: 16,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20, 
    backgroundColor: "#E0E0E0", 
  },
  activeTab: {
    backgroundColor: "#1A3B5D", 
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7A7A7A", 
  },
  activeTabText: {
    color: "#fff",
  },
  card: {
   backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A3B5D",
  },
  text: {
    fontSize: 14,
    color: "#7A7A7A", 
    marginTop: 8,
  },
  statusBadge: {
    marginTop: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 15,
    fontWeight: "bold",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    textTransform: "capitalize",
  },
  active: {
    backgroundColor: "#27AE60", 
    color: "white",
  },
  pending: {
    backgroundColor: "#F47C48", 
    color: "white",
  },
  cancelled: {
    backgroundColor: "#E74C3C", 
    color: "white",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#7A7A7A", 
    marginTop: 20,
  },
  payNowButton: {
    marginTop: 12,
    backgroundColor: "#1A3B5D", 
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  payNowButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});



export default UserContractPage;
