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
