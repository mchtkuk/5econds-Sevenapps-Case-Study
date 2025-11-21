import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { VideoGrid } from '@/components/VideoGrid';
import { useVideoStore } from '@/store/videoStore';
import {
  requestPermissions,
  pickVideoFromGallery,
  recordVideo,
  loadVideosFromLibrary,
} from '@/utils/videoUtils';
import { VideoItem } from '@/types/video';

export default function HomeScreen() {
  const router = useRouter();
  const { videos, addVideo, removeVideo, setSelectedVideo } = useVideoStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkPermissionsAndLoadVideos();
  }, []);

  const checkPermissionsAndLoadVideos = async () => {
    const permissions = await requestPermissions();
    if (!permissions.mediaLibrary) {
      Alert.alert(
        'Permission Required',
        'VidCut needs access to your media library to function properly.'
      );
    }
  };

  const handlePickVideo = async () => {
    setLoading(true);
    try {
      const video = await pickVideoFromGallery();
      if (video) {
        addVideo(video);
        Alert.alert('Success', 'Video imported successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordVideo = async () => {
    setLoading(true);
    try {
      const video = await recordVideo();
      if (video) {
        addVideo(video);
        Alert.alert('Success', 'Video recorded successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to record video');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoPress = (video: VideoItem) => {
    setSelectedVideo(video);
    router.push('/editor');
  };

  const handleDeleteVideo = (videoId: string) => {
    Alert.alert('Delete Video', 'Are you sure you want to remove this video?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeVideo(videoId),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>VidCut</Text>
        <Text style={styles.subtitle}>Your Video Editor</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handlePickVideo}
          disabled={loading}
        >
          <Ionicons name="folder-open" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Import Video</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleRecordVideo}
          disabled={loading}
        >
          <Ionicons name="videocam" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Record Video</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <VideoGrid
          videos={videos}
          onVideoPress={handleVideoPress}
          onDeleteVideo={handleDeleteVideo}
          emptyMessage="Import or record a video to get started"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
