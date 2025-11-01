/**
 * Statistika kartochkalari komponenti
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';

import { HomeStats } from '../types';
import { fontSize, horizontalPadding } from '../utils/responsive';

interface StatisticsCardsProps {
  stats: HomeStats;
}

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  gradientColors: [string, string];
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  gradientColors,
  delay = 0,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const displayValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Counter animation
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Number counting animation
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(displayValue, {
        toValue: value,
        duration: 1200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [value, delay, animatedValue, displayValue]);

  const scale = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.05, 1],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Animated counter
  const [counter, setCounter] = React.useState(0);

  useEffect(() => {
    const listener = displayValue.addListener(({ value: val }) => {
      setCounter(Math.floor(val));
    });

    return () => displayValue.removeListener(listener);
  }, [displayValue]);

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={icon as any}
            size={28}
            color="rgba(255, 255, 255, 0.95)"
          />
        </View>
        <Text style={styles.value}>{counter}</Text>
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      <StatCard
        icon="briefcase-check"
        label="Aktiv ishlar"
        value={stats.totalJobs}
        gradientColors={['#1B4332', '#2D5A3D']}
        delay={0}
      />
      <StatCard
        icon="fire"
        label="Bugun yangi"
        value={stats.newToday}
        gradientColors={['#40916C', '#52B788']}
        delay={100}
      />
      <StatCard
        icon="office-building"
        label="Kompaniyalar"
        value={stats.companiesCount}
        gradientColors={['#2D5A3D', '#40916C']}
        delay={200}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: horizontalPadding(16),
    marginTop: 8,
    marginBottom: 20,
    gap: 12,
  },
  cardWrapper: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  value: {
    fontSize: fontSize(28),
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  label: {
    fontSize: fontSize(12),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
  },
});
