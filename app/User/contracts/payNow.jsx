import { View, Text } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';

export default function payNow() {
    const route = useRoute();
      const { paymentId } = route.params;
  return (
    <View>
      <Text>payNow ID : {paymentId}</Text>
    </View>
  )
}