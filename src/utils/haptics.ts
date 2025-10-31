/**
 * Haptic Feedback utilities
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export enum HapticType {
  LIGHT = 'light',
  MEDIUM = 'medium',
  HEAVY = 'heavy',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  SELECTION = 'selection',
}

/**
 * Trigger haptic feedback
 */
export const triggerHaptic = async (type: HapticType = HapticType.LIGHT) => {
  try {
    // Check if haptics are available
    if (Platform.OS === 'web') return;

    switch (type) {
      case HapticType.LIGHT:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case HapticType.MEDIUM:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case HapticType.HEAVY:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case HapticType.SUCCESS:
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case HapticType.WARNING:
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case HapticType.ERROR:
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case HapticType.SELECTION:
        await Haptics.selectionAsync();
        break;
      default:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch (error) {
    console.warn('Haptic feedback not available:', error);
  }
};

/**
 * Quick haptic shortcuts
 */
export const hapticFeedback = {
  // Touch interactions
  touch: () => triggerHaptic(HapticType.LIGHT),
  press: () => triggerHaptic(HapticType.MEDIUM),
  longPress: () => triggerHaptic(HapticType.HEAVY),
  
  // UI feedback
  selection: () => triggerHaptic(HapticType.SELECTION),
  success: () => triggerHaptic(HapticType.SUCCESS),
  warning: () => triggerHaptic(HapticType.WARNING),
  error: () => triggerHaptic(HapticType.ERROR),
  
  // Custom patterns
  doubleTouch: async () => {
    await triggerHaptic(HapticType.LIGHT);
    setTimeout(() => triggerHaptic(HapticType.LIGHT), 100);
  },
  
  confirmAction: async () => {
    await triggerHaptic(HapticType.MEDIUM);
    setTimeout(() => triggerHaptic(HapticType.SUCCESS), 150);
  },
  
  swipeAction: () => triggerHaptic(HapticType.MEDIUM),
  
  pullRefresh: () => triggerHaptic(HapticType.LIGHT),
};
