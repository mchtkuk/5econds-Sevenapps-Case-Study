import { File } from "expo-file-system"; // FIXED: Use modern File API
import * as VideoThumbnails from "expo-video-thumbnails";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Image, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

// Aggressive cache clearing helper
const clearImageCache = () => {
  if ((Image as any).clearMemoryCache) (Image as any).clearMemoryCache();
  if ((Image as any).clearDiskCache) (Image as any).clearDiskCache();
};

interface TrimChange {
  start: number;
  end: number;
}

interface VideoThumbnailScrubberProps {
  videoUri: string;
  duration: number; // in milliseconds
  onTrimChange: (trim: TrimChange) => void;
  onScrubComplete: (start: number) => void;
  trimDuration: number;
}

const SCRUBBER_HEIGHT = 60;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const THUMBNAIL_WIDTH = 60;
const YELLOW_FRAME_WIDTH = THUMBNAIL_WIDTH * 5;
const YELLOW_BORDER = 4;

const LoadingSkeleton = () => (
  <View
    style={{
      height: SCRUBBER_HEIGHT,
      backgroundColor: "#2a2a2a",
      width: SCREEN_WIDTH,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ color: "#555", fontSize: 10 }}>Generating timeline...</Text>
  </View>
);

export const VideoThumbnailScrubber: React.FC<VideoThumbnailScrubberProps> =
  React.memo(
    ({ videoUri, duration, onTrimChange, onScrubComplete, trimDuration }) => {
      const [thumbnails, setThumbnails] = useState<string[]>([]);
      const [loading, setLoading] = useState(true);
      const [displayTimes, setDisplayTimes] = useState({
        start: 0,
        center: 0,
        end: 0,
      });

      const scrollViewRef = useRef<Animated.ScrollView>(null);
      const scrollX = useSharedValue(0);
      const isMounted = useRef(true);

      // Track generated files to delete them later
      const generatedFiles = useRef<string[]>([]);

      useEffect(() => {
        isMounted.current = true;
        let isGenerating = true;

        const generateThumbnails = async () => {
          try {
            setLoading(true);
            setThumbnails([]);
            generatedFiles.current = [];
            clearImageCache();

            const totalSeconds = Math.ceil(duration / 1000);
            const BATCH_SIZE = 10;

            for (let i = 0; i < totalSeconds; i += BATCH_SIZE) {
              if (!isMounted.current || !isGenerating) break;

              const batchPromises = [];
              const end = Math.min(i + BATCH_SIZE, totalSeconds);

              for (let sec = i; sec < end; sec++) {
                const time = sec * 1000;
                batchPromises.push(
                  VideoThumbnails.getThumbnailAsync(videoUri, {
                    time,
                    quality: 0.3, // Low quality saves memory
                  }).catch(() => null)
                );
              }

              const results = await Promise.all(batchPromises);

              if (!isMounted.current) break;

              const newThumbs: string[] = [];
              results.forEach((r) => {
                if (r?.uri) {
                  newThumbs.push(r.uri);
                  generatedFiles.current.push(r.uri); // Track for deletion
                }
              });

              setThumbnails((prev) => [...prev, ...newThumbs]);

              // Clear memory cache periodically during generation
              if (i % 20 === 0) clearImageCache();

              // Pause to let the UI thread breathe
              await new Promise((resolve) => setTimeout(resolve, 50));
            }
          } catch (error) {
            console.error("Error generating thumbnails:", error);
          } finally {
            if (isMounted.current) setLoading(false);
          }
        };

        generateThumbnails();

        // --- NUCLEAR CLEANUP ON UNMOUNT ---
        return () => {
          console.log("[Scrubber] Unmounting - Deleting temp files...");
          isMounted.current = false;
          isGenerating = false;
          setThumbnails([]);

          // 1. Clear Image Cache
          clearImageCache();

          // 2. DELETE FILES FROM DISK (Updated for new Expo API)
          const filesToDelete = [...generatedFiles.current];

          filesToDelete.forEach((uri) => {
            try {
              if (uri.startsWith("file://")) {
                // FIXED: Use the new File class API
                const file = new File(uri);
                file.delete(); // This is typically synchronous/void in the new API
              }
            } catch (e) {
              // Ignore deletion errors (file might not exist)
            }
          });
        };
      }, [videoUri, duration]);

      const updateTrimState = (scrollPosition: number) => {
        const pixelsPerMs = THUMBNAIL_WIDTH / 1000;
        const startTime = scrollPosition / pixelsPerMs;
        const clampedStart = Math.max(
          0,
          Math.min(startTime, duration - trimDuration)
        );

        setDisplayTimes({
          start: clampedStart,
          center: clampedStart + trimDuration / 2,
          end: clampedStart + trimDuration,
        });

        onTrimChange({ start: clampedStart, end: clampedStart + trimDuration });
      };

      const performPlayerSeek = (scrollPosition: number) => {
        const pixelsPerMs = THUMBNAIL_WIDTH / 1000;
        const startTime = scrollPosition / pixelsPerMs;
        const clampedStart = Math.max(
          0,
          Math.min(startTime, duration - trimDuration)
        );
        onScrubComplete(clampedStart);
      };

      const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
          scrollX.value = event.contentOffset.x;
          runOnJS(updateTrimState)(event.contentOffset.x);
        },
        onEndDrag: (event) => {
          runOnJS(performPlayerSeek)(event.contentOffset.x);
        },
        onMomentumEnd: (event) => {
          runOnJS(performPlayerSeek)(event.contentOffset.x);
        },
      });

      return (
        <View className="mb-4">
          {/* Time Labels */}
          <View className="relative w-full mb-2" style={{ height: 20 }}>
            <View
              style={{
                position: "absolute",
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

          {/* Scrubber Area */}
          <View className="relative w-full" style={{ height: SCRUBBER_HEIGHT }}>
            {loading && thumbnails.length === 0 ? (
              <LoadingSkeleton />
            ) : (
              <>
                <Animated.ScrollView
                  ref={scrollViewRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  onScroll={scrollHandler}
                  scrollEventThrottle={16}
                  decelerationRate="fast"
                  removeClippedSubviews={true}
                  contentContainerStyle={{
                    paddingHorizontal: (SCREEN_WIDTH - YELLOW_FRAME_WIDTH) / 2,
                  }}
                  style={{ width: SCREEN_WIDTH, height: SCRUBBER_HEIGHT }}
                >
                  {thumbnails.map((thumb, index) => (
                    <View
                      key={index}
                      style={{
                        width: THUMBNAIL_WIDTH,
                        height: SCRUBBER_HEIGHT,
                      }}
                    >
                      <Image
                        source={{ uri: thumb }}
                        style={{
                          width: THUMBNAIL_WIDTH,
                          height: SCRUBBER_HEIGHT,
                        }}
                        resizeMode="cover"
                        fadeDuration={0}
                      />
                    </View>
                  ))}
                </Animated.ScrollView>
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
    }
  );

function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
