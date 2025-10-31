/**
 * Theme Selector komponenti - Settings sahifasi uchun
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { AnimatedTouchable } from './AnimatedComponents';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { fontSize } from '../utils/responsive';

export const ThemeSelector: React.FC = () => {
  const { themeMode, setThemeMode, colors } = useTheme();

  const themeOptions: { mode: ThemeMode; label: string; icon: string }[] = [
    { mode: 'light', label: 'Yorug\'', icon: 'white-balance-sunny' },
    { mode: 'dark', label: 'Qorong\'u', icon: 'moon-waning-crescent' },
    { mode: 'system', label: 'Tizim', icon: 'cellphone' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Mavzu tanlash
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Ilovaning ko'rinishini o'zgartiring
      </Text>
      
      <View style={styles.optionsContainer}>
        {themeOptions.map((option) => (
          <AnimatedTouchable
            key={option.mode}
            style={[
              styles.option,
              { 
                backgroundColor: colors.background,
                borderColor: themeMode === option.mode ? colors.primary : colors.border,
                borderWidth: themeMode === option.mode ? 2 : 1,
              }
            ]}
            onPress={() => setThemeMode(option.mode)}
            scaleValue={0.96}
          >
            <MaterialCommunityIcons
              name={option.icon as any}
              size={24}
              color={themeMode === option.mode ? colors.primary : colors.textSecondary}
            />
            <Text style={[
              styles.optionText,
              { 
                color: themeMode === option.mode ? colors.primary : colors.text,
                fontWeight: themeMode === option.mode ? '600' : '500',
              }
            ]}>
              {option.label}
            </Text>
            {themeMode === option.mode && (
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color={colors.primary}
                style={styles.checkIcon}
              />
            )}
          </AnimatedTouchable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    margin: 16,
    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: fontSize(20),
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSize(14),
    marginBottom: 20,
    lineHeight: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    position: 'relative',
  },
  optionText: {
    fontSize: fontSize(16),
    marginLeft: 12,
    flex: 1,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
});
