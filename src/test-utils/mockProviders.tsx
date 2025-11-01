/**
 * Mock Providers - Test uchun
 */

import React, { createContext, useContext } from 'react';

// Mock AuthContext
const MockAuthContext = createContext({
  user: null,
  loading: false,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  resetPassword: jest.fn(),
  updateProfile: jest.fn(),
});

export const MockAuthProvider: React.FC<{
  children: React.ReactNode;
  value?: any;
}> = ({ children, value }) => {
  const defaultValue = {
    user: null,
    loading: false,
    login: jest.fn().mockResolvedValue({ success: true }),
    register: jest.fn().mockResolvedValue({ success: true }),
    logout: jest.fn().mockResolvedValue(undefined),
    resetPassword: jest.fn().mockResolvedValue({ success: true }),
    updateProfile: jest.fn().mockResolvedValue({ success: true }),
    ...value,
  };

  return (
    <MockAuthContext.Provider value={defaultValue}>
      {children}
    </MockAuthContext.Provider>
  );
};

export const useMockAuth = () => useContext(MockAuthContext);

// Mock JobContext
const MockJobContext = createContext({
  jobs: [],
  userJobs: [],
  loading: false,
  filters: {},
  setFilters: jest.fn(),
  refreshJobs: jest.fn(),
  refreshUserJobs: jest.fn(),
});

export const MockJobProvider: React.FC<{
  children: React.ReactNode;
  value?: any;
}> = ({ children, value }) => {
  const defaultValue = {
    jobs: [],
    userJobs: [],
    loading: false,
    filters: {},
    setFilters: jest.fn(),
    refreshJobs: jest.fn().mockResolvedValue(undefined),
    refreshUserJobs: jest.fn().mockResolvedValue(undefined),
    ...value,
  };

  return (
    <MockJobContext.Provider value={defaultValue}>
      {children}
    </MockJobContext.Provider>
  );
};

export const useMockJobs = () => useContext(MockJobContext);

// Mock ThemeContext
const MockThemeContext = createContext({
  themeMode: 'light' as const,
  isDarkMode: false,
  setThemeMode: jest.fn(),
  colors: {
    primary: '#1B4332',
    primaryDark: '#0F2419',
    primaryLight: '#2D5A3D',
    secondary: '#D4A574',
    accent: '#40916C',
    error: '#DC3545',
    warning: '#F59E0B',
    success: '#52B788',
    info: '#40916C',
    background: '#FAFBFC',
    surface: '#FFFFFF',
    text: '#212529',
    textSecondary: '#495057',
    textDisabled: '#ADB5BD',
    border: '#DEE2E6',
    divider: '#CED4DA',
    shadow: 'rgba(27, 67, 50, 0.1)',
  },
});

export const MockThemeProvider: React.FC<{
  children: React.ReactNode;
  value?: any;
}> = ({ children, value }) => {
  const defaultValue = {
    themeMode: 'light' as const,
    isDarkMode: false,
    setThemeMode: jest.fn(),
    colors: {
      primary: '#1B4332',
      primaryDark: '#0F2419',
      primaryLight: '#2D5A3D',
      secondary: '#D4A574',
      accent: '#40916C',
      error: '#DC3545',
      warning: '#F59E0B',
      success: '#52B788',
      info: '#40916C',
      background: '#FAFBFC',
      surface: '#FFFFFF',
      text: '#212529',
      textSecondary: '#495057',
      textDisabled: '#ADB5BD',
      border: '#DEE2E6',
      divider: '#CED4DA',
      shadow: 'rgba(27, 67, 50, 0.1)',
    },
    ...value,
  };

  return (
    <MockThemeContext.Provider value={defaultValue}>
      {children}
    </MockThemeContext.Provider>
  );
};

export const useMockTheme = () => useContext(MockThemeContext);

// Mock TransitionContext
const MockTransitionContext = createContext({
  currentTransition: 'ios' as const,
  setTransition: jest.fn(),
  getTransitionConfig: jest.fn(),
  isAnimationsEnabled: true,
  setAnimationsEnabled: jest.fn(),
});

export const MockTransitionProvider: React.FC<{
  children: React.ReactNode;
  value?: any;
}> = ({ children, value }) => {
  const defaultValue = {
    currentTransition: 'ios' as const,
    setTransition: jest.fn(),
    getTransitionConfig: jest.fn(() => ({
      transitionSpec: {
        open: { animation: 'timing', config: { duration: 250 } },
        close: { animation: 'timing', config: { duration: 200 } },
      },
    })),
    isAnimationsEnabled: true,
    setAnimationsEnabled: jest.fn(),
    ...value,
  };

  return (
    <MockTransitionContext.Provider value={defaultValue}>
      {children}
    </MockTransitionContext.Provider>
  );
};

export const useMockTransition = () => useContext(MockTransitionContext);
