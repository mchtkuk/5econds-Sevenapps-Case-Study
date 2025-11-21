# VidCut - Test Guide

This document provides a comprehensive testing guide for the VidCut video editor application, based on the test case requirements.

## Test Environment Setup

### Prerequisites
1. Expo Go app installed on physical device (iOS or Android)
2. Development server running (`npm start`)
3. Test videos available on device for import testing

### Device Requirements
- iOS 13+ or Android 8+
- Camera access
- Storage access
- Minimum 2GB free storage for video processing

## Test Cases

### 1. Application Launch & Permissions

**Test Case 1.1: Initial Launch**
- **Steps**:
  1. Launch the VidCut app
  2. Observe the home screen
- **Expected Result**:
  - App launches successfully
  - "VidCut - Your Video Editor" header visible
  - Two action buttons: "Import Video" and "Record Video"
  - Empty state message: "Import or record a video to get started"

**Test Case 1.2: Permission Requests**
- **Steps**:
  1. Tap "Import Video"
  2. Grant media library permissions when prompted
  3. Tap "Record Video"
  4. Grant camera permissions when prompted
- **Expected Result**:
  - Permission dialogs appear with custom messages
  - Permissions are granted successfully
  - User can proceed with video operations

### 2. Video Import

**Test Case 2.1: Import from Gallery**
- **Steps**:
  1. Tap "Import Video" button
  2. Select a video from gallery
  3. Wait for thumbnail generation
- **Expected Result**:
  - Gallery picker opens
  - Selected video appears in grid with thumbnail
  - Video card shows filename, duration, and resolution
  - Success alert: "Video imported successfully!"

**Test Case 2.2: Record Video**
- **Steps**:
  1. Tap "Record Video" button
  2. Record a short video (5-10 seconds)
  3. Confirm recording
- **Expected Result**:
  - Camera interface opens
  - Recording works properly
  - Recorded video appears in grid
  - Success alert: "Video recorded successfully!"

**Test Case 2.3: Multiple Video Import**
- **Steps**:
  1. Import 3-5 videos using "Import Video"
  2. Observe the video grid
- **Expected Result**:
  - All videos display in 2-column grid
  - Each video card shows correct information
  - Thumbnails are visible
  - Videos are sorted by import time

### 3. Video Grid Display

**Test Case 3.1: Video Card Information**
- **Steps**:
  1. Import a video
  2. Examine the video card in the grid
- **Expected Result**:
  - Thumbnail image displayed
  - Duration badge in bottom-right (format: MM:SS or H:MM:SS)
  - Filename shown below thumbnail
  - Resolution displayed (e.g., "1920 x 1080")
  - Delete button (X) in top-right corner

**Test Case 3.2: Delete Video**
- **Steps**:
  1. Tap delete button (X) on a video card
  2. Confirm deletion in alert dialog
- **Expected Result**:
  - Confirmation dialog appears
  - Video is removed from grid
  - Grid updates immediately

### 4. Video Editor Navigation

**Test Case 4.1: Open Editor**
- **Steps**:
  1. Import a video
  2. Tap on the video card
- **Expected Result**:
  - Editor screen opens
  - Video is displayed in video player
  - Timeline controls are visible
  - Tool buttons are visible at bottom

**Test Case 4.2: Editor Header**
- **Steps**:
  1. Open editor with a video
  2. Observe the header
- **Expected Result**:
  - Back button (arrow) on left
  - "Video Editor" title in center
  - Export button (download icon) on right

### 5. Video Playback Controls

**Test Case 5.1: Play/Pause**
- **Steps**:
  1. Open a video in editor
  2. Tap play button
  3. Tap pause button
- **Expected Result**:
  - Video plays when play button tapped
  - Video pauses when pause button tapped
  - Button icon toggles between play and pause

**Test Case 5.2: Timeline Scrubbing**
- **Steps**:
  1. Open a video in editor
  2. Drag timeline slider left and right
  3. Observe video position
- **Expected Result**:
  - Video position updates as slider moves
  - Current time updates in real-time
  - Video frame updates during scrubbing

**Test Case 5.3: Time Display**
- **Steps**:
  1. Open a video in editor
  2. Play the video
  3. Observe time displays
- **Expected Result**:
  - Current time shown on left (format: M:SS)
  - Total duration shown on right
  - Times update in real-time during playback

### 6. Trim Functionality

**Test Case 6.1: Set Trim Start**
- **Steps**:
  1. Open a video in editor
  2. Drag "Start" trim slider to 5 seconds
  3. Observe the start time
- **Expected Result**:
  - Start slider moves smoothly
  - Start time displays correctly (0:05)
  - Green track indicates trim start position

**Test Case 6.2: Set Trim End**
- **Steps**:
  1. Open a video in editor
  2. Drag "End" trim slider to 10 seconds before end
  3. Observe the end time
