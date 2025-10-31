/**
 * Qidiruv va filtr ekrani
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Platform, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryChip } from '../components/CategoryChip';
import { FilterModal } from '../components/FilterModal';
import { JobCard } from '../components/JobCard';
import { SearchBar } from '../components/SearchBar';
import { JobCardSkeleton, CategoryChipsSkeleton } from '../components/SkeletonLoader';
import { LottieEmptyState } from '../components/LottieEmptyState';
import { categories } from '../constants/categories';
import { colors } from '../constants/colors';
import { useJobs } from '../context/JobContext';
import { fontSize, horizontalPadding } from '../utils/responsive';

export const SearchScreen: React.FC = () => {
  const { jobs, loading, filters, setFilters, refreshJobs } = useJobs();
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Tab bar balandligi: iOS 88px, Android 64px
  const tabBarHeight = Platform.OS === 'ios' ? 88 : 64;

  const handleCategoryPress = (categoryId: string) => {
    setFilters({
      ...filters,
      category: filters.category === categoryId ? undefined : categoryId,
    });
  };

  // Filtrlangan ishlar
  const filteredJobs = jobs.filter(job => {
    // Category filter
    if (filters.category && job.category !== filters.category) {
      return false;
    }
    
    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.companyName?.toLowerCase().includes(query) ||
        job.region.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Empty state component
  const EmptySearchResults = () => {
    const emptyMessage = filters.searchQuery || filters.category 
      ? 'Qidiruv bo\'yicha hech narsa topilmadi. Boshqa so\'zlar bilan qidiring yoki filtrlarni o\'zgartiring.' 
      : 'Hozircha ish e\'lonlari mavjud emas. Sahifani yangilash uchun pastga torting.';

    return (
      <View 
        style={styles.emptyContainer}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={loading ? 'Qidirilmoqda, iltimos kuting' : emptyMessage}
      >
        {!loading && (
          <MaterialCommunityIcons
            name="magnify-remove-outline"
            size={64}
            color={colors.textDisabled}
            style={styles.emptyIcon}
            accessible={false}
          />
        )}
        <Text 
          style={styles.emptyTitle}
          accessible={false}
        >
          {loading ? 'Qidirilmoqda...' : 'Hech narsa topilmadi'}
        </Text>
        {!loading && (
          <Text 
            style={styles.emptySubtitle}
            accessible={false}
          >
            {filters.searchQuery || filters.category 
              ? 'Qidiruv shartlaringizni o\'zgartiring' 
              : 'Hozircha ish e\'lonlari mavjud emas'}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']}>
      <View style={styles.container}>
        <SearchBar />
        
        {/* Categories */}
        {loading ? (
          <CategoryChipsSkeleton />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((category) => (
              <CategoryChip
                key={category.id}
                category={category}
                selected={filters.category === category.id}
                onPress={() => handleCategoryPress(category.id)}
              />
            ))}
          </ScrollView>
        )}

        {/* Jobs List */}
        <FlatList
          data={loading ? Array(5).fill({}) : filteredJobs}
          renderItem={({ item, index }) => 
            loading ? <JobCardSkeleton key={index} /> : <JobCard job={item} />
          }
          keyExtractor={(item, index) => loading ? `skeleton-${index}` : item.id}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshJobs} />
          }
          contentContainerStyle={[
            styles.jobsContent, 
            { paddingBottom: tabBarHeight + 20 },
            !loading && filteredJobs.length === 0 && styles.emptyListContent
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!loading ? (
            <LottieEmptyState
              title={filters.searchQuery || filters.category ? 'Hech narsa topilmadi' : 'Ish e\'lonlari yo\'q'}
              subtitle={
                filters.searchQuery || filters.category 
                  ? 'Qidiruv shartlaringizni o\'zgartiring yoki boshqa kategoriyani tanlang' 
                  : 'Hozircha ish e\'lonlari mavjud emas. Tez orada yangilar qo\'shiladi.'
              }
              actionText="Filtrlarni tozalash"
              onAction={() => setFilters({})}
              animationType={filters.searchQuery || filters.category ? 'search' : 'empty'}
            />
          ) : null}
        />

        <FilterModal
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          filters={filters}
          onApplyFilters={setFilters}
        />
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
  categoriesContainer: {
    maxHeight: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    // Shadow qo'shish
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  categoriesContent: {
    paddingHorizontal: horizontalPadding(16),
    paddingVertical: 8,
  },
  jobsContent: {
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

