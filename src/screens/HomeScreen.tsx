/**
 * Bosh sahifa - To'liq funktsional
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedTouchable } from '../components/AnimatedComponents';
import { CategoryModal } from '../components/CategoryModal';
import { FeaturedJobCard } from '../components/FeaturedJobCard';
import { HomeHeader } from '../components/HomeHeader';
import { JobCard } from '../components/JobCard';
import { LottieEmptyState } from '../components/LottieEmptyState';
import { PopularCompanies } from '../components/PopularCompanies';
import { PromoBanner } from '../components/PromoBanner';
import { QuickFilters } from '../components/QuickFilters';
import { RecommendedJobs } from '../components/RecommendedJobs';
import { JobCardSkeleton } from '../components/SkeletonLoader';
import { StatisticsCards } from '../components/StatisticsCards';
import { colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { popularCompanies } from '../data/homeData';
import {
  getTodayJobsCount,
  getUniqueCompaniesCount,
  getJobsByCompany,
} from '../data/homeData';
import { featuredJobs } from '../services/mockData';
import { Company, HomeStats, Job } from '../types';
import { fontSize, horizontalPadding } from '../utils/responsive';

export const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const {
    jobs,
    filteredJobs,
    recommendedJobs,
    loading,
    applyFilters,
    refreshJobs,
  } = useJobs();
  const navigation = useNavigation();

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>();
  const [selectedType, setSelectedType] = useState<
    Job['employmentType'] | undefined
  >();

  // Tab bar balandligi
  const tabBarHeight = Platform.OS === 'ios' ? 88 : 60;

  // Statistika (har doim ko'rsatiladi, hatto 0 bo'lsa ham)
  const stats: HomeStats = useMemo(
    () => ({
      totalJobs: jobs.length,
      newToday: getTodayJobsCount(jobs),
      companiesCount: getUniqueCompaniesCount(jobs),
    }),
    [jobs],
  );

  // Filter handler
  const handleFilterChange = useCallback(
    (filters: { region?: string; employmentType?: Job['employmentType'] }) => {
      setSelectedRegion(filters.region);
      setSelectedType(filters.employmentType);
      applyFilters(filters);
    },
    [applyFilters],
  );

  // Featured job press handler
  const handleFeaturedJobPress = useCallback(
    (jobId: string) => {
      // @ts-expect-error - Navigation type
      navigation.navigate('JobDetails', { jobId });
    },
    [navigation],
  );

  // Company press handler
  const handleCompanyPress = useCallback(
    (company: Company) => {
      const companyJobs = getJobsByCompany(jobs, company.name);
      if (companyJobs.length > 0) {
        // @ts-expect-error - Navigation type
        navigation.navigate('Search', {
          companyName: company.name,
        });
      }
    },
    [jobs, navigation],
  );

  // Category select handler
  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      applyFilters({ category: categoryId });
    },
    [applyFilters],
  );

  // Render job item
  const renderJob = useCallback(
    ({ item }: { item: Job }) => <JobCard job={item} />,
    [],
  );

  // Render featured job item
  const renderFeaturedJob = useCallback(
    ({ item }: { item: any }) => (
      <FeaturedJobCard
        job={item}
        onPress={() => handleFeaturedJobPress(item.id)}
      />
    ),
    [handleFeaturedJobPress],
  );

  // Unread messages count (mock - real app would get from context)
  const unreadCount = 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']}>
      <View style={styles.container}>
        {/* Header */}
        <HomeHeader user={user} unreadCount={unreadCount} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshJobs} />
          }
          contentContainerStyle={{ paddingBottom: tabBarHeight + 80 }}
        >
          {/* Statistika */}
          <StatisticsCards stats={stats} />

          {/* Kategoriyalar tugmasi */}
          <View style={styles.categoryButtonContainer}>
            <AnimatedTouchable
              onPress={() => setCategoryModalVisible(true)}
              style={styles.categoryButton}
              scaleValue={0.98}
              enableHaptic
              hapticType="selection"
              enableSound
              soundType="selection"
              accessible
              accessibilityRole="button"
              accessibilityLabel="Kategoriyalarni ko'rish"
            >
              <MaterialCommunityIcons name="apps" size={22} color="#40916C" />
              <Text style={styles.categoryButtonText}>Kategoriyalar</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#6C757D"
              />
            </AnimatedTouchable>
          </View>

          {/* Banner */}
          <PromoBanner user={user} />

          {/* Tezkor filtrlar */}
          <QuickFilters
            onFilterChange={handleFilterChange}
            selectedRegion={selectedRegion}
            selectedType={selectedType}
          />

          {/* Personallashtirilgan tavsiyalar (faqat kirgan foydalanuvchi) */}
          {user && recommendedJobs.length > 0 && (
            <RecommendedJobs jobs={recommendedJobs} />
          )}

          {/* Mashhur ishlar - Har doim ko'rsatiladi */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔥 Mashhur ish e'lonlari</Text>
            </View>
            {featuredJobs.length > 0 ? (
              <FlatList
                horizontal
                data={featuredJobs}
                renderItem={renderFeaturedJob}
                keyExtractor={(item) => `featured-${item.id}`}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredList}
              />
            ) : (
              <View style={styles.emptySection}>
                <Text style={styles.emptyText}>Yakunda qo'shiladi</Text>
              </View>
            )}
          </View>

          {/* Ommabop kompaniyalar */}
          <PopularCompanies
            companies={popularCompanies}
            onCompanyPress={handleCompanyPress}
          />

          {/* Barcha ishlar */}
          <View style={styles.allJobsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Barcha ishlar</Text>
              <Text style={styles.jobCount}>{filteredJobs.length} ta ish</Text>
            </View>

            {loading ? (
              // Loading skeletons
              <View>
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <JobCardSkeleton key={`skeleton-${index}`} />
                  ))}
              </View>
            ) : filteredJobs.length === 0 ? (
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
              <FlatList
                data={filteredJobs}
                renderItem={renderJob}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </ScrollView>
      </View>

      {/* Kategoriya Modal */}
      <CategoryModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        onCategorySelect={handleCategorySelect}
      />
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
  categoryButtonContainer: {
    paddingHorizontal: horizontalPadding(16),
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E9ECEF',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  categoryButtonText: {
    flex: 1,
    fontSize: fontSize(15),
    fontWeight: '700',
    color: '#212529',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalPadding(16),
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: fontSize(20),
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  jobCount: {
    fontSize: fontSize(14),
    fontWeight: '600',
    color: '#6C757D',
  },
  featuredList: {
    paddingHorizontal: horizontalPadding(16),
  },
  allJobsSection: {
    paddingHorizontal: horizontalPadding(16),
    marginBottom: 16,
  },
  emptySection: {
    paddingHorizontal: horizontalPadding(16),
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize(14),
    color: '#6C757D',
    fontWeight: '500',
  },
});
