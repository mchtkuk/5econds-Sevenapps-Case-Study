import { useVideoStore } from "@/store/video-store";
import { ExportOptions } from "@/types/video";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ExportScreen() {
  const router = useRouter();
  const {
    selectedVideo,
    exportProgress,
    setExportProgress,
    resetExportProgress,
  } = useVideoStore();

  const [selectedQuality, setSelectedQuality] =
    useState<ExportOptions["quality"]>("medium");
  const [isExporting, setIsExporting] = useState(false);

  const qualityOptions: Array<{
    value: ExportOptions["quality"];
    label: string;
    description: string;
    icon: string;
  }> = [
    {
      value: "low",
      label: "Low Quality",
      description: "480p - Smaller file size",
      icon: "stats-chart",
    },
    {
      value: "medium",
      label: "Medium Quality",
      description: "720p - Balanced",
      icon: "stats-chart",
    },
    {
      value: "high",
      label: "High Quality",
      description: "1080p - Best quality",
      icon: "stats-chart",
    },
    {
      value: "original",
      label: "Original Quality",
      description: "Keep original settings",
      icon: "sparkles",
    },
  ];

  const handleExport = async () => {
    if (!selectedVideo) {
      Alert.alert("Error", "No video selected");
      return;
    }

    try {
      setIsExporting(true);
      setExportProgress({ progress: 0, status: "processing" });

      // Simulate export progress (in a real app, this would be actual video processing)
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setExportProgress({ progress: i, status: "processing" });
      }

      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant media library permissions to save the video."
        );
        setExportProgress({
          progress: 0,
          status: "failed",
          error: "Permission denied",
        });
        return;
      }

      // In a real app, you would save the processed video here
      // For now, we'll use the original video URI
      setExportProgress({
        progress: 100,
        status: "completed",
        outputUri: selectedVideo.uri,
      });

      Alert.alert(
        "Export Completed",
        "Your video has been successfully exported!",
        [
          {
            text: "Share",
            onPress: handleShare,
          },
          {
            text: "Save to Gallery",
            onPress: handleSaveToGallery,
          },
          {
            text: "Done",
            style: "cancel",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("Export error:", error);
      setExportProgress({
        progress: 0,
        status: "failed",
        error: "Export failed",
      });
      Alert.alert("Error", "Failed to export video");
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (!exportProgress.outputUri) {
      Alert.alert("Error", "No exported video to share");
      return;
    }

    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(exportProgress.outputUri, {
          dialogTitle: "Share your video",
          mimeType: "video/mp4",
        });
      } else {
        Alert.alert("Error", "Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Sharing error:", error);
      Alert.alert("Error", "Failed to share video");
    }
  };

  const handleSaveToGallery = async () => {
    if (!exportProgress.outputUri) {
      Alert.alert("Error", "No exported video to save");
      return;
    }

    try {
      const asset = await MediaLibrary.createAssetAsync(
        exportProgress.outputUri
      );
      await MediaLibrary.createAlbumAsync("VidCut", asset, false);
      Alert.alert("Success", "Video saved to gallery!");
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to save video to gallery");
    }
  };

  if (!selectedVideo) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Export Video</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Select Quality</Text>

        <View style={styles.qualityOptions}>
          {qualityOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.qualityOption,
                selectedQuality === option.value &&
                  styles.qualityOptionSelected,
              ]}
              onPress={() => setSelectedQuality(option.value)}
              disabled={isExporting}
            >
              <Ionicons
                name={option.icon as any}
                size={32}
                color={selectedQuality === option.value ? "#007AFF" : "#666"}
              />
              <Text
                style={[
                  styles.qualityLabel,
                  selectedQuality === option.value &&
                    styles.qualityLabelSelected,
                ]}
              >
                {option.label}
              </Text>
              <Text
                style={[
                  styles.qualityDescription,
                  selectedQuality === option.value &&
                    styles.qualityDescriptionSelected,
                ]}
              >
                {option.description}
              </Text>
              {selectedQuality === option.value && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {isExporting && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Exporting... {exportProgress.progress}%
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${exportProgress.progress}%` },
                ]}
              />
            </View>
            <ActivityIndicator
              size="large"
              color="#ffffff"
              style={styles.spinner}
            />
          </View>
        )}

        {exportProgress.status === "completed" && !isExporting && (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={64} color="#34C759" />
            <Text style={styles.successText}>Export Completed!</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
              >
                <Ionicons name="share-social" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleSaveToGallery}
              >
                <Ionicons name="save" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!isExporting && exportProgress.status !== "completed" && (
          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleExport}
            disabled={isExporting}
          >
            <Ionicons name="download" size={24} color="#fff" />
            <Text style={styles.exportButtonText}>Start Export</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  qualityOptions: {
    gap: 12,
    marginBottom: 24,
  },
  qualityOption: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    position: "relative",
  },
  qualityOptionSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  qualityLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
  },
  qualityLabelSelected: {
    color: "#007AFF",
  },
  qualityDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  qualityDescriptionSelected: {
    color: "#007AFF",
  },
  checkmark: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  progressContainer: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  spinner: {
    marginTop: 8,
  },
  successContainer: {
    backgroundColor: "#fff",
    padding: 32,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  successText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  exportButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
