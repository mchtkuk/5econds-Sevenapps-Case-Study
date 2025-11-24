import { ErrorModal } from "@/components/error-modal";
import { FolderView } from "@/components/folder-view";
import { ReelsVideoCard } from "@/components/reels-video-card";
import { useVideoStore } from "@/store/video-store";
import { getUserErrorMessage, isVideoValidationError } from "@/utils/errors";
import {
  downloadVideoToGallery,
  pickVideoFromGallery,
  recordVideo,
  requestPermissions,
  shareVideo,
} from "@/utils/video-utils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: WINDOW_HEIGHT } = Dimensions.get("window"); // Use 'window' for actual viewport
const SCREEN_HEIGHT = WINDOW_HEIGHT; // Viewport height for reels

type ViewMode = "reels" | "folder";

export default function HomeScreen() {
  const router = useRouter();
  const {
    croppedVideos,
    removeCroppedVideo,
    setSelectedCroppedVideo,
    setSelectedVideo,
    addVideo,
    toggleFavorite,
  } = useVideoStore();
  const [loading, setLoading] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("reels");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isScreenFocused, setIsScreenFocused] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  // Handle view mode changes with transition
  const handleViewModeChange = (newMode: ViewMode) => {
    setIsTransitioning(true);
    setViewMode(newMode);
    // Allow animation to complete before enabling interactions
    setTimeout(() => {
      setIsTransitioning(false);
    }, 400);
  };

  useEffect(() => {
    requestPermissionsOnMount();
    // Mark as ready after a brief delay to ensure store is initialized
    setTimeout(() => setIsReady(true), 100);
  }, []);

  // Pause videos when screen loses focus
  useFocusEffect(
    React.useCallback(() => {
      // Screen is focused - clear any cached images/videos
      if ((Image as any).clearMemoryCache) {
        (Image as any).clearMemoryCache();
      }
      if ((Image as any).clearDiskCache) {
        (Image as any).clearDiskCache();
      }
      setIsScreenFocused(true);

      return () => {
        // Screen loses focus - pause all videos
        setIsScreenFocused(false);
      };
    }, [])
  );

  const requestPermissionsOnMount = async () => {
    const permissions = await requestPermissions();
    if (!permissions.mediaLibrary) {
      Alert.alert(
        "Permission Required",
        "Video Diary needs access to your media library to function properly."
      );
    }
  };

  const handleImportAndCrop = async () => {
    setLoading(true);
    try {
      const video = await pickVideoFromGallery();
      if (video) {
        // Valid video - add to temporary videos list and navigate to editor for cropping
        addVideo(video);
        setSelectedVideo(video);
        router.push("/editor");
      }
    } catch (error: any) {
      if (isVideoValidationError(error)) {
        // Video validation failed - show user-friendly error
        setErrorMessage(getUserErrorMessage(error));
        setShowErrorModal(true);
      } else {
        Alert.alert("Error", "Failed to pick video");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRecordVideo = async () => {
    setLoading(true);
    try {
      const video = await recordVideo();
      if (video) {
        // Valid video - add to temporary videos list and navigate to editor for cropping
        addVideo(video);
        setSelectedVideo(video);
        router.push("/editor");
      }
    } catch (error: any) {
      if (isVideoValidationError(error)) {
        // Video validation failed - show user-friendly error
        setErrorMessage(getUserErrorMessage(error));
        setShowErrorModal(true);
      } else {
        Alert.alert("Error", "Failed to record video");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCroppedVideoPress = (videoId: string) => {
    const croppedVideo = croppedVideos.find((v) => v.id === videoId);
    if (croppedVideo) {
      setSelectedCroppedVideo(croppedVideo);
      // Navigate to details page (we'll create this)
      router.push({
        pathname: "/details",
        params: { videoId },
      } as any);
    }
  };

  const handleFolderVideoPress = (videoId: string) => {
    // Navigate to details page
    const croppedVideo = croppedVideos.find((v) => v.id === videoId);
    if (croppedVideo) {
      setSelectedCroppedVideo(croppedVideo);
      router.push({
        pathname: "/details",
        params: { videoId },
      } as any);
    }
  };

  const handleDeleteCroppedVideo = (videoId: string) => {
    Alert.alert(
      "Delete Video Diary Entry",
      "Are you sure you want to remove this cropped video?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeCroppedVideo(videoId),
        },
      ]
    );
  };

  const handleDownloadVideo = async (videoId: string) => {
    const video = croppedVideos.find((v) => v.id === videoId);
    if (!video) return;

    const result = await downloadVideoToGallery(video.uri, video.name);
    if (result.success) {
      Alert.alert(
        "Success",
        "Video saved to your gallery in the '5econds' album!"
      );
    } else {
      Alert.alert("Error", result.error || "Failed to save video to gallery");
    }
  };

  const handleShareVideo = async (videoId: string) => {
    const video = croppedVideos.find((v) => v.id === videoId);
    if (!video) return;

    const result = await shareVideo(video.uri);
    if (!result.success) {
      Alert.alert("Error", result.error || "Failed to share video");
    }
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveVideoIndex(viewableItems[0].index);
      }
    }
  ).current;

  if (!isReady || loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!croppedVideos || croppedVideos.length === 0) {
    return (
      <View className="flex-1 bg-black">
        {/* Header */}
        <LinearGradient
          colors={["rgba(0,0,0,0.8)", "transparent"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            paddingTop: insets.top + 16,
            paddingBottom: 24,
            paddingHorizontal: 24,
            zIndex: 10,
          }}
        >
          <View className="flex-row justify-between items-start">
            <View>
              <Image
                source={require("../../assets/images/seconds-logo-transparent.png")}
                className="w-36 h-8 left-[-14]"
              />
            </View>
          </View>
        </LinearGradient>

        {/* Empty State */}
        <View className="flex-1 justify-center items-center p-8">
          <Ionicons name="videocam-outline" size={80} color="#666" />
          <Text className="text-white/70 text-lg text-center mt-6 mb-12">
            Import or record a video to create your first 5-second clip
          </Text>

          <View className="w-full gap-4">
            <TouchableOpacity
              className="flex-row items-center justify-center p-4 bg-[#0095f6] rounded-xl gap-2"
              onPress={handleImportAndCrop}
            >
              <Ionicons name="folder-open" size={24} color="#fff" />
              <Text className="text-white text-base font-semibold">
                Import Video
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-center p-4 bg-[#22c55e] rounded-xl gap-2"
              onPress={handleRecordVideo}
            >
              <Ionicons name="videocam" size={24} color="#fff" />
              <Text className="text-white text-base font-semibold">
                Record Video
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Error Modal */}
        <ErrorModal
          visible={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          message={errorMessage}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Transparent Header Overlay */}
      <LinearGradient
        colors={
          viewMode === "folder"
            ? ["rgba(0,0,0,1)", "rgba(0,0,0,0.8)"]
            : ["rgba(0,0,0,0.8)", "transparent"]
        }
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          paddingTop: insets.top + 16,
          paddingBottom: 24,
          paddingHorizontal: 24,
          zIndex: 10,
        }}
        pointerEvents="box-none"
      >
        <View className="flex-row justify-between items-start">
          <View>
            <Image
              source={require("../../assets/images/seconds-logo-transparent.png")}
              className="w-36 h-8 left-[-14]"
            />
            <Text className="text-sm text-white/80 mt-1">
              {croppedVideos.length} clip{croppedVideos.length !== 1 ? "s" : ""}
            </Text>
          </View>

          {/* View Mode Toggle */}
          <View pointerEvents="auto">
            <TouchableOpacity
              onPress={() =>
                handleViewModeChange(viewMode === "reels" ? "folder" : "reels")
              }
              disabled={isTransitioning}
              className="bg-black/70 rounded-full p-2"
            >
              <Ionicons
                name={viewMode === "reels" ? "grid" : "play-circle"}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Transition Loading */}
      {isTransitioning && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="small" color="#ffffff" />
        </View>
      )}

      {/* Content - Reels or Folder View */}
      {croppedVideos && croppedVideos.length > 0 && !isTransitioning && (
        <>
          {viewMode === "reels" ? (
            <Animated.View
              key="reels-view"
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(200)}
              style={{ flex: 1 }}
            >
              <FlatList
                ref={flatListRef}
                data={croppedVideos}
                renderItem={({ item, index }) => (
                  <ReelsVideoCard
                    key={item.id}
                    video={item}
                    isActive={
                      index === activeVideoIndex &&
                      viewMode === "reels" &&
                      isScreenFocused
                    }
                    onPress={() => handleCroppedVideoPress(item.id)}
                    onDelete={() => handleDeleteCroppedVideo(item.id)}
                    onToggleFavorite={() => toggleFavorite(item.id)}
                    onDownload={() => handleDownloadVideo(item.id)}
                    onShare={() => handleShareVideo(item.id)}
                  />
                )}
                keyExtractor={(item) => item.id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                snapToInterval={SCREEN_HEIGHT}
                snapToAlignment="start"
                decelerationRate="fast"
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                getItemLayout={(data, index) => ({
                  length: SCREEN_HEIGHT,
                  offset: SCREEN_HEIGHT * index,
                  index,
                })}
                removeClippedSubviews={true}
                maxToRenderPerBatch={1}
                windowSize={3}
                initialNumToRender={1}
                maintainVisibleContentPosition={{
                  minIndexForVisible: 0,
                }}
              />
            </Animated.View>
          ) : (
            <Animated.View
              key="folder-view"
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(200)}
              style={{ flex: 1 }}
            >
              <FolderView
                videos={croppedVideos}
                onVideoPress={handleFolderVideoPress}
                onDeleteVideo={handleDeleteCroppedVideo}
              />
            </Animated.View>
          )}
        </>
      )}

      {/* Error Modal */}
      <ErrorModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={errorMessage}
      />
    </View>
  );
}
