/**
 * Aspect Ratio Selector Component
 * Allows users to select video aspect ratio (Original or 9:16)
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AspectRatio } from "@/types/video";

interface AspectRatioOption {
  value: AspectRatio;
  label: string;
  icon: string;
}

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  onRatioChange: (ratio: AspectRatio) => void;
  options: AspectRatioOption[];
}

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({
  selectedRatio,
  onRatioChange,
  options,
}) => {
  return (
    <View className="absolute bottom-24 right-4 gap-2">
      {options.map((ratio) => (
        <TouchableOpacity
          key={ratio.value}
          onPress={() => onRatioChange(ratio.value)}
          className="bg-black/70 rounded-full px-3 py-2 flex-row items-center gap-2"
          style={{ minWidth: ratio.value === "original" ? 150 : 80 }}
        >
          <Ionicons
            name={ratio.icon as any}
            size={16}
            color={selectedRatio === ratio.value ? "#fff" : "#aaa"}
          />
          <Text
            className={`text-xs font-semibold ${
              selectedRatio === ratio.value ? "text-white" : "text-white/60"
            }`}
            numberOfLines={1}
          >
            {ratio.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
