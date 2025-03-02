import { useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import { useIsFocused } from "@react-navigation/native";
export default function HomeUser() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();

  const getListings = useCallback(async () => {
    try {
      setIsLoading(true);

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
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      getListings();
    }
  }, [getListings, isFocused]);

  const handleSearch = () => {
    navigation.navigate("SearchResults", {
      query: searchQuery,
      filter: selectedFilter,
    });
  };

  const rentListings = listings.filter(
    (listing) => listing.houseType === "Rent"
  );
  const buyListings = listings.filter((listing) => listing.houseType === "Buy");

  const filteredListings =
    selectedFilter === "Rent"
      ? rentListings
      : selectedFilter === "Buy"
      ? buyListings
      : listings;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to MyHome2U</Text>
        <Text style={styles.subtitle}>Find your perfect home today!</Text>

        <View style={styles.searchBar}>
          <TextInput
            style={styles.input}
            placeholder="Search For City Name"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Button title="Search" onPress={handleSearch} />
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterText}>Filter by:</Text>
          <View style={styles.filterButtons}>
            {["All", "Rent", "Buy"].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.selectedFilterButton,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={styles.filterButtonText}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.featuredProperties}>
        <Text style={styles.sectionTitle}>Featured Properties</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#F47C48" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filteredListings.length === 0 ? (
              <Text style={styles.noPropertyText}>No Properties Available</Text>
            ) : (
              filteredListings.map((property) => (
                <View key={property._id} style={styles.propertyCard}>
                  <Image
                    source={{ uri: property.images[0] }}
                    style={styles.propertyImage}
                  />
                  <Text style={styles.propertyTitle}>{property.title}</Text>
                  <Text style={styles.propertyDescription}>
                    {property.city}
                  </Text>
                  <Text style={styles.propertyPrice}>${property.price}</Text>
                  <TouchableOpacity
                    style={styles.viewDetailsButton}
                    onPress={() =>
                      navigation.navigate("ViewListing", {
                        listingId: property._id,
                      })
                    }
                  >
                    <Text style={styles.viewDetailsText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>

      <View style={styles.ctaSection}>
        <Text style={styles.ctaText}>Ready to find your next home?</Text>
        <Text style={styles.ctaSubtitle}>
          Start your journey with us today!
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate("listings")}
        >
          <Text style={styles.ctaButtonText}>Explore Listings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.testimonialsSection}>
        <Text style={styles.sectionTitle}>What Our Users Say</Text>
        <View style={styles.testimonialCard}>
          <Text style={styles.testimonialText}>
            "I found my dream home through MyHome2U. The search was so easy and
            the results were exactly what I was looking for!"
          </Text>
          <Text style={styles.testimonialAuthor}>- Nasri Abdi</Text>
        </View>
        <View style={styles.testimonialCard}>
          <Text style={styles.testimonialText}>
            "Great platform! The property listings are up-to-date, and I was
            able to easily book a viewing."
          </Text>
          <Text style={styles.testimonialAuthor}>- Nucmaan Abdi</Text>
        </View>
      </View>

      <View style={styles.contactUsSection}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.contactText}>
          Have any questions? Reach out to us at:
        </Text>
        <Text style={styles.contactDetails}>Email: support@myhome2u.com</Text>
        <Text style={styles.contactDetails}>Phone: +123 456 7890</Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => navigation.navigate("ContactForm")}
        >
          <Text style={styles.contactButtonText}>Contact Form</Text>
        </TouchableOpacity>
      </View>

      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F7F7F9",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  header: {
    backgroundColor: "#1A3B5D",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#FFFFFF",
    marginVertical: 10,
    textAlign: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginRight: 10,
  },
  filterContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  filterText: {
    fontSize: 16,
    color: "white",
    marginBottom: 15,
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginHorizontal: 10,
  },
  selectedFilterButton: {
    backgroundColor: "#F47C48",
  },
  filterButtonText: {
    fontSize: 16,
    color: "#333333",
  },
  featuredProperties: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1A3B5D",
  },
  propertyCard: {
    width: 250,
    marginRight: 16,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowRadius: 4,
  },
  propertyImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  propertyDescription: {
    fontSize: 14,
    color: "#7A7A7A",
    marginVertical: 5,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A3B5D",
  },
  viewDetailsButton: {
    marginTop: 10,
    backgroundColor: "#F47C48",
    paddingVertical: 10,
    borderRadius: 8,
  },
  viewDetailsText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  contactUsSection: {
    marginBottom: 5,
    backgroundColor: "#F7F7F9",
    padding: 20,
    borderRadius: 10,
  },
  contactText: {
    fontSize: 18,
    marginVertical: 10,
    color: "#333333",
  },
  contactDetails: {
    fontSize: 16,
    color: "#7A7A7A",
  },
  contactButton: {
    backgroundColor: "#1A3B5D",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  contactButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  testimonialsSection: {
    marginBottom: 10,
    backgroundColor: "#F7F7F9",
    padding: 20,
    borderRadius: 10,
  },
  testimonialCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  testimonialText: {
    fontSize: 16,
    color: "#333333",
  },
  testimonialAuthor: {
    fontSize: 14,
    color: "#7A7A7A",
    marginTop: 10,
    textAlign: "right",
  },
  ctaSection: {
    backgroundColor: "#F47C48",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
  },
  ctaText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  ctaSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    marginVertical: 10,
    textAlign: "center",
  },
  ctaButton: {
    backgroundColor: "#1A3B5D",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
