/**
 * Lottie Empty State komponenti
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { fontSize } from '../utils/responsive';

import { AnimatedTouchable, FadeInView } from './AnimatedComponents';
import { AnimatedIcons } from './LottieIcon';

interface LottieEmptyStateProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
  animationType?: 'empty' | 'search' | 'error';
}

export const LottieEmptyState: React.FC<LottieEmptyStateProps> = ({
  title,
  subtitle,
  actionText,
  onAction,
  animationType = 'empty',
}) => {
  const { colors } = useTheme();

  const getAnimationComponent = () => {
    switch (animationType) {
      case 'search':
        return <AnimatedIcons.Search size={120} />;
      case 'error':
        return <AnimatedIcons.Error size={120} />;
      default:
        return <AnimatedIcons.Empty size={120} />;
    }
  };

  const dynamicStyles = StyleSheet.create({
    title: {
      color: colors.text,
    },
    subtitle: {
      color: colors.textSecondary,
    },
    actionButton: {
      backgroundColor: colors.primary,
    },
    actionText: {
      color: colors.surface,
    },
  });

  return (
    <FadeInView style={styles.container}>
      <View style={styles.animationContainer}>{getAnimationComponent()}</View>

      <Text style={[styles.title, dynamicStyles.title]}>{title}</Text>

      {subtitle && (
        <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
          {subtitle}
        </Text>
      )}

      {actionText && onAction && (
        <AnimatedTouchable
          style={[styles.actionButton, dynamicStyles.actionButton]}
          onPress={onAction}
          enableHaptic={true}
          hapticType="press"
          enableSound={true}
          soundType="buttonPress"
        >
          <Text style={[styles.actionText, dynamicStyles.actionText]}>
            {actionText}
          </Text>
        </AnimatedTouchable>
      )}
    </FadeInView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  animationContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: fontSize(20),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: fontSize(16),
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 280,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
  },
  actionText: {
    fontSize: fontSize(16),
    fontWeight: '600',
    textAlign: 'center',
  },
});
