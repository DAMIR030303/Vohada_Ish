/**
 * Qidiruv ekrani
 */

import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterModal } from '../components/FilterModal';
import { JobCard } from '../components/JobCard';
import { LottieEmptyState } from '../components/LottieEmptyState';
import { SearchBar } from '../components/SearchBar';
import { colors } from '../constants/colors';
import { useJobs } from '../context/JobContext';
import { FilterOptions } from '../types';
import { wp, hp } from '../utils/responsive';

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const { jobs, loading } = useJobs();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Qidiruv so'zini filters'ga qo'shish
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: searchQuery.trim() || undefined,
    }));
  }, [searchQuery]);

  // Filtrlangan ishlar
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Kategoriya filtri
      if (filters.category && job.category !== filters.category) {
        return false;
      }

      // Hudud filtri
      if (filters.region && job.region !== filters.region) {
        return false;
      }

      // Tuman filtri
      if (filters.district && job.district !== filters.district) {
        return false;
      }

      // Ish turi filtri
      if (
        filters.employmentType &&
        job.employmentType !== filters.employmentType
      ) {
        return false;
      }

      // Maosh filtri
      if (
        filters.salaryMin &&
        job.salary?.min &&
        job.salary.min < filters.salaryMin
      ) {
        return false;
      }

      if (
        filters.salaryMax &&
        job.salary?.max &&
        job.salary.max > filters.salaryMax
      ) {
        return false;
      }

      // Qidiruv so'zi filtri
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = [
          job.title,
          job.description,
          job.companyName || '',
          ...(job.requirements || []),
          ...(job.benefits || []),
        ]
          .join(' ')
          .toLowerCase();

        if (!searchableText.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, filters]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Ish qidirish..."
          onFilterPress={() => setShowFilterModal(true)}
        />

        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onPress={() =>
                navigation.navigate('JobDetails', { jobId: item.id })
              }
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading ? (
              <LottieEmptyState
                title="Hech narsa topilmadi"
                subtitle={
                  filters.searchQuery || filters.category
                    ? "Qidiruv bo'yicha hech narsa topilmadi. Boshqa so'zlar bilan qidiring yoki filtrlarni o'zgartiring."
                    : "Hozircha ish e'lonlari mavjud emas. Sahifani yangilash uchun pastga torting."
                }
                actionText="Filtrlarni tozalash"
                onAction={() => setFilters({})}
                animationType={
                  filters.searchQuery || filters.category ? 'search' : 'empty'
                }
              />
            ) : null
          }
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
    paddingHorizontal: wp(4),
  },
  listContainer: {
    paddingBottom: hp(16),
    flexGrow: 1,
  },
});