- **Expected Result**:
  - End slider moves smoothly
  - End time displays correctly
  - Red track indicates trim end position

**Test Case 6.3: Playback with Trim**
- **Steps**:
  1. Set trim start at 5 seconds
  2. Set trim end at 15 seconds
  3. Play video
- **Expected Result**:
  - Video plays from trim start
  - Video pauses at trim end
  - Playback restarts from trim start

### 7. Text Overlay Feature

**Test Case 7.1: Add Text Overlay**
- **Steps**:
  1. Open a video in editor
  2. Tap "Add Text" button
  3. Enter "Test Text" in modal
  4. Tap "Add" button
- **Expected Result**:
  - Text input modal appears
  - Text can be entered
  - Modal closes after adding
  - Success alert: "Text overlay added!"

**Test Case 7.2: Cancel Text Overlay**
- **Steps**:
  1. Tap "Add Text" button
  2. Enter some text
  3. Tap "Cancel" button
- **Expected Result**:
  - Modal closes
  - No text overlay added
  - No changes to project

**Test Case 7.3: Multiple Text Overlays**
- **Steps**:
  1. Add 3 different text overlays
  2. Navigate to Projects tab
  3. Check text overlays section
- **Expected Result**:
  - All 3 text overlays are listed
  - Each shows the correct text content
  - Overlay count shows "3 overlays"

### 8. Filter Effects

**Test Case 8.1: Open Filter Modal**
- **Steps**:
  1. Open a video in editor
  2. Tap "Filters" button
- **Expected Result**:
  - Filter modal appears
  - Six filter options visible:
    - GRAYSCALE
    - SEPIA
    - BRIGHTNESS
    - CONTRAST
    - SATURATION
    - BLUR

**Test Case 8.2: Apply Filter**
- **Steps**:
  1. Open filter modal
  2. Tap "GRAYSCALE"
  3. Tap "Apply" button
- **Expected Result**:
  - GRAYSCALE option is highlighted
  - Modal closes
  - Success alert: "Filter applied!"
  - Filter visible in Projects tab

**Test Case 8.3: Multiple Filters**
- **Steps**:
  1. Apply GRAYSCALE filter
  2. Apply BRIGHTNESS filter
  3. Apply BLUR filter
  4. Check Projects tab
- **Expected Result**:
  - All filters are listed in Projects
  - Filter count shows "3 filters"
  - Each filter is individually listed

### 9. Projects Tab

**Test Case 9.1: Project Creation**
- **Steps**:
  1. Import a video
  2. Open editor
  3. Navigate to Projects tab
- **Expected Result**:
  - Project is automatically created
  - Project name shown (e.g., "Project_1234567890")
  - Creation date displayed
  - Project statistics visible

**Test Case 9.2: Project Statistics**
- **Steps**:
  1. Create a project with edits
  2. Add 2 text overlays and 1 filter
  3. Navigate to Projects tab
- **Expected Result**:
  - Videos count: correct number
  - Overlays count: 2 overlays
  - Filters count: 1 filter
  - Statistics update in real-time

**Test Case 9.3: Empty Project State**
- **Steps**:
  1. Fresh app launch
  2. Navigate to Projects tab without importing videos
- **Expected Result**:
  - Empty state displayed
  - "No Active Project" message
  - Description: "Import a video and start editing to create a project"
  - Feature list visible

### 10. Export Functionality

**Test Case 10.1: Open Export Screen**
- **Steps**:
  1. Open a video in editor
  2. Tap export button (download icon)
- **Expected Result**:
  - Export screen appears
  - "Export Video" header visible
  - Four quality options displayed
  - "Start Export" button at bottom

**Test Case 10.2: Quality Selection**
- **Steps**:
  1. On export screen, tap each quality option
  2. Observe selection state
- **Expected Result**:
  - Options:
    - Low Quality (480p - Smaller file size)
    - Medium Quality (720p - Balanced) - Default
    - High Quality (1080p - Best quality)
    - Original Quality (Keep original settings)
  - Selected option highlighted in blue
  - Checkmark appears on selected option

**Test Case 10.3: Export Process**
- **Steps**:
  1. Select "Medium Quality"
  2. Tap "Start Export"
  3. Observe progress
- **Expected Result**:
  - Progress bar appears
  - Percentage updates (0% to 100%)
  - Loading spinner visible
  - Text: "Exporting... X%"

**Test Case 10.4: Export Completion**
- **Steps**:
  1. Wait for export to complete
  2. Observe completion screen
- **Expected Result**:
  - Green checkmark icon appears
  - "Export Completed!" message
  - Alert dialog with three options:
    - Share
    - Save to Gallery
    - Done
  - Two action buttons: Share and Save

