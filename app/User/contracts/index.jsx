import useUserAuth from '@/myStore/userAuth';
import axios from "axios";
import { API_URL } from "@env";
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

const UserContractPage = () => {
  const [userContracts, setUserContracts] = useState([]);
  const [loading, setLoading] = useState(false);  
  const user = useUserAuth((state) => state.user);

  const getOwnerContracts = useCallback(async () => {
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

  useEffect(() => {
    getOwnerContracts();
  }, [getOwnerContracts]);

  return (
    <ScrollView style={styles.container}>
      {loading ? (  
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1A3B5D" />
          <Text style={styles.loadingText}>Loading contracts...</Text>
        </View>
      ) : userContracts.length === 0 ? (
        <View style={styles.noContractsContainer}>
          <Text style={styles.noContractsText}>No contracts found</Text>
        </View>
      ) : (
        userContracts.map((contract) => {
          const { property, startDate, endDate, status, owner } = contract;
          return (
            <View key={contract._id} style={styles.card}>
              <Text style={styles.title}>{property.title}</Text>
              <Text style={styles.text}>
                Contract Period: {new Date(startDate).toDateString()} - {new Date(endDate).toDateString()}
              </Text>

              {property.houseType === 'Buy' ? (
                <>
                  <Text style={styles.text}>Price: ${property.price}</Text>
                  <Text style={styles.text}>Status: {property.status}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.text}>Monthly Rent: ${property.price}</Text>
                </>
              )}

              <Text style={styles.text}>
                Owner: {owner.username || 'N/A'} | Phone: {owner.mobile || 'N/A'} | Email:{' '}
                <Text style={styles.link}>{owner.email || 'N/A'}</Text>
              </Text>

              <View style={styles.statusBadge}>
                <Text
                  style={[ 
                    styles.statusText, 
                    status === 'Active' && styles.active, 
                    status === 'Pending' && styles.pending, 
                    status === 'Cancelled' && styles.cancelled 
                  ]}
                >
                  {status}
                </Text>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7F7F9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A3B5D',
    marginTop: 10,
  },
  noContractsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  noContractsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6347', 
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A3B5D',
  },
  text: {
    fontSize: 14,
    color: '#7A7A7A',
    marginTop: 8,
  },
  link: {
    color: '#4C8492',
    textDecorationLine: 'underline',
  },
  statusBadge: {
    marginTop: 16,
  },
  statusText: {
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    textAlign: 'center',
  },
  active: {
    backgroundColor: '#27AE60',  
    color: 'white',
  },
  pending: {
    backgroundColor: '#F47C48',  
    color: 'white',
  },
  cancelled: {
    backgroundColor: '#E74C3C',  
    color: 'white',
  },
});

export default UserContractPage;
