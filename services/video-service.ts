/**
 * Video service layer
 * Handles video validation, processing, and business logic
 */

import * as VideoThumbnails from 'expo-video-thumbnails';
import { VideoItem } from '../types/video';
import { VIDEO } from '../constants/app';
import { VideoValidationError, VideoProcessingError } from '../utils/errors';

/**
 * Generate a thumbnail from a video URI
 * @throws {VideoProcessingError} if thumbnail generation fails
 */
export async function generateThumbnail(videoUri: string): Promise<string | null> {
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
      time: 0,
      quality: 0.8,
    });
    return uri;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw new VideoProcessingError(
      'thumbnail',
      'Failed to generate video thumbnail',
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Validates video duration
 * @throws {VideoValidationError} if video duration exceeds maximum
 */
export function validateVideoDuration(durationMs: number, videoUri?: string): void {
  const durationInSeconds = durationMs / 1000;

  if (durationInSeconds > VIDEO.MAX_DURATION_SECONDS) {
    throw new VideoValidationError(
      `Video must be ${VIDEO.MAX_DURATION_SECONDS / 60} minutes or shorter`,
      {
        videoUri,
        actualDuration: durationInSeconds,
        maxDuration: VIDEO.MAX_DURATION_SECONDS,
      }
    );
  }
}

/**
 * Validates that video has minimum required duration for cropping
 * @throws {VideoValidationError} if video is too short
 */
export function validateMinimumDuration(durationMs: number): void {
  if (durationMs < VIDEO.CROP_DURATION_MS) {
    throw new VideoValidationError(
      `Video must be at least ${VIDEO.CROP_DURATION_MS / 1000} seconds long`
    );
  }
}

/**
 * Process picked video asset into VideoItem
 * Validates duration and generates thumbnail
 */
export async function processVideoAsset(asset: any): Promise<VideoItem> {
  // Validate duration
  if (asset.duration) {
    validateVideoDuration(asset.duration, asset.uri);
  }

  // Generate thumbnail
  const thumbnail = await generateThumbnail(asset.uri);

  // Create VideoItem
  return {
    id: Date.now().toString(),
    uri: asset.uri,
    duration: asset.duration || 0,
    filename: asset.fileName || `video_${Date.now()}.mp4`,
    width: asset.width,
    height: asset.height,
    thumbnail: thumbnail || undefined,
  };
}

/**
 * Validates crop parameters
 * @throws {VideoValidationError} if crop parameters are invalid
 */
export function validateCropParameters(
  startTime: number,
  endTime: number,
  videoDuration: number
): void {
  const cropDuration = endTime - startTime;

  // Check if crop duration matches expected duration
  if (Math.abs(cropDuration - VIDEO.CROP_DURATION_MS) > 100) {
    throw new VideoValidationError(
      'Crop must be exactly 5 seconds'
    );
  }

  // Check if crop is within video bounds
  if (startTime < 0 || endTime > videoDuration) {
    throw new VideoValidationError(
      'Crop times are outside video duration'
    );
  }

  // Check if start time is before end time
  if (startTime >= endTime) {
    throw new VideoValidationError(
      'Start time must be before end time'
    );
  }
}

/**
 * Validates video metadata
 * @throws {VideoValidationError} if metadata is invalid
 */
export function validateVideoMetadata(name: string, description: string): void {
  if (!name.trim()) {
    throw new VideoValidationError(
      'Video name is required'
    );
  }

  if (!description.trim()) {
    throw new VideoValidationError(
      'Video description is required'
    );
  }
}
