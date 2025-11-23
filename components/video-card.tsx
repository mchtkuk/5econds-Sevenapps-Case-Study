import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { VideoItem } from "../types/video";
import { formatDuration } from "../utils/video-utils";

interface VideoCardProps {
  video: VideoItem;
  onPress: (video: VideoItem) => void;
  onDelete?: (videoId: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onPress,
  onDelete,
}) => {
  return (
    <TouchableOpacity
      className="w-[48%] mb-4 bg-instagram-card rounded-xl overflow-hidden shadow-lg"
      onPress={() => onPress(video)}
    >
      <View className="relative w-full aspect-video">
        {video.thumbnail ? (
          <Image
            source={{ uri: video.thumbnail }}
            className="w-full h-full bg-instagram-surface"
          />
        ) : (
          <View className="w-full h-full bg-instagram-surface justify-center items-center">
            <Ionicons name="videocam" size={40} color="#a8a8a8" />
          </View>
        )}
        <View className="absolute bottom-2 right-2 bg-black/70 px-1.5 py-0.5 rounded">
          <Text className="text-white text-xs font-semibold">
            {formatDuration(video.duration)}
          </Text>
        </View>
        {onDelete && (
          <TouchableOpacity
            className="absolute top-2 right-2 bg-red-600/70 rounded-full"
            onPress={() => onDelete(video.id)}
          >
            <Ionicons name="close-circle" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      <View className="p-2">
        <Text
          className="text-sm font-semibold text-instagram-text mb-1"
          numberOfLines={1}
        >
          {video.filename}
        </Text>
        {video.width && video.height && (
          <Text className="text-xs text-instagram-text-secondary">
            {video.width} x {video.height}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