### 11. Sharing Functionality

**Test Case 11.1: Share Video**
- **Steps**:
  1. Complete video export
  2. Tap "Share" button
  3. Select sharing destination
- **Expected Result**:
  - Native share sheet appears
  - Various sharing options available
  - Video can be shared to selected app

**Test Case 11.2: Save to Gallery**
- **Steps**:
  1. Complete video export
  2. Tap "Save to Gallery" button
- **Expected Result**:
  - Success alert: "Video saved to gallery!"
  - Video appears in device gallery
  - Video saved in "VidCut" album

### 12. Navigation & UI

**Test Case 12.1: Tab Navigation**
- **Steps**:
  1. Tap "Videos" tab
  2. Tap "Projects" tab
  3. Return to "Videos" tab
- **Expected Result**:
  - Tabs switch smoothly
  - Content updates correctly
  - Active tab is highlighted
  - Tab icons change color when active

**Test Case 12.2: Back Navigation**
- **Steps**:
  1. Open editor
  2. Tap back button
  3. Open export screen
  4. Tap back button
- **Expected Result**:
  - User returns to previous screen
  - State is preserved
  - No data loss

**Test Case 12.3: Loading States**
- **Steps**:
  1. Import a large video
  2. Observe loading indicator
- **Expected Result**:
  - Loading spinner appears
  - Action buttons disabled during loading
  - Screen is not interactive during loading

### 13. Error Handling

**Test Case 13.1: Permission Denied**
- **Steps**:
  1. Deny media library permission
  2. Try to import video
- **Expected Result**:
  - Permission alert appears
  - Appropriate error message shown
  - App doesn't crash

**Test Case 13.2: Invalid Video**
- **Steps**:
  1. Try to import an invalid or corrupted video
- **Expected Result**:
  - Error alert appears
  - Video is not added to grid
  - App remains stable

### 14. Performance Testing

**Test Case 14.1: Multiple Videos**
- **Steps**:
  1. Import 10+ videos
  2. Scroll through grid
  3. Open and edit videos
- **Expected Result**:
  - Grid scrolls smoothly
  - No lag or performance issues
  - Thumbnails load efficiently

**Test Case 14.2: Long Video Handling**
- **Steps**:
  1. Import a video longer than 5 minutes
  2. Perform editing operations
- **Expected Result**:
  - Video loads successfully
  - Playback is smooth
  - Trim operations work correctly

### 15. UI/UX Testing

**Test Case 15.1: Dark Mode (if applicable)**
- **Steps**:
  1. Enable device dark mode
  2. Relaunch app
- **Expected Result**:
  - App adapts to system theme
  - All text is readable
  - Colors are appropriate

**Test Case 15.2: Responsive Layout**
- **Steps**:
  1. Rotate device to landscape
  2. Test all screens
- **Expected Result**:
  - Layout adapts to orientation
  - Content is visible and accessible
  - No UI elements are cut off

## Test Results Template

Use this template to document test results:

```
Test Case ID: [e.g., 2.1]
Test Case Name: [e.g., Import from Gallery]
Date Tested: [Date]
Tester: [Name]
Device: [e.g., iPhone 13, Android Pixel 6]
OS Version: [e.g., iOS 16.5]

Status: [ ] Pass [ ] Fail [ ] Blocked

Steps Executed:
1. [Step]
2. [Step]
3. [Step]

Actual Result:
[What actually happened]

Expected Result:
[What should have happened]

Issues Found:
[Any bugs or issues encountered]

Screenshots:
[Attach relevant screenshots]

Notes:
[Additional observations]
```

## Known Limitations

1. **Video Processing**: Current implementation uses simulated export. Real video processing requires native modules.
2. **Filter Preview**: Filters are tracked but not visually applied in current version.
3. **Split/Merge**: UI exists but full implementation pending.

## Test Coverage Summary

- ✅ Video Import
- ✅ Video Recording
- ✅ Video Display
- ✅ Playback Controls
- ✅ Trim Functionality
- ✅ Text Overlays
- ✅ Filter Selection
- ✅ Project Management
- ✅ Export Flow
- ✅ Sharing
- ✅ Navigation
- ⚠️ Actual Video Processing (simulated)
- ⚠️ Filter Visual Effects (tracked only)

## Reporting Issues

When reporting issues, include:
1. Test case ID
2. Device and OS version
3. Steps to reproduce
4. Expected vs actual result
5. Screenshots/videos if applicable
6. Error messages or logs

## Success Criteria

The app is considered production-ready when:
- All test cases pass
- No critical bugs
- Performance is acceptable
- UI/UX is polished
- All features work as specified
- Permissions are properly handled

---

**VidCut Test Guide**
Version 1.0.0
Last Updated: 2025-11-20
