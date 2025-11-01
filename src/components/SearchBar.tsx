/**
 * Qidiruv paneli komponenti
 */

import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../constants/colors';
import { useJobs } from '../context/JobContext';
import { horizontalPadding } from '../utils/responsive';

export interface SearchBarProps {
  compact?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ compact = false }) => {
  const { filters, setFilters } = useJobs();
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '');
  const insets = useSafeAreaInsets();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({
      ...filters,
      searchQuery: query || undefined,
    });
  };

  const handleClear = () => {
    setSearchQuery('');
    setFilters({
      ...filters,
      searchQuery: undefined,
    });
  };

  // Status bar va notch uchun padding
  const topPadding = compact
    ? Platform.OS === 'ios'
      ? 8
      : 12
    : Platform.OS === 'ios'
      ? Math.max(insets.top, 8)
      : Math.max(insets.top + 4, 28);

  const bottomPadding = compact ? 8 : 12;
  const searchHeight = compact ? 44 : 48;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: topPadding, paddingBottom: bottomPadding },
      ]}
    >
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Ish qidirish..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={[styles.searchbar, { height: searchHeight }]}
          inputStyle={styles.searchInput}
          iconColor={colors.primary}
          onIconPress={handleClear}
          accessible={true}
          accessibilityRole="search"
          accessibilityLabel="Ish e'lonlarini qidirish"
          accessibilityHint="Ish nomi, kompaniya yoki joylashuv bo'yicha qidiring"
          clearIcon={() =>
            searchQuery ? (
              <TouchableOpacity
                onPress={handleClear}
                activeOpacity={0.7}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Qidiruv matnini tozalash"
                accessibilityHint="Kiritilgan matnni o'chirish uchun bosing"
              >
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: horizontalPadding(16),
    backgroundColor: colors.surface,
    borderBottomWidth: 0,
    // Shadow qo'shish - chiroyliroq ko'rinish uchun
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchbar: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    // Chiroyli shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  searchInput: {
    fontSize: 16,
    fontWeight: '500',
  },
  clearIcon: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: 'bold',
    padding: 4,
  },
});
