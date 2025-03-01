import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '@env'
import useUserAuth from '@/myStore/userAuth'
import Toast from "react-native-toast-message";
import { useIsFocused } from '@react-navigation/native'

export default function UserBookings() {
  const [userBookings, setUserBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [errormessage, setErrorMessage] = useState('')
  const [isCanceling, setIsCanceling] = useState(null)  
  const user = useUserAuth((state) => state.user)
  const isFocused = useIsFocused();

  const fetchUserBookings = useCallback(async () => {
    if (!user?._id) return
    try {
      const response = await axios.get(`${API_URL}/api/booking/userBooking/${user._id}`)
      setUserBookings(response.data.bookings)
    } catch (error) {
      setErrorMessage('Failed to fetch user bookings')
    } finally {
      setLoading(false)
    }
  }, [user?._id])

  const cancelBooking = async (bookingId) => {
    setIsCanceling(bookingId)  
    try {
      const response = await axios.delete(`${API_URL}/api/booking/cancel/${bookingId}`)
      setUserBookings((prevBookings) => prevBookings.filter(booking => booking._id !== bookingId))

      Toast.show({
        type: "success", 
        text1: `${response.data.message}`,
        position: "top",
      })
    } catch (error) {
      Toast.show({
        type: "error", 
        text1: "Error try again",
      })
      setErrorMessage('Failed to cancel booking')
    } finally {
      setIsCanceling(null)  
    }
  }

  useEffect(() => {
    if (isFocused) {
      fetchUserBookings();
    }
  }, [fetchUserBookings, isFocused])

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#F47C48" />
      </View>
    )
  }

  if (errormessage) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errormessage}</Text>
      </View>
    )
  }

  if (userBookings.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noBookingsText}>You have no bookings yet.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={userBookings}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.bookingCard}>
            <Text style={styles.propertyTitle}>{item.listing.title}</Text>
            <Text style={styles.propertyDetails}>
              {item.listing.city} | {item.listing.houseType}
            </Text>
            <Text style={styles.bookingInfo}>
              Visiting Date: {new Date(item.visitingDate).toLocaleDateString()}
            </Text>
            <Text style={styles.bookingInfo}>Status: {item.status}</Text>
            {item.notes && <Text style={styles.notes}>Notes: {item.notes}</Text>}

            {item.status === 'pending' && (
              <TouchableOpacity
                onPress={() => cancelBooking(item._id)}
                style={styles.cancelButton} 
                disabled={isCanceling === item._id} 
              >
                {isCanceling === item._id ? (
                  <ActivityIndicator size="small" color="#FFFFFF" /> 
                ) : (
                  <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F9',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A3B5D',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#4C8492',
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: '#E74C3C',
    textAlign: 'center',
  },
  noBookingsText: {
    fontSize: 18,
    color: '#7A7A7A',
    textAlign: 'center',
    marginTop: 20,
  },
  bookingCard: {
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
  propertyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A3B5D',
  },
  propertyDetails: {
    fontSize: 16,
    color: '#7A7A7A',
    marginTop: 5,
  },
  bookingInfo: {
    fontSize: 16,
    color: '#333333',
    marginTop: 5,
  },
  notes: {
    fontSize: 14,
    color: '#F47C48',
    marginTop: 10,
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#F47C48',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
})
