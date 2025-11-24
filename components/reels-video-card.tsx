import { CroppedVideo } from "@/types/video";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { memo, useEffect, useRef, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

interface ReelsVideoCardProps {
  video: CroppedVideo;
  isActive: boolean;
  onPress?: () => void;
  onDelete?: () => void;
  onToggleFavorite?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const ReelsVideoCardComponent: React.FC<ReelsVideoCardProps> = ({
  video,
  isActive,
  onPress,
  onDelete,
  onToggleFavorite,
  onDownload,
  onShare,
}) => {
  const [isPaused, setIsPaused] = useState(false);

  // Track mount state to prevent setting state on unmounted components
  const isMounted = useRef(true);

  // Initialize player
  const player = useVideoPlayer(video.uri, (player) => {
    player.loop = true;
    player.muted = false;
  });

  // 1. CLEANUP LOGIC (The most important part for memory leaks)
  useEffect(() => {
    isMounted.current = true;
    console.log(`[ReelsVideoCard] Mounted: ${video.id}`);

    return () => {
      console.log(`[ReelsVideoCard] Unmounting: ${video.id}`);
      isMounted.current = false;

      if (player) {
        try {
          player.pause();
          // FIX: Use replaceAsync (Async) instead of replace (Sync)
          // This prevents the UI thread from freezing/crashing during fast scrolling
          player.replaceAsync(null).catch((err) => {
            // Ignore errors if player is already destroyed
            // console.warn("Player cleanup error:", err);
          });
        } catch (error) {
          // Ignore
        }
      }
    };
  }, [player, video.id]);

  // 2. PLAYBACK LOGIC
  useEffect(() => {
    if (!player) return;

    // Use a small timeout to let the UI settle before playing/pausing
    // This helps performance when swiping quickly
    const timer = setTimeout(() => {
      if (!isMounted.current) return;

      try {
        if (isActive && !isPaused) {
          player.play();
        } else {
          player.pause();
        }
      } catch (error) {
        // Player might be destroyed, ignore
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [isActive, isPaused, player]);

  // Determine content fit based on actual video dimensions
  const getContentFit = () => {
    if (video.width && video.height) {
      const videoRatio = video.width / video.height;

      // 9:16 ratio is 0.5625
      // 4:5 ratio is 0.8
      // 1:1 ratio is 1.0

      // FIX: If the video is "wider" than a very tall rectangle (approx 2:3 or 0.66),
      // we must CONTAIN it to prevent side cropping.
      // This handles 4:5 (0.8), 1:1 (1.0), and Landscape (1.77) correctly.
      if (videoRatio > 0.6) {
        return "contain";
      }

      // Only use COVER for very tall videos (like 9:16) to fill the screen
      // and avoid tiny black bars on varying phone screen sizes.
      return "cover";
    }

    // Default safe fallback
    return "contain";
  };

  const handlePressIn = () => setIsPaused(true);
  const handlePressOut = () => setIsPaused(false);

  if (!video || !video.uri) {
    return (
      <View
        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
        className="relative bg-black justify-center items-center"
      >
        <Text className="text-white/70">No video available</Text>
      </View>
    );
  }

  return (
    <View
      style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
      className="relative bg-black"
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="flex-1"
      >
        <VideoView
          player={player}
          style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
          contentFit={getContentFit()}
          nativeControls={false}
          allowsPictureInPicture={false}
          // Optimization: Disable PIP automatically
          startsPictureInPictureAutomatically={false}
        />
      </TouchableOpacity>

      {/* Overlay Gradient */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: 95,
          paddingHorizontal: 24,
          paddingTop: 60,
        }}
        pointerEvents="none"
      >
        <Text className="text-white text-xl font-bold mb-2" numberOfLines={2}>
          {video.name}
        </Text>
        {video.description && (
          <Text className="text-white/90 text-sm" numberOfLines={3}>
            {video.description}
          </Text>
        )}
      </LinearGradient>

      {/* Action Buttons */}
      <View
        style={{
          position: "absolute",
          right: 16,
          bottom: 115,
          gap: 20,
        }}
      >
        {onToggleFavorite && (
          <TouchableOpacity onPress={onToggleFavorite} className="items-center">
            <View className="bg-black/50 rounded-full p-2.5 mb-1">
              <Ionicons
                name={video.isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={video.isFavorite ? "#ef4444" : "#fff"}
              />
            </View>
            <Text className="text-white text-[10px]">Favorite</Text>
          </TouchableOpacity>
        )}

        {onDownload && (
          <TouchableOpacity onPress={onDownload} className="items-center">
            <View className="bg-black/50 rounded-full p-2.5 mb-1">
              <Ionicons name="download-outline" size={24} color="#fff" />
            </View>
            <Text className="text-white text-[10px]">Download</Text>
          </TouchableOpacity>
        )}

        {onShare && (
          <TouchableOpacity onPress={onShare} className="items-center">
            <View className="bg-black/50 rounded-full p-2.5 mb-1">
              <Ionicons name="share-outline" size={24} color="#fff" />
            </View>
            <Text className="text-white text-[10px]">Share</Text>
          </TouchableOpacity>
        )}

        {onDelete && (
          <TouchableOpacity onPress={onDelete} className="items-center">
            <View className="bg-black/50 rounded-full p-2.5 mb-1">
              <Ionicons name="trash-outline" size={24} color="#fff" />
            </View>
            <Text className="text-white text-[10px]">Delete</Text>
          </TouchableOpacity>
        )}

        {onPress && (
          <TouchableOpacity onPress={onPress} className="items-center">
            <View className="bg-black/50 rounded-full p-2.5 mb-1">
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#fff"
              />
            </View>
            <Text className="text-white text-[10px]">Details</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Strict Memoization
export const ReelsVideoCard = memo(ReelsVideoCardComponent, (prev, next) => {
  return (
    prev.video.id === next.video.id &&
    prev.isActive === next.isActive &&
    prev.video.isFavorite === next.video.isFavorite
  );
});
