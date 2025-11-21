# VidCut - Video Editor App

A comprehensive React Native video editing application built with Expo, featuring video trimming, text overlays, filters, and export capabilities.

## Features

### Core Functionality
- **Video Import & Management**
  - Import videos from gallery
  - Record videos using camera
  - Display video thumbnails in grid layout
  - Video details display (duration, resolution, filename)

- **Video Editing**
  - Trim/cut videos with visual timeline
  - Video playback controls
  - Split video into segments
  - Real-time preview

- **Text Overlays**
  - Add custom text overlays to videos
  - Configurable position, font size, and color
  - Timestamp-based text display

- **Filters & Effects**
  - Grayscale
  - Sepia
  - Brightness
  - Contrast
  - Saturation
  - Blur

- **Export & Sharing**
  - Multiple quality options (Low 480p, Medium 720p, High 1080p, Original)
  - Progress tracking during export
  - Save to device gallery
  - Share to social platforms

### Technical Features
- State management with Zustand
- TypeScript for type safety
- Expo Router for navigation
- Cross-platform support (iOS, Android)
- Permission handling for camera and media library

## Project Structure

```
VidCut/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Home screen with video import
│   │   ├── explore.tsx        # Projects overview
│   │   └── _layout.tsx        # Tab navigation layout
│   ├── editor.tsx             # Video editing screen
│   ├── export.tsx             # Export and sharing screen
│   └── _layout.tsx            # Root layout
├── components/
│   ├── VideoCard.tsx          # Individual video card component
│   └── VideoGrid.tsx          # Grid layout for videos
├── store/
│   └── videoStore.ts          # Zustand state management
├── types/
│   └── video.ts               # TypeScript type definitions
├── utils/
│   └── videoUtils.ts          # Utility functions for video operations
└── app.json                   # Expo configuration
```

## Dependencies

### Main Dependencies
- `expo` - Expo SDK
- `react-native` - React Native framework
- `expo-router` - File-based routing
- `zustand` - State management
- `expo-av` - Audio/Video playback and recording
- `expo-media-library` - Media library access
- `expo-video-thumbnails` - Thumbnail generation
- `expo-image-picker` - Image/Video picker
- `expo-sharing` - Sharing functionality
- `@react-native-community/slider` - Slider component

## Setup Instructions

### Prerequisites
- Node.js (v20.13.1 or higher recommended)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on specific platform:
```bash
npm run ios      # Run on iOS
npm run android  # Run on Android
npm run web      # Run on web
```

## Configuration

### Permissions

The app requires the following permissions (configured in `app.json`):

- **Media Library**: Access and save photos/videos
- **Camera**: Record videos
- **Microphone**: Audio recording for videos

### App Configuration

Edit `app.json` to customize:
- App name and slug
- Version
- Icon and splash screen
- Platform-specific settings

## Usage Guide

### Importing Videos

1. **From Gallery**:
   - Tap "Import Video" button on home screen
   - Select video from device gallery
   - Video appears in the grid with thumbnail

2. **Recording**:
   - Tap "Record Video" button
   - Use device camera to record
   - Video automatically added after recording

### Editing Videos

1. Tap on any video card to open the editor
2. Use the timeline slider to preview video
3. **Trim**: Adjust start and end points using trim sliders
4. **Add Text**: Tap "Add Text" button, enter text, and position
5. **Apply Filters**: Select from available filters
6. Tap export button when ready

### Exporting Videos

1. Select quality option:
   - Low (480p) - Smaller file size
   - Medium (720p) - Balanced quality
   - High (1080p) - Best quality
   - Original - Keep original settings

2. Tap "Start Export"
3. Wait for processing (progress bar shown)
4. Choose to Share or Save to Gallery

## State Management

The app uses Zustand for state management with the following store structure:

- **videos**: Array of imported videos
- **currentProject**: Active editing project
- **selectedVideo**: Currently selected video for editing
- **exportProgress**: Export operation status and progress

## Type System

Comprehensive TypeScript types defined in `types/video.ts`:

- `VideoItem`: Video metadata and properties
- `TextOverlay`: Text overlay configuration
- `VideoSegment`: Video segment for splitting
- `FilterEffect`: Filter type and intensity
- `VideoProject`: Complete project structure
- `ExportOptions`: Export configuration
- `ExportProgress`: Export status tracking

## Development Notes

### Known Issues
- MediaTypeOptions deprecation warning (to be updated in future Expo SDK)
- Video processing is simulated (real implementation requires native modules)

### Future Enhancements
- Video merging functionality
- Advanced split features
- More filter options
- Custom filter intensity controls
- Project persistence (save/load)
- Multi-video projects
- Audio editing
- Transitions between segments

## Testing

To test the app:

1. Import test videos or record new ones
2. Test editing features (trim, text, filters)
3. Verify export functionality
4. Test sharing capabilities
5. Check project tracking in Projects tab

## Build for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

## License

Private project

## Support

For issues and questions, please contact the development team.

---

**VidCut** - Your Video Editor
Version 1.0.0
