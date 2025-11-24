import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VideoItem, ExportProgress, CroppedVideo } from '../types/video';

interface VideoStore {
  // State
  videos: VideoItem[];
  croppedVideos: CroppedVideo[]; // Main list of cropped videos for Video Diary
  selectedVideo: VideoItem | null;
  selectedCroppedVideo: CroppedVideo | null;
  exportProgress: ExportProgress;

  // Video management actions
  addVideo: (video: VideoItem) => void;
  removeVideo: (videoId: string) => void;
  setSelectedVideo: (video: VideoItem | null) => void;
  clearVideos: () => void;

  // Cropped video management (Video Diary)
  addCroppedVideo: (video: CroppedVideo) => void;
  updateCroppedVideo: (videoId: string, updates: Partial<CroppedVideo>) => void;
  removeCroppedVideo: (videoId: string) => void;
  setSelectedCroppedVideo: (video: CroppedVideo | null) => void;
  getCroppedVideoById: (videoId: string) => CroppedVideo | undefined;
  toggleFavorite: (videoId: string) => void;

  // Export actions
  setExportProgress: (progress: ExportProgress) => void;
  resetExportProgress: () => void;
}

export const useVideoStore = create<VideoStore>()(
  persist(
    (set, get) => ({
      // Initial state
      videos: [],
      croppedVideos: [],
      selectedVideo: null,
      selectedCroppedVideo: null,
      exportProgress: {
        progress: 0,
        status: 'idle',
      },

      // Video management actions
      addVideo: (video) =>
        set((state) => ({
          videos: [...state.videos, video],
        })),

      removeVideo: (videoId) =>
        set((state) => ({
          videos: state.videos.filter((v) => v.id !== videoId),
        })),

      setSelectedVideo: (video) =>
        set({ selectedVideo: video }),

      clearVideos: () =>
        set({ videos: [] }),

      // Cropped video management
      addCroppedVideo: (video) =>
        set((state) => ({
          croppedVideos: [video, ...state.croppedVideos], // Add to beginning for newest first
        })),

      updateCroppedVideo: (videoId, updates) =>
        set((state) => ({
          croppedVideos: state.croppedVideos.map((v) =>
            v.id === videoId ? { ...v, ...updates, updatedAt: Date.now() } : v
          ),
        })),

      removeCroppedVideo: (videoId) =>
        set((state) => ({
          croppedVideos: state.croppedVideos.filter((v) => v.id !== videoId),
        })),

      setSelectedCroppedVideo: (video) =>
        set({ selectedCroppedVideo: video }),

      getCroppedVideoById: (videoId) => {
        return get().croppedVideos.find((v) => v.id === videoId);
      },

      toggleFavorite: (videoId) =>
        set((state) => ({
          croppedVideos: state.croppedVideos.map((v) =>
            v.id === videoId ? { ...v, isFavorite: !v.isFavorite, updatedAt: Date.now() } : v
          ),
        })),

      // Export actions
      setExportProgress: (progress) =>
        set({ exportProgress: progress }),

      resetExportProgress: () =>
        set({
          exportProgress: {
            progress: 0,
            status: 'idle',
          },
        }),
    }),
    {
      name: 'video-diary-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist cropped videos, not temporary state
      partialize: (state) => ({
        croppedVideos: state.croppedVideos,
      }),
    }
  )
);
