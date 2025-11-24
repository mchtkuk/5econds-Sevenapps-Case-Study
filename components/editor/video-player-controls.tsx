/**
 * Video Player Controls Component
 * Center play/pause button overlay and duration display
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface VideoPlayerControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: string;
  totalDuration: string;
}

export const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
  isPlaying,
  onTogglePlay,
  currentTime,
  totalDuration,
}) => {
  return (
    <>
      {/* Play/Pause Button Overlay */}
      <View className="absolute inset-0 items-center justify-center">
        <TouchableOpacity
          onPress={onTogglePlay}
          className="w-16 h-16 rounded-full bg-black/50 items-center justify-center"
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={40}
            color="#ffffff"
          />
        </TouchableOpacity>
      </View>

      {/* Duration Display - Bottom Left */}
      <View className="absolute bottom-8 left-4">
        <View className="bg-black/70 px-3 py-2 rounded-full">
          <Text className="text-white text-xs font-semibold">
            {currentTime} / {totalDuration}
          </Text>
        </View>
      </View>
    </>
  );
};
