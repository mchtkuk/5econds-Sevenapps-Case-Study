/**
 * App setup utilities
 * Handles app initialization and cleanup
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

/**
 * Clear all app data (useful after clean rebuilds in development)
 * WARNING: This deletes all user data!
 */
export async function clearAppData() {
  try {
    // Clear AsyncStorage (removes all saved videos metadata)
    await AsyncStorage.clear();

    // Clear cache directory
    const cacheDir = (FileSystem as any).cacheDirectory;
    if (cacheDir) {
      const files = await FileSystem.readDirectoryAsync(cacheDir);
      await Promise.all(
        files.map(file =>
          FileSystem.deleteAsync(`${cacheDir}${file}`, { idempotent: true })
        )
      );
    }

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Check if this is a fresh install
 * Useful for detecting when app data might be stale
 */
export async function isFreshInstall(): Promise<boolean> {
  try {
    const hasData = await AsyncStorage.getItem('video-diary-storage');
    return !hasData;
  } catch (error) {
    return true;
  }
}
