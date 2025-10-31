/**
 * Bosh sahifa - Ish e'lonlari ro'yxati
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { 
  FlatList, 
  Platform, 
  RefreshControl, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { JobCard } from '../components/JobCard';
import { FeaturedJobCard } from '../components/FeaturedJobCard';
import { SearchBar } from '../components/SearchBar';
import { JobCardSkeleton } from '../components/SkeletonLoader';
import { LottieEmptyState } from '../components/LottieEmptyState';
import { colors } from '../constants/colors';
import { useJobs } from '../context/JobContext';
import { featuredJobs } from '../services/mockData';
import { fontSize, horizontalPadding } from '../utils/responsive';

export const HomeScreen: React.FC = () => {
  const { jobs, loading, refreshJobs } = useJobs();
  const navigation = useNavigation();

  // Tab bar balandligi: iOS 88px, Android 80px
  const tabBarHeight = Platform.OS === 'ios' ? 88 : 80;

  // Featured job card bosilganda
  const handleFeaturedJobPress = useCallback((jobId: string) => {
    // @ts-ignore - Navigation type issue
    navigation.navigate('JobDetails', { jobId });
  }, [navigation]);

  // Featured jobs render item
  const renderFeaturedJob = useCallback(({ item }: any) => (
    <FeaturedJobCard 
      job={item} 
      onPress={() => handleFeaturedJobPress(item.id)}
    />
  ), [handleFeaturedJobPress]);

  // Regular job render item
  const renderJob = useCallback(({ item }: any) => (
    <JobCard job={item} />
  ), []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']}>
      <View style={styles.container}>
        {/* Compact qidiruv maydoni */}
        <SearchBar compact={true} />
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshJobs} />
          }
          contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
        >
          {/* Mashhur ish e'lonlari bo'limi */}
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>🔥 Mashhur Ish E'lonlari</Text>
            <FlatList
              horizontal
              data={featuredJobs}
              renderItem={renderFeaturedJob}
              keyExtractor={(item) => `featured-${item.id}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            />
          </View>

          {/* Barcha ishlar bo'limi */}
          <View style={styles.allJobsSection}>
            <Text style={styles.sectionTitle}>Barcha Ishlar</Text>
            
            {loading ? (
              // Loading skeletons
              <View>
                {Array(5).fill(0).map((_, index) => (
                  <JobCardSkeleton key={`skeleton-${index}`} />
                ))}
              </View>
            ) : jobs.length === 0 ? (
              // Empty state
              <LottieEmptyState
                title="Ish e'lonlari topilmadi"
                subtitle="Yangi ish e'lonlari tez orada qo'shiladi. Sahifani yangilash uchun pastga torting."
                actionText="Yangilash"
                onAction={refreshJobs}
                animationType="empty"
              />
            ) : (
              // Jobs list
              jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  featuredSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: fontSize(20),
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    marginLeft: horizontalPadding(16),
  },
  featuredList: {
    paddingLeft: horizontalPadding(16),
    paddingRight: horizontalPadding(16),
  },
  allJobsSection: {
    paddingHorizontal: horizontalPadding(16),
  },
  listContent: {
    padding: horizontalPadding(16),
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: fontSize(18),
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: fontSize(14),
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
});

