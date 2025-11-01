/**
 * DateSeparator - Xabar ro'yxatidagi sana ajratuvchi
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { scale, moderateScale } from '../utils/responsive';

interface DateSeparatorProps {
  date: Date;
}

const formatDateSeparator = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  if (messageDate.getTime() === today.getTime()) {
    return 'Bugun';
  }

  if (messageDate.getTime() === yesterday.getTime()) {
    return 'Kecha';
  }

  // O'tgan haftalar
  const diffDays = Math.floor(
    (today.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 7) {
    const dayNames = [
      'Yakshanba',
      'Dushanba',
      'Seshanba',
      'Chorshanba',
      'Payshanba',
      'Juma',
      'Shanba',
    ];
    return dayNames[messageDate.getDay()];
  }

  // Format: 15 Yanvar 2024
  const monthNames = [
    'Yanvar',
    'Fevral',
    'Mart',
    'Aprel',
    'May',
    'Iyun',
    'Iyul',
    'Avgust',
    'Sentabr',
    'Oktabr',
    'Noyabr',
    'Dekabr',
  ];

  return `${messageDate.getDate()} ${monthNames[messageDate.getMonth()]} ${messageDate.getFullYear()}`;
};

export const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.line,
          {
            backgroundColor: theme.border,
          },
        ]}
      />
      <Text style={[styles.text, { color: theme.textSecondary }]}>
        {formatDateSeparator(date)}
      </Text>
      <View
        style={[
          styles.line,
          {
            backgroundColor: theme.border,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scale(16),
    paddingHorizontal: scale(16),
  },
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    marginHorizontal: scale(12),
    fontSize: moderateScale(13),
    fontWeight: '600',
  },
});
