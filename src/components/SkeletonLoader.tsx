/**
 * Skeleton loader komponenti - loading states uchun
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';

import { colors } from '../constants/colors';
import { horizontalPadding } from '../utils/responsive';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ]),
      ).start();
    };

    startAnimation();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.textDisabled],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
};

// Job Card Skeleton
export const JobCardSkeleton: React.FC = () => {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonContent}>
        {/* Title */}
        <SkeletonLoader
          width="70%"
          height={20}
          borderRadius={6}
          style={styles.skeletonTitle}
        />

        {/* Company */}
        <SkeletonLoader
          width="50%"
          height={16}
          borderRadius={4}
          style={styles.skeletonCompany}
        />

        {/* Description lines */}
        <SkeletonLoader
          width="100%"
          height={14}
          borderRadius={4}
          style={styles.skeletonDescription}
        />
        <SkeletonLoader
          width="80%"
          height={14}
          borderRadius={4}
          style={styles.skeletonDescription}
        />

        {/* Meta info */}
        <View style={styles.skeletonMeta}>
          <SkeletonLoader width="40%" height={12} borderRadius={4} />
          <SkeletonLoader width="30%" height={12} borderRadius={4} />
        </View>

        {/* Salary */}
        <SkeletonLoader
          width="60%"
          height={16}
          borderRadius={6}
          style={styles.skeletonSalary}
        />
      </View>
    </View>
  );
};

// Search Bar Skeleton
export const SearchBarSkeleton: React.FC = () => {
  return (
    <View style={styles.searchBarContainer}>
      <SkeletonLoader
        width="100%"
        height={48}
        borderRadius={16}
        style={styles.searchBarSkeleton}
      />
    </View>
  );
};

// Category Chips Skeleton
export const CategoryChipsSkeleton: React.FC = () => {
  return (
    <View style={styles.chipsContainer}>
      {[1, 2, 3, 4].map((item) => (
        <SkeletonLoader
          key={item}
          width={80}
          height={44}
          borderRadius={22}
          style={styles.chipSkeleton}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonCard: {
    marginBottom: 16,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  skeletonContent: {
    padding: 20,
  },
  skeletonTitle: {
    marginBottom: 8,
  },
  skeletonCompany: {
    marginBottom: 12,
  },
  skeletonDescription: {
    marginBottom: 6,
  },
  skeletonMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 16,
  },
  skeletonSalary: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  searchBarContainer: {
    paddingHorizontal: horizontalPadding(16),
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },
  searchBarSkeleton: {
    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  chipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: horizontalPadding(16),
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chipSkeleton: {
    marginRight: 12,
  },
});
