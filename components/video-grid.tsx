import React from "react";
import { FlatList, Text, View } from "react-native";
import { VideoItem } from "../types/video";
import { VideoCard } from "./video-card";

interface VideoGridProps {
  videos: VideoItem[];
  onVideoPress: (video: VideoItem) => void;
  onDeleteVideo?: (videoId: string) => void;
  emptyMessage?: string;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  onVideoPress,
  onDeleteVideo,
  emptyMessage = "No videos yet",
}) => {
  if (videos.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-8">
        <Text className="text-base text-instagram-text-secondary text-center">
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={videos}
      renderItem={({ item }) => (
        <VideoCard
          video={item}
          onPress={onVideoPress}
          onDelete={onDeleteVideo}
        />
      )}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperClassName="justify-between"
      contentContainerClassName="p-4"
      showsVerticalScrollIndicator={false}
    />
  );
};
