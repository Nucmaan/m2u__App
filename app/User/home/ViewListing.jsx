import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import { useIsFocused, useRoute } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "@env";
import { Ionicons } from "@expo/vector-icons";
import useUserAuth from "@/myStore/userAuth";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function ViewListing() {
  const route = useRoute();
  const { listingId } = route.params;
  const isFocused = useIsFocused();
  const user = useUserAuth((state) => state.user);

  const [userBookings, setUserBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [visitingDate, setVisitingDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mode, setMode] = useState("date");

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageIndex, setImageIndex] = useState(0);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || visitingDate;
    setShowDatePicker(false);
    setVisitingDate(currentDate);
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/listings/${listingId}`
        );
        setListing(response.data.data);
      } catch (error) {
        setErrorMessage("Failed to fetch listing details");
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchListing();
    }
  }, [listingId, isFocused]);

  const handleBookNow = () => {
    if (!user) {
      Toast.show({ type: "error", text1: "Please log in to book a property." });
      return;
    }
    if (user?.role === "Admin" || user?.role === "Agent") {
      Toast.show({
        type: "error",
        text1: "Admins and Agents cannot book properties.",
      });
      return;
    }

    if (userBookings.some((booking) => booking.listing._id === listingId)) {
      Toast.show({
        type: "error",
        text1: "You have already booked this property.",
      });
      return;
    }

    setIsModalOpen(true);
  };

  const allReadyBooked = useCallback(async () => {
    if (!user?._id) return;
    try {
      const response = await axios.get(
        `${API_URL}/api/booking/userBooking/${user._id}`
      );
      setUserBookings(response.data.bookings || []);
    } catch (error) {
      setUserBookings([]);
    }
  }, [user?._id]);

  useEffect(() => {
    if (user?._id) {
      allReadyBooked();
    }
  }, [user?._id, allReadyBooked]);

  const handleConfirmBooking = async () => {
    if (!visitingDate) {
      Toast.show({ type: "error", text1: "Please select a visiting date." });
      return;
    }
    if (!notes) {
      Toast.show({
        type: "error",
        text1: "Please add comments for your booking.",
      });
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/api/booking/addBooking`, {
        user: user._id,
        owner: listing?.owner?._id,
        listing: listingId,
        visitingDate,
        notes,
      });
      Toast.show({ type: "success", text1: response.data.message });
      setIsModalOpen(false);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to book property. Please try again.",
      });
    }
  };

  const nextImage = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % listing.images.length);
  };

  const prevImage = () => {
    setImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + listing.images.length) % listing.images.length
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1A3B5D" />
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.arrowLeft} onPress={prevImage}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Image
          source={{ uri: listing.images[imageIndex] }}
          style={styles.image}
        />
        <TouchableOpacity style={styles.arrowRight} onPress={nextImage}>
          <Ionicons name="chevron-forward" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.price}>${listing.price} / month</Text>
        <Text style={styles.address}>
          {listing.address}, {listing.city}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>🛏 {listing.bedrooms} Bedrooms</Text>
          <Text style={styles.infoText}>🛁 {listing.bathrooms} Bathrooms</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>🏠 Type: {listing.houseType}</Text>
          <Text style={styles.infoText}>🟢 Status: {listing.status}</Text>
        </View>

        <Text style={styles.infoText}>💰 Deposit: ${listing.deposit}</Text>

        <Text style={styles.description}>{listing.description}</Text>

        <View style={styles.agentContainer}>
          <Image
            source={{ uri: listing.owner.avatar }}
            style={styles.agentAvatar}
          />
          <View>
            <Text style={styles.agentName}>{listing.owner.username}</Text>
            <Text style={styles.agentEmail}>{listing.owner.email}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleBookNow} style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalOpen} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Booking Confirmation</Text>

            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.inputField}
            >
              <Text>{visitingDate.toLocaleDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={visitingDate}
                mode={mode}
                display="default"
                onChange={onDateChange}
              />
            )}

            <TextInput
              style={styles.textArea}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add your comments"
              multiline
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleConfirmBooking}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Confirm Booking</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsModalOpen(false)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F9",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F9",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#E74C3C",
    fontSize: 16,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 250,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  arrowLeft: {
    position: "absolute",
    left: 10,
    top: "50%",
    zIndex: 1,
  },
  arrowRight: {
    position: "absolute",
    right: 10,
    top: "50%",
    zIndex: 1,
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#27AE60",
    marginBottom: 10,
  },
  address: {
    fontSize: 16,
    color: "#7F8C8D",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    marginRight: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
    paddingBottom: 10,
  },
  agentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  agentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  agentName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  agentEmail: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  bookButton: {
    backgroundColor: "#1A3B5D",
    paddingVertical: 15,
    marginTop: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  bookButtonText: {
    color: "white",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    width: "80%",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputField: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    borderRadius: 5,
  },
  textArea: {
    height: 100,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    borderRadius: 5,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#1A3B5D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
