import { AspectRatio } from "@/types/video";
import { validateVideoMetadata } from "@/utils/validation";
import { formatDuration } from "@/utils/video-utils";
import { Ionicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
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
  videoUri: string;
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
  videoUri,
  videoName,
  videoDescription,
  onNameChange,
  onDescriptionChange,
  trimStart,
  trimEnd,
  isSaving,
  aspectRatio = "original",
}: MetadataModalProps) {
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const [isReady, setIsReady] = useState(false);

  // Initialize Player
  const player = useVideoPlayer(visible ? videoUri : "", (p) => {
    p.loop = false; // We handle looping manually for precision
    p.muted = false;
    p.volume = 1.0;
  });

  // --- 🔄 BULLETPROOF LOOP LOGIC ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let startTimer: ReturnType<typeof setTimeout>;
    let endListener: any;

    const performLoop = () => {
      try {
        if (!player) return;
        // 1. Seek to Start
        player.currentTime = trimStart / 1000;
        // 2. Force Play
        player.play();
      } catch (e) {
        // Ignore seek errors
      }
    };

    if (visible && player) {
      // 1. Wait for Modal Animation (450ms)
      startTimer = setTimeout(() => {
        setIsReady(true);

        // Initial Play
        performLoop();

        // 2. Event Listener: Catches if video hits actual EOF (End of File)
        endListener = player.addListener("playToEnd", () => {
          console.log("[Modal] Hit EOF, looping...");
          performLoop();
        });

        // 3. Interval: Catches if video passes 'trimEnd' (Custom Cut)
        interval = setInterval(() => {
          try {
            const currentMs = player.currentTime * 1000;
            const isPlaying = player.playing;

            // Condition A: Passed the Trim End
            if (currentMs >= trimEnd) {
              console.log("[Modal] Passed Trim End, looping...");
              performLoop();
            }

            // Condition B: Stuck Check (Paused, but not at start, and not playing)
            // If user didn't pause it, but it stopped on its own -> Force Resume
            else if (
              !isPlaying &&
              currentMs > trimStart + 100 &&
              currentMs < trimEnd - 100
            ) {
              console.log("[Modal] Player stuck, resuming...");
              player.play();
            }
          } catch (e) {
            clearInterval(interval);
          }
        }, 150);
      }, 450);
    } else {
      setIsReady(false);
    }

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
      if (endListener) endListener.remove();
      // Safe cleanup
      try {
        if (player) player.pause();
      } catch (error) {}
    };
  }, [visible, player, trimStart, trimEnd]);

  // --- SAVE LOGIC ---
  const handleSave = () => {
    const validation = validateVideoMetadata({
      name: videoName,
      description: videoDescription,
    });

    if (!validation.success) {
      setValidationErrors(validation.errors || {});
      return;
    }
    Keyboard.dismiss();
    setValidationErrors({});
    onSave();
  };

  const handleNameChange = (text: string) => {
    onNameChange(text);
    if (validationErrors.name)
      setValidationErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleDescriptionChange = (text: string) => {
    onDescriptionChange(text);
    if (validationErrors.description)
      setValidationErrors((prev) => ({ ...prev, description: undefined }));
  };

  const getContentFit = () =>
    aspectRatio === "original" ? "contain" : "cover";

  const videoContainerStyle = useMemo(() => {
    const screenWidth = Dimensions.get("window").width;
    if (aspectRatio === "9:16") {
      const w = Math.min(screenWidth * 0.5, 200);
      return {
        width: w,
        height: (w * 16) / 9,
        alignSelf: "center" as const,
        backgroundColor: "#000",
        borderRadius: 12,
        overflow: "hidden" as const,
      };
    }
    return { width: "100%" as const, height: 240, backgroundColor: "#000" };
  }, [aspectRatio]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
        <View className="flex-1 bg-instagram-surface">
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
            <View
              style={{
                width: "100%",
                minHeight: 240,
                backgroundColor: "#000",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 20,
              }}
            >
              <View style={videoContainerStyle}>
                {/* Wait for 'isReady' (450ms) to ensure Modal animation 
                   doesn't break the native video layer attachment.
                */}
                {visible && isReady && player ? (
                  <VideoView
                    key={`modal-player-${aspectRatio}`}
                    player={player}
                    style={{ width: "100%", height: "100%" }}
                    contentFit={getContentFit()}
                    nativeControls={false}
                    allowsPictureInPicture={false}
                  />
                ) : (
                  <View className="flex-1 justify-center items-center bg-gray-900">
                    <ActivityIndicator size="small" color="#ffffff" />
                  </View>
                )}

                <View className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded-full">
                  <Text className="text-white text-xs font-semibold">
                    {formatDuration(trimEnd - trimStart)}
                  </Text>
                </View>
              </View>

              {aspectRatio === "9:16" && (
                <View className="absolute top-3 left-3 bg-black/70 px-2 py-1 rounded-full">
                  <Text className="text-white text-xs font-semibold">9:16</Text>
                </View>
              )}
            </View>

            <View className="p-5">
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Title
                </Text>
                <TextInput
                  className={`bg-instagram-input border rounded-xl p-4 text-base text-white ${
                    validationErrors.name ? "border-red-500" : "border-gray-700"
                  }`}
                  placeholder="Give your clip a name..."
                  placeholderTextColor="#666"
                  value={videoName}
                  onChangeText={handleNameChange}
                />
                {validationErrors.name && (
                  <View className="flex-row items-center gap-1 mt-2">
                    <Ionicons name="alert-circle" size={16} color="#ef4444" />
                    <Text className="text-red-500 text-sm">
                      {validationErrors.name}
                    </Text>
                  </View>
                )}
                <Text className="text-gray-500 text-xs mt-1 ml-1">
                  Min 3 characters
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Description
                </Text>
                <TextInput
                  className={`bg-instagram-input border rounded-xl p-4 text-base text-white min-h-[120px] ${
                    validationErrors.description
                      ? "border-red-500"
                      : "border-gray-700"
                  }`}
                  placeholder="What makes this moment special?"
                  placeholderTextColor="#666"
                  value={videoDescription}
                  onChangeText={handleDescriptionChange}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                {validationErrors.description && (
                  <View className="flex-row items-center gap-1 mt-2">
                    <Ionicons name="alert-circle" size={16} color="#ef4444" />
                    <Text className="text-red-500 text-sm">
                      {validationErrors.description}
                    </Text>
                  </View>
                )}
                <Text className="text-gray-500 text-xs mt-1 ml-1">
                  Min 10 characters
                </Text>
              </View>

              <View className="flex-row gap-3 mt-2 mb-6">
                <TouchableOpacity
                  className="flex-1 p-4 rounded-xl items-center bg-gray-800"
                  onPress={onClose}
                >
                  <Text className="text-white font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 p-4 rounded-xl items-center flex-row justify-center gap-2 ${
                    isSaving ? "bg-gray-700" : "bg-instagram-primary"
                  }`}
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#fff"
                      />
                      <Text className="text-white font-semibold">
                        Save Clip
                      </Text>
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
