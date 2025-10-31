/**
 * Sound Effects utilities
 */

import { Audio } from 'expo-av';
import { Platform } from 'react-native';

export enum SoundType {
  TAP = 'tap',
  SUCCESS = 'success',
  ERROR = 'error',
  NOTIFICATION = 'notification',
  SWIPE = 'swipe',
  REFRESH = 'refresh',
  BUTTON_PRESS = 'button_press',
  SELECTION = 'selection',
}

// Sound configuration
const SOUND_CONFIG = {
  shouldDuckAndroid: true,
  playThroughEarpieceAndroid: false,
  staysActiveInBackground: false,
};

class SoundManager {
  private sounds: Map<SoundType, Audio.Sound> = new Map();
  private isEnabled: boolean = true;
  private isInitialized: boolean = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      
      // Preload sound effects
      await this.preloadSounds();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Failed to initialize sound manager:', error);
    }
  }

  private async preloadSounds() {
    // Hozircha system sound'lardan foydalanish
    // Keyinchalik local sound fayllar qo'shilganda bu qism yangilanadi
    if (__DEV__) {
      console.log('Sound effects initialized - using system sounds');
    }
    
    // Mock sounds for now
    const soundTypes = Object.values(SoundType);
    soundTypes.forEach(type => {
      // Placeholder sound objects
      this.sounds.set(type, {} as Audio.Sound);
    });
  }

  async playSound(type: SoundType, volume: number = 0.5) {
    if (!this.isEnabled || !this.isInitialized) return;

    try {
      // Hozircha system sound'lardan foydalanish
      this.playSystemSound(type);
    } catch (error) {
      console.warn(`Failed to play sound ${type}:`, error);
    }
  }

  private playSystemSound(type: SoundType) {
    // iOS va Android uchun system sound'lar
    // Bu real implementation'da native module kerak bo'ladi
    if (__DEV__) {
      console.log(`Playing system sound: ${type}`);
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  isEnabledState() {
    return this.isEnabled;
  }

  async cleanup() {
    for (const sound of this.sounds.values()) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        console.warn('Failed to unload sound:', error);
      }
    }
    this.sounds.clear();
    this.isInitialized = false;
  }
}

// Global sound manager instance
const soundManager = new SoundManager();

/**
 * Initialize sound effects
 */
export const initializeSounds = async () => {
  await soundManager.initialize();
};

/**
 * Play sound effect
 */
export const playSound = async (type: SoundType, volume?: number) => {
  await soundManager.playSound(type, volume);
};

/**
 * Enable/disable sound effects
 */
export const setSoundEnabled = (enabled: boolean) => {
  soundManager.setEnabled(enabled);
};

/**
 * Check if sounds are enabled
 */
export const isSoundEnabled = () => {
  return soundManager.isEnabledState();
};

/**
 * Cleanup sound resources
 */
export const cleanupSounds = async () => {
  await soundManager.cleanup();
};

/**
 * Quick sound shortcuts
 */
export const soundEffects = {
  // UI interactions
  tap: () => playSound(SoundType.TAP, 0.3),
  buttonPress: () => playSound(SoundType.BUTTON_PRESS, 0.4),
  selection: () => playSound(SoundType.SELECTION, 0.3),
  
  // Feedback sounds
  success: () => playSound(SoundType.SUCCESS, 0.6),
  error: () => playSound(SoundType.ERROR, 0.5),
  notification: () => playSound(SoundType.NOTIFICATION, 0.5),
  
  // Gesture sounds
  swipe: () => playSound(SoundType.SWIPE, 0.2),
  refresh: () => playSound(SoundType.REFRESH, 0.4),
  
  // Custom combinations
  confirmAction: async () => {
    await playSound(SoundType.TAP, 0.3);
    setTimeout(() => playSound(SoundType.SUCCESS, 0.4), 200);
  },
  
  deleteAction: async () => {
    await playSound(SoundType.TAP, 0.3);
    setTimeout(() => playSound(SoundType.ERROR, 0.3), 150);
  },
};
