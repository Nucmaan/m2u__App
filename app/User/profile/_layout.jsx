import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router';

export default function _layout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen
          name="EditProfile"
          options={{
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitleStyle: { 
              color: '#FFFFFF' 
            },
            headerStyle: { 
              backgroundColor: '#1A3B5D'
            },
            headerBackTitleStyle: { 
              color: '#FFFFFF'
            },
            headerTitle: 'Edit Profile',
          }}
          />
        </Stack>
      );
}