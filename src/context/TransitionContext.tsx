/**
 * Transition Context - Screen transitions'ni boshqarish
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState } from 'react';

import { transitionConfigs } from '../utils/screenTransitions';

export type TransitionType =
  | 'ios'
  | 'android'
  | 'modal'
  | 'bouncy'
  | 'flip'
  | 'cube';

interface TransitionContextType {
  currentTransition: TransitionType;
  setTransition: (transition: TransitionType) => void;
  getTransitionConfig: () => any;
  isAnimationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(
  undefined,
);

const TRANSITION_STORAGE_KEY = '@transition_type';
const ANIMATIONS_STORAGE_KEY = '@animations_enabled';

export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTransition, setCurrentTransition] =
    useState<TransitionType>('ios');
  const [isAnimationsEnabled, setIsAnimationsEnabledState] = useState(true);

  // Load saved transition settings
  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const [savedTransition, savedAnimations] = await Promise.all([
          AsyncStorage.getItem(TRANSITION_STORAGE_KEY),
          AsyncStorage.getItem(ANIMATIONS_STORAGE_KEY),
        ]);

        if (
          savedTransition &&
          Object.keys(transitionConfigs).includes(savedTransition)
        ) {
          setCurrentTransition(savedTransition as TransitionType);
        }

        if (savedAnimations !== null) {
          setIsAnimationsEnabledState(JSON.parse(savedAnimations));
        }
      } catch (error) {
        console.error('Error loading transition settings:', error);
      }
    };

    loadSettings();
  }, []);

  const setTransition = async (transition: TransitionType) => {
    try {
      setCurrentTransition(transition);
      await AsyncStorage.setItem(TRANSITION_STORAGE_KEY, transition);
    } catch (error) {
      console.error('Error saving transition type:', error);
    }
  };

  const setAnimationsEnabled = async (enabled: boolean) => {
    try {
      setIsAnimationsEnabledState(enabled);
      await AsyncStorage.setItem(
        ANIMATIONS_STORAGE_KEY,
        JSON.stringify(enabled),
      );
    } catch (error) {
      console.error('Error saving animations setting:', error);
    }
  };

  const getTransitionConfig = () => {
    if (!isAnimationsEnabled) {
      // Return minimal transition config when animations are disabled
      return {
        transitionSpec: {
          open: { animation: 'timing', config: { duration: 0 } },
          close: { animation: 'timing', config: { duration: 0 } },
        },
        cardStyleInterpolator: ({ current }: any) => ({
          cardStyle: { opacity: current.progress },
        }),
      };
    }

    return transitionConfigs[currentTransition];
  };

  return (
    <TransitionContext.Provider
      value={{
        currentTransition,
        setTransition,
        getTransitionConfig,
        isAnimationsEnabled,
        setAnimationsEnabled,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = (): TransitionContextType => {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
};
