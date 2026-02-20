import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-expo'; // useAuth ve useUser eklendi
import * as Notifications from 'expo-notifications';
import React, { useEffect } from 'react';
import { registerForPushNotificationsAsync, saveTokenToFirebase } from './../Shared/NotificationService'; // Servisimiz eklendi

// --- 1. BİLDİRİM AYARI: Uygulama açıkken yukarıdan bildirim DÜŞMEZ ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false, 
    shouldPlaySound: false, 
    shouldSetBadge: false,
  }),
});

const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key)
      return item
    } catch (error) {
      await SecureStore.deleteItemAsync(key)
      return null
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}

// ASIL İŞİ YAPAN KISIM (Clerk verilerine erişebilmesi için ayrı bir component yaptık)
function MainLayout() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [fontsLoaded] = useFonts({
    'Outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Medium': require('./../assets/fonts/Outfit-Medium.ttf'),
    'Outfit-Bold': require('./../assets/fonts/Outfit-Bold.ttf'),
  });

  // GİRİŞ YAPILDIĞINDA TOKEN ALIP FIREBASE'E KAYDEDER
  useEffect(() => {
    if (isSignedIn && user) {
      registerForPushNotificationsAsync().then(token => {
        if (token) {
          saveTokenToFirebase(user?.primaryEmailAddress?.emailAddress, token);
        }
      });
    }
  }, [isSignedIn, user]);

  if (!fontsLoaded) return null;

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login/index" options={{ headerShown: false }} />
    </Stack>
  );
}

// EN DIŞ KATMAN
export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <MainLayout />
    </ClerkProvider>
  );
}