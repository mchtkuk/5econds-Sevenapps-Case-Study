import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, View } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");

      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (hasSeenOnboarding === "true") {
        router.replace("/(tabs)");
      } else {
        router.replace("/onboarding");
      }
    } catch (error) {
      router.replace("/onboarding");
    }
  };

  return (
    <View className="flex-1 bg-black items-center justify-center">
      <Image
        source={require("../assets/images/splash-icon.png")}
        className="w-64 h-32"
      />
      <ActivityIndicator color="#ffffff" />
    </View>
  );
}
