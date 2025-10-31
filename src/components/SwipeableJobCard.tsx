/**
 * Swipeable Job Card - swipe actions bilan
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';
import { 
  PanGestureHandler, 
  PanGestureHandlerGestureEvent,
  State 
} from 'react-native-gesture-handler';

import { AnimatedTouchable } from './AnimatedComponents';
import { useTheme } from '../context/ThemeContext';
import { Job } from '../types';
import { fontSize } from '../utils/responsive';
import { hapticFeedback } from '../utils/haptics';
import { soundEffects } from '../utils/soundEffects';

interface SwipeableJobCardProps {
  job: Job;
  onPress: () => void;
  onSave?: () => void;
  onShare?: () => void;
  onApply?: () => void;
  children: React.ReactNode;
}

const SWIPE_THRESHOLD = 100;
const ACTION_WIDTH = 80;

export const SwipeableJobCard: React.FC<SwipeableJobCardProps> = ({
  job,
  onPress,
  onSave,
  onShare,
  onApply,
  children,
}) => {
  const { colors } = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX: translation, velocityX } = event.nativeEvent;
      
      // Determine swipe direction and action
      if (Math.abs(translation) > SWIPE_THRESHOLD || Math.abs(velocityX) > 500) {
        if (translation > 0) {
          // Swipe right - Save action
          handleSwipeAction('save');
        } else {
          // Swipe left - Share action  
          handleSwipeAction('share');
        }
      } else {
        // Return to center
        resetPosition();
      }
    }
  };

  const handleSwipeAction = (action: 'save' | 'share' | 'apply') => {
    // Haptic and sound feedback
    hapticFeedback.swipeAction();
    soundEffects.swipe();

    // Animation feedback
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset animations
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Execute action
      switch (action) {
        case 'save':
          onSave?.();
          hapticFeedback.success();
          soundEffects.success();
          break;
        case 'share':
          onShare?.();
          hapticFeedback.success();
          soundEffects.success();
          break;
        case 'apply':
          onApply?.();
          hapticFeedback.confirmAction();
          soundEffects.confirmAction();
          break;
      }
    });

    resetPosition();
  };

  const resetPosition = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      tension: 200,
      friction: 8,
    }).start();
  };

  const leftAction = () => (
    <View style={[styles.leftAction, { backgroundColor: colors.success }]}>
      <MaterialCommunityIcons
        name="bookmark-plus"
        size={24}
        color={colors.surface}
      />
      <Text style={[styles.actionText, { color: colors.surface }]}>
        Saqlash
      </Text>
    </View>
  );

  const rightAction = () => (
    <View style={[styles.rightAction, { backgroundColor: colors.primary }]}>
      <MaterialCommunityIcons
        name="share"
        size={24}
        color={colors.surface}
      />
      <Text style={[styles.actionText, { color: colors.surface }]}>
        Ulashish
      </Text>
    </View>
  );

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderRadius: 18,
      overflow: 'hidden',
      marginBottom: 16,
    },
    gestureContainer: {
      backgroundColor: colors.surface,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      {/* Background Actions */}
      <View style={styles.actionsContainer}>
        {leftAction()}
        {rightAction()}
      </View>

      {/* Swipeable Content */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-10, 10]}
      >
        <Animated.View
          style={[
            dynamicStyles.gestureContainer,
            {
              transform: [
                { translateX },
                { scale },
              ],
              opacity,
            },
          ]}
        >
          <AnimatedTouchable
            onPress={onPress}
            enableHaptic={true}
            hapticType="press"
            enableSound={true}
            soundType="buttonPress"
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Ish e'loni: ${job.title}`}
            accessibilityHint="Tafsilotlar uchun bosing, saqlash uchun o'ngga, ulashish uchun chapga suring"
          >
            {children}
          </AnimatedTouchable>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  rightAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  actionText: {
    fontSize: fontSize(12),
    fontWeight: '600',
    marginTop: 4,
  },
});
