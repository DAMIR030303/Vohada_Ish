/**
 * JobContext testlari
 *
 * @description JobContext funksiyalarini to'liq test qilish
 * Coverage target: 90%+
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import React from 'react';

import * as jobService from '../../services/jobService';
import * as AuthContextModule from '../AuthContext';
import { AuthProvider } from '../AuthContext';
import { JobProvider, useJobs } from '../JobContext';

// Mock services
jest.mock('../../services/jobService');
jest.mock('../AuthContext', () => ({
  ...jest.requireActual('../AuthContext'),
  useAuth: jest.fn(),
}));

const mockGetJobs = jobService.getJobs as jest.Mock;
const mockGetUserJobs = jobService.getUserJobs as jest.Mock;
const { useAuth } = AuthContextModule;

describe('JobContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetJobs.mockResolvedValue([]);
    mockGetUserJobs.mockResolvedValue([]);
    useAuth.mockReturnValue({ user: null });
  });

  describe('Provider initialization', () => {
    it("default state bo'sh arrays bo'lishi kerak", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <JobProvider>{children}</JobProvider>
        </AuthProvider>
      );

      const { result } = renderHook(() => useJobs(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.jobs).toEqual([]);
      expect(result.current.userJobs).toEqual([]);
      expect(result.current.filters).toEqual({});
    });

    it('mount paytida jobs yuklash kerak', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          title: 'React Developer',
          category: 'technology',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockGetJobs.mockResolvedValue(mockJobs);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <JobProvider>{children}</JobProvider>
        </AuthProvider>
      );

      const { result } = renderHook(() => useJobs(), { wrapper });

      await waitFor(() => {
        expect(result.current.jobs).toHaveLength(1);
      });

      expect(mockGetJobs).toHaveBeenCalledWith({});
      expect(result.current.jobs[0].title).toBe('React Developer');
    });
  });

  describe('setFilters', () => {
    it("filterlarni o'zgartirish kerak", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <JobProvider>{children}</JobProvider>
        </AuthProvider>
      );

      const { result } = renderHook(() => useJobs(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        result.current.setFilters({ category: 'technology' });
      });

      expect(result.current.filters.category).toBe('technology');
    });

    it("filterlar o'zgarganda jobs refresh qilish kerak", async () => {
      const mockJobs = [
        {
          id: 'job-1',
          title: 'Job 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockGetJobs.mockResolvedValue(mockJobs);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <JobProvider>{children}</JobProvider>
        </AuthProvider>
      );

      const { result } = renderHook(() => useJobs(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      mockGetJobs.mockResolvedValue([
        ...mockJobs,
        {
          id: 'job-2',
          title: 'Job 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      await act(async () => {
        result.current.setFilters({
          category: 'technology',
          region: 'Toshkent',
        });
      });

      await waitFor(() => {
        expect(mockGetJobs).toHaveBeenCalledWith({
          category: 'technology',
          region: 'Toshkent',
        });
      });
    });
  });

  describe('refreshJobs', () => {
    it("jobs'larni yangilash kerak", async () => {
      const mockJobs = [
        {
          id: 'job-1',
          title: 'Job 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockGetJobs.mockResolvedValue(mockJobs);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <JobProvider>{children}</JobProvider>
        </AuthProvider>
      );

      const { result } = renderHook(() => useJobs(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newJobs = [
        {
          id: 'job-1',
          title: 'Job 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'job-2',
          title: 'Job 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockGetJobs.mockResolvedValue(newJobs);

      await act(async () => {
        await result.current.refreshJobs();
      });

      await waitFor(() => {
        expect(result.current.jobs).toHaveLength(2);
      });

      expect(mockGetJobs).toHaveBeenCalledWith(result.current.filters);
    });

    it('xato yuz berganda console.error chaqirilishi kerak', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Network error');
      mockGetJobs.mockRejectedValue(error);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <JobProvider>{children}</JobProvider>
        </AuthProvider>
      );

      const { result } = renderHook(() => useJobs(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.refreshJobs();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching jobs:', error);

      consoleSpy.mockRestore();
    });

    it("loading state to'g'ri o'zgarish kerak", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <JobProvider>{children}</JobProvider>
        </AuthProvider>
      );

      const { result } = renderHook(() => useJobs(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      mockGetJobs.mockImplementation(() => {
        return Promise.resolve([]);
      });

      act(() => {
        result.current.refreshJobs();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('refreshUserJobs', () => {
    it("user bo'lsa user jobs'larni yuklash kerak", async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        fullName: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      useAuth.mockReturnValue({ user: mockUser });

      const mockUserJobs = [
        {
          id: 'job-1',
          title: 'My Job',
          postedBy: 'user-123',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockGetUserJobs.mockResolvedValue(mockUserJobs);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <JobProvider>{children}</JobProvider>
        </AuthProvider>
      );

      const { result } = renderHook(() => useJobs(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.refreshUserJobs();
      });

      await waitFor(() => {
        expect(result.current.userJobs).toHaveLength(1);
      });

      expect(mockGetUserJobs).toHaveBeenCalledWith('user-123');
      expect(result.current.userJobs[0].title).toBe('My Job');
    });

    it("user bo'lmasa bo'sh array qaytarish kerak", async () => {
      useAuth.mockReturnValue({ user: null });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <JobProvider>{children}</JobProvider>
        </AuthProvider>
      );

      const { result } = renderHook(() => useJobs(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.refreshUserJobs();
      });

      expect(result.current.userJobs).toEqual([]);
      expect(mockGetUserJobs).not.toHaveBeenCalled();
    });

    it('xato yuz berganda console.error chaqirilishi kerak', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        fullName: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      useAuth.mockReturnValue({ user: mockUser });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Network error');
      mockGetUserJobs.mockRejectedValue(error);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <JobProvider>{children}</JobProvider>
        </AuthProvider>
      );

      const { result } = renderHook(() => useJobs(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.refreshUserJobs();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching user jobs:',
        error,
      );

      consoleSpy.mockRestore();
    });
  });

  describe('User dependency', () => {
    it("user o'zgarganda userJobs refresh qilish kerak", async () => {
      useAuth.mockReturnValue({ user: null });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <JobProvider>{children}</JobProvider>
        </AuthProvider>
      );

      const { result, rerender } = renderHook(() => useJobs(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        fullName: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      useAuth.mockReturnValue({ user: mockUser });

      const mockUserJobs = [
        {
          id: 'job-1',
          title: 'My Job',
          postedBy: 'user-123',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockGetUserJobs.mockResolvedValue(mockUserJobs);

      rerender();

      await waitFor(() => {
        expect(mockGetUserJobs).toHaveBeenCalled();
      });
    });
  });

  describe('useJobs hook', () => {
    it('provider ichida ishlash kerak', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <JobProvider>{children}</JobProvider>
        </AuthProvider>
      );

      const { result } = renderHook(() => useJobs(), { wrapper });

      expect(result.current).toHaveProperty('jobs');
      expect(result.current).toHaveProperty('userJobs');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('filters');
      expect(result.current).toHaveProperty('setFilters');
      expect(result.current).toHaveProperty('refreshJobs');
      expect(result.current).toHaveProperty('refreshUserJobs');
    });

    it('provider tashqarisida xato tashlash kerak', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useJobs());
      }).toThrow('useJobs must be used within a JobProvider');

      consoleSpy.mockRestore();
    });
  });
});
