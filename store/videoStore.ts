import { create } from 'zustand';
import { VideoItem, VideoProject, TextOverlay, FilterEffect, ExportProgress } from '../types/video';

interface VideoStore {
  // State
  videos: VideoItem[];
  currentProject: VideoProject | null;
  selectedVideo: VideoItem | null;
  exportProgress: ExportProgress;

  // Video management actions
  addVideo: (video: VideoItem) => void;
  removeVideo: (videoId: string) => void;
  setSelectedVideo: (video: VideoItem | null) => void;
  clearVideos: () => void;

  // Project management actions
  createProject: (name: string) => void;
  updateProject: (project: Partial<VideoProject>) => void;
  clearProject: () => void;

  // Editing actions
  addTextOverlay: (overlay: TextOverlay) => void;
  removeTextOverlay: (overlayId: string) => void;
  updateTextOverlay: (overlayId: string, updates: Partial<TextOverlay>) => void;

  addFilter: (filter: FilterEffect) => void;
  removeFilter: (filterIndex: number) => void;
  updateFilter: (filterIndex: number, filter: FilterEffect) => void;

  // Export actions
  setExportProgress: (progress: ExportProgress) => void;
  resetExportProgress: () => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
  // Initial state
  videos: [],
  currentProject: null,
  selectedVideo: null,
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

  // Project management actions
  createProject: (name) =>
    set({
      currentProject: {
        id: Date.now().toString(),
        name,
        videos: [],
        segments: [],
        textOverlays: [],
        filters: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    }),

  updateProject: (updates) =>
    set((state) => ({
      currentProject: state.currentProject
        ? { ...state.currentProject, ...updates, updatedAt: Date.now() }
        : null,
    })),

  clearProject: () =>
    set({ currentProject: null }),

  // Editing actions
  addTextOverlay: (overlay) =>
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            textOverlays: [...state.currentProject.textOverlays, overlay],
            updatedAt: Date.now(),
          }
        : null,
    })),

  removeTextOverlay: (overlayId) =>
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            textOverlays: state.currentProject.textOverlays.filter((o) => o.id !== overlayId),
            updatedAt: Date.now(),
          }
        : null,
    })),

  updateTextOverlay: (overlayId, updates) =>
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            textOverlays: state.currentProject.textOverlays.map((o) =>
              o.id === overlayId ? { ...o, ...updates } : o
            ),
            updatedAt: Date.now(),
          }
        : null,
    })),

  addFilter: (filter) =>
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            filters: [...state.currentProject.filters, filter],
            updatedAt: Date.now(),
          }
        : null,
    })),

  removeFilter: (filterIndex) =>
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            filters: state.currentProject.filters.filter((_, i) => i !== filterIndex),
            updatedAt: Date.now(),
          }
        : null,
    })),

  updateFilter: (filterIndex, filter) =>
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            filters: state.currentProject.filters.map((f, i) => (i === filterIndex ? filter : f)),
            updatedAt: Date.now(),
          }
        : null,
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
}));
