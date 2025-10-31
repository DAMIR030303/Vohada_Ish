/**
 * Kategoriya chip komponenti
 */

import React from 'react';
import { StyleSheet, Text, Platform } from 'react-native';

import { AnimatedTouchable, SlideInRight } from './AnimatedComponents';

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
  const accessibilityLabel = selected 
    ? `${category.name} kategoriyasi tanlangan. Tanlovni bekor qilish uchun bosing`
    : `${category.name} kategoriyasini tanlash uchun bosing`;

  return (
    <SlideInRight delay={Math.random() * 200}>
      <AnimatedTouchable
        style={[styles.chip, selected && styles.chipSelected]}
        onPress={onPress}
        scaleValue={0.92}
        enableHaptic={true}
        hapticType="selection"
        enableSound={true}
        soundType="selection"
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ selected }}
        accessibilityHint="Kategoriya bo'yicha ish e'lonlarini filtrlash uchun"
      >
        <Text 
          style={styles.icon}
          accessible={false}
        >
          {category.icon}
        </Text>
        <Text 
          style={[styles.text, selected && styles.textSelected]}
          accessible={false}
        >
          {category.name}
        </Text>
      </AnimatedTouchable>
    </SlideInRight>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 26,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: 12,
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
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    // Selected shadow
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  text: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
  },
  textSelected: {
    color: colors.surface,
    fontWeight: '700',
  },
});

