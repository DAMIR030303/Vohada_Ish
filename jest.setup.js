// Jest setup file
import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// Mock Expo Haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

// Mock Expo AV (Sound)
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(() =>
        Promise.resolve({
          sound: {
            playAsync: jest.fn(() => Promise.resolve()),
            stopAsync: jest.fn(() => Promise.resolve()),
            unloadAsync: jest.fn(() => Promise.resolve()),
            setVolumeAsync: jest.fn(() => Promise.resolve()),
          },
          status: {},
        }),
      ),
    },
    setAudioModeAsync: jest.fn(() => Promise.resolve()),
  },
}));

// Mock Expo Notifications
jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted', granted: true }),
  ),
  getPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted', granted: true }),
  ),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('notification-id')),
  cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
  setNotificationHandler: jest.fn(),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
}));

// Mock Expo Font
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoaded: jest.fn(() => true),
  useFonts: jest.fn(() => [true, null]),
  Font: {
    displayName: 'Font',
    loadAsync: jest.fn(() => Promise.resolve()),
    isLoaded: jest.fn(() => true),
  },
}));

// Mock Expo Vector Icons
jest.mock('@expo/vector-icons', () => {
  const { View, Text } = require('react-native');
  return {
    MaterialCommunityIcons: View,
    MaterialIcons: View,
    FontAwesome: View,
    FontAwesome5: View,
    Feather: View,
    AntDesign: View,
    Ionicons: View,
    Entypo: View,
    Fontisto: View,
    SimpleLineIcons: View,
    Octicons: View,
    Foundation: View,
    EvilIcons: View,
    Zocial: View,
  };
});

// Mock Expo Linear Gradient
jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return {
    LinearGradient: View,
  };
});

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(() => jest.fn()),
  sendPasswordResetEmail: jest.fn(),
  confirmPasswordReset: jest.fn(),
  updateProfile: jest.fn(),
}));

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  setDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({ seconds: Date.now() / 1000, nanoseconds: 0 })),
  },
}));

// Mock Firebase service
jest.mock('./src/services/firebase', () => ({
  auth: {
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(() => jest.fn()),
    sendPasswordResetEmail: jest.fn(),
  },
  db: {
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
}));

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock Gesture Handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    GestureHandlerRootView: View,
    PanGestureHandler: View,
    TouchableOpacity: View,
    State: {},
    Directions: {},
  };
});

// Mock React Navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      dispatch: jest.fn(),
      setOptions: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

// Mock React Native Paper
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');

  const Searchbar = React.forwardRef((props, ref) => {
    const {
      placeholder,
      onChangeText,
      value,
      style,
      inputStyle,
      onIconPress,
      clearIcon,
    } = props;

    // Find placeholder in children if needed
    return (
      <View testID="searchbar" ref={ref} style={style}>
        <TextInput
          testID={`searchbar-input-${placeholder}`}
          placeholder={placeholder}
          onChangeText={onChangeText}
          value={value}
          style={inputStyle}
          accessible={true}
          accessibilityRole="search"
          accessibilityLabel={placeholder}
        />
        {clearIcon}
      </View>
    );
  });
  Searchbar.displayName = 'Searchbar';

  const TextInputPaper = React.forwardRef((props, ref) => {
    const { label, ...textInputProps } = props;
    return (
      <View>
        {label && <Text>{label}</Text>}
        <TextInput {...textInputProps} ref={ref} />
      </View>
    );
  });
  TextInputPaper.displayName = 'TextInput';

  const ButtonPaper = React.forwardRef((props, ref) => {
    const { children, onPress, mode, ...rest } = props;
    return (
      <TouchableOpacity onPress={onPress} ref={ref} {...rest}>
        <Text>{children}</Text>
      </TouchableOpacity>
    );
  });
  ButtonPaper.displayName = 'Button';

  return {
    Provider: ({ children }) => children,
    Searchbar,
    TextInput: TextInputPaper,
    Button: ButtonPaper,
    Portal: ({ children }) => children,
    PortalHost: () => null,
    Snackbar: View,
    Dialog: View,
    DialogContent: View,
    DialogActions: View,
    DialogTitle: View,
    useTheme: () => ({
      colors: {
        primary: '#6200EE',
        accent: '#03DAC6',
        background: '#FFFFFF',
        surface: '#FFFFFF',
        text: '#000000',
        onSurface: '#000000',
        disabled: '#CCCCCC',
        placeholder: '#999999',
        backdrop: 'rgba(0, 0, 0, 0.5)',
      },
      dark: false,
    }),
  };
});

// Suppress console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
