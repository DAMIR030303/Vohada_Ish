/**
 * Theme Context - Dark/Light mode uchun
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

import { brandColors } from '../constants/colors';

export type ThemeMode = 'light' | 'dark' | 'system';

type ColorScheme = {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  secondaryDark: string;
  secondaryLight: string;
  accent: string;
  error: string;
  warning: string;
  success: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  textDisabled: string;
  border: string;
  divider: string;
  shadow: string;
};

interface ThemeContextType {
  themeMode: ThemeMode;
  isDarkMode: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  colors: ColorScheme;
  theme: ColorScheme; // Alias for colors (backward compatibility)
}

// Light theme colors - VohadaIsh brand
const lightColors = {
  // Brand colors
  primary: brandColors.primary,
  primaryDark: brandColors.primaryDark,
  primaryLight: brandColors.primaryLight,

  // Complementary colors
  secondary: '#D4A574', // Warm beige complement
  secondaryDark: '#B8956A',
  secondaryLight: '#E0B885',

  // Status colors
  accent: brandColors.accent,
  error: '#DC3545',
  warning: '#F59E0B',
  success: brandColors.accentLight,
  info: brandColors.accent,

  // UI colors
  background: '#FAFBFC',
  surface: brandColors.white,
  text: brandColors.gray[800],
  textSecondary: brandColors.gray[600],
  textDisabled: brandColors.gray[400],
  border: brandColors.gray[200],
  divider: brandColors.gray[300],
  shadow: 'rgba(27, 67, 50, 0.1)',
};

// Dark theme colors - VohadaIsh brand
const darkColors = {
  // Brand colors (lighter for dark theme)
  primary: brandColors.accentLight,
  primaryDark: brandColors.accent,
  primaryLight: '#6FD89C',

  // Complementary colors
  secondary: '#E0B885',
  secondaryDark: '#D4A574',
  secondaryLight: '#ECCC9A',

  // Status colors
  accent: brandColors.accentLight,
  error: '#F87171',
  warning: '#FBBF24',
  success: '#6FD89C',
  info: brandColors.accentLight,

  // UI colors
  background: '#0A0F0C', // Very dark green tint
  surface: '#1A2B20', // Dark green surface
  text: brandColors.white,
  textSecondary: brandColors.gray[300],
  textDisabled: brandColors.gray[500],
  border: '#2D4A35', // Dark green border
  divider: '#3A5A42', // Darker green divider
  shadow: 'rgba(0, 0, 0, 0.4)',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme(),
  );

  // Determine if dark mode should be active
  const isDarkMode =
    themeMode === 'dark' ||
    (themeMode === 'system' && systemColorScheme === 'dark');

  // Get current colors based on theme
  const colors = isDarkMode ? darkColors : lightColors;

  // Load saved theme mode
  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Error loading theme mode:', error);
      }
    };

    loadThemeMode();
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  // Set theme mode and save to storage
  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        isDarkMode,
        setThemeMode,
        colors,
        theme: colors, // Alias for backward compatibility
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export colors for backward compatibility
export const getColors = (isDark: boolean) =>
  isDark ? darkColors : lightColors;
