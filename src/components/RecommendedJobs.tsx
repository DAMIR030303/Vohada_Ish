/**
 * Tavsiya etilgan ishlar komponenti (personallashtirilgan)
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Job } from '../types';
import { fontSize, horizontalPadding } from '../utils/responsive';

import { JobCard } from './JobCard';

interface RecommendedJobsProps {
  jobs: Job[];
  title?: string;
}

export const RecommendedJobs: React.FC<RecommendedJobsProps> = ({
  jobs,
  title = 'Siz uchun',
}) => {
  if (!jobs || jobs.length === 0) {
    return null;
  }

  const renderItem = ({ item }: { item: Job }) => <JobCard job={item} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons
            name="star-circle"
            size={24}
            color="#40916C"
          />
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.badge}>
          <MaterialCommunityIcons name="auto-fix" size={14} color="#40916C" />
          <Text style={styles.badgeText}>Shaxsiy</Text>
        </View>
      </View>

      <View style={styles.subtitle}>
        <Text style={styles.subtitleText}>
          Sizning qiziqishlaringizga asoslangan ishlar
        </Text>
      </View>

      <FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={(item) => `recommended-${item.id}`}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalPadding(16),
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: fontSize(20),
    fontWeight: '800',
    color: '#212529',
    letterSpacing: -0.5,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5EE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: fontSize(12),
    fontWeight: '700',
    color: '#40916C',
  },
  subtitle: {
    paddingHorizontal: horizontalPadding(16),
    marginBottom: 16,
  },
  subtitleText: {
    fontSize: fontSize(14),
    color: '#6C757D',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: horizontalPadding(16),
  },
});
