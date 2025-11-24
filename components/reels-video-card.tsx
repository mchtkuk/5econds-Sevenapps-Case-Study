import { CroppedVideo } from "@/types/video";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { memo, useEffect, useState } from "react";
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window"); // Use 'window' for actual viewport

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

  // Create video player
  const player = useVideoPlayer(video.uri, (player) => {
    player.loop = true;
    player.muted = false;
  });

  // Determine content fit based on actual video dimensions
  const getContentFit = () => {
    // Check actual video dimensions
    if (video.width && video.height) {
      const aspectRatio = video.width / video.height;
      // If portrait (height > width), use cover to fill screen without black bars
      // If landscape (width > height), use contain to show full video
      return aspectRatio < 1 ? "cover" as const : "contain" as const;
    }

    // Fallback: use cover for unknown dimensions to avoid black bars
    return "cover" as const;
  };

  useEffect(() => {
    console.log(`[ReelsVideoCard] Mounted for video: ${video.id}`);

    return () => {
      console.log(`[ReelsVideoCard] Unmounting video: ${video.id}`);
      // Cleanup player when component unmounts
      try {
        if (player) {
          player.pause();
          player.replace(null); // Release video resource
        }
      } catch (error) {
        // Ignore - player may already be destroyed
      }
    };
  }, [player, video.id]);

  useEffect(() => {
    if (!player) return;

    try {
      if (isActive && !isPaused) {
        player.play();
      } else {
        player.pause();
      }
    } catch (error) {
      // Ignore playback errors - player may be destroyed
    }
  }, [isActive, isPaused, player]);

  const handlePressIn = () => {
    setIsPaused(true);
  };

  const handlePressOut = () => {
    setIsPaused(false);
  };

  // Don't render if video URI is invalid
  if (!video || !video.uri) {
    return (
      <View
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
        }}
        className="relative bg-black justify-center items-center"
      >
        <Text className="text-white/70">No video available</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
      }}
      className="relative bg-black"
      accessible={false}
      accessibilityElementsHidden={true}
      importantForAccessibility="no-hide-descendants"
    >
      {/* Video Player */}
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="flex-1"
        accessible={false}
        importantForAccessibility="no-hide-descendants"
      >
        <VideoView
          player={player}
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
          }}
          contentFit={getContentFit()}
          nativeControls={false}
          allowsPictureInPicture={false}
          accessibilityElementsHidden={true}
          importantForAccessibility="no-hide-descendants"
        />
      </TouchableOpacity>

      {/* Bottom Left: Video Title & Description */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: 95, // Tab bar height (70) + padding
          paddingHorizontal: 24,
          paddingTop: 60,
        }}
        pointerEvents="none"
        accessible={false}
        importantForAccessibility="no-hide-descendants"
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

      {/* Right Side Actions */}
      <View
        style={{
          position: "absolute",
          right: 16,
          bottom: 115, // Adjusted for tab bar + 5px upward shift
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

// Memoize component to prevent unnecessary re-renders
export const ReelsVideoCard = memo(ReelsVideoCardComponent, (prevProps, nextProps) => {
  // Only re-render if video ID, active state, or favorite state changes
  return (
    prevProps.video.id === nextProps.video.id &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.video.isFavorite === nextProps.video.isFavorite
  );
});
