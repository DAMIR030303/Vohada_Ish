/**
 * Bosh sahifa - Ish e'lonlari ro'yxati
 */

import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { JobCard } from '../components/JobCard';
import { SearchBar } from '../components/SearchBar';
import { colors } from '../constants/colors';
import { useJobs } from '../context/JobContext';

export const HomeScreen: React.FC = () => {
  const { jobs, loading, refreshJobs } = useJobs();

  return (
    <View style={styles.container}>
      <SearchBar />
      <FlatList
        data={jobs}
        renderItem={({ item }) => <JobCard job={item} />}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshJobs} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Yuklanmoqda...' : 'Ish e\'lonlari topilmadi'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

