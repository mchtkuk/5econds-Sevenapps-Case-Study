# 5econds

A modern, high-performance React Native video editor that lets you create and share perfect 5-second video clips.

## Overview

**5econds** is a mobile video diary application built with React Native and Expo. Users can import videos from their gallery or record new ones, precisely crop them to exactly 5 seconds, add metadata, and save them in an optimized format. The app features a beautiful TikTok-style reels interface for viewing your video collection.

### Key Features

- **Video Import & Recording**

  - Import videos from your device gallery (up to 2 minutes)
  - Record videos directly within the app
  - Automatic video validation and duration checking

- **Precision Video Editor**

  - Crop any video to exactly 5 seconds with millisecond precision
  - Interactive timeline scrubber for precise frame selection
  - Real-time video preview with loop playback
  - Aspect ratio selection (Original, 9:16)
  - Live video player with smooth seeking

- **Metadata & Organization**

  - Add custom names and descriptions to your clips
  - Mark videos as favorites
  - Two viewing modes: Reels (TikTok-style) and Grid (folder view)
  - Automatic thumbnail generation

- **Sharing & Export**

  - Save cropped videos to device gallery in '5econds' album
  - Share videos directly to other apps
  - High-quality video export with aspect ratio preservation

- **Onboarding Experience**

  - Beautiful first-time user introduction
  - Smooth animations and transitions

- **Performance Optimized**
  - Memory-efficient video processing
  - Optimized thumbnail generation
  - Aggressive cache management to prevent memory leaks
  - FlatList optimizations for smooth scrolling

## Tech Stack

### Core Framework

- **React Native** 0.81.5 - Cross-platform mobile development
- **Expo SDK** 54 - Managed workflow and native modules
- **TypeScript** 5.9.2 - Type safety and better DX
- **React** 19.1.0 - Latest React with concurrent features

### Navigation & Routing

- **Expo Router** 6.0.15 - File-based routing with typed routes
- **React Navigation** 7.x - Native navigation primitives

### Video Processing

- **expo-video** 3.0.14 - Modern video playback (replaces expo-av)
- **expo-video-thumbnails** 10.0.7 - Thumbnail generation
- **expo-trim-video** 1.0.1 - Video cropping and trimming

### Media & Permissions

- **expo-media-library** 18.2.0 - Gallery access and video saving
- **expo-image-picker** 17.0.8 - Video selection and camera access
- **expo-sharing** 14.0.7 - Share functionality

### UI & Styling

- **NativeWind** 4.2.1 - TailwindCSS for React Native
- **expo-linear-gradient** 15.0.7 - Beautiful gradient effects
- **React Native Reanimated** 4.1.1 - Smooth 60fps animations
- **React Native Gesture Handler** 2.28.0 - Touch gesture system

### State Management & Data

- **Zustand** 5.0.8 - Lightweight state management
- **AsyncStorage** 2.2.0 - Persistent local storage
- **Zod** 4.1.13 - Runtime validation and type safety

### Developer Experience

- **ESLint** 9.25.0 - Code linting
- **expo-constants** 18.0.10 - Environment constants
- **React Native Safe Area Context** 5.6.0 - Safe area handling

## Project Structure

```
VidCut/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── _layout.tsx          # Tabs layout configuration
│   │   ├── index.tsx            # Home screen (Reels/Grid view)
│   │   ├── add.tsx              # Add video screen
│   │   └── favorites.tsx        # Favorites screen
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Entry point (onboarding router)
│   ├── onboarding.tsx           # Onboarding screens
│   ├── editor.tsx               # Video editor with crop functionality
│   ├── details.tsx              # Video details view
│   ├── export.tsx               # Video export screen
│   └── reel.tsx                 # Full-screen reel player
│
├── components/                   # Reusable React components
│   ├── editor/                   # Editor-specific components
│   │   ├── aspect-ratio-selector.tsx
│   │   ├── editor-top-bar.tsx
│   │   ├── preview-crop-toggle.tsx
│   │   └── video-player-controls.tsx
│   ├── video-thumbnail-scrubber.tsx  # Timeline scrubber
│   ├── reels-video-card.tsx         # Reels view video card
│   ├── video-card.tsx               # Grid view video card
│   ├── folder-view.tsx              # Grid layout component
│   ├── metadata-modal.tsx           # Video metadata input
│   ├── success-modal.tsx            # Success feedback
│   └── error-modal.tsx              # Error handling UI
│
├── store/                        # Zustand state management
│   └── video-store.ts           # Video state and persistence
│
├── hooks/                        # Custom React hooks
│   └── use-video-cropping.ts    # Video cropping logic
│
├── utils/                        # Utility functions
│   ├── video-utils.ts           # Video operations (pick, record, save, share)
│   ├── errors.ts                # Error handling utilities
│   └── validation.ts            # Zod validation schemas
│
├── services/                     # Business logic layer
│   └── video-service.ts         # Video processing services
│
├── constants/                    # App-wide constants
│   ├── app.ts                   # Configuration constants
│   └── theme.ts                 # Theme constants
│
├── types/                        # TypeScript type definitions
│   └── video.ts                 # Video-related interfaces
│
├── assets/                       # Static assets
│   └── images/                  # App images and icons
│
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js           # TailwindCSS configuration
└── metro.config.js              # Metro bundler configuration
```

