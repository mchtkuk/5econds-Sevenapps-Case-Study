import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVideoStore } from '@/store/videoStore';

export default function ProjectsScreen() {
  const { currentProject } = useVideoStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Projects</Text>
        <Text style={styles.subtitle}>Manage your video projects</Text>
      </View>

      <ScrollView style={styles.content}>
        {currentProject ? (
          <View style={styles.projectCard}>
            <View style={styles.projectHeader}>
              <Ionicons name="folder-open" size={32} color="#007AFF" />
              <View style={styles.projectInfo}>
                <Text style={styles.projectName}>{currentProject.name}</Text>
                <Text style={styles.projectDate}>
                  Created: {new Date(currentProject.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View style={styles.projectStats}>
              <View style={styles.statItem}>
                <Ionicons name="videocam" size={20} color="#666" />
                <Text style={styles.statText}>{currentProject.videos.length} videos</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="text" size={20} color="#666" />
                <Text style={styles.statText}>{currentProject.textOverlays.length} overlays</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="color-filter" size={20} color="#666" />
                <Text style={styles.statText}>{currentProject.filters.length} filters</Text>
              </View>
            </View>

            {currentProject.textOverlays.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Text Overlays</Text>
                {currentProject.textOverlays.map((overlay) => (
                  <View key={overlay.id} style={styles.overlayItem}>
                    <Ionicons name="text" size={16} color="#007AFF" />
                    <Text style={styles.overlayText}>{overlay.text}</Text>
                  </View>
                ))}
              </View>
            )}

            {currentProject.filters.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Applied Filters</Text>
                {currentProject.filters.map((filter, index) => (
                  <View key={index} style={styles.filterItem}>
                    <Ionicons name="color-filter" size={16} color="#007AFF" />
                    <Text style={styles.filterText}>{filter.type.toUpperCase()}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Active Project</Text>
            <Text style={styles.emptyDescription}>
              Import a video and start editing to create a project
            </Text>
          </View>
        )}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About VidCut</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#34C759" />
              <Text style={styles.featureText}>Trim and cut videos</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#34C759" />
              <Text style={styles.featureText}>Add text overlays</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#34C759" />
              <Text style={styles.featureText}>Apply filters and effects</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#34C759" />
              <Text style={styles.featureText}>Export in multiple qualities</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#34C759" />
              <Text style={styles.featureText}>Share your creations</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  projectCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  projectInfo: {
    marginLeft: 12,
    flex: 1,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  projectDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  projectStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  overlayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  overlayText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  filterText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  infoSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
  },
});
