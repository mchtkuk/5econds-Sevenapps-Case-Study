import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useVideoStore } from '@/store/videoStore';
import { formatDuration } from '@/utils/videoUtils';
import Slider from '@react-native-community/slider';

export default function EditorScreen() {
  const router = useRouter();
  const videoRef = useRef<Video>(null);
  const { selectedVideo, currentProject, createProject, addTextOverlay, addFilter } = useVideoStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);

  // Modal states
  const [showTextModal, setShowTextModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('');

  useEffect(() => {
    if (!selectedVideo) {
      router.back();
      return;
    }

    if (!currentProject) {
      createProject(`Project_${Date.now()}`);
    }
  }, [selectedVideo]);

  useEffect(() => {
    if (duration > 0 && trimEnd === 0) {
      setTrimEnd(duration);
    }
  }, [duration]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setCurrentTime(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);

      // Auto pause at trim end
      if (trimEnd > 0 && status.positionMillis >= trimEnd) {
        videoRef.current?.pauseAsync();
        videoRef.current?.setPositionAsync(trimStart);
      }
    }
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      await videoRef.current?.pauseAsync();
    } else {
      await videoRef.current?.playAsync();
    }
  };

  const handleSeek = async (value: number) => {
    await videoRef.current?.setPositionAsync(value);
  };

  const handleAddText = () => {
    if (textInput.trim()) {
      addTextOverlay({
        id: Date.now().toString(),
        text: textInput,
        x: 50,
        y: 50,
        fontSize: 24,
        color: '#FFFFFF',
        timestamp: currentTime,
      });
      setTextInput('');
      setShowTextModal(false);
      Alert.alert('Success', 'Text overlay added!');
    }
  };

  const handleApplyFilter = () => {
    if (selectedFilter) {
      addFilter({
        type: selectedFilter as any,
        intensity: 1.0,
      });
      setShowFilterModal(false);
      Alert.alert('Success', 'Filter applied!');
    }
  };

  const handleExport = () => {
    router.push('/export');
  };

  if (!selectedVideo) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Video Editor</Text>
        <TouchableOpacity onPress={handleExport} style={styles.exportButton}>
          <Ionicons name="download" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: selectedVideo.uri }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          shouldPlay={false}
        />
      </View>

      <View style={styles.controls}>
        <View style={styles.timelineContainer}>
          <Text style={styles.timeText}>{formatDuration(currentTime)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={currentTime}
            onValueChange={handleSeek}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#ccc"
          />
          <Text style={styles.timeText}>{formatDuration(duration)}</Text>
        </View>

        <View style={styles.playbackControls}>
          <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={48} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.trimControls}>
          <Text style={styles.sectionTitle}>Trim Video</Text>
          <View style={styles.trimRow}>
            <View style={styles.trimInput}>
              <Text style={styles.trimLabel}>Start</Text>
              <Slider
                style={styles.trimSlider}
                minimumValue={0}
                maximumValue={duration}
                value={trimStart}
                onValueChange={setTrimStart}
                minimumTrackTintColor="#34C759"
                maximumTrackTintColor="#ccc"
              />
              <Text style={styles.trimValue}>{formatDuration(trimStart)}</Text>
            </View>
            <View style={styles.trimInput}>
              <Text style={styles.trimLabel}>End</Text>
              <Slider
                style={styles.trimSlider}
                minimumValue={0}
                maximumValue={duration}
                value={trimEnd}
                onValueChange={setTrimEnd}
                minimumTrackTintColor="#FF3B30"
                maximumTrackTintColor="#ccc"
              />
              <Text style={styles.trimValue}>{formatDuration(trimEnd)}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolsBar}>
        <TouchableOpacity style={styles.toolButton} onPress={() => setShowTextModal(true)}>
          <Ionicons name="text" size={24} color="#fff" />
          <Text style={styles.toolButtonText}>Add Text</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolButton} onPress={() => setShowFilterModal(true)}>
          <Ionicons name="color-filter" size={24} color="#fff" />
          <Text style={styles.toolButtonText}>Filters</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolButton} onPress={() => Alert.alert('Coming Soon', 'Split feature')}>
          <Ionicons name="cut" size={24} color="#fff" />
          <Text style={styles.toolButtonText}>Split</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolButton} onPress={() => Alert.alert('Coming Soon', 'Merge feature')}>
          <Ionicons name="git-merge" size={24} color="#fff" />
          <Text style={styles.toolButtonText}>Merge</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Text Overlay Modal */}
      <Modal
        visible={showTextModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTextModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Text Overlay</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter text..."
              value={textInput}
              onChangeText={setTextInput}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowTextModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddText}
              >
                <Text style={styles.confirmButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Apply Filter</Text>
            <ScrollView style={styles.filterList}>
              {['grayscale', 'sepia', 'brightness', 'contrast', 'saturation', 'blur'].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterOption,
                    selectedFilter === filter && styles.filterOptionSelected,
                  ]}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text style={styles.filterOptionText}>{filter.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleApplyFilter}
              >
                <Text style={styles.confirmButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1c1c1e',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  exportButton: {
    padding: 8,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controls: {
    backgroundColor: '#1c1c1e',
    padding: 16,
  },
  timelineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    width: 60,
  },
  slider: {
    flex: 1,
    marginHorizontal: 8,
  },
  playbackControls: {
    alignItems: 'center',
    marginBottom: 16,
  },
  playButton: {
    padding: 12,
  },
  trimControls: {
    marginTop: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  trimRow: {
    gap: 12,
  },
  trimInput: {
    marginBottom: 8,
  },
  trimLabel: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 4,
  },
  trimSlider: {
    width: '100%',
  },
  trimValue: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  toolsBar: {
    backgroundColor: '#1c1c1e',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  toolButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 80,
  },
  toolButtonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 16,
  },
  filterList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  filterOption: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  filterOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
