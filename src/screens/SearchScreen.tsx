/**
 * Qidiruv va filtr ekrani
 */

import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { CategoryChip } from '../components/CategoryChip';
import { FilterModal } from '../components/FilterModal';
import { JobCard } from '../components/JobCard';
import { SearchBar } from '../components/SearchBar';
import { categories } from '../constants/categories';
import { colors } from '../constants/colors';
import { useJobs } from '../context/JobContext';

export const SearchScreen: React.FC = () => {
  const { jobs, filters, setFilters } = useJobs();
  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleCategoryPress = (categoryId: string) => {
    setFilters({
      ...filters,
      category: filters.category === categoryId ? undefined : categoryId,
    });
  };

  return (
    <View style={styles.container}>
      <SearchBar />
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
      <ScrollView style={styles.jobsContainer}>
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </ScrollView>
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApplyFilters={setFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  categoriesContainer: {
    maxHeight: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  jobsContainer: {
    flex: 1,
    padding: 16,
  },
});

