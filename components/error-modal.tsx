import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function ErrorModal({
  visible,
  onClose,
  title = "Upload Failed",
  message = "Please select a video that is 30 seconds or shorter"
}: ErrorModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/90">
        <View className="bg-instagram-surface rounded-3xl p-8 mx-8 items-center" style={{ maxWidth: 340 }}>
          {/* Error Icon */}
          <View className="w-20 h-20 rounded-full bg-red-500/20 items-center justify-center mb-4">
            <Ionicons name="close-circle" size={64} color="#ef4444" />
          </View>

          {/* Error Text */}
          <Text className="text-2xl font-bold text-white text-center mb-2">
            {title}
          </Text>
          <Text className="text-base text-gray-400 text-center mb-6">
            {message}
          </Text>

          {/* Action Button */}
          <TouchableOpacity
            className="w-full bg-instagram-primary py-4 px-8 items-center"
            onPress={onClose}
          >
            <Text className="text-white text-base font-semibold">Got It</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
