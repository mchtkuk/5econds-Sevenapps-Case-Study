import { useMutation } from '@tanstack/react-query';
import { trimVideo } from 'expo-trim-video';

export interface CropVideoParams {
  videoUri: string;
  startTime: number; // in milliseconds
  endTime: number;   // in milliseconds
  outputPath?: string;
}

export interface CropVideoResult {
  uri: string;
  duration: number;
  size: number;
}

/**
 * Custom hook for cropping/trimming videos using expo-trim-video with Tanstack Query
 *
 * @returns Mutation object with methods to crop video and track its state
 *
 * @example
 * ```tsx
 * const { mutate: cropVideo, isPending, isError, data } = useVideoCropping();
 *
 * cropVideo({
 *   videoUri: 'file:///path/to/video.mp4',
 *   startTime: 0,      // milliseconds
 *   endTime: 10000,    // 10 seconds in milliseconds
 * });
 * ```
 */
export const useVideoCropping = () => {
  return useMutation({
    mutationFn: async (params: CropVideoParams): Promise<CropVideoResult> => {
      const { videoUri, startTime, endTime } = params;

      try {
        // Convert milliseconds to seconds for expo-trim-video
        const startSeconds = startTime / 1000;
        const endSeconds = endTime / 1000;

        // Call expo-trim-video's trimVideo function
        const result = await trimVideo({
          uri: videoUri,
          start: startSeconds,
          end: endSeconds,
        });

        // Return the cropped video result
        return {
          uri: result.uri,
          duration: endTime - startTime, // duration in milliseconds
          size: 0, // expo-trim-video doesn't return size
        };
      } catch (error) {
        console.error('Error cropping video:', error);
        throw new Error(
          `Failed to crop video: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    onSuccess: (data) => {
      console.log('Video cropped successfully:', data);
    },
    onError: (error) => {
      console.error('Video cropping failed:', error);
    },
  });
};

/**
 * Hook for batch video cropping operations
 * Useful for cropping multiple segments from a single video
 */
export const useBatchVideoCropping = () => {
  return useMutation({
    mutationFn: async (operations: CropVideoParams[]): Promise<CropVideoResult[]> => {
      try {
        const results = await Promise.all(
          operations.map(async (params) => {
            // Convert milliseconds to seconds
            const startSeconds = params.startTime / 1000;
            const endSeconds = params.endTime / 1000;

            const result = await trimVideo({
              uri: params.videoUri,
              start: startSeconds,
              end: endSeconds,
            });

            return {
              uri: result.uri,
              duration: params.endTime - params.startTime,
              size: 0,
            };
          })
        );

        return results;
      } catch (error) {
        console.error('Error in batch video cropping:', error);
        throw new Error(
          `Failed to crop videos: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    onSuccess: (data) => {
      console.log(`Successfully cropped ${data.length} video segments`);
    },
    onError: (error) => {
      console.error('Batch video cropping failed:', error);
    },
  });
};
