import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from 'expo-router';
import axios from "axios";
import { API_URL } from "@env";
import { useIsFocused } from '@react-navigation/native';

export default function Listings() {
  const navigation = useNavigation();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
    const isFocused = useIsFocused();

  const getListings = useCallback(async () => {
    try {
      setIsLoading(true); // Set loading to true before starting the fetch

      const response = await axios.get(`${API_URL}/api/listings`);

      if (!response.data?.Listings) {
        throw new Error("Invalid response from server");
      }

      const validListings = response.data.Listings.filter(
        (listing) =>
          listing.owner !== null &&
          listing.owner.isVerified === true &&
          listing.status === "Available"
      );
      setListings(validListings);
    } catch (error) {
      setListings([]);
    } finally {
      setIsLoading(false); // Set loading to false after fetching
    }
  }, []);
  

  useEffect(() => {
    if (isFocused) { 
      getListings();
    }

  }, [getListings, isFocused]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F7F7F9' }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>All Listings</Text>
      </View>

      {isLoading ? ( 
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1A3B5D" />
        </View>
      ) : (
        <View style={styles.listingContainer}>
          {listings.length === 0 ? (
            <Text style={styles.noPropertyText}>No Properties Available</Text>
          ) : (
            listings.map((listing) => (
              <View style={styles.listingCard} key={listing._id}>
                <Image
                  source={{ uri: listing.images[0] }} 
                  style={styles.propertyImage}
                />
                <View style={styles.propertyInfo}>
                  <Text style={styles.propertyTitle}>{listing.title}</Text>
                  <Text style={styles.propertyDetails}>
                    {listing.city}, {listing.bedrooms} Beds, {listing.bathrooms} Baths
                  </Text>
                  <Text style={styles.propertyPrice}>${listing.price}/month</Text>
                  <Text style={styles.propertyType}>{listing.houseType}</Text>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => navigation.navigate("ViewListing", { listingId: listing._id })}
                  >
                    <Text style={styles.viewButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = {
  header: {
    backgroundColor: '#1A3B5D',
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  listingContainer: {
    margin: 10,
    flexDirection: 'column',
  },
  listingCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  propertyImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  propertyInfo: {
    padding: 10,
    flex: 1,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  propertyDetails: {
    fontSize: 14,
    color: '#7A7A7A',
    marginTop: 5,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 10,
  },
  propertyType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F47C48',
    marginTop: 5,
  },
  viewButton: {
    backgroundColor: '#1A3B5D',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  viewButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noPropertyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#7A7A7A',
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
};
