import { useVideoStore } from "@/store/video-store";
import { formatDuration } from "@/utils/video-utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_SIZE = (SCREEN_WIDTH - 6) / 3; // 3 columns with 2px gaps

export default function FavoritesScreen() {
  const router = useRouter();
  const { croppedVideos, setSelectedCroppedVideo } = useVideoStore();

  // Filter only favorite videos
  const favoriteVideos = croppedVideos.filter((v) => v.isFavorite);

  const handleVideoPress = (videoId: string) => {
    const croppedVideo = croppedVideos.find((v) => v.id === videoId);
    if (croppedVideo) {
      setSelectedCroppedVideo(croppedVideo);
      router.push({
        pathname: "/reel",
        params: { videoId },
      } as any);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-800">
        <Text className="text-white text-2xl font-bold">Favorites</Text>
        {favoriteVideos.length > 0 && (
          <Text className="text-gray-400 text-sm mt-1">
            {favoriteVideos.length}{" "}
            {favoriteVideos.length === 1 ? "clip" : "clips"}
          </Text>
        )}
      </View>

      {/* Empty State */}
      {favoriteVideos.length === 0 ? (
        <View className="flex-1 justify-center items-center px-8">
          <Ionicons name="heart-outline" size={80} color="#666" />
          <Text className="text-white/70 text-lg text-center mt-6">
            Your favorite clips will appear here
          </Text>
        </View>
      ) : (
        /* Grid View */
        <FlatList
          data={favoriteVideos}
          numColumns={3}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 1 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleVideoPress(item.id)}
              style={{
                width: ITEM_SIZE,
                height: ITEM_SIZE,
                margin: 1,
              }}
              activeOpacity={0.7}
            >
              {/* Thumbnail */}
              <Image
                source={{ uri: item.thumbnail || item.uri }}
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#1a1a1a",
                }}
                resizeMode="cover"
              />

              {/* Duration Badge */}
              <View className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded">
                <Text className="text-white text-[10px] font-semibold">
                  {formatDuration(item.duration)}
                </Text>
              </View>

              {/* Play Icon Overlay */}
              <View className="absolute inset-0 items-center justify-center">
                <View className="bg-black/30 rounded-full p-2">
                  <Ionicons name="play" size={20} color="white" />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
