/**
 * Mening e'lonlarim ekrani
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';

import { JobCard } from '../components/JobCard';
import { colors } from '../constants/colors';
import { useJobs } from '../context/JobContext';

export const MyJobsScreen: React.FC = () => {
  const { userJobs, loading, refreshUserJobs } = useJobs();

  return (
    <View style={styles.container}>
      <FlatList
        data={userJobs}
        renderItem={({ item }) => <JobCard job={item} />}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshUserJobs} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Yuklanmoqda...' : "Sizning e'lonlaringiz yo'q"}
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
