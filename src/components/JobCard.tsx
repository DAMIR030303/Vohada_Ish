/**
 * Ish kartochkasi komponenti - Zamonaviy dizayn
 */

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AnimatedTouchable, FadeInView } from './AnimatedComponents';
import { useTheme } from '../context/ThemeContext';
import { Job } from '../types';
import { fontSize } from '../utils/responsive';
import { formatCurrency, formatRelativeTime, truncateText } from '../utils/formatters';

type RootStackParamList = {
  JobDetails: { jobId: string };
  MainTabs: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const handlePress = () => {
    navigation.navigate('JobDetails', { jobId: job.id });
  };

  // Kategoriya bo'yicha gradient ranglar va icon
  const getCategoryStyle = () => {
    const styles = {
      IT: {
        gradient: ['#667eea', '#764ba2'] as [string, string],
        icon: 'laptop' as const,
        iconBg: 'rgba(255, 255, 255, 0.2)',
      },
      Dizayn: {
        gradient: ['#f093fb', '#f5576c'] as [string, string],
        icon: 'palette' as const,
        iconBg: 'rgba(255, 255, 255, 0.2)',
      },
      Marketing: {
        gradient: ['#4facfe', '#00f2fe'] as [string, string],
        icon: 'bullhorn' as const,
        iconBg: 'rgba(255, 255, 255, 0.2)',
      },
      default: {
        gradient: [colors.primary, colors.accent] as [string, string],
        icon: 'briefcase' as const,
        iconBg: 'rgba(255, 255, 255, 0.2)',
      },
    };
    
    return styles[job.category as keyof typeof styles] || styles.default;
  };

  const categoryStyle = getCategoryStyle();

  // Maoshni formatlash
  const formatSalary = () => {
    if (!job.salary) return 'Kelishilgan holda';
    
    const min = job.salary.min ? Math.floor(job.salary.min / 1000000) : 0;
    const max = job.salary.max ? Math.floor(job.salary.max / 1000000) : null;
    
    if (max && min) {
      return `${min}-${max} mln`;
    }
    if (min) {
      return `${min}+ mln`;
    }
    return 'Kelishilgan holda';
  };

  // Accessibility labels
  const salaryText = job.salary 
    ? job.salary.min && job.salary.max
      ? `Maosh ${formatCurrency(job.salary.min)} dan ${formatCurrency(job.salary.max)} gacha`
      : job.salary.min
        ? `Maosh ${formatCurrency(job.salary.min)} dan yuqori`
        : `Maosh ${formatCurrency(job.salary.max!)} gacha`
    : '';

  const locationText = `Joylashuv: ${job.region}${job.district ? `, ${job.district}` : ''}`;
  const timeText = `E'lon qilingan: ${formatRelativeTime(job.createdAt)}`;
  
  const accessibilityLabel = [
    `Ish e'loni: ${job.title}`,
    job.companyName ? `Kompaniya: ${job.companyName}` : '',
    `Tavsif: ${truncateText(job.description, 50)}`,
    locationText,
    timeText,
    salaryText,
    'Batafsil ma\'lumot uchun bosing'
  ].filter(Boolean).join('. ');

  return (
    <FadeInView>
      <AnimatedTouchable 
        onPress={handlePress} 
        scaleValue={0.97}
        enableHaptic={true}
        hapticType="press"
        enableSound={true}
        soundType="buttonPress"
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Ish e'loni tafsilotlarini ko'rish uchun bosing"
      >
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={categoryStyle.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            {/* Top section - Category icon & Badge */}
            <View style={styles.topRow}>
              <View style={[styles.categoryIcon, { backgroundColor: categoryStyle.iconBg }]}>
                <MaterialCommunityIcons
                  name={categoryStyle.icon}
                  size={24}
                  color="#FFFFFF"
                />
              </View>
              
              {/* Time badge */}
              <View style={styles.timeBadge}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={14}
                  color="rgba(255, 255, 255, 0.9)"
                />
                <Text style={styles.timeText}>
                  {formatRelativeTime(job.createdAt)}
                </Text>
              </View>
            </View>

            {/* Job Title */}
            <Text 
              style={styles.title}
              numberOfLines={2}
              accessible={true}
              accessibilityRole="header"
            >
              {job.title}
            </Text>

            {/* Company Name */}
            {job.companyName && (
              <View style={styles.companyRow}>
                <MaterialCommunityIcons
                  name="office-building"
                  size={16}
                  color="rgba(255, 255, 255, 0.9)"
                />
                <Text 
                  style={styles.company}
                  numberOfLines={1}
                  accessible={true}
                  accessibilityLabel={`Kompaniya: ${job.companyName}`}
                >
                  {job.companyName}
                </Text>
              </View>
            )}

            {/* Description */}
            <Text 
              style={styles.description} 
              numberOfLines={2}
              accessible={true}
              accessibilityLabel={`Tavsif: ${job.description}`}
            >
              {truncateText(job.description, 90)}
            </Text>

            {/* Bottom section - Location & Salary */}
            <View style={styles.bottomSection}>
              {/* Location */}
              <View style={styles.locationContainer}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={16}
                  color="rgba(255, 255, 255, 0.95)"
                />
                <Text 
                  style={styles.locationText}
                  numberOfLines={1}
                  accessible={true}
                  accessibilityLabel={locationText}
                >
                  {job.region}
                  {job.district && `, ${job.district}`}
                </Text>
              </View>

              {/* Salary */}
              {job.salary && (
                <View style={styles.salaryPill}>
                  <MaterialCommunityIcons
                    name="cash-multiple"
                    size={18}
                    color="#FFFFFF"
                  />
                  <Text 
                    style={styles.salaryText}
                    accessible={true}
                    accessibilityLabel={salaryText}
                  >
                    {formatSalary()}
                  </Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>
      </AnimatedTouchable>
    </FadeInView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  gradient: {
    padding: 20,
    borderRadius: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  timeText: {
    fontSize: fontSize(12),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
  },
  title: {
    fontSize: fontSize(20),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 28,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  company: {
    fontSize: fontSize(15),
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
    flex: 1,
  },
  description: {
    fontSize: fontSize(14),
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 16,
    lineHeight: 22,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  locationText: {
    fontSize: fontSize(13),
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    flex: 1,
  },
  salaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  salaryText: {
    fontSize: fontSize(14),
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
