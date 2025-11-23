import { CroppedVideo } from "@/types/video";
import { formatDuration } from "@/utils/video-utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FolderViewProps {
  videos: CroppedVideo[];
  onVideoPress: (videoId: string) => void;
  onDeleteVideo: (videoId: string) => void;
}

export const FolderView: React.FC<FolderViewProps> = ({
  videos,
  onVideoPress,
  onDeleteVideo,
}) => {
  const insets = useSafeAreaInsets();

  const renderVideoItem = ({ item }: { item: CroppedVideo }) => (
    <TouchableOpacity
      className="bg-[#1c1c1e] rounded-xl overflow-hidden mb-3"
      onPress={() => onVideoPress(item.id)}
      activeOpacity={0.7}
    >
      <View className="flex-row">
        {/* Thumbnail */}
        <View className="w-24 h-36 bg-black rounded-lg overflow-hidden relative">
          {item.thumbnail ? (
            <Image
              source={{ uri: item.thumbnail }}
              style={{ width: 96, height: 144 }}
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full justify-center items-center bg-[#2c2c2e]">
              <Ionicons name="videocam" size={32} color="#666" />
            </View>
          )}
          {/* Duration Badge */}
          <View className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded">
            <Text className="text-white text-[10px] font-semibold">
              {formatDuration(item.duration)}
            </Text>
          </View>
        </View>

        {/* Video Info */}
        <View className="flex-1 p-4 justify-between">
          <View>
            <Text
              className="text-white text-base font-semibold mb-2"
              numberOfLines={2}
            >
              {item.name}
            </Text>
            <Text className="text-white/60 text-sm" numberOfLines={2}>
              {item.description}
            </Text>
          </View>

          {/* Date */}
          <Text className="text-white/40 text-xs">
            {new Date(item.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>

        {/* Delete Button */}
        <TouchableOpacity
          onPress={() => onDeleteVideo(item.id)}
          className="p-4"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerStyle={{
        paddingTop: insets.top + 100, // Safe area + header height
        paddingHorizontal: 16,
        paddingBottom: 32,
      }}
      showsVerticalScrollIndicator={false}
    >
      {videos.map((item) => (
        <View key={item.id}>{renderVideoItem({ item })}</View>
      ))}
    </ScrollView>
  );
};
