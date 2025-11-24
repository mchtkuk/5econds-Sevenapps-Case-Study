/**
 * Theme configuration for 5econds app
 * Centralized color palette and styling constants
 */

/**
 * Color palette
 */
export const colors = {
  // Brand colors
  primary: '#0095f6',      // Instagram blue
  success: '#22c55e',      // Green
  error: '#ef4444',        // Red

  // Backgrounds
  black: '#000000',
  surface: '#1c1c1e',      // Card/modal background
  input: '#2c2c2e',        // Input field background

  // Text colors
  white: '#ffffff',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',  // white/70
  textTertiary: 'rgba(255, 255, 255, 0.6)',   // white/60
  textDisabled: 'rgba(255, 255, 255, 0.4)',   // white/40

  // Gray scale
  gray600: '#666666',
  gray700: '#333333',
  gray800: '#1f1f1f',

  // Overlays
  overlayLight: 'rgba(0, 0, 0, 0.5)',      // black/50
  overlayMedium: 'rgba(0, 0, 0, 0.7)',     // black/70
  overlayHeavy: 'rgba(0, 0, 0, 0.8)',      // black/80
  overlayDark: 'rgba(0, 0, 0, 0.9)',       // black/90

  // Transparent colors
  whiteOverlay: 'rgba(255, 255, 255, 0.3)', // white/30
  whiteOverlayLight: 'rgba(255, 255, 255, 0.2)', // white/20

  // Borders
  border: '#333333',
  borderLight: 'rgba(255, 255, 255, 0.2)',  // white/20
} as const;

/**
 * Gradient configurations
 */
export const gradients = {
  /** Bottom gradient for video overlays */
  bottomOverlay: ['transparent', 'rgba(0, 0, 0, 0.8)'],

  /** Top gradient for headers */
  topOverlay: ['rgba(0, 0, 0, 0.8)', 'transparent'],

  /** Folder view header gradient */
  folderHeader: ['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0.8)'],
} as const;

/**
 * Spacing scale (in pixels)
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/**
 * Border radius scale
 */
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

/**
 * Typography
 */
export const typography = {
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

/**
 * Opacity values
 */
export const opacity = {
  disabled: 0.5,
  overlay: 0.7,
  active: 0.9,
} as const;

/**
 * Shadow configurations
 */
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
} as const;

/**
 * Complete theme export
 */
export const theme = {
  colors,
  gradients,
  spacing,
  borderRadius,
  typography,
  opacity,
  shadows,
} as const;

/**
 * Legacy Colors export for backward compatibility
 * Maps to dark theme since the app only uses dark mode
 */
export const Colors = {
  light: {
    text: colors.textPrimary,
    background: colors.black,
    tint: colors.primary,
    icon: colors.gray600,
    tabIconDefault: colors.gray600,
    tabIconSelected: colors.white,
  },
  dark: {
    text: colors.textPrimary,
    background: colors.black,
    tint: colors.primary,
    icon: colors.gray600,
    tabIconDefault: colors.gray600,
    tabIconSelected: colors.white,
  },
} as const;

export default theme;
