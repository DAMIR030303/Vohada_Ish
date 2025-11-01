/**
 * Responsive design utilities
 */

import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base screen dimensions (iPhone 12 Pro - 390x844)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Responsive width - ekran kengligiga moslashadi (foizda)
 */
export const wp = (percentage: number): number => {
  const value = (percentage * SCREEN_WIDTH) / 100;
  return PixelRatio.roundToNearestPixel(value);
};

/**
 * Responsive height - ekran balandligiga moslashadi (foizda)
 */
export const hp = (percentage: number): number => {
  const value = (percentage * SCREEN_HEIGHT) / 100;
  return PixelRatio.roundToNearestPixel(value);
};

/**
 * Scale size based on screen width
 * Horizontal scaling - asosiy scaling funksiyasi
 */
export const scale = (size: number): number => {
  const scaleRatio = SCREEN_WIDTH / BASE_WIDTH;
  return PixelRatio.roundToNearestPixel(size * scaleRatio);
};

/**
 * Scale size based on screen height
 * Vertical scaling
 */
export const verticalScale = (size: number): number => {
  const scaleRatio = SCREEN_HEIGHT / BASE_HEIGHT;
  return PixelRatio.roundToNearestPixel(size * scaleRatio);
};

/**
 * Moderate scale - muvozanatli scaling
 * Balance between horizontal and vertical scaling
 * Font size va boshqa elementlar uchun eng yaxshi
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  const scaleRatio = SCREEN_WIDTH / BASE_WIDTH;
  return PixelRatio.roundToNearestPixel(
    size + (scaleRatio - 1) * size * factor,
  );
};

/**
 * Font size - responsive font scaling
 * Minimal 80% ni saqlab qoladi
 */
export const fontSize = (size: number): number => {
  const scaleRatio = SCREEN_WIDTH / BASE_WIDTH;
  const scaledSize = size * scaleRatio;
  const minSize = size * 0.8; // Minimal 80%
  return PixelRatio.roundToNearestPixel(Math.max(scaledSize, minSize));
};

/**
 * Horizontal padding - responsive padding
 * Ekran kengligiga qarab moslashadi
 */
export const horizontalPadding = (basePadding: number = 24): number => {
  if (SCREEN_WIDTH < 375) {
    // Kichik ekranlar - biroz kam padding
    return PixelRatio.roundToNearestPixel(basePadding * 0.9);
  } else if (SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414) {
    // O'rtacha ekranlar - base padding
    return PixelRatio.roundToNearestPixel(basePadding);
  } else {
    // Katta ekranlar - biroz ko'p padding
    return PixelRatio.roundToNearestPixel(basePadding * 1.1);
  }
};

/**
 * Vertical padding - responsive padding
 * Ekran balandligiga qarab moslashadi
 */
export const verticalPadding = (basePadding: number = 24): number => {
  if (SCREEN_HEIGHT < 667) {
    // Kichik ekranlar - biroz kam padding
    return PixelRatio.roundToNearestPixel(basePadding * 0.9);
  } else if (SCREEN_HEIGHT >= 667 && SCREEN_HEIGHT < 900) {
    // O'rtacha ekranlar - base padding
    return PixelRatio.roundToNearestPixel(basePadding);
  } else {
    // Katta ekranlar - biroz ko'p padding
    return PixelRatio.roundToNearestPixel(basePadding * 1.1);
  }
};

/**
 * Ekran o'lchami tekshirish
 */
export const isSmallScreen = (): boolean => SCREEN_WIDTH < 375;
export const isMediumScreen = (): boolean =>
  SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
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
