/**
 * Pull to Refresh komponenti - advanced gestures
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useRef, useEffect } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
} from 'react-native-gesture-handler';

import { useTheme } from '../context/ThemeContext';
import { hapticFeedback } from '../utils/haptics';
import { fontSize } from '../utils/responsive';
import { soundEffects } from '../utils/soundEffects';

interface PullToRefreshProps {
  onRefresh: () => void;
  refreshing: boolean;
  children: React.ReactNode;
}

const PULL_THRESHOLD = 80;
const MAX_PULL_DISTANCE = 120;

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  refreshing,
  children,
}) => {
  const { colors } = useTheme();
  const translateY = useRef(new Animated.Value(0)).current;
  const pullDistance = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const hasTriggeredHaptic = useRef(false);
  const isRefreshing = useRef(false);

  useEffect(() => {
    if (refreshing && !isRefreshing.current) {
      isRefreshing.current = true;
      startRefreshAnimation();
    } else if (!refreshing && isRefreshing.current) {
      isRefreshing.current = false;
      endRefreshAnimation();
    }
  }, [refreshing]);

  const startRefreshAnimation = () => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();
  };

  const endRefreshAnimation = () => {
    rotation.stopAnimation();
    rotation.setValue(0);

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 200,
        friction: 8,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    {
      useNativeDriver: true,
      listener: (event: PanGestureHandlerGestureEvent) => {
        const { translationY } = event.nativeEvent;

        if (translationY > 0) {
          const progress = Math.min(translationY / PULL_THRESHOLD, 1);
          pullDistance.setValue(Math.min(translationY, MAX_PULL_DISTANCE));
          opacity.setValue(progress);

          // Haptic feedback at threshold
          if (translationY >= PULL_THRESHOLD && !hasTriggeredHaptic.current) {
            hasTriggeredHaptic.current = true;
            hapticFeedback.pullRefresh();
            soundEffects.refresh();
          } else if (translationY < PULL_THRESHOLD) {
            hasTriggeredHaptic.current = false;
          }
        }
      },
    },
  );

  const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY } = event.nativeEvent;

      if (translationY >= PULL_THRESHOLD && !refreshing) {
        // Trigger refresh
        hapticFeedback.success();
        soundEffects.success();
        onRefresh();
      } else {
        // Return to original position
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 200,
            friction: 8,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }

      hasTriggeredHaptic.current = false;
    }
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const pullInterpolate = pullDistance.interpolate({
    inputRange: [0, PULL_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const dynamicStyles = StyleSheet.create({
    refreshIndicator: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      shadowColor: colors.shadow,
    },
    refreshText: {
      color: colors.text,
    },
    refreshSubtext: {
      color: colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      {/* Pull to Refresh Indicator */}
      <Animated.View
        style={[
          styles.refreshContainer,
          {
            opacity,
            transform: [
              {
                translateY: pullDistance.interpolate({
                  inputRange: [0, MAX_PULL_DISTANCE],
                  outputRange: [-60, 0],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.refreshIndicator, dynamicStyles.refreshIndicator]}>
          <Animated.View
            style={{
              transform: [
                { rotate: refreshing ? rotateInterpolate : '0deg' },
                { scale: pullInterpolate },
              ],
            }}
          >
            <MaterialCommunityIcons
              name={refreshing ? 'loading' : 'arrow-down'}
              size={24}
              color={colors.primary}
            />
          </Animated.View>
          <Text style={[styles.refreshText, dynamicStyles.refreshText]}>
            {refreshing ? 'Yangilanmoqda...' : 'Yangilash uchun torting'}
          </Text>
        </View>
      </Animated.View>

      {/* Scrollable Content */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetY={[0, 10]}
        failOffsetY={-5}
      >
        <Animated.View style={styles.content}>{children}</Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  refreshContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
    paddingTop: 20,
  },
  refreshIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    // Shadow
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  refreshText: {
    fontSize: fontSize(14),
    fontWeight: '500',
    marginLeft: 8,
  },
});
