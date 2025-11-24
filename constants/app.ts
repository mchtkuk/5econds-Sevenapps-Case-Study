/**
 * Application-wide constants
 * Centralized configuration for consistency across the app
 */

/**
 * Video constraints and settings
 */
export const VIDEO = {
  /** Maximum video duration in milliseconds (2 minutes) */
  MAX_DURATION_MS: 120000,

  /** Maximum video duration in seconds (2 minutes) */
  MAX_DURATION_SECONDS: 120,

  /** Fixed crop duration in milliseconds (5 seconds) */
  CROP_DURATION_MS: 5000,

  /** Album name for saved videos in device gallery */
  ALBUM_NAME: '5econds',
} as const;

/**
 * UI dimensions and spacing
 */
export const DIMENSIONS = {
  /** Tab bar height in pixels */
  TAB_BAR_HEIGHT: 70,

  /** Tab bar padding bottom */
  TAB_BAR_PADDING: 8,

  /** Standard border radius for cards */
  CARD_BORDER_RADIUS: 12,

  /** Icon sizes */
  ICON_SIZE_SMALL: 20,
  ICON_SIZE_MEDIUM: 24,
  ICON_SIZE_LARGE: 32,
  ICON_SIZE_XLARGE: 42.5,
} as const;

/**
 * Animation durations in milliseconds
 */
export const ANIMATION = {
  /** Standard animation duration */
  STANDARD: 200,

  /** Fade animation duration */
  FADE: 300,

  /** Transition animation duration */
  TRANSITION: 400,
} as const;

/**
 * App metadata
 */
export const APP = {
  /** Application name */
  NAME: '5econds',

  /** Onboarding storage key */
  ONBOARDING_KEY: 'hasSeenOnboarding',

  /** Store persistence key */
  STORE_KEY: 'video-diary-storage',
} as const;

/**
 * Performance settings
 */
export const PERFORMANCE = {
  /** Video update interval in milliseconds */
  VIDEO_UPDATE_INTERVAL: 100,

  /** Maximum videos to render per batch */
  MAX_RENDER_BATCH: 1,

  /** Window size for FlatList optimization */
  WINDOW_SIZE: 3,

  /** Thumbnail scrubber cleanup delay */
  CLEANUP_DELAY: 300,
} as const;

/**
 * Validation tolerances
 */
export const TOLERANCE = {
  /** Duration validation tolerance in milliseconds */
  DURATION_MS: 100,

  /** Aspect ratio tolerance for comparison */
  ASPECT_RATIO: 0.1,
} as const;
