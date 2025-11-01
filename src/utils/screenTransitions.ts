/**
 * Custom Screen Transitions
 */

import {
  StackCardInterpolationProps,
  StackCardInterpolatedStyle,
} from '@react-navigation/stack';
import { Easing } from 'react-native';

type StackCardStyleInterpolator = (
  props: StackCardInterpolationProps,
) => StackCardInterpolatedStyle;

// Transition timing configurations
export const transitionSpecs = {
  // Fast transitions
  fast: {
    animation: 'timing',
    config: {
      duration: 250,
      easing: Easing.out(Easing.poly(4)),
    },
  },

  // Smooth transitions
  smooth: {
    animation: 'timing',
    config: {
      duration: 350,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    },
  },

  // Spring transitions
  spring: {
    animation: 'spring',
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  },

  // Bouncy transitions
  bouncy: {
    animation: 'spring',
    config: {
      stiffness: 800,
      damping: 200,
      mass: 1,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  },
};

/**
 * Slide from right (default iOS style)
 */
export const slideFromRight: StackCardStyleInterpolator = ({
  current,
  next: _next,
  layouts,
}: StackCardInterpolationProps): StackCardInterpolatedStyle => {
  return {
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
      ],
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
      }),
    },
  };
};

/**
 * Slide from left
 */
export const slideFromLeft: StackCardStyleInterpolator = ({
  current,
  layouts,
}: StackCardInterpolationProps): StackCardInterpolatedStyle => {
  return {
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-layouts.screen.width, 0],
          }),
        },
      ],
    },
  };
};

/**
 * Slide from bottom (modal style)
 */
export const slideFromBottom: StackStackCardStyleInterpolator = ({
  current,
  layouts,
}: StackCardInterpolationProps): StackCardInterpolatedStyle => {
  return {
    cardStyle: {
      transform: [
        {
          translateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.height, 0],
          }),
        },
      ],
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
      }),
    },
  };
};

/**
 * Slide from top
 */
export const slideFromTop: StackCardStyleInterpolator = ({
  current,
  layouts,
}: StackCardInterpolationProps): StackCardInterpolatedStyle => {
  return {
    cardStyle: {
      transform: [
        {
          translateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-layouts.screen.height, 0],
          }),
        },
      ],
    },
  };
};

/**
 * Fade transition
 */
export const fadeTransition: StackCardStyleInterpolator = ({
  current,
}: StackCardInterpolationProps): StackCardInterpolatedStyle => {
  return {
    cardStyle: {
      opacity: current.progress,
    },
  };
};

/**
 * Scale transition
 */
export const scaleTransition: StackCardStyleInterpolator = ({
  current,
  next: _next,
}: StackCardInterpolationProps): StackCardInterpolatedStyle => {
  return {
    cardStyle: {
      transform: [
        {
          scale: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.9, 1],
          }),
        },
      ],
      opacity: current.progress,
    },
  };
};

/**
 * Flip transition (3D effect)
 */
export const flipTransition: StackCardStyleInterpolator = ({
  current,
  layouts: _layouts,
}: StackCardInterpolationProps): StackCardInterpolatedStyle => {
  return {
    cardStyle: {
      transform: [
        { perspective: 1000 },
        {
          rotateY: current.progress.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ['180deg', '90deg', '0deg'],
          }),
        },
      ],
    },
  };
};

/**
 * Cube transition
 */
export const cubeTransition: StackCardStyleInterpolator = ({
  current,
  layouts,
}: StackCardInterpolationProps): StackCardInterpolatedStyle => {
  const { width } = layouts.screen;

  return {
    cardStyle: {
      transform: [
        { perspective: width * 2 },
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [width, 0],
          }),
        },
        {
          rotateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: ['-90deg', '0deg'],
          }),
        },
      ],
    },
  };
};

/**
 * Push transition (like iOS push)
 */
export const pushTransition: StackCardStyleInterpolator = ({
  current,
  next,
  layouts,
}: StackCardInterpolationProps): StackCardInterpolatedStyle => {
  return {
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
        {
          scale: next
            ? next.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.9],
              })
            : 1,
        },
      ],
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.07],
      }),
    },
  };
};

/**
 * Zoom transition
 */
export const zoomTransition: StackCardStyleInterpolator = ({
  current,
}: StackCardInterpolationProps): StackCardInterpolatedStyle => {
  return {
    cardStyle: {
      transform: [
        {
          scale: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.85, 1],
          }),
        },
      ],
      opacity: current.progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
      }),
    },
  };
};

/**
 * Predefined transition configs
 */
export const transitionConfigs = {
  // iOS-like transitions
  ios: {
    transitionSpec: {
      open: transitionSpecs.smooth,
      close: transitionSpecs.fast,
    },
    cardStyleInterpolator: slideFromRight,
  },

  // Android-like transitions
  android: {
    transitionSpec: {
      open: transitionSpecs.fast,
      close: transitionSpecs.fast,
    },
    cardStyleInterpolator: fadeTransition,
  },

  // Modal transitions
  modal: {
    transitionSpec: {
      open: transitionSpecs.smooth,
      close: transitionSpecs.fast,
    },
    cardStyleInterpolator: slideFromBottom,
  },

  // Bouncy transitions
  bouncy: {
    transitionSpec: {
      open: transitionSpecs.bouncy,
      close: transitionSpecs.spring,
    },
    cardStyleInterpolator: scaleTransition,
  },

  // 3D transitions
  flip: {
    transitionSpec: {
      open: transitionSpecs.smooth,
      close: transitionSpecs.smooth,
    },
    cardStyleInterpolator: flipTransition,
  },

  // Cube transitions
  cube: {
    transitionSpec: {
      open: transitionSpecs.smooth,
      close: transitionSpecs.smooth,
    },
    cardStyleInterpolator: cubeTransition,
  },
};
