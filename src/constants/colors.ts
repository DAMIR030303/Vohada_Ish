/**
 * VohadaIsh Brand Colors - Logo'dan olingan ranglar
 */

// Brand colors from VohadaIsh logo
export const brandColors = {
  // Primary brand colors (logo'dagi yashil tonlari)
  primary: '#1B4332', // Logo'dagi to'q yashil
  primaryLight: '#2D5A3D', // Ochroq yashil
  primaryDark: '#0F2419', // Quyuqroq yashil

  // Accent colors
  accent: '#40916C', // Yorqin yashil accent
  accentLight: '#52B788', // Ochroq accent

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F8F9FA',
    100: '#E9ECEF',
    200: '#DEE2E6',
    300: '#CED4DA',
    400: '#ADB5BD',
    500: '#6C757D',
    600: '#495057',
    700: '#343A40',
    800: '#212529',
    900: '#0D1117',
  },
} as const;

/**
 * Loyiha ranglari - Brand colors bilan yangilangan
 * @deprecated Use useTheme hook instead for dynamic colors
 */

// Updated colors with brand palette
export const colors = {
  // Brand-based primary colors
  primary: brandColors.primary,
  primaryDark: brandColors.primaryDark,
  primaryLight: brandColors.primaryLight,

  // Secondary colors (complement to brand green)
  secondary: '#D4A574', // Warm beige complement
  secondaryDark: '#B8956A',
  secondaryLight: '#E0B885',

  // Accent and status colors
  accent: brandColors.accent,
  error: '#DC3545',
  warning: '#FFC107',
  success: brandColors.accentLight,
  info: brandColors.accent,

  // UI colors
  background: '#FAFBFC',
  surface: brandColors.white,
  text: brandColors.gray[800],
  textSecondary: brandColors.gray[600],
  textDisabled: brandColors.gray[400],
  border: brandColors.gray[200],
  divider: brandColors.gray[300],
  shadow: 'rgba(27, 67, 50, 0.1)', // Brand color shadow

  // Dark mode colors (brand-based)
  dark: {
    background: '#0A0F0C', // Very dark green tint
    surface: '#1A2B20', // Dark green surface
    text: brandColors.white,
    textSecondary: brandColors.gray[300],
    border: '#2D4A35', // Dark green border
  },
} as const;
