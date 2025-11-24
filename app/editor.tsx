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
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Image, View } from "react-native";
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

const releasePlayer = (p: ReturnType<typeof useVideoPlayer> | null) => {
  if (!p) return;
  try {
    p.pause();
    // Async release prevents UI freeze
    p.replaceAsync(null).catch(() => {});
  } catch (error) {}
};

export default function EditorScreen() {
  const router = useRouter();
  const { selectedVideo, addCroppedVideo } = useVideoStore();
  const insets = useSafeAreaInsets();

  // UNMOUNT STATE: Prevents rendering during navigation
  const [isUnmounting, setIsUnmounting] = useState(false);

  // Initialize ONLY the main player
  const player = useVideoPlayer(selectedVideo?.uri || "", (p) => {
    p.loop = false;
    p.muted = false;
    p.volume = 1.0;
  });

  const { mutate: cropVideo, isPending: isCropping } = useVideoCropping();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState<number>(VIDEO.CROP_DURATION_MS);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [videoName, setVideoName] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [selectedAspectRatio, setSelectedAspectRatio] =
    useState<AspectRatio>("original");

  // Animations
  const togglePosition = useSharedValue(1);
  const scrubberHeight = useSharedValue(1);
  const isUserScrubbing = useRef(false);

  useEffect(() => {
    togglePosition.value = withTiming(isPreviewMode ? 0 : 1, { duration: 200 });
    scrubberHeight.value = withTiming(isPreviewMode ? 0 : 1, { duration: 300 });
  }, [isPreviewMode]);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: togglePosition.value * 68 }],
  }));

  const animatedScrubberStyle = useAnimatedStyle(() => ({
    height: scrubberHeight.value * 150,
    opacity: scrubberHeight.value,
    overflow: "hidden",
  }));

  // Helper functions
  const getAspectRatios = () => {
    const width = selectedVideo?.width || 0;
    const height = selectedVideo?.height || 0;
    const is9by16 = Math.abs(width / height - 9 / 16) < 0.1;
    const ratioStr = selectedVideo
      ? `${selectedVideo.width}:${selectedVideo.height}`
      : "";

    const options = [
      {
        value: "original" as AspectRatio,
        label: "Original",
        icon: "resize",
      },
    ];

    if (!is9by16) {
      options.push({
        value: "9:16" as AspectRatio,
        label: "9:16",
        icon: "phone-portrait",
      });
    }
    return options;
  };

  const calculateCroppedDimensions = () => {
    const w = selectedVideo?.width || 0;
    const h = selectedVideo?.height || 0;
    if (selectedAspectRatio === "9:16") {
      const targetRatio = 9 / 16;
      if (w / h > targetRatio)
        return { width: Math.round(h * targetRatio), height: h };
      return { width: w, height: Math.round(w / targetRatio) };
    }
    return { width: w, height: h };
  };

  // CLEANUP LOGIC
  const cleanupResources = useCallback(() => {
    console.log("[Editor] Cleaning up...");
    setIsUnmounting(true); // Triggers empty render
    releasePlayer(player);

    // Aggressive Cache Clear
    if ((Image as any).clearMemoryCache) (Image as any).clearMemoryCache();
    if ((Image as any).clearDiskCache) (Image as any).clearDiskCache();
  }, [player]);

  const handleBackNavigation = () => {
    cleanupResources();
    setTimeout(() => {
      // Navigate to ROOT of tabs to escape stack
      router.replace("/");
    }, 50);
  };

  useEffect(() => {
    if (!selectedVideo) {
      router.replace("/");
      return;
    }
    setSelectedAspectRatio("original");
    return () => cleanupResources();
  }, [selectedVideo, cleanupResources]);

  // Playback Loop
  useEffect(() => {
    if (!player) return;
    const interval = setInterval(() => {
      if (isUserScrubbing.current) return;

      const currentMs = player.currentTime * 1000;
      setCurrentTime(currentMs);
      setDuration(player.duration * 1000);
      setIsPlaying(player.playing);

      if (!isPreviewMode && player.playing && trimEnd > 0) {
        if (currentMs >= trimEnd + 50) {
          player.currentTime = trimStart / 1000;
        }
      }
    }, 250);
    return () => clearInterval(interval);
  }, [player, trimEnd, trimStart, isPreviewMode]);

  // Handlers
  const handleTrimChange = useCallback(
    ({ start, end }: { start: number; end: number }) => {
      isUserScrubbing.current = true;
      setTrimStart(start);
      setTrimEnd(end);
    },
    []
  );

  const handleScrubComplete = useCallback(
    (start: number) => {
      isUserScrubbing.current = false;
      if (player) player.currentTime = start / 1000;
    },
    [player]
  );

  const handleSaveCroppedVideo = async () => {
    if (!selectedVideo || !videoName.trim() || !videoDescription.trim()) {
      return Alert.alert("Required", "Please complete all fields");
    }
    const cropDuration = trimEnd - trimStart;
    if (
      Math.abs(cropDuration - VIDEO.CROP_DURATION_MS) > TOLERANCE.DURATION_MS
    ) {
      return Alert.alert("Error", "Crop must be 5 seconds");
    }

    cropVideo(
      { videoUri: selectedVideo.uri, startTime: trimStart, endTime: trimEnd },
      {
        onSuccess: async (data) => {
          const thumbnail = await generateThumbnail(data.uri);
          const { width, height } = calculateCroppedDimensions();
          addCroppedVideo({
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
          });
          setShowMetadataModal(false);
          setShowSuccessModal(true);
        },
        onError: (e) => Alert.alert("Error", e.message),
      }
    );
  };

  // NUCLEAR RENDER GUARD
  if (isUnmounting || !selectedVideo) {
    return <View style={{ flex: 1, backgroundColor: "black" }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-black" edges={[]}>
        <View className="relative flex-1 bg-black">
          {player ? (
            <VideoView
              player={player}
              style={{ width: "100%", height: "100%" }}
              contentFit={
                selectedAspectRatio === "original" ? "contain" : "cover"
              }
              nativeControls={false}
            />
          ) : (
            <ActivityIndicator
              size="large"
              color="#0095f6"
              style={{ flex: 1 }}
            />
          )}

          <EditorTopBar
            onBack={handleBackNavigation}
            onSave={() => {
              if (player) player.pause();
              setShowMetadataModal(true);
            }}
            isSaving={isCropping}
            disabled={isCropping}
            topInset={insets.top}
          />

          <AspectRatioSelector
            selectedRatio={selectedAspectRatio}
            onRatioChange={setSelectedAspectRatio}
            options={getAspectRatios()}
          />
          <PreviewCropToggle
            isPreviewMode={isPreviewMode}
            onToggle={() => setIsPreviewMode(!isPreviewMode)}
            animatedIndicatorStyle={animatedIndicatorStyle}
          />
          <VideoPlayerControls
            isPlaying={isPlaying}
            onTogglePlay={() => {
              if (player) isPlaying ? player.pause() : player.play();
            }}
            currentTime={formatDuration(currentTime)}
            totalDuration={formatDuration(duration)}
          />
        </View>

        <Animated.View
          className="bg-instagram-surface"
          style={animatedScrubberStyle}
        >
          <View className="p-4">
            {duration > 0 && (
              <VideoThumbnailScrubber
                videoUri={selectedVideo.uri}
                duration={duration}
                onTrimChange={handleTrimChange}
                onScrubComplete={handleScrubComplete}
                trimDuration={VIDEO.CROP_DURATION_MS}
              />
            )}
          </View>
        </Animated.View>

        <MetadataModal
          visible={showMetadataModal}
          onClose={() => setShowMetadataModal(false)}
          onSave={handleSaveCroppedVideo}
          videoUri={selectedVideo.uri}
          videoName={videoName}
          videoDescription={videoDescription}
          onNameChange={setVideoName}
          onDescriptionChange={setVideoDescription}
          trimStart={trimStart}
          trimEnd={trimEnd}
          isSaving={isCropping}
          aspectRatio={selectedAspectRatio}
        />

        <SuccessModal
          visible={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            cleanupResources();
            setTimeout(() => router.replace("/"), 100);
          }}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
