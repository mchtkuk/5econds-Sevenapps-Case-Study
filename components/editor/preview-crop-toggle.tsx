/**
 * Preview/Crop Toggle Component
 * Animated toggle switch to switch between preview and crop modes
 */

import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

interface PreviewCropToggleProps {
  isPreviewMode: boolean;
  onToggle: () => void;
  disabled?: boolean;
  animatedIndicatorStyle: any;
}

export const PreviewCropToggle: React.FC<PreviewCropToggleProps> = ({
  isPreviewMode,
  onToggle,
  disabled = false,
  animatedIndicatorStyle,
}) => {
  return (
    <View className="absolute bottom-8 right-4">
      <TouchableOpacity
        onPress={onToggle}
        disabled={disabled}
        className="bg-black/70 rounded-full flex-row p-1"
        style={{ width: 140 }}
      >
        {/* Background sliding indicator */}
        <Animated.View
          className="absolute top-1 left-1 bottom-1 rounded-full bg-white/30"
          style={[
            {
              width: 66,
            },
            animatedIndicatorStyle,
          ]}
        />

        {/* Preview Option */}
        <View className="flex-1 items-center justify-center py-1.5 z-10">
          <Text
            className={`text-xs font-semibold ${
              isPreviewMode ? "text-white" : "text-white/60"
            }`}
          >
            Preview
          </Text>
        </View>

        {/* Crop Option */}
        <View className="flex-1 items-center justify-center py-1.5 z-10">
          <Text
            className={`text-xs font-semibold ${
              !isPreviewMode ? "text-white" : "text-white/60"
            }`}
          >
            Crop
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
