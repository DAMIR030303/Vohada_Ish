/**
 * Kategoriya chip komponenti
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { colors } from '../constants/colors';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryChipProps {
  category: Category;
  selected?: boolean;
  onPress: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  category,
  selected = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
    >
      <Text style={styles.icon}>{category.icon}</Text>
      <Text style={[styles.text, selected && styles.textSelected]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  text: {
    fontSize: 14,
    color: colors.text,
  },
  textSelected: {
    color: colors.surface,
    fontWeight: '600',
  },
});

