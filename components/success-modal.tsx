import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SuccessModal({ visible, onClose }: SuccessModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/90">
        <View className="bg-instagram-surface rounded-3xl p-8 mx-8 items-center" style={{ maxWidth: 340 }}>
          {/* Success Icon */}
          <View className="w-20 h-20 rounded-full bg-green-500/20 items-center justify-center mb-4">
            <Ionicons name="checkmark-circle" size={64} color="#10b981" />
          </View>

          {/* Success Text */}
          <Text className="text-2xl font-bold text-white text-center mb-2">
            Clip Saved!
          </Text>
          <Text className="text-base text-gray-400 text-center mb-6">
            Your 5-second memory has been saved to your diary
          </Text>

          {/* Action Button */}
          <TouchableOpacity
            className="w-full bg-instagram-primary py-4 px-8 items-center"
            onPress={onClose}
          >
            <Text className="text-white text-base font-semibold">View My Clips</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
