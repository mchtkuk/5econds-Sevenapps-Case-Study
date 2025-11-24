/**
 * Validation schemas using Zod
 * Centralized validation logic for forms and data
 */

import { z } from 'zod';

/**
 * Video metadata validation schema
 * Used when saving cropped video clips
 */
export const videoMetadataSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
});

export type VideoMetadata = z.infer<typeof videoMetadataSchema>;

/**
 * Validate video metadata and return errors
 */
export function validateVideoMetadata(data: unknown): {
  success: boolean;
  errors?: { name?: string; description?: string };
  data?: VideoMetadata;
} {
  const result = videoMetadataSchema.safeParse(data);

  if (!result.success) {
    const errors: { name?: string; description?: string } = {};

    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as 'name' | 'description';
      if (field && !errors[field]) {
        errors[field] = issue.message;
      }
    });

    return { success: false, errors };
  }

  return { success: true, data: result.data };
}
