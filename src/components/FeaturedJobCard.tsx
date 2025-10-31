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
  // Gradient ranglarni tanlash - Logo ranglaridan foydalanish
  const getGradientColors = (): [string, string] => {
    switch (job.badge) {
      case 'TOP':
        return [colors.accentLight, colors.accent]; // #52B788 → #40916C (eng yorqin)
      case 'PREMIUM':
        return [colors.primary, colors.primaryDark]; // #1B4332 → #0F2419 (quyuq, premium)
      case 'YANGI':
        return [colors.primaryLight, colors.accent]; // #2D5A3D → #40916C (yangi uchun)
      default:
        return [colors.primary, colors.accent];
    }
  };

  // Maoshni formatlash
  const formatSalary = () => {
    if (!job.salary) return 'Kelishilgan holda';
    
    const min = job.salary.min ? Math.floor(job.salary.min / 1000000) : 0;
    const max = job.salary.max ? Math.floor(job.salary.max / 1000000) : null;
    
    if (max && min) {
      return `${min}-${max} mln UZS`;
    }
    if (min) {
      return `${min}+ mln UZS`;
    }
    return 'Kelishilgan holda';
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
    width: 300,
    height: 200,
    marginRight: 16,
    borderRadius: 24,
    overflow: 'hidden',
    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.35,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  gradient: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  badgeText: {
    fontSize: fontSize(12),
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  title: {
    fontSize: fontSize(19),
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 14,
    lineHeight: 26,
  },
  company: {
    fontSize: fontSize(15),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    marginTop: 6,
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  infoText: {
    fontSize: fontSize(13),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
  },
});

