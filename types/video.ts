export interface VideoItem {
  id: string;
  uri: string;
  duration: number;
  filename: string;
  creationTime?: number;
  modificationTime?: number;
  width?: number;
  height?: number;
  thumbnail?: string;
  error?: string; // For validation errors
}

export type AspectRatio = 'original' | '9:16';

export interface CroppedVideo {
  id: string;
  name: string;
  description: string;
  uri: string; // URI of the cropped video file
  originalVideoUri: string; // URI of the original video
  startTime: number; // in milliseconds
  endTime: number; // in milliseconds
  duration: number; // in milliseconds (endTime - startTime)
  thumbnail?: string;
  width?: number; // Video width in pixels
  height?: number; // Video height in pixels
  aspectRatio?: AspectRatio; // Display aspect ratio
  isFavorite?: boolean; // Whether the video is favorited
  createdAt: number;
  updatedAt: number;
}

export interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily?: string;
  timestamp: number; // When to show the overlay in milliseconds
}

export interface VideoSegment {
  id: string;
  videoId: string;
  startTime: number;
  endTime: number;
}

export interface FilterEffect {
  type: 'grayscale' | 'sepia' | 'brightness' | 'contrast' | 'saturation' | 'blur';
  intensity: number;
}

export interface VideoProject {
  id: string;
  name: string;
  videos: VideoItem[];
  segments: VideoSegment[];
  textOverlays: TextOverlay[];
  filters: FilterEffect[];
  createdAt: number;
  updatedAt: number;
}

export interface ExportOptions {
  quality: 'low' | 'medium' | 'high' | 'original';
  format: 'mp4' | 'mov';
  resolution?: {
    width: number;
    height: number;
  };
}

export interface ExportProgress {
  progress: number; // 0-100
  status: 'idle' | 'processing' | 'completed' | 'failed';
  outputUri?: string;
  error?: string;
}
