/**
 * TransitionContext testlari
 * 
 * @description TransitionContext funksiyalarini to'liq test qilish
 * Coverage target: 85%+
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TransitionProvider, useTransition, TransitionType } from '../TransitionContext';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('TransitionContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  describe('Provider initialization', () => {
    it('default state ios transition bo\'lishi kerak', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TransitionProvider>{children}</TransitionProvider>
      );

      const { result } = renderHook(() => useTransition(), { wrapper });

      await waitFor(() => {
        expect(result.current.currentTransition).toBe('ios');
      });

      expect(result.current.isAnimationsEnabled).toBe(true);
    });

    it('saved transition AsyncStorage\'dan yuklash kerak', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === '@transition_type') {
          return Promise.resolve('android');
        }
        if (key === '@animations_enabled') {
          return Promise.resolve('true');
        }
        return Promise.resolve(null);
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TransitionProvider>{children}</TransitionProvider>
      );

      const { result } = renderHook(() => useTransition(), { wrapper });

      await waitFor(() => {
        expect(result.current.currentTransition).toBe('android');
      });
    });

    it('saved animations setting AsyncStorage\'dan yuklash kerak', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === '@animations_enabled') {
          return Promise.resolve('false');
        }
        return Promise.resolve(null);
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TransitionProvider>{children}</TransitionProvider>
      );

      const { result } = renderHook(() => useTransition(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAnimationsEnabled).toBe(false);
      });
    });

    it('invalid transition ni ignore qilish kerak', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === '@transition_type') {
          return Promise.resolve('invalid-transition');
        }
        return Promise.resolve(null);
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TransitionProvider>{children}</TransitionProvider>
      );

      const { result } = renderHook(() => useTransition(), { wrapper });

      await waitFor(() => {
        // Should keep default
        expect(result.current.currentTransition).toBe('ios');
      });
    });
  });

  describe('setTransition', () => {
    it('transition o\'zgartirish va saqlash kerak', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TransitionProvider>{children}</TransitionProvider>
      );

      const { result } = renderHook(() => useTransition(), { wrapper });

      await waitFor(() => {
        expect(result.current.currentTransition).toBe('ios');
      });

      await act(async () => {
        await result.current.setTransition('android');
      });

      expect(result.current.currentTransition).toBe('android');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@transition_type', 'android');
    });

    it('barcha transition turlarini qo\'llab-quvvatlash kerak', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TransitionProvider>{children}</TransitionProvider>
      );

      const { result } = renderHook(() => useTransition(), { wrapper });

      await waitFor(() => {
        expect(result.current.currentTransition).toBe('ios');
      });

      const transitions: TransitionType[] = ['ios', 'android', 'modal', 'bouncy', 'flip', 'cube'];

      for (const transition of transitions) {
        await act(async () => {
          await result.current.setTransition(transition);
        });

        expect(result.current.currentTransition).toBe(transition);
      }
    });

    it('xato yuz berganda console.error chaqirilishi kerak', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TransitionProvider>{children}</TransitionProvider>
      );

      const { result } = renderHook(() => useTransition(), { wrapper });

      await waitFor(() => {
        expect(result.current.currentTransition).toBe('ios');
      });

      await act(async () => {
        await result.current.setTransition('android');
      });

      // State should still update
      expect(result.current.currentTransition).toBe('android');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error saving transition type:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('setAnimationsEnabled', () => {
    it('animations\'ni yoqish/o\'chirish va saqlash kerak', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TransitionProvider>{children}</TransitionProvider>
      );

      const { result } = renderHook(() => useTransition(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAnimationsEnabled).toBe(true);
      });

      await act(async () => {
        await result.current.setAnimationsEnabled(false);
      });

      expect(result.current.isAnimationsEnabled).toBe(false);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@animations_enabled',
        'false'
      );

      await act(async () => {
        await result.current.setAnimationsEnabled(true);
      });

      expect(result.current.isAnimationsEnabled).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@animations_enabled',
        'true'
      );
    });

    it('xato yuz berganda console.error chaqirilishi kerak', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TransitionProvider>{children}</TransitionProvider>
      );

      const { result } = renderHook(() => useTransition(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAnimationsEnabled).toBe(true);
      });

      await act(async () => {
        await result.current.setAnimationsEnabled(false);
      });

      // State should still update
      expect(result.current.isAnimationsEnabled).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error saving animations setting:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('getTransitionConfig', () => {
    it('animations yoqilgan bo\'lsa transition config qaytarish kerak', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TransitionProvider>{children}</TransitionProvider>
      );

      const { result } = renderHook(() => useTransition(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAnimationsEnabled).toBe(true);
      });

      const config = result.current.getTransitionConfig();

      expect(config).toHaveProperty('transitionSpec');
      expect(config).toHaveProperty('cardStyleInterpolator');
      expect(typeof config.cardStyleInterpolator).toBe('function');
    });

    it('animations o\'chirilgan bo\'lsa minimal config qaytarish kerak', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TransitionProvider>{children}</TransitionProvider>
      );

      const { result } = renderHook(() => useTransition(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAnimationsEnabled).toBe(true);
      });

      await act(async () => {
        await result.current.setAnimationsEnabled(false);
      });

      const config = result.current.getTransitionConfig();

      expect(config.transitionSpec.open.config.duration).toBe(0);
      expect(config.transitionSpec.close.config.duration).toBe(0);
      expect(typeof config.cardStyleInterpolator).toBe('function');
    });

    it('turli transition turlari uchun to\'g\'ri config qaytarish kerak', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TransitionProvider>{children}</TransitionProvider>
      );

      const { result } = renderHook(() => useTransition(), { wrapper });

      await waitFor(() => {
        expect(result.current.currentTransition).toBe('ios');
      });

      const transitions: TransitionType[] = ['modal', 'bouncy', 'flip', 'cube'];

      for (const transition of transitions) {
        await act(async () => {
          await result.current.setTransition(transition);
        });

        const config = result.current.getTransitionConfig();
        expect(config).toHaveProperty('transitionSpec');
        expect(config).toHaveProperty('cardStyleInterpolator');
      }
    });
  });

  describe('useTransition hook', () => {
    it('provider ichida ishlash kerak', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TransitionProvider>{children}</TransitionProvider>
      );

      const { result } = renderHook(() => useTransition(), { wrapper });

      expect(result.current).toHaveProperty('currentTransition');
      expect(result.current).toHaveProperty('setTransition');
      expect(result.current).toHaveProperty('getTransitionConfig');
      expect(result.current).toHaveProperty('isAnimationsEnabled');
      expect(result.current).toHaveProperty('setAnimationsEnabled');
    });

    it('provider tashqarisida xato tashlash kerak', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useTransition());
      }).toThrow('useTransition must be used within a TransitionProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Error handling', () => {
    it('AsyncStorage xatolarini to\'g\'ri qayta ishlash kerak', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TransitionProvider>{children}</TransitionProvider>
      );

      const { result } = renderHook(() => useTransition(), { wrapper });

      await waitFor(() => {
        // Should fallback to defaults
        expect(result.current.currentTransition).toBe('ios');
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error loading transition settings:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});

