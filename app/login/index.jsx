import { View, Text, Image, Pressable, Alert } from "react-native";
import React, { useCallback } from "react";
import * as WebBrowser from "expo-web-browser";
import Colors from "./../../constants/Colors.ts";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

export default function LoginScreen() {
  useWarmUpBrowser();

  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = useCallback(async () => {
    try {
      // 1) OAuth başlat
      const { createdSessionId, setActive } = await startOAuthFlow({
        // Not: scheme app.json/app.config.js içindeki scheme ile aynı olmalı
        redirectUrl: Linking.createURL("/(tabs)/home", { scheme: "myapp" }),
      });

      // 2) Session oluştuysa aktif et
      if (createdSessionId) {
        await setActive({ session: createdSessionId });

        // 3) Uygulamanın içine gönder
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Giriş tamamlanamadı", "Tekrar dene.");
      }
    } catch (err) {
      console.error("OAuth error", err);
      Alert.alert("Giriş hatası", "Google girişinde hata oluştu. Tekrar dene.");
    }
  }, [startOAuthFlow, router]);

  return (
    <View style={{ backgroundColor: Colors.WHITE, height: "100%" }}>
      <Image
        source={require("./../../assets/images/login.png")}
        style={{ width: "100%", height: 500 }}
      />

      <View style={{ padding: 20, display: "flex", alignItems: "center" }}>
        <Text style={{ fontFamily: "Outfit-Bold", fontSize: 30, textAlign: "center" }}>
          Ready to make a new friend?
        </Text>

        <Text
          style={{
            fontFamily: "Outfit",
            fontSize: 18,
            textAlign: "center",
            color: Colors.GRAY,
            marginTop: 10,
          }}
        >
          Let's adopt the pet which you like and make their life happy again
        </Text>

        <Pressable
          onPress={onPress}
          style={{
            padding: 16,
            backgroundColor: "orange",
            borderRadius: 12,
            marginTop: 20,
            width: "100%",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700" }}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}
