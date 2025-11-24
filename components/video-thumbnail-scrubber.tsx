import { File } from "expo-file-system";
import * as VideoThumbnails from "expo-video-thumbnails";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Image, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";

// Clear React Native Image cache
const clearImageCache = () => {
  if ((Image as any).clearMemoryCache) {
    (Image as any).clearMemoryCache();
  }
  if ((Image as any).clearDiskCache) {
    (Image as any).clearDiskCache();
  }
};

interface VideoThumbnailScrubberProps {
  videoUri: string;
  duration: number; // in milliseconds
  onTrimChange: (startTime: number, endTime: number) => void;
  trimDuration: number; // fixed 5 seconds in milliseconds
}

const SCRUBBER_HEIGHT = 60;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const THUMBNAIL_WIDTH = 60; // Each thumbnail width (1 second)
const YELLOW_BORDER = 4; // Yellow border thickness
// Yellow frame shows exactly 5 seconds = 5 thumbnails
const YELLOW_FRAME_WIDTH = THUMBNAIL_WIDTH * 5; // 300px = 5 seconds

// Loading Skeleton Component
const LoadingSkeleton = () => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Calculate number of skeleton items to show
  const numSkeletons = Math.floor(SCREEN_WIDTH / THUMBNAIL_WIDTH) + 2;

  return (
    <View
      style={{
        flexDirection: "row",
        height: SCRUBBER_HEIGHT,
        alignItems: "center",
      }}
    >
      {Array.from({ length: numSkeletons }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            {
              width: THUMBNAIL_WIDTH,
              height: SCRUBBER_HEIGHT,
              backgroundColor: "#2a2a2a",
              marginRight: 0,
            },
            animatedStyle,
          ]}
        />
      ))}
    </View>
  );
};

