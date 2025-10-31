/**
 * Animated komponentlar - micro-interactions uchun
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { hapticFeedback } from '../utils/haptics';
import { soundEffects } from '../utils/soundEffects';

// Animated TouchableOpacity with spring effect, haptic feedback and sound effects
interface AnimatedTouchableProps extends TouchableOpacityProps {
  scaleValue?: number;
  enableHaptic?: boolean;
  hapticType?: 'touch' | 'press' | 'selection';
  enableSound?: boolean;
  soundType?: 'tap' | 'buttonPress' | 'selection';
  children: React.ReactNode;
}

export const AnimatedTouchable: React.FC<AnimatedTouchableProps> = ({
  scaleValue = 0.95,
  enableHaptic = true,
  hapticType = 'touch',
  enableSound = true,
  soundType = 'tap',
  children,
  onPressIn,
  onPressOut,
  onPress,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (event: any) => {
    // Trigger haptic feedback
    if (enableHaptic) {
      switch (hapticType) {
        case 'touch':
          hapticFeedback.touch();
          break;
        case 'press':
          hapticFeedback.press();
          break;
        case 'selection':
          hapticFeedback.selection();
          break;
      }
    }

    // Trigger sound effect
    if (enableSound) {
      switch (soundType) {
        case 'tap':
          soundEffects.tap();
          break;
        case 'buttonPress':
          soundEffects.buttonPress();
          break;
        case 'selection':
          soundEffects.selection();
          break;
      }
    }

    Animated.spring(scaleAnim, {
      toValue: scaleValue,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
    
    onPressIn?.(event);
  };

  const handlePressOut = (event: any) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
    
    onPressOut?.(event);
  };

  const handlePress = (event: any) => {
    onPress?.(event);
  };

  return (
    <TouchableOpacity
      {...props}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      activeOpacity={1}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

// Fade In Animation
interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: any;
}

export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  delay = 0,
  duration = 500,
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [fadeAnim, translateY, delay, duration]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Scale In Animation
interface ScaleInViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: any;
}

export const ScaleInView: React.FC<ScaleInViewProps> = ({
  children,
  delay = 0,
  duration = 400,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 200,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [scaleAnim, opacityAnim, delay, duration]);

  return (
    <Animated.View
      style={[
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Slide In From Right
interface SlideInRightProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: any;
}

export const SlideInRight: React.FC<SlideInRightProps> = ({
  children,
  delay = 0,
  duration = 300,
  style,
}) => {
  const translateX = useRef(new Animated.Value(100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [translateX, opacityAnim, delay, duration]);

  return (
    <Animated.View
      style={[
        {
          opacity: opacityAnim,
          transform: [{ translateX }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Bounce Animation
interface BounceViewProps {
  children: React.ReactNode;
  trigger?: boolean;
  style?: any;
}

export const BounceView: React.FC<BounceViewProps> = ({
  children,
  trigger = false,
  style,
}) => {
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (trigger) {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
      ]).start();
    }
  }, [trigger, bounceAnim]);

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: bounceAnim }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};
