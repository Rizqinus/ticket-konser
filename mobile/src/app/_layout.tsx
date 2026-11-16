import "../global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="concert" />
      <Stack.Screen name="pilih-tiket" />
      <Stack.Screen name="checkout" />
      <Stack.Screen name="pembayaran" />
      <Stack.Screen name="ticket-qr" />
      <Stack.Screen name="profile-edit" />
      <Stack.Screen name="notifikasi" />
      <Stack.Screen name="favorit" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
