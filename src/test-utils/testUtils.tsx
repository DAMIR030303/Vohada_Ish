/**
 * Test Utilities - VohadaIsh uchun
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';

import { ThemeProvider } from '../context/ThemeContext';
import { TransitionProvider } from '../context/TransitionContext';
import { AuthProvider } from '../context/AuthContext';
import { JobProvider } from '../context/JobContext';

/**
 * Custom render function with all providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // Provider options
  withAuth?: boolean;
  withJobs?: boolean;
  withTheme?: boolean;
  withTransition?: boolean;
  // Initial states
  initialAuthState?: {
    user: any;
    loading: boolean;
  };
  initialJobState?: {
    jobs: any[];
    loading: boolean;
  };
}

const AllProviders: React.FC<{ 
  children: React.ReactNode;
  options?: CustomRenderOptions;
}> = ({ 
  children, 
  options = {} 
}) => {
  const {
    withAuth = true,
    withJobs = true,
    withTheme = true,
    withTransition = true,
  } = options;

  let component = children;

  // Wrap with providers (inner to outer)
  if (withJobs) {
    component = <JobProvider>{component}</JobProvider>;
  }

  if (withAuth) {
    component = <AuthProvider>{component}</AuthProvider>;
  }

  component = <PaperProvider>{component}</PaperProvider>;

  if (withTransition) {
    component = <TransitionProvider>{component}</TransitionProvider>;
  }

  if (withTheme) {
    component = <ThemeProvider>{component}</ThemeProvider>;
  }

  component = <SafeAreaProvider>{component}</SafeAreaProvider>;

  return <>{component}</>;
};

export const renderWithProviders = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders options={options}>{children}</AllProviders>
    ),
    ...options,
  });
};

/**
 * Theme-only wrapper (for theme-dependent components)
 */
export const renderWithTheme = (ui: React.ReactElement) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <SafeAreaProvider>
        <ThemeProvider>
          <PaperProvider>
            {children}
          </PaperProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    ),
  });
};

/**
 * Mock data generators
 */
export const createMockJob = (overrides = {}) => ({
  id: 'test-job-1',
  title: 'Test Job Title',
  description: 'Test job description',
  category: 'technology',
  region: 'Toshkent',
  district: 'Yunusobod',
  salary: {
    min: 5000000,
    max: 8000000,
    currency: 'UZS',
  },
  employmentType: 'full-time' as const,
  requirements: ['React Native', 'TypeScript'],
  benefits: ['Health insurance', 'Flexible hours'],
  companyName: 'Test Company',
  contactPhone: '+998901234567',
  contactEmail: 'test@company.com',
  postedBy: 'test-user-id',
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'active' as const,
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: 'test-user-1',
  email: 'test@example.com',
  fullName: 'Test User',
  phone: '+998901234567',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockJobs = (count = 5) => {
  return Array.from({ length: count }, (_, index) =>
    createMockJob({
      id: `test-job-${index + 1}`,
      title: `Test Job ${index + 1}`,
    })
  );
};

/**
 * Common test helpers
 */
export const waitForLoadingToFinish = () => {
  return new Promise((resolve) => setTimeout(resolve, 0));
};

export const createMockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
  dispatch: jest.fn(),
  setOptions: jest.fn(),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => true),
  getId: jest.fn(() => 'test-route'),
  getParent: jest.fn(),
  getState: jest.fn(),
});

export const createMockRoute = (params = {}) => ({
  key: 'test-route-key',
  name: 'TestScreen' as never,
  params,
  path: undefined,
});

/**
 * Accessibility test helpers
 */
export const testAccessibility = {
  hasAccessibilityLabel: (element: any, label: string) => {
    expect(element).toHaveProp('accessibilityLabel', label);
  },
  hasAccessibilityRole: (element: any, role: string) => {
    expect(element).toHaveProp('accessibilityRole', role);
  },
  hasAccessibilityHint: (element: any, hint: string) => {
    expect(element).toHaveProp('accessibilityHint', hint);
  },
  isAccessible: (element: any) => {
    expect(element).toHaveProp('accessible', true);
  },
};

/**
 * Animation test helpers
 */
export const mockAnimations = () => {
  // Mock Animated API
  jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    return {
      ...RN,
      Animated: {
        ...RN.Animated,
        timing: jest.fn(() => ({
          start: jest.fn((callback) => callback && callback()),
        })),
        spring: jest.fn(() => ({
          start: jest.fn((callback) => callback && callback()),
        })),
        sequence: jest.fn(() => ({
          start: jest.fn((callback) => callback && callback()),
        })),
        parallel: jest.fn(() => ({
          start: jest.fn((callback) => callback && callback()),
        })),
        loop: jest.fn(() => ({
          start: jest.fn(),
          stop: jest.fn(),
        })),
        Value: jest.fn(() => ({
          setValue: jest.fn(),
          interpolate: jest.fn(() => 0),
          addListener: jest.fn(),
          removeListener: jest.fn(),
          removeAllListeners: jest.fn(),
        })),
      },
    };
  });
};

/**
 * Firebase mock helpers
 */
export const mockFirebase = () => {
  return {
    auth: {
      currentUser: null,
      signInWithEmailAndPassword: jest.fn(),
      createUserWithEmailAndPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChanged: jest.fn(),
      sendPasswordResetEmail: jest.fn(),
    },
    firestore: {
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          get: jest.fn(),
          set: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
          onSnapshot: jest.fn(),
        })),
        add: jest.fn(),
        where: jest.fn(() => ({
          get: jest.fn(),
          onSnapshot: jest.fn(),
        })),
        orderBy: jest.fn(() => ({
          get: jest.fn(),
          onSnapshot: jest.fn(),
        })),
        limit: jest.fn(() => ({
          get: jest.fn(),
        })),
      })),
    },
  };
};

// Re-export testing library utilities
export * from '@testing-library/react-native';
