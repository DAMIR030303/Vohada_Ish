/**
 * Ish kartochkasi komponenti
 */

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';

import { AnimatedTouchable, FadeInView } from './AnimatedComponents';
import { useTheme } from '../context/ThemeContext';
import { Job } from '../types';
import { fontSize, horizontalPadding } from '../utils/responsive';
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

  const dynamicStyles = StyleSheet.create({
    card: {
      marginBottom: 16,
      borderRadius: 18,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      // Shadow
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    title: {
      fontSize: fontSize(18),
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
      lineHeight: 24,
    },
    company: {
      fontSize: fontSize(15),
      color: colors.primary,
      fontWeight: '600',
    },
    description: {
      fontSize: fontSize(14),
      color: colors.textSecondary,
      marginBottom: 12,
      lineHeight: 20,
    },
    metaText: {
      fontSize: fontSize(13),
      color: colors.textSecondary,
      fontWeight: '500',
    },
    time: {
      fontSize: fontSize(12),
      color: colors.textSecondary,
      fontWeight: '500',
    },
    salaryContainer: {
      marginTop: 8,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    salary: {
      fontSize: fontSize(16),
      fontWeight: '700',
      color: colors.success,
    },
  });

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
        scaleValue={0.98}
        enableHaptic={true}
        hapticType="press"
        enableSound={true}
        soundType="buttonPress"
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Ish e'loni tafsilotlarini ko'rish uchun bosing"
      >
        <Card style={dynamicStyles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.header}>
              <Text 
                style={dynamicStyles.title}
                accessible={true}
                accessibilityRole="header"
              >
                {job.title}
              </Text>
              {job.companyName && (
                <Text 
                  style={dynamicStyles.company}
                  accessible={true}
                  accessibilityLabel={`Kompaniya: ${job.companyName}`}
                >
                  {job.companyName}
                </Text>
              )}
            </View>
            <Text 
              style={dynamicStyles.description} 
              numberOfLines={2}
              accessible={true}
              accessibilityLabel={`Tavsif: ${job.description}`}
            >
              {truncateText(job.description, 100)}
            </Text>
            <View style={styles.meta}>
              <View style={styles.metaItem}>
                <Text 
                  style={dynamicStyles.metaText}
                  accessible={true}
                  accessibilityLabel={locationText}
                >
                  📍 {job.region}
                  {job.district && `, ${job.district}`}
                </Text>
              </View>
              <Text 
                style={dynamicStyles.time}
                accessible={true}
                accessibilityLabel={timeText}
              >
                {formatRelativeTime(job.createdAt)}
              </Text>
            </View>
            {job.salary && (
              <View style={dynamicStyles.salaryContainer}>
                <Text 
                  style={dynamicStyles.salary}
                  accessible={true}
                  accessibilityLabel={salaryText}
                >
                  💰{' '}
                  {job.salary.min && job.salary.max
                    ? `${formatCurrency(job.salary.min)} - ${formatCurrency(job.salary.max)}`
                    : job.salary.min
                      ? `dan ${formatCurrency(job.salary.min)}`
                      : `gacha ${formatCurrency(job.salary.max!)}`}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </AnimatedTouchable>
    </FadeInView>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    padding: 20,
  },
  header: {
    marginBottom: 10,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  metaItem: {
    flex: 1,
  },
});

