import { AspectRatioSelector } from "@/components/editor/aspect-ratio-selector";
import { EditorTopBar } from "@/components/editor/editor-top-bar";
import { PreviewCropToggle } from "@/components/editor/preview-crop-toggle";
import { VideoPlayerControls } from "@/components/editor/video-player-controls";
import { MetadataModal } from "@/components/metadata-modal";
import { SuccessModal } from "@/components/success-modal";
import { VideoThumbnailScrubber } from "@/components/video-thumbnail-scrubber";
import { TOLERANCE, VIDEO } from "@/constants/app";
import { useVideoCropping } from "@/hooks/use-video-cropping";
import { useVideoStore } from "@/store/video-store";
import { AspectRatio } from "@/types/video";
import { formatDuration, generateThumbnail } from "@/utils/video-utils";
import { useRouter } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function EditorScreen() {
  const router = useRouter();
  const { selectedVideo, addCroppedVideo } = useVideoStore();
  const insets = useSafeAreaInsets();

  // Initialize video player
  const player = useVideoPlayer(selectedVideo?.uri || "", (player) => {
    player.loop = true; // Loop the video for preview
    player.muted = false; // Enable sound
    player.volume = 1.0; // Full volume
  });

  // Initialize modal preview player
  const modalPlayer = useVideoPlayer(selectedVideo?.uri || "", (player) => {
    player.loop = true;
    player.muted = false;
    player.volume = 1.0;
  });

  // Initialize video cropping hook
  const { mutate: cropVideo, isPending: isCropping } = useVideoCropping();

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState<number>(VIDEO.CROP_DURATION_MS);
  const [isPreviewMode, setIsPreviewMode] = useState(false); // Toggle between cropped/uncropped mode

  // Animation for toggle switch
  const togglePosition = useSharedValue(1); // Start on Crop (right side)
  const scrubberHeight = useSharedValue(1); // Start visible (in crop mode)

  useEffect(() => {
    // When isPreviewMode is true, indicator is on "Preview" (left side, position 0)
    // When isPreviewMode is false, indicator is on "Crop" (right side, position 1)
    togglePosition.value = withTiming(isPreviewMode ? 0 : 1, { duration: 200 });

    // Animate scrubber in/out
    scrubberHeight.value = withTiming(isPreviewMode ? 0 : 1, { duration: 300 });
  }, [isPreviewMode]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: togglePosition.value * 68 }], // Half of 140px width minus padding
    };
  });

  const animatedScrubberStyle = useAnimatedStyle(() => {
    return {
      height: scrubberHeight.value * 150, // Approximate height of scrubber with padding
      opacity: scrubberHeight.value,
      overflow: "hidden",
    };
  });

  // Modal states
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [videoName, setVideoName] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [selectedAspectRatio, setSelectedAspectRatio] =
    useState<AspectRatio>("original");
  const [showScrubber, setShowScrubber] = useState(true); // Control scrubber visibility for cleanup

  // Get dynamic aspect ratios based on video
  const getAspectRatios = (): {
    value: AspectRatio;
    label: string;
    icon: string;
  }[] => {
    // Check if video is already 9:16
    const width = selectedVideo?.width || 0;
    const height = selectedVideo?.height || 0;
    const ratio = width / height;
    const is9by16 = Math.abs(ratio - 9 / 16) < 0.1; // Tolerance of 0.1

    const videoRatio = getVideoAspectRatioString();
    const originalLabel = videoRatio ? `Original ${videoRatio}` : "Original";

    // If already 9:16, only show Original
    if (is9by16) {
      return [
        {
          value: "original",
          label: originalLabel,
          icon: "resize",
        },
      ];
    }

    // If NOT 9:16, show Original + 9:16 option
    return [
      {
        value: "original",
        label: originalLabel,
        icon: "resize",
      },
      {
        value: "9:16",
        label: "9:16",
        icon: "phone-portrait",
      },
    ];
  };

  // Always use "original" as default - removed auto-detection

  // Get actual video aspect ratio as string (e.g., "16:9")
  const getVideoAspectRatioString = (): string => {
    if (!selectedVideo?.width || !selectedVideo?.height) return "";
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(selectedVideo.width, selectedVideo.height);
    const w = selectedVideo.width / divisor;
    const h = selectedVideo.height / divisor;
    return `${w}:${h}`;
  };

  // Calculate cropped dimensions based on aspect ratio
  const calculateCroppedDimensions = (): { width?: number; height?: number } => {
    const originalWidth = selectedVideo?.width;
    const originalHeight = selectedVideo?.height;

    // If no dimensions or original aspect ratio selected, keep original
    if (!originalWidth || !originalHeight || selectedAspectRatio === "original") {
      return { width: originalWidth, height: originalHeight };
    }

    // Calculate 9:16 dimensions
    if (selectedAspectRatio === "9:16") {
      const targetRatio = 9 / 16;
      const originalRatio = originalWidth / originalHeight;

      if (originalRatio > targetRatio) {
        // Original is wider (landscape) - crop width, keep height
        const newWidth = Math.round(originalHeight * targetRatio);
        return { width: newWidth, height: originalHeight };
      } else {
        // Original is taller - crop height, keep width (unlikely for 16:9 → 9:16)
        const newHeight = Math.round(originalWidth / targetRatio);
        return { width: originalWidth, height: newHeight };
      }
    }

    return { width: originalWidth, height: originalHeight };
  };

  // Handle back button navigation with cleanup
  const handleBackNavigation = () => {
    // Step 1: Hide scrubber to trigger cleanup
    setShowScrubber(false);

    // Step 2: Cleanup players
    try {
      if (player) player.pause();
    } catch (error) {
      // Ignore
    }
    try {
      if (modalPlayer) modalPlayer.pause();
    } catch (error) {
      // Ignore
    }

    // Step 3: Navigate after cleanup has time to run
    setTimeout(() => {
      router.push("/(tabs)");
    }, 300);
  };

  useEffect(() => {
    if (!selectedVideo) {
      router.push("/(tabs)");
      return;
    }

    // Always default to "original" (video's native aspect ratio)
    setSelectedAspectRatio("original");

    // Cleanup players when component unmounts
    return () => {
      try {
        if (player) {
          player.pause();
        }
      } catch (error) {
        // Ignore - player may already be destroyed
      }
      try {
        if (modalPlayer) {
          modalPlayer.pause();
        }
      } catch (error) {
        // Ignore - player may already be destroyed
      }
    };
  }, [selectedVideo]);

  // Update duration and playback state from player
  useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      const currentTimeMs = player.currentTime * 1000;
      const durationMs = player.duration * 1000;

      setCurrentTime(currentTimeMs);
      setDuration(durationMs);
      setIsPlaying(player.playing);

      // Auto loop within trim range (only in edit mode, not preview mode)
      if (!isPreviewMode && trimEnd > 0 && currentTimeMs >= trimEnd) {
        player.currentTime = trimStart / 1000;
        // Keep playing (loop the 5-second segment)
      }
    }, 100);

    return () => clearInterval(interval);
  }, [player, trimEnd, trimStart, isPreviewMode]);

  useEffect(() => {
    if (duration > 0) {
      // Ensure trimEnd is always 5 seconds from trimStart
      const maxEnd = Math.min(trimStart + VIDEO.CROP_DURATION_MS, duration);
      setTrimEnd(maxEnd);
    }
  }, [duration, trimStart]);

  // Seek player to trimStart whenever it changes (when user scrubs)
  useEffect(() => {
    if (player && trimStart >= 0 && !isPreviewMode) {
      player.currentTime = trimStart / 1000; // Convert ms to seconds
    }
  }, [player, trimStart, isPreviewMode]);

  // Reset to start when toggling preview mode
  useEffect(() => {
    if (player) {
      if (isPreviewMode) {
        // Preview mode: start from beginning
        player.currentTime = 0;
      } else {
        // Edit mode: start from trimStart
        player.currentTime = trimStart / 1000;
      }
    }
  }, [player, isPreviewMode, trimStart]);

  // Control modal preview player
  useEffect(() => {
    if (showMetadataModal && modalPlayer) {
      try {
        // Start from trimStart
        modalPlayer.currentTime = trimStart / 1000;
        modalPlayer.play();

        // Loop within trim range
        const interval = setInterval(() => {
          try {
            const currentTimeMs = modalPlayer.currentTime * 1000;
            if (currentTimeMs >= trimEnd) {
              modalPlayer.currentTime = trimStart / 1000;
            }
          } catch (error) {
            // Ignore - player may be destroyed
          }
        }, 100);

        return () => clearInterval(interval);
      } catch (error) {
        // Ignore - player may be destroyed
      }
    } else if (!showMetadataModal && modalPlayer) {
      // Stop when modal closes
      try {
        modalPlayer.pause();
      } catch (error) {
        // Ignore - player may already be destroyed
      }
    }
  }, [showMetadataModal, modalPlayer, trimStart, trimEnd]);

  const handlePlayPause = () => {
    if (!player) return;

    try {
      if (isPlaying) {
        player.pause();
        setIsPlaying(false);
      } else {
        player.play();
        setIsPlaying(true);
      }
    } catch (error) {
      // Ignore - player may be destroyed
    }
  };

  const handleApplyCrop = () => {
    if (!selectedVideo) return;

    // Validate video length
    if (duration < VIDEO.CROP_DURATION_MS) {
      Alert.alert("Video Too Short", "Video must be at least 5 seconds long");
      return;
    }

    // Validate trim range is exactly 5 seconds
    const cropDuration = trimEnd - trimStart;
    if (
      Math.abs(cropDuration - VIDEO.CROP_DURATION_MS) > TOLERANCE.DURATION_MS
    ) {
      Alert.alert("Invalid Duration", "Crop must be exactly 5 seconds");
      return;
    }

    // Pause the main player before opening modal
    try {
      if (player) {
        player.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      // Ignore - player may be destroyed
    }

    // Show metadata modal to collect name and description
    setShowMetadataModal(true);
  };

  const handleSaveCroppedVideo = () => {
    if (!selectedVideo) return;

    // Validate metadata
    if (!videoName.trim()) {
      Alert.alert(
        "Required Field",
        "Please enter a name for your video diary entry"
      );
      return;
    }

    if (!videoDescription.trim()) {
      Alert.alert(
        "Required Field",
        "Please enter a description for your video diary entry"
      );
      return;
    }

    // Execute video cropping via Tanstack Query
    cropVideo(
      {
        videoUri: selectedVideo.uri,
        startTime: trimStart,
        endTime: trimEnd,
      },
      {
        onSuccess: async (data) => {
          // Generate thumbnail for the cropped video
          const thumbnail = await generateThumbnail(data.uri);

          // Calculate dimensions based on selected aspect ratio
          const { width, height } = calculateCroppedDimensions();

          // Save to cropped videos store
          const croppedVideo = {
            id: Date.now().toString(),
            name: videoName,
            description: videoDescription,
            uri: data.uri,
            originalVideoUri: selectedVideo.uri,
            startTime: trimStart,
            endTime: trimEnd,
            duration: data.duration,
            thumbnail: thumbnail || undefined,
            width,
            height,
            aspectRatio: selectedAspectRatio,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          addCroppedVideo(croppedVideo);

          setShowMetadataModal(false);
          setVideoName("");
          setVideoDescription("");
          setShowSuccessModal(true);
        },
        onError: (error) => {
          Alert.alert("Error", `Failed to crop video: ${error.message}`);
        },
      }
    );
  };

  if (!selectedVideo) {
    return null;
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-black" edges={[]}>
        {/* Video Player - Full Height */}
        <View className="relative flex-1 bg-black">
          {player && selectedVideo ? (
            <>
              <VideoView
                player={player}
                style={{ width: "100%", height: "100%" }}
                contentFit={
                  selectedAspectRatio === "original" ? "contain" : "cover"
                }
                nativeControls={false}
                allowsPictureInPicture={false}
              />
            </>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#0095f6" />
              <Text style={{ color: "white", marginTop: 8 }}>
                Loading video...
              </Text>
            </View>
          )}

          {/* Top Navigation Bar */}
          <EditorTopBar
            onBack={handleBackNavigation}
            onSave={handleApplyCrop}
            isSaving={isCropping}
            disabled={isCropping || duration < VIDEO.CROP_DURATION_MS}
            topInset={insets.top}
          />

          {/* Aspect Ratio Selector - Bottom Right */}
          <AspectRatioSelector
            selectedRatio={selectedAspectRatio}
            onRatioChange={setSelectedAspectRatio}
            options={getAspectRatios()}
          />

          {/* Preview/Crop Toggle Switch - Bottom Right */}
          <PreviewCropToggle
            isPreviewMode={isPreviewMode}
            onToggle={() => setIsPreviewMode(!isPreviewMode)}
            animatedIndicatorStyle={animatedIndicatorStyle}
          />

          {/* Video Player Controls */}
          <VideoPlayerControls
            isPlaying={isPlaying}
            onTogglePlay={handlePlayPause}
            currentTime={formatDuration(currentTime)}
            totalDuration={formatDuration(duration)}
          />
        </View>

        {/* Bottom Controls - Animated scrubber */}
        <Animated.View
          className="bg-instagram-surface"
          style={animatedScrubberStyle}
        >
          <View className="p-4">
            {selectedVideo && duration > 0 && showScrubber && (
              <VideoThumbnailScrubber
                videoUri={selectedVideo.uri}
                duration={duration}
                onTrimChange={(start, end) => {
                  setTrimStart(start);
                  setTrimEnd(end);
                }}
                trimDuration={VIDEO.CROP_DURATION_MS}
              />
            )}
          </View>
        </Animated.View>

        {/* Metadata Modal - for Name and Description */}
        <MetadataModal
          visible={showMetadataModal}
          onClose={() => {
            setShowMetadataModal(false);
            setVideoName("");
            setVideoDescription("");
            // Stop modal player when closing
            try {
              if (modalPlayer) modalPlayer.pause();
            } catch (error) {
              // Ignore - player may already be destroyed
            }
          }}
          onSave={handleSaveCroppedVideo}
          videoPlayer={modalPlayer}
          videoName={videoName}
          videoDescription={videoDescription}
          onNameChange={setVideoName}
          onDescriptionChange={setVideoDescription}
          trimStart={trimStart}
          trimEnd={trimEnd}
          isSaving={isCropping}
          aspectRatio={selectedAspectRatio}
        />

        {/* Success Modal */}
        <SuccessModal
          visible={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);

            // Hide scrubber to trigger cleanup
            setShowScrubber(false);

            // Stop all players before navigating away
            try {
              if (player) player.pause();
            } catch (error) {
              // Ignore - player may already be destroyed
            }
            try {
              if (modalPlayer) modalPlayer.pause();
            } catch (error) {
              // Ignore - player may already be destroyed
            }

            // Navigate after cleanup
            setTimeout(() => {
              router.push("/(tabs)");
            }, 300);
          }}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
