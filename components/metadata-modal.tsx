import { AspectRatio } from "@/types/video";
import { formatDuration } from "@/utils/video-utils";
import { Ionicons } from "@expo/vector-icons";
import { VideoPlayer, VideoView } from "expo-video";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MetadataModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  videoPlayer: VideoPlayer;
  videoName: string;
  videoDescription: string;
  onNameChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  trimStart: number;
  trimEnd: number;
  isSaving: boolean;
  aspectRatio?: AspectRatio;
}

export function MetadataModal({
  visible,
  onClose,
  onSave,
  videoPlayer,
  videoName,
  videoDescription,
  onNameChange,
  onDescriptionChange,
  trimStart,
  trimEnd,
  isSaving,
  aspectRatio = "original",
}: MetadataModalProps) {
  const getContentFit = () => {
    if (aspectRatio === "original") {
      return "contain" as const;
    }
    return "cover" as const;
  };

  // Get video container dimensions based on aspect ratio
  const getVideoContainerStyle = () => {
    const screenWidth = Dimensions.get("window").width;

    if (aspectRatio === "9:16") {
      // For 9:16, make container narrower to show the crop
      const containerWidth = Math.min(screenWidth * 0.5, 200); // Max 200px wide
      const containerHeight = (containerWidth * 16) / 9;

      return {
        width: containerWidth,
        height: containerHeight,
        alignSelf: "center" as const,
        backgroundColor: "#000",
      };
    }

    // Original: full width, fixed height
    return {
      width: "100%" as const,
      height: 240,
      backgroundColor: "#000",
    };
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
        <View className="flex-1 bg-instagram-surface">
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-800">
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-white">
              Save Video Clip
            </Text>
            <View className="w-10" />
          </View>

          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Video Preview */}
            <View style={{ width: "100%", minHeight: 240, backgroundColor: "#000", justifyContent: "center", alignItems: "center", paddingVertical: 20 }}>
              <View style={getVideoContainerStyle()}>
                <VideoView
                  player={videoPlayer}
                  style={{ width: "100%", height: "100%" }}
                  contentFit={getContentFit()}
                  nativeControls={false}
                  allowsPictureInPicture={false}
                />
                {/* Duration Badge */}
                <View className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded-full">
                  <Text className="text-white text-xs font-semibold">
                    {formatDuration(trimEnd - trimStart)}
                  </Text>
                </View>
              </View>
              {/* Aspect Ratio Label */}
              {aspectRatio === "9:16" && (
                <View className="absolute top-3 left-3 bg-black/70 px-2 py-1 rounded-full">
                  <Text className="text-white text-xs font-semibold">9:16</Text>
                </View>
              )}
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
                  value={videoName}
                  onChangeText={onNameChange}
                />
              </View>

              {/* Description Input */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Description
                </Text>
                <TextInput
                  className="bg-instagram-input border border-gray-700 rounded-xl p-4 text-base text-white min-h-[120px]"
                  placeholder="What makes this moment special?"
                  placeholderTextColor="#666"
                  value={videoDescription}
                  onChangeText={onDescriptionChange}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-3 mt-2 mb-6">
                <TouchableOpacity
                  className="flex-1 p-4 rounded-xl items-center bg-gray-800"
                  onPress={onClose}
                >
                  <Text className="text-white font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 p-4 rounded-xl items-center flex-row justify-center gap-2 ${
                    isSaving || !videoName.trim() || !videoDescription.trim()
                      ? "bg-gray-700"
                      : "bg-instagram-primary"
                  }`}
                  onPress={onSave}
                  disabled={
                    isSaving || !videoName.trim() || !videoDescription.trim()
                  }
                >
                  {isSaving ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={20} color="#fff" />
                      <Text className="text-white font-semibold">Save Clip</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
