import { useVideoStore } from "@/store/video-store";
import { formatDuration, downloadVideoToGallery, shareVideo } from "@/utils/video-utils";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetailsScreen() {
  const router = useRouter();
  const { videoId } = useLocalSearchParams<{ videoId: string }>();
  const { getCroppedVideoById, updateCroppedVideo } = useVideoStore();

  const croppedVideo = getCroppedVideoById(videoId || "");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(croppedVideo?.name || "");
  const [editDescription, setEditDescription] = useState(
    croppedVideo?.description || ""
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const player = useVideoPlayer(croppedVideo?.uri || "", (player) => {
    player.loop = true;
    player.muted = false; // Enable sound
    player.volume = 1.0; // Full volume
    player.play();
  });

  const getContentFit = () => {
    if (!croppedVideo?.aspectRatio || croppedVideo.aspectRatio === "original") {
      return "contain" as const;
    }
    return "cover" as const;
  };

  const handleDownload = async () => {
    if (!croppedVideo) return;

    setIsDownloading(true);
    try {
      const result = await downloadVideoToGallery(croppedVideo.uri, croppedVideo.name);

      if (result.success) {
        Alert.alert(
          "Success",
          "Video saved to your gallery in the '5econds' album!",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Error",
          result.error || "Failed to save video to gallery",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred", [{ text: "OK" }]);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!croppedVideo) return;

    setIsSharing(true);
    try {
      const result = await shareVideo(croppedVideo.uri);

      if (!result.success) {
        Alert.alert(
          "Error",
          result.error || "Failed to share video",
          [{ text: "OK" }]
        );
      }
      // No success alert needed - the share dialog provides feedback
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred", [{ text: "OK" }]);
    } finally {
      setIsSharing(false);
    }
  };

  if (!croppedVideo) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-row items-center justify-between p-4 bg-instagram-surface">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#0095f6" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-white">
            Video Not Found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-white">Details</Text>
        <TouchableOpacity
          onPress={() => setShowEditModal(true)}
          className="p-2 -mr-2"
        >
          <Ionicons name="create-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Video Preview */}
        <View style={{ width: "100%", height: 300, backgroundColor: "#000" }}>
          <VideoView
            player={player}
            style={{ width: "100%", height: "100%" }}
            contentFit={getContentFit()}
            nativeControls={true}
          />
        </View>

        {/* Video Information */}
        <View className="px-4 py-5 border-b border-gray-800">
          <Text className="text-white text-xl font-bold mb-2">
            {croppedVideo.name}
          </Text>
          <Text className="text-gray-400 text-sm leading-5">
            {croppedVideo.description}
          </Text>
        </View>

        {/* Details Grid */}
        <View className="px-4 py-4 gap-4">
          {/* Duration */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="bg-gray-800 rounded-full p-2.5">
                <Ionicons name="time-outline" size={20} color="#fff" />
              </View>
              <Text className="text-gray-400 text-sm">Duration</Text>
            </View>
            <Text className="text-white font-semibold">
              {formatDuration(croppedVideo.duration)}
            </Text>
          </View>

          {/* Aspect Ratio */}
          {croppedVideo.aspectRatio && (
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="bg-gray-800 rounded-full p-2.5">
                  <Ionicons name="resize-outline" size={20} color="#fff" />
                </View>
                <Text className="text-gray-400 text-sm">Aspect Ratio</Text>
              </View>
              <Text className="text-white font-semibold">
                {croppedVideo.aspectRatio === "original"
                  ? "Original"
                  : croppedVideo.aspectRatio}
              </Text>
            </View>
          )}

          {/* Created Date */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="bg-gray-800 rounded-full p-2.5">
                <Ionicons name="calendar-outline" size={20} color="#fff" />
              </View>
              <Text className="text-gray-400 text-sm">Created</Text>
            </View>
            <Text className="text-white font-semibold">
              {new Date(croppedVideo.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Action Buttons - Download and Share */}
        <View className="px-4 py-4 gap-3">
          {/* Download Button */}
          <TouchableOpacity
            onPress={handleDownload}
            disabled={isDownloading}
            className="bg-instagram-primary rounded-xl p-4 flex-row items-center justify-center gap-3"
          >
            {isDownloading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="download-outline" size={22} color="#fff" />
            )}
            <Text className="text-white font-semibold text-base">
              {isDownloading ? "Downloading..." : "Download to Gallery"}
            </Text>
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity
            onPress={handleShare}
            disabled={isSharing}
            className="bg-gray-800 rounded-xl p-4 flex-row items-center justify-center gap-3"
          >
            {isSharing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="share-outline" size={22} color="#fff" />
            )}
            <Text className="text-white font-semibold text-base">
              {isSharing ? "Sharing..." : "Share Video"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View className="flex-1 justify-end bg-black/90">
          <View
            className="bg-instagram-surface rounded-t-3xl overflow-hidden"
            style={{ maxHeight: "85%" }}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-800">
              <TouchableOpacity
                onPress={() => {
                  setShowEditModal(false);
                  setEditName(croppedVideo?.name || "");
                  setEditDescription(croppedVideo?.description || "");
                }}
                className="p-2"
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-white">
                Edit Details
              </Text>
              <View className="w-10" />
            </View>

            {/* Form Content */}
            <View className="p-5">
              {/* Name Input */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Title
                </Text>
                <TextInput
                  className="bg-instagram-input border border-gray-700 rounded-xl p-4 text-base text-white"
                  placeholder="Give your clip a name..."
                  placeholderTextColor="#666"
                  value={editName}
                  onChangeText={setEditName}
                  autoCapitalize="sentences"
                />
              </View>

              {/* Description Input */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Description
                </Text>
                <TextInput
                  className="bg-instagram-input border border-gray-700 rounded-xl p-4 text-base text-white min-h-[120px]"
                  placeholder="Add a description..."
                  placeholderTextColor="#666"
                  value={editDescription}
                  onChangeText={setEditDescription}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  autoCapitalize="sentences"
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                className="bg-white rounded-xl p-4 items-center"
                onPress={() => {
                  if (!editName.trim()) {
                    Alert.alert(
                      "Required Field",
                      "Please enter a name for your video"
                    );
                    return;
                  }
                  if (!editDescription.trim()) {
                    Alert.alert(
                      "Required Field",
                      "Please enter a description for your video"
                    );
                    return;
                  }
                  updateCroppedVideo(videoId || "", {
                    name: editName,
                    description: editDescription,
                  });
                  setShowEditModal(false);
                  Alert.alert("Success", "Video details updated successfully!");
                }}
              >
                <Text className="text-black text-base font-bold">
                  Save Changes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
