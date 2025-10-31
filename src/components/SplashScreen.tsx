/**
 * VohadaIsh Brand Splash Screen
 */

import React, { useEffect, useRef } from 'react';
import { 
  Animated, 
  StyleSheet, 
  Text, 
  View, 
  Dimensions,
  StatusBar,
  Platform 
} from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { brandColors } from '../constants/colors';
import { fontSize } from '../utils/responsive';

interface SplashScreenProps {
  onAnimationEnd?: () => void;
  duration?: number;
}

const { width, height } = Dimensions.get('window');

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onAnimationEnd,
  duration = 2500,
}) => {
  const { colors } = useTheme();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const backgroundAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Complex animation sequence
    const animationSequence = Animated.sequence([
      // 1. Background fade in
      Animated.timing(backgroundAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      
      // 2. Logo appears with scale and fade
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 200,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      
      // 3. Text slides up and fades in
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      
      // 4. Hold for a moment
      Animated.delay(800),
      
      // 5. Fade out everything
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
      ]),
    ]);

    animationSequence.start(() => {
      onAnimationEnd?.();
    });
  }, [
    backgroundAnim,
    logoOpacity,
    scaleAnim,
    slideAnim,
    textOpacity,
    fadeAnim,
    onAnimationEnd,
  ]);

  const dynamicBackgroundColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [brandColors.primary, 'rgba(27, 67, 50, 0)'],
  });

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
    },
    logoText: {
      color: colors.surface,
    },
    tagline: {
      color: colors.surface,
    },
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <StatusBar 
        backgroundColor={brandColors.primary} 
        barStyle="light-content" 
        translucent={false}
      />
      
      {/* Animated Background */}
      <Animated.View
        style={[
          styles.backgroundOverlay,
          {
            backgroundColor: dynamicBackgroundColor,
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          },
        ]}
      />

      {/* Logo Container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo Text - VohadaIsh brand */}
        <View style={styles.logoTextContainer}>
          <Text style={[styles.logoText, dynamicStyles.logoText]}>
            VOHADA
          </Text>
          <View style={styles.logoUnderline} />
          <Text style={[styles.logoText, styles.logoTextSecondary, dynamicStyles.logoText]}>
            ISH
          </Text>
        </View>
      </Animated.View>

      {/* Tagline */}
      <Animated.View
        style={[
          styles.taglineContainer,
          {
            opacity: textOpacity,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={[styles.tagline, dynamicStyles.tagline]}>
          Ish topish oson
        </Text>
        <Text style={[styles.subtitle, dynamicStyles.tagline]}>
          Professional • Ishonchli • Tez
        </Text>
      </Animated.View>

      {/* Loading indicator */}
      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: textOpacity,
          },
        ]}
      >
        <View style={styles.loadingBar}>
          <Animated.View
            style={[
              styles.loadingProgress,
              {
                width: backgroundAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    zIndex: 2,
    marginBottom: 40,
  },
  logoTextContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  logoText: {
    fontSize: fontSize(48),
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'sans-serif',
      },
    }),
  },
  logoTextSecondary: {
    fontSize: fontSize(52),
    marginTop: -8,
  },
  logoUnderline: {
    width: 120,
    height: 3,
    backgroundColor: brandColors.white,
    marginVertical: 4,
    borderRadius: 2,
  },
  taglineContainer: {
    alignItems: 'center',
    zIndex: 2,
    marginBottom: 60,
  },
  tagline: {
    fontSize: fontSize(18),
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize(14),
    fontWeight: '400',
    opacity: 0.9,
    textAlign: 'center',
    letterSpacing: 1,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  loadingBar: {
    width: width * 0.6,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: brandColors.white,
    borderRadius: 2,
  },
});
