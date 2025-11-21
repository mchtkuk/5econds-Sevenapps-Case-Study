# VidCut - Quick Start Guide

Get VidCut running on your device in 5 minutes!

## Prerequisites

- Node.js v20+ installed
- npm or yarn installed
- Expo Go app on your mobile device ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm start
```

This will:
- Start the Metro bundler
- Generate a QR code
- Open the Expo Dev Tools in your browser

### 3. Open on Your Device

#### iOS (iPhone/iPad)
1. Open the Camera app
2. Point at the QR code
3. Tap the notification to open in Expo Go

#### Android
1. Open Expo Go app
2. Tap "Scan QR Code"
3. Point at the QR code

## First Time Setup

### Grant Permissions
When you first open the app:
1. Tap "Import Video" to trigger media library permission
2. Grant permission when prompted
3. Tap "Record Video" to trigger camera permission
4. Grant permission when prompted

## Testing the App

### Quick Test Flow
1. **Import a Video**
   - Tap "Import Video"
   - Select any video from your gallery
   - Wait for thumbnail to generate

2. **Open the Editor**
   - Tap on the video card
   - Video editor screen opens

3. **Test Playback**
   - Tap the play button
   - Video should play
   - Tap pause to stop

4. **Test Trim**
   - Drag the "Start" slider
   - Drag the "End" slider
   - Play video to see trim in action

5. **Add Text**
   - Tap "Add Text" button
   - Enter some text (e.g., "Hello World")
   - Tap "Add"
   - Success message appears

6. **Apply Filter**
   - Tap "Filters" button
   - Select "GRAYSCALE"
   - Tap "Apply"
   - Success message appears

7. **Check Project**
   - Navigate to "Projects" tab
   - See your project with stats
   - View text overlays and filters

8. **Export Video**
   - Go back to editor
   - Tap export icon (top right)
   - Select quality (e.g., "Medium Quality")
   - Tap "Start Export"
   - Wait for progress to complete
   - Tap "Done" or try sharing

## Common Commands

```bash
# Start development server
npm start

# Start with cache cleared
npm start --clear

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web

# Lint code
npm run lint

# Reset project (if needed)
npm run reset-project
```

## Project Structure Overview

```
VidCut/
├── app/                    # All screens (Expo Router)
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Home (Videos)
│   │   └── explore.tsx    # Projects
│   ├── editor.tsx         # Video editor
│   └── export.tsx         # Export screen
├── components/            # Reusable UI components
├── store/                 # Zustand state management
├── types/                 # TypeScript types
└── utils/                 # Helper functions
```

## Troubleshooting

### App won't connect to server
- Make sure your phone and computer are on the same WiFi network
- Try clearing cache: `npm start --clear`
- Restart the Expo Go app

### Permissions not working
- Check device settings
- Grant all permissions manually
- Restart the app

### Videos won't import
- Make sure you have videos on your device
- Check storage permissions
- Try recording a video first

### Thumbnails not showing
- Thumbnails generate asynchronously
- Wait a few seconds
- Pull down to refresh (if implemented)

### Build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear metro cache
npm start --clear

# Clear watchman (Mac only)
watchman watch-del-all
```

## Development Tips

### Hot Reload
- Changes to code automatically reload in the app
- Press `r` in terminal to manually reload
- Press `m` to toggle menu
- Shake device to open developer menu

### Debugging
1. Shake your device to open the menu
2. Tap "Debug Remote JS"
3. Open browser console for logs

### Device Logs
- iOS: `npx react-native log-ios`
- Android: `npx react-native log-android`

## Features to Test

✅ **Must Test**
- [ ] Import video from gallery
- [ ] Record video with camera
- [ ] Video grid display
- [ ] Video playback
- [ ] Trim controls
- [ ] Add text overlay
- [ ] Apply filters
- [ ] Export video
- [ ] Share video
- [ ] Project tracking

⚠️ **Known Limitations**
- Export is simulated (no actual video processing)
- Filters are tracked but not visually applied
- Text overlays are stored but not rendered on video

## What's Working vs What's Simulated

### Fully Working ✅
- Video import and recording
- Thumbnail generation
- Video playback and controls
- UI/UX and navigation
- State management
- Permission handling
- All user interactions

### Simulated 🔧
- Video export (shows progress but doesn't process)
- Filter visual effects (tracked but not applied)
- Text overlay rendering (stored but not burned in)

## Next Development Steps

If you want to contribute or extend:

1. **Add Real Video Processing**
   - Integrate FFmpeg or similar
   - Implement actual trim/cut
   - Add text overlay rendering

2. **Enhance UI**
   - Add more animations
   - Improve feedback
   - Add loading states

3. **Add Features**
   - Multiple video merging
   - More filters
   - Audio editing
   - Video templates

## Getting Help

- Check `README_VIDCUT.md` for full documentation
- Review `TEST_GUIDE.md` for testing scenarios
- See `IMPLEMENTATION_SUMMARY.md` for technical details

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo AV Documentation](https://docs.expo.dev/versions/latest/sdk/av/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## Quick Reference

### Key Files to Edit
- **Home Screen**: `app/(tabs)/index.tsx`
- **Editor Screen**: `app/editor.tsx`
- **Export Screen**: `app/export.tsx`
- **State**: `store/videoStore.ts`
- **Types**: `types/video.ts`
- **Utils**: `utils/videoUtils.ts`

### Adding a New Feature
1. Define types in `types/video.ts`
2. Add state management in `store/videoStore.ts`
3. Create UI components in `components/`
4. Add screen or update existing in `app/`
5. Test thoroughly

## Support

For issues or questions:
- Check error messages in console
- Review documentation files
- Test on physical device (not just simulator)

---

**VidCut Quick Start Guide**
Version 1.0.0

Happy coding! 🚀
