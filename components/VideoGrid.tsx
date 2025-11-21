import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { VideoCard } from './VideoCard';
import { VideoItem } from '../types/video';

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
  emptyMessage = 'No videos yet',
}) => {
  if (videos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={videos}
      renderItem={({ item }) => (
        <VideoCard video={item} onPress={onVideoPress} onDelete={onDeleteVideo} />
      )}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
