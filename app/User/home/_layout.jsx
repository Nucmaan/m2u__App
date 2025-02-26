 import React from "react";
import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="listings" />
      <Stack.Screen name="ContactForm" />
      <Stack.Screen name="ViewListing" />
    </Stack>
  );
}
