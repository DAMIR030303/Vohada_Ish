/**
 * Lottie Loading Screen komponenti
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { fontSize } from '../utils/responsive';

import { AnimatedIcons } from './LottieIcon';

interface LottieLoadingScreenProps {
  visible: boolean;
  message?: string;
  onComplete?: () => void;
}

export const LottieLoadingScreen: React.FC<LottieLoadingScreenProps> = ({
  visible,
  message = 'Yuklanmoqda...',
  onComplete,
}) => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 200,
          friction: 8,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onComplete?.();
      });
    }
  }, [visible, fadeAnim, scaleAnim, onComplete]);

  if (!visible) return null;

  const dynamicStyles = StyleSheet.create({
    overlay: {
      backgroundColor: colors.background + 'F0', // 94% opacity
    },
    container: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      shadowColor: colors.shadow,
    },
    message: {
      color: colors.text,
    },
  });

  return (
    <Animated.View
      style={[
        styles.overlay,
        dynamicStyles.overlay,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.container,
          dynamicStyles.container,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <AnimatedIcons.Loading size={80} />
        <Text style={[styles.message, dynamicStyles.message]}>{message}</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 200,
    // Shadow
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  message: {
    fontSize: fontSize(16),
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
});
