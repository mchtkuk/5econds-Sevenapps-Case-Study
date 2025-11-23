import { ReelsVideoCard } from "@/components/reels-video-card";
import { useVideoStore } from "@/store/video-store";
import { downloadVideoToGallery, shareVideo } from "@/utils/video-utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Dimensions, View, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("screen");

export default function ReelScreen() {
  const router = useRouter();
  const { videoId } = useLocalSearchParams<{ videoId: string }>();
  const { getCroppedVideoById, toggleFavorite } = useVideoStore();
  const [isScreenFocused, setIsScreenFocused] = useState(true);
  const insets = useSafeAreaInsets();

  const video = getCroppedVideoById(videoId || "");

  if (!video) {
    router.back();
    return null;
  }

  const handleDetails = () => {
    router.push({
      pathname: "/details",
      params: { videoId: video.id },
    } as any);
  };

  const handleDownload = async () => {
    const result = await downloadVideoToGallery(video.uri, video.name);
    if (result.success) {
      Alert.alert("Success", "Video saved to your gallery in the '5econds' album!");
    } else {
      Alert.alert("Error", result.error || "Failed to save video to gallery");
    }
  };

  const handleShare = async () => {
    const result = await shareVideo(video.uri);
    if (!result.success) {
      Alert.alert("Error", result.error || "Failed to share video");
    }
  };

  return (
    <View className="flex-1 bg-black">
      <ReelsVideoCard
        video={video}
        isActive={isScreenFocused}
        onPress={handleDetails}
        onDelete={() => router.back()}
        onToggleFavorite={() => toggleFavorite(video.id)}
        onDownload={handleDownload}
        onShare={handleShare}
      />

      {/* Back Button Overlay */}
      <View
        style={{
          position: "absolute",
          top: insets.top + 8,
          left: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-black/50 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