## Setup Guide

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn**
- **Expo CLI** (installed automatically)
- **iOS**: macOS with Xcode 15+ (for iOS development)
- **Android**: Android Studio with SDK 34+ (for Android development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd VidCut
   ```

2. **Install dependencies**

   ```bash
   npm install npm expo install
   ```

3. **Start the prebuild --clean**

   ```bash
   npx expo prebuild --clean
   ```

4. **Run on your preferred platform**

   - For iOS

   ```bash
   npx expo run:ios
   ```

   - For Android

   ```bash
   npx expo run:android
   ```

   - Wait for building completion

## Configuration

### App Configuration (`app.json`)

Key settings in `app.json`:

- **Bundle Identifier**: `com.mchtkk.VidCut`
- **App Name**: `5econds`
- **Permissions**: Media library, camera, microphone access
- **Orientation**: Portrait only
- **New Architecture**: Enabled for better performance

### Environment Variables

No environment variables required for basic setup. The app works out of the box.

### Permissions

The app requests the following permissions:

- **iOS**: Photos, Camera, Microphone
- **Android**: Read/Write External Storage, Media Location, Camera, Microphone

## Architecture Highlights

### Video Processing Pipeline

1. **Import/Record** → Video selected or recorded
2. **Validation** → Duration and format checked (max 2 minutes)
3. **Editor** → User selects 5-second segment with scrubber
4. **Metadata** → User adds name and description
5. **Cropping** → Video trimmed using `expo-trim-video`
6. **Storage** → Saved to app storage + device gallery
7. **Playback** → Displayed in Reels or Grid view

### State Management

Uses **Zustand** with AsyncStorage persistence:

- `videos[]` - Temporary imported videos
- `croppedVideos[]` - Finalized 5-second clips
- `selectedVideo` - Currently editing video
- `selectedCroppedVideo` - Currently viewing video

### Memory Optimization

The app implements aggressive memory management to prevent leaks:

- **No Thumbnail Caching** in scrubber (timeline-based UI instead)
- **Image Cache Clearing** on screen transitions
- **Player Resource Cleanup** on unmount
- **FlatList Optimizations** with `windowSize={3}` and `removeClippedSubviews`
- **Debounced Seeking** to prevent frame accumulation

### Performance Features

- **Reanimated** for 60fps animations
- **Lazy Loading** for video thumbnails
- **Optimized FlatList** with `getItemLayout`
- **Concurrent Rendering** with React 19
- **New React Native Architecture** enabled

## Known Issues & Limitations

- **Maximum Video Duration**: 2 minutes (configurable in `constants/app.ts`)
- **Platform**: iOS and Android

## Troubleshooting

### Issue: "Module not found" errors

**Solution**: Clear Metro cache and reinstall

```bash
rm -rf node_modules
npm install
npx expo start -c
```

### Issue: Android build fails

**Solution**: Clean Android build

```bash
cd android
./gradlew clean
cd ..
npx expo prebuild --platform android --clean
```

### Issue: Video playback stuttering

**Solution**: Ensure you're testing on a physical device or enable hardware acceleration in emulator settings.

### Issue: Memory warnings on iOS

**Solution**: This is expected with video processing. The app has aggressive memory management built-in. Close other apps if warnings persist.

## Contributing

This is a case study project for Sevenapps. For issues or feature requests, please contact the development team.

## License

Proprietary - All rights reserved

## Credits

Built with ❤️ using Expo and React Native

**Bundle ID**: `com.mchtkk.VidCut`
**Version**: 1.0.0
**Last Updated**: November 2025