export const VideoThumbnailScrubber: React.FC<VideoThumbnailScrubberProps> = ({
  videoUri,
  duration,
  onTrimChange,
  trimDuration,
}) => {
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayTimes, setDisplayTimes] = useState({
    start: 0,
    center: 0,
    end: 0,
  });
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);
  const thumbnailsRef = useRef<string[]>([]);

  // Generate thumbnails for ENTIRE video (1 per second)
  useEffect(() => {
    console.log('[VideoThumbnailScrubber] Component mounted');
    generateThumbnails();

    // Cleanup thumbnails on unmount to prevent memory leak
    return () => {
      console.log('[VideoThumbnailScrubber] Component unmounting - triggering cleanup');
      cleanupThumbnails();
    };
  }, [videoUri, duration]);

  const cleanupThumbnails = async () => {
    // Delete all thumbnail files from disk
    const thumbsToClean = thumbnailsRef.current;

    console.log(`[VideoThumbnailScrubber] Cleaning up ${thumbsToClean.length} thumbnails`);

    // Clear state immediately to stop rendering
    thumbnailsRef.current = [];
    setThumbnails([]);

    // Clear React Native Image cache
    clearImageCache();

    // Delete files from disk in background
    if (thumbsToClean.length > 0) {
      // Use Promise.all to delete in parallel for faster cleanup
      const deletePromises = thumbsToClean.map(async (thumbUri) => {
        try {
          const file = new File(thumbUri);
          await file.delete();
        } catch (err) {
          // Ignore errors - file may already be deleted
        }
      });

      await Promise.all(deletePromises);

      // Clear cache again after deletion
      clearImageCache();

      console.log(`[VideoThumbnailScrubber] Cleanup complete - deleted ${thumbsToClean.length} files`);
    }
  };

  const generateThumbnails = async () => {
    try {
      setLoading(true);

      // Clean up old thumbnails first
      await cleanupThumbnails();

      const thumbs: string[] = [];

      // Generate 1 thumbnail per second for accurate trimming
      const durationInSeconds = Math.floor(duration / 1000);

      // Generate thumbnails in batches to reduce memory pressure
      const BATCH_SIZE = 10;
      for (let batch = 0; batch < Math.ceil(durationInSeconds / BATCH_SIZE); batch++) {
        const start = batch * BATCH_SIZE;
        const end = Math.min(start + BATCH_SIZE, durationInSeconds);

        const batchPromises = [];
        for (let i = start; i < end; i++) {
          const time = i * 1000; // Time in milliseconds
          batchPromises.push(
            VideoThumbnails.getThumbnailAsync(videoUri, {
              time,
              quality: 0.3, // Lower quality to reduce memory
            }).catch((err) => {
              console.log("Error generating thumbnail:", err);
              return null;
            })
          );
        }

        const batchResults = await Promise.all(batchPromises);
        batchResults.forEach((result) => {
          if (result?.uri) {
            thumbs.push(result.uri);
          }
        });

        // Update state incrementally so UI shows progress
        thumbnailsRef.current = [...thumbs];
        setThumbnails([...thumbs]);
      }
    } catch (error) {
      console.error("Error generating thumbnails:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate current trim position based on scroll
  // The scroll position directly maps to the start time
  const updateTrimFromScroll = (scrollPosition: number) => {
    // Each thumbnail = 1 second, scroll position / thumbnail width = seconds elapsed
    const startTime = (scrollPosition / THUMBNAIL_WIDTH) * 1000;
    const clampedStart = Math.max(
      0,
      Math.min(startTime, duration - trimDuration)
    );

    // Update display times for labels
    setDisplayTimes({
      start: clampedStart,
      center: clampedStart + trimDuration / 2,
      end: clampedStart + trimDuration,
    });

    onTrimChange(clampedStart, clampedStart + trimDuration);
  };

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      runOnJS(updateTrimFromScroll)(event.contentOffset.x);
    },
  });

  return (
    <View className="mb-4">
      {/* Time labels above scrubber - positioned to match yellow frame */}
      <View className="relative w-full mb-2" style={{ height: 20 }}>
        <View
          className="absolute"
          style={{
            left: (SCREEN_WIDTH - YELLOW_FRAME_WIDTH) / 2,
            width: YELLOW_FRAME_WIDTH,
            flexDirection: "row",
            justifyContent: "space-between",
            top: -5,
          }}
        >
          <Text className="text-white text-xs font-medium">
            {formatTime(displayTimes.start)}
          </Text>
          <Text className="text-white text-xs font-medium">
            {formatTime(displayTimes.center)}
          </Text>
          <Text className="text-white text-xs font-medium">
            {formatTime(displayTimes.end)}
          </Text>
        </View>
      </View>

      {/* Full Width Timeline Container */}
      <View className="relative w-full" style={{ height: SCRUBBER_HEIGHT }}>
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Scrollable Timeline - Yellow frame scrolls with content */}
            <Animated.ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              onScroll={scrollHandler}
              scrollEventThrottle={16}
              snapToInterval={THUMBNAIL_WIDTH} // Snap to each second
              decelerationRate="fast"
              removeClippedSubviews={true} // Remove off-screen views from memory
              contentContainerStyle={{
                paddingLeft: (SCREEN_WIDTH - YELLOW_FRAME_WIDTH) / 2,
                paddingRight: (SCREEN_WIDTH - YELLOW_FRAME_WIDTH) / 2,
              }}
              style={{
                width: SCREEN_WIDTH,
                height: SCRUBBER_HEIGHT,
              }}
            >
              {thumbnails.map((thumb, index) => (
                <View key={`${videoUri}-${index}`} style={{ position: "relative" }}>
                  <Image
                    key={`thumb-${videoUri}-${index}`}
                    source={{ uri: thumb }}
                    style={{
                      width: THUMBNAIL_WIDTH,
                      height: SCRUBBER_HEIGHT,
                    }}
                    resizeMode="cover"
                    accessible={false}
                    accessibilityElementsHidden={true}
                    importantForAccessibility="no-hide-descendants"
                    fadeDuration={0}
                  />
                </View>
              ))}
            </Animated.ScrollView>

            {/* Yellow Frame - Fixed in center, always shows 5 thumbnails width */}
            <View
              className="absolute bg-transparent"
              style={{
                top: 0,
                left: (SCREEN_WIDTH - YELLOW_FRAME_WIDTH) / 2,
                width: YELLOW_FRAME_WIDTH,
                height: SCRUBBER_HEIGHT,
                borderRadius: 8,
                borderWidth: YELLOW_BORDER,
                borderColor: "#FBBF24",
              }}
              pointerEvents="none"
            />
          </>
        )}
      </View>
    </View>
  );
};

// Helper function to format time
function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
