/**
 * Featured Job Card - Mashhur ish e'lonlari uchun zamonaviy kartochka
 */

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '../constants/colors';
import { FeaturedJob } from '../services/mockData';
import { fontSize } from '../utils/responsive';

interface FeaturedJobCardProps {
  job: FeaturedJob;
  onPress?: () => void;
  style?: ViewStyle;
}

export const FeaturedJobCard: React.FC<FeaturedJobCardProps> = ({
  job,
  onPress,
  style,
}) => {
  // Gradient ranglarni tanlash
  const getGradientColors = (): [string, string] => {
    switch (job.badge) {
      case 'TOP':
        return [colors.primary, colors.accent];
      case 'PREMIUM':
        return ['#6366F1', '#8B5CF6'];
      case 'YANGI':
        return ['#10B981', '#14B8A6'];
      default:
        return [colors.primary, colors.accent];
    }
  };

  // Maoshni formatlash
  const formatSalary = () => {
    if (!job.salary) return 'Kelishilgan holda';
    
    const min = Math.floor(job.salary.min / 1000000);
    const max = job.salary.max ? Math.floor(job.salary.max / 1000000) : null;
    
    if (max) {
      return `${min}-${max} mln UZS`;
    }
    return `${min}+ mln UZS`;
  };

  const gradientColors = getGradientColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        style,
        pressed && styles.pressed,
      ]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${job.title} - ${job.companyName || 'Kompaniya'}`}
      accessibilityHint="Ish e'loni tafsilotlarini ko'rish uchun bosing"
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Badge */}
        {job.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{job.badge}</Text>
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Kompaniya logo placeholder */}
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons
              name="office-building"
              size={32}
              color="rgba(255, 255, 255, 0.9)"
            />
          </View>

          {/* Job title */}
          <Text style={styles.title} numberOfLines={2}>
            {job.title}
          </Text>

          {/* Company name */}
          <Text style={styles.company} numberOfLines={1}>
            {job.companyName || 'Kompaniya'}
          </Text>

          {/* Bottom info */}
          <View style={styles.bottomInfo}>
            {/* Location */}
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="map-marker"
                size={16}
                color="rgba(255, 255, 255, 0.9)"
              />
              <Text style={styles.infoText} numberOfLines={1}>
                {job.region}
              </Text>
            </View>

            {/* Salary */}
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="cash"
                size={16}
                color="rgba(255, 255, 255, 0.9)"
              />
              <Text style={styles.infoText} numberOfLines={1}>
                {formatSalary()}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 180,
    marginRight: 16,
    borderRadius: 20,
    overflow: 'hidden',
    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  gradient: {
    flex: 1,
    padding: 16,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  badgeText: {
    fontSize: fontSize(11),
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: fontSize(18),
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
    lineHeight: 24,
  },
  company: {
    fontSize: fontSize(14),
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    fontSize: fontSize(12),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    marginLeft: 4,
  },
});

