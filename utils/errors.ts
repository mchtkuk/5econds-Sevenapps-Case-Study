/**
 * Custom error classes for the 5econds app
 * Provides type-safe error handling with specific error types
 */

/**
 * Base application error class
 */
export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Video validation error
 * Thrown when a video doesn't meet validation requirements
 */
export class VideoValidationError extends AppError {
  public readonly videoUri?: string;
  public readonly actualDuration?: number;
  public readonly maxDuration?: number;

  constructor(
    message: string,
    options?: {
      videoUri?: string;
      actualDuration?: number;
      maxDuration?: number;
    }
  ) {
    super(message);
    this.name = 'VideoValidationError';
    this.videoUri = options?.videoUri;
    this.actualDuration = options?.actualDuration;
    this.maxDuration = options?.maxDuration;
    Object.setPrototypeOf(this, VideoValidationError.prototype);
  }
}

/**
 * Permission error
 * Thrown when required permissions are not granted
 */
export class PermissionError extends AppError {
  public readonly permissionType: 'camera' | 'mediaLibrary' | 'microphone';

  constructor(permissionType: 'camera' | 'mediaLibrary' | 'microphone', message?: string) {
    super(message || `${permissionType} permission is required`);
    this.name = 'PermissionError';
    this.permissionType = permissionType;
    Object.setPrototypeOf(this, PermissionError.prototype);
  }
}

/**
 * Video processing error
 * Thrown when video processing operations fail
 */
export class VideoProcessingError extends AppError {
  public readonly operation: 'crop' | 'thumbnail' | 'save' | 'share' | 'export';
  public readonly originalError?: Error;

  constructor(
    operation: 'crop' | 'thumbnail' | 'save' | 'share' | 'export',
    message: string,
    originalError?: Error
  ) {
    super(message);
    this.name = 'VideoProcessingError';
    this.operation = operation;
    this.originalError = originalError;
    Object.setPrototypeOf(this, VideoProcessingError.prototype);
  }
}

/**
 * File system error
 * Thrown when file operations fail
 */
export class FileSystemError extends AppError {
  public readonly filePath?: string;
  public readonly operation: 'read' | 'write' | 'delete' | 'access';

  constructor(
    operation: 'read' | 'write' | 'delete' | 'access',
    message: string,
    filePath?: string
  ) {
    super(message);
    this.name = 'FileSystemError';
    this.operation = operation;
    this.filePath = filePath;
    Object.setPrototypeOf(this, FileSystemError.prototype);
  }
}

/**
 * Type guard to check if an error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Type guard to check if an error is a VideoValidationError
 */
export function isVideoValidationError(error: unknown): error is VideoValidationError {
  return error instanceof VideoValidationError;
}

/**
 * Type guard to check if an error is a PermissionError
 */
export function isPermissionError(error: unknown): error is PermissionError {
  return error instanceof PermissionError;
}

/**
 * Type guard to check if an error is a VideoProcessingError
 */
export function isVideoProcessingError(error: unknown): error is VideoProcessingError {
  return error instanceof VideoProcessingError;
}

/**
 * Type guard to check if an error is a FileSystemError
 */
export function isFileSystemError(error: unknown): error is FileSystemError {
  return error instanceof FileSystemError;
}

/**
 * Get user-friendly error message from any error
 */
export function getUserErrorMessage(error: unknown): string {
  if (isVideoValidationError(error)) {
    return error.message;
  }

  if (isPermissionError(error)) {
    return error.message;
  }

  if (isVideoProcessingError(error)) {
    return error.message;
  }

  if (isFileSystemError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}
