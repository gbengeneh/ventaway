import React from "react";
import { Stack, Slot } from "expo-router";

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Declare your screens */}
      <Stack.Screen name="(main)" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/home" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/settings" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/community" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/message" options={{ headerShown: false }} />
      <Slot />
    </Stack>
  );
}
