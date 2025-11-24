import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colors } from "@/constants/theme";
import { DIMENSIONS } from "@/constants/app";
import { View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.gray600,
        tabBarStyle: {
          backgroundColor: colors.black,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: DIMENSIONS.TAB_BAR_HEIGHT,
          paddingBottom: DIMENSIONS.TAB_BAR_PADDING,
          paddingTop: 4,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Clips",
          tabBarIcon: ({ color }) => (
            <Ionicons name="play-circle" size={DIMENSIONS.ICON_SIZE_MEDIUM} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Create",
          tabBarIcon: ({ color }) => (
            <View className="h-24 w-24 -mt-8 justify-center items-center">
              <Ionicons name="add-circle" size={DIMENSIONS.ICON_SIZE_XLARGE} color={colors.white} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart" size={DIMENSIONS.ICON_SIZE_MEDIUM} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
