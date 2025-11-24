/**
 * Editor Top Bar Component
 * Navigation bar with back button, title, and save button
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface EditorTopBarProps {
  onBack: () => void;
  onSave: () => void;
  isSaving: boolean;
  disabled: boolean;
  topInset: number;
}

export const EditorTopBar: React.FC<EditorTopBarProps> = ({
  onBack,
  onSave,
  isSaving,
  disabled,
  topInset,
}) => {
  return (
    <View
      style={{
        position: "absolute",
        top: topInset,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Back Button */}
      <TouchableOpacity
        onPress={onBack}
        className="w-10 h-10 rounded-full bg-black/50 items-center justify-center"
      >
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* Edit Text */}
      <Text className="text-white text-base font-semibold">Edit</Text>

      {/* Checkmark Button - Save */}
      <TouchableOpacity
        onPress={onSave}
        disabled={disabled}
        className={`w-10 h-10 rounded-full items-center justify-center ${
          disabled ? "bg-gray-600/50" : "bg-black/50"
        }`}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Ionicons name="checkmark" size={24} color="#ffffff" />
        )}
      </TouchableOpacity>
    </View>
  );
};
