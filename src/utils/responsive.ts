/**
 * Responsive design utilities
 */

import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base screen dimensions (iPhone 12 Pro - 390x844)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Responsive width - ekran kengligiga moslashadi
 */
export const wp = (percentage: number): number => {
  const value = (percentage * SCREEN_WIDTH) / 100;
  return PixelRatio.roundToNearestPixel(value);
};

/**
 * Responsive height - ekran balandligiga moslashadi
 */
export const hp = (percentage: number): number => {
  const value = (percentage * SCREEN_HEIGHT) / 100;
  return PixelRatio.roundToNearestPixel(value);
};

/**
 * Font size moslashadi ekran o'lchamiga
 */
export const fontSize = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return PixelRatio.roundToNearestPixel(Math.max(newSize, size * 0.8)); // Minimum 80% of original
};

/**
 * Horizontal padding moslashadi
 */
export const horizontalPadding = (basePadding: number = 24): number => {
  if (SCREEN_WIDTH < 375) {
    // Kichik ekranlar (iPhone SE, etc.)
    return basePadding * 0.75;
  } else if (SCREEN_WIDTH > 414) {
    // Katta ekranlar (iPhone Pro Max, tablets)
    return basePadding * 1.2;
  }
  return basePadding;
};

/**
 * Vertical padding moslashadi
 */
export const verticalPadding = (basePadding: number = 24): number => {
  if (SCREEN_HEIGHT < 667) {
    // Qisqa ekranlar
    return basePadding * 0.8;
  } else if (SCREEN_HEIGHT > 900) {
    // Uzun ekranlar
    return basePadding * 1.2;
  }
  return basePadding;
};

/**
 * Ekran o'lchami tekshirish
 */
export const isSmallScreen = (): boolean => SCREEN_WIDTH < 375;
export const isMediumScreen = (): boolean => SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeScreen = (): boolean => SCREEN_WIDTH >= 414;
export const isTablet = (): boolean => SCREEN_WIDTH >= 768;

/**
 * Platform tekshirish
 */
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

/**
 * Screen dimensions
 */
export const screenDimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};

