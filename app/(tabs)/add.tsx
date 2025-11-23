import { useVideoStore } from "@/store/video-store";
import {
  pickVideoFromGallery,
  recordVideo,
  requestPermissions,
} from "@/utils/video-utils";
import { ErrorModal } from "@/components/error-modal";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { addVideo, setSelectedVideo } = useVideoStore();

  useFocusEffect(
    React.useCallback(() => {
      // Show modal when this tab is focused
      setModalVisible(true);
      return () => {
        // Cleanup when tab loses focus
        setModalVisible(false);
      };
    }, [])
  );

  const handleImportVideo = async () => {
    setModalVisible(false);
    setLoading(true);

    try {
      // Request permissions first
      const permissions = await requestPermissions();
      if (!permissions.mediaLibrary) {
        Alert.alert(
          "Permission Required",
          "Please grant media library access to import videos."
        );
        router.push("/(tabs)");
        return;
      }

      const video = await pickVideoFromGallery();
      console.log("Picked video:", video);

      if (video?.error) {
        // Video validation failed
        setLoading(false);
        setErrorMessage("Please select a video that is 2 minutes or shorter");
        setShowErrorModal(true);
      } else if (video) {
        // Valid video
        addVideo(video);
        setSelectedVideo(video);
        setLoading(false);
        router.push("/editor");
      } else {
        // User cancelled, go back to clips tab
        setLoading(false);
        router.push("/(tabs)");
      }
    } catch (error: any) {
      console.error("Import video error:", error);
      setLoading(false);
      Alert.alert("Error", "Failed to pick video");
      router.push("/(tabs)");
    }
  };

  const handleRecordVideo = async () => {
    setModalVisible(false);
    setLoading(true);

    try {
      // Request permissions first
      const permissions = await requestPermissions();
      if (!permissions.camera) {
        Alert.alert(
          "Permission Required",
          "Please grant camera access to record videos."
        );
        setLoading(false);
        router.push("/(tabs)");
        return;
      }

      const video = await recordVideo();
      console.log("Recorded video:", video);

      if (video?.error) {
        // Video validation failed
        setLoading(false);
        setErrorMessage("Please record a video that is 2 minutes or shorter");
        setShowErrorModal(true);
      } else if (video) {
        // Valid video
        addVideo(video);
        setSelectedVideo(video);
        setLoading(false);
        router.push("/editor");
      } else {
        // User cancelled, go back to clips tab
        setLoading(false);
        router.push("/(tabs)");
      }
    } catch (error: any) {
      console.error("Record video error:", error);
      setLoading(false);
      Alert.alert("Error", "Failed to record video");
      router.push("/(tabs)");
    }
  };

  const handleClose = () => {
    setModalVisible(false);
    // Navigate back to clips tab
    router.push("/(tabs)");
  };

  return (
    <View className="flex-1 bg-black">
      {/* Loading Indicator */}
      {loading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-4">Processing video...</Text>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleClose}
      >
        <View className="flex-1 justify-end">
          {/* Backdrop */}
          <TouchableOpacity
            className="flex-1 bg-black/50"
            activeOpacity={1}
            onPress={handleClose}
          />

          {/* Modal Content */}
          <View className="bg-[#1c1c1e] rounded-t-3xl p-6 pb-12">
            <View className="w-12 h-1 bg-white/30 rounded-full self-center mb-6" />

            <Text className="text-white text-2xl font-bold mb-6">
              Create New Clip
            </Text>

            <TouchableOpacity
              className="flex-row items-center p-4 bg-[#2c2c2e] rounded-2xl mb-4"
              onPress={handleImportVideo}
            >
              <View className="bg-[#0095f6] rounded-full p-3 mr-4">
                <Ionicons name="folder-open" size={24} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-semibold">
                  Import Video
                </Text>
                <Text className="text-white/60 text-sm mt-1">
                  Choose from gallery
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4 bg-[#2c2c2e] rounded-2xl mb-4"
              onPress={handleRecordVideo}
            >
              <View className="bg-[#22c55e] rounded-full p-3 mr-4">
                <Ionicons name="videocam" size={24} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-semibold">
                  Record Video
                </Text>
                <Text className="text-white/60 text-sm mt-1">
                  Capture new footage
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-4 p-4 bg-transparent border border-white/20 rounded-2xl"
              onPress={handleClose}
            >
              <Text className="text-white text-center text-base font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <ErrorModal
        visible={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
          router.push("/(tabs)");
        }}
        message={errorMessage}
      />
    </View>
  );
}
