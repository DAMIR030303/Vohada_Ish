/**
 * Mock Services - Test uchun
 */

// Mock Haptics
export const mockHaptics = {
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
};

// Mock Sound Effects
export const mockSoundEffects = {
  tap: jest.fn(),
  buttonPress: jest.fn(),
  selection: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
  notification: jest.fn(),
  swipe: jest.fn(),
  refresh: jest.fn(),
  confirmAction: jest.fn(),
  deleteAction: jest.fn(),
};

// Mock Firebase Auth
export const mockFirebaseAuth = {
  currentUser: null,
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: { uid: 'test-uid', email: 'test@example.com' },
  }),
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: { uid: 'test-uid', email: 'test@example.com' },
  }),
  signOut: jest.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
  onAuthStateChanged: jest.fn((callback) => {
    // Simulate auth state change
    setTimeout(() => callback(null), 0);
    return jest.fn(); // unsubscribe function
  }),
};

// Mock Firestore
export const mockFirestore = {
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      get: jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({ name: 'Test Data' }),
      }),
      set: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      onSnapshot: jest.fn((callback) => {
        // Simulate real-time update
        setTimeout(
          () =>
            callback({
              exists: true,
              data: () => ({ name: 'Test Data' }),
            }),
          0,
        );
        return jest.fn(); // unsubscribe function
      }),
    })),
    add: jest.fn().mockResolvedValue({ id: 'test-doc-id' }),
    where: jest.fn(() => ({
      get: jest.fn().mockResolvedValue({
        docs: [
          {
            id: 'test-doc-1',
            data: () => ({ title: 'Test Job 1' }),
          },
        ],
      }),
      onSnapshot: jest.fn((callback) => {
        setTimeout(
          () =>
            callback({
              docs: [
                {
                  id: 'test-doc-1',
                  data: () => ({ title: 'Test Job 1' }),
                },
              ],
            }),
          0,
        );
        return jest.fn();
      }),
    })),
    orderBy: jest.fn(() => ({
      get: jest.fn().mockResolvedValue({
        docs: [
          {
            id: 'test-doc-1',
            data: () => ({ title: 'Test Job 1', createdAt: new Date() }),
          },
        ],
      }),
      limit: jest.fn(() => ({
        get: jest.fn().mockResolvedValue({
          docs: [
            {
              id: 'test-doc-1',
              data: () => ({ title: 'Test Job 1' }),
            },
          ],
        }),
      })),
    })),
  })),
};

// Mock AsyncStorage
export const mockAsyncStorage = {
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
  getAllKeys: jest.fn().mockResolvedValue([]),
  multiGet: jest.fn().mockResolvedValue([]),
  multiSet: jest.fn().mockResolvedValue(undefined),
  multiRemove: jest.fn().mockResolvedValue(undefined),
};

// Mock Navigation
export const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
  dispatch: jest.fn(),
  setOptions: jest.fn(),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => true),
  getId: jest.fn(() => 'test-screen'),
  getParent: jest.fn(),
  getState: jest.fn(() => ({
    key: 'test-state',
    index: 0,
    routeNames: ['Test'],
    routes: [{ key: 'test-route', name: 'Test' }],
  })),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
};

// Mock Gesture Handler
export const mockGestureHandler = {
  PanGestureHandler: 'PanGestureHandler',
  LongPressGestureHandler: 'LongPressGestureHandler',
  State: {
    UNDETERMINED: 0,
    FAILED: 1,
    BEGAN: 2,
    CANCELLED: 3,
    ACTIVE: 4,
    END: 5,
  },
};

// Mock Lottie
export const mockLottie = {
  default: jest.fn(() => null),
};

// Mock Expo modules
export const mockExpoModules = {
  // Expo Haptics
  Haptics: mockHaptics,

  // Expo AV
  Audio: {
    setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
    Sound: {
      createAsync: jest.fn().mockResolvedValue({
        sound: {
          playAsync: jest.fn().mockResolvedValue(undefined),
          setVolumeAsync: jest.fn().mockResolvedValue(undefined),
          replayAsync: jest.fn().mockResolvedValue(undefined),
          unloadAsync: jest.fn().mockResolvedValue(undefined),
        },
      }),
    },
  },

  // Expo Constants
  Constants: {
    expoConfig: {
      name: 'VohadaIsh',
      version: '1.0.0',
    },
    platform: {
      ios: undefined,
      android: {},
    },
  },

  // Expo Status Bar
  StatusBar: {
    setStatusBarStyle: jest.fn(),
    setBackgroundColorAsync: jest.fn().mockResolvedValue(undefined),
  },
};

// Global mocks setup
export const setupMocks = () => {
  // Mock React Native modules
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
        Value: jest.fn(() => ({
          setValue: jest.fn(),
          interpolate: jest.fn(() => 0),
        })),
      },
      Dimensions: {
        get: jest.fn(() => ({ width: 375, height: 812 })),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
      Platform: {
        OS: 'ios',
        select: jest.fn((obj) => obj.ios || obj.default),
      },
    };
  });

  // Mock AsyncStorage
  jest.mock(
    '@react-native-async-storage/async-storage',
    () => mockAsyncStorage,
  );

  // Mock Expo Haptics
  jest.mock('expo-haptics', () => mockHaptics);

  // Mock Firebase
  jest.mock('../../../services/firebase', () => ({
    auth: mockFirebaseAuth,
    db: mockFirestore,
    storage: null,
  }));

  // Mock Sound Effects
  jest.mock('../../../utils/soundEffects', () => ({
    initializeSounds: jest.fn().mockResolvedValue(undefined),
    soundEffects: mockSoundEffects,
  }));
};

export default {
  mockHaptics,
  mockSoundEffects,
  mockFirebaseAuth,
  mockFirestore,
  mockAsyncStorage,
  mockNavigation,
  mockGestureHandler,
  mockLottie,
  mockExpoModules,
  setupMocks,
};
