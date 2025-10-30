/**
 * Qidiruv paneli komponenti
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';

import { colors } from '../constants/colors';
import { useJobs } from '../context/JobContext';

export const SearchBar: React.FC = () => {
  const { filters, setFilters } = useJobs();
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({
      ...filters,
      searchQuery: query || undefined,
    });
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Ish qidirish..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchbar: {
    elevation: 0,
  },
});

