import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { VideoItem } from '../types/video';

export const requestPermissions = async () => {
  const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
  const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();

  return {
    mediaLibrary: mediaStatus === 'granted',
    camera: cameraStatus === 'granted',
  };
};

export const pickVideoFromGallery = async (): Promise<VideoItem | null> => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];

      // Generate thumbnail
      const thumbnail = await generateThumbnail(asset.uri);

      return {
        id: Date.now().toString(),
        uri: asset.uri,
        duration: asset.duration || 0,
        filename: asset.fileName || `video_${Date.now()}.mp4`,
        width: asset.width,
        height: asset.height,
        thumbnail: thumbnail || undefined,
      };
    }

    return null;
  } catch (error) {
    console.error('Error picking video:', error);
    return null;
  }
};

export const recordVideo = async (): Promise<VideoItem | null> => {
  try {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['videos'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];

      // Generate thumbnail
      const thumbnail = await generateThumbnail(asset.uri);

      return {
        id: Date.now().toString(),
        uri: asset.uri,
        duration: asset.duration || 0,
        filename: asset.fileName || `video_${Date.now()}.mp4`,
        width: asset.width,
        height: asset.height,
        thumbnail: thumbnail || undefined,
      };
    }

    return null;
  } catch (error) {
    console.error('Error recording video:', error);
    return null;
  }
};

export const generateThumbnail = async (videoUri: string): Promise<string | null> => {
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
      time: 0,
    });
    return uri;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return null;
  }
};

export const loadVideosFromLibrary = async (limit: number = 20): Promise<VideoItem[]> => {
  try {
    const { status } = await MediaLibrary.getPermissionsAsync();
    if (status !== 'granted') {
      return [];
    }

    const media = await MediaLibrary.getAssetsAsync({
      mediaType: 'video',
      first: limit,
      sortBy: [[MediaLibrary.SortBy.creationTime, false]],
    });

    const videos: VideoItem[] = await Promise.all(
      media.assets.map(async (asset) => {
        const thumbnail = await generateThumbnail(asset.uri);
        return {
          id: asset.id,
          uri: asset.uri,
          duration: asset.duration,
          filename: asset.filename,
          creationTime: asset.creationTime,
          modificationTime: asset.modificationTime,
          width: asset.width,
          height: asset.height,
          thumbnail: thumbnail || undefined,
        };
      })
    );

    return videos;
  } catch (error) {
    console.error('Error loading videos from library:', error);
    return [];
  }
};

export const formatDuration = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

export const getQualitySettings = (quality: 'low' | 'medium' | 'high' | 'original') => {
  switch (quality) {
    case 'low':
      return { width: 640, height: 480, bitrate: 500000 };
    case 'medium':
      return { width: 1280, height: 720, bitrate: 2000000 };
    case 'high':
      return { width: 1920, height: 1080, bitrate: 5000000 };
    case 'original':
      return null; // Use original settings
    default:
      return { width: 1280, height: 720, bitrate: 2000000 };
  }
};
