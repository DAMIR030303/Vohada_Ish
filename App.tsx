/**
 * Asosiy App komponenti
 */

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/context/AuthContext';
import { JobProvider } from './src/context/JobContext';
import { MessageProvider } from './src/context/MessageContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { TransitionProvider } from './src/context/TransitionContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { initializeSounds } from './src/utils/soundEffects';

export default function App() {
  // Initialize sounds when app starts
  React.useEffect(() => {
    initializeSounds();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TransitionProvider>
          <PaperProvider>
            <AuthProvider>
              <JobProvider>
                <MessageProvider>
                  <AppNavigator />
                  <StatusBar style="auto" />
                </MessageProvider>
              </JobProvider>
            </AuthProvider>
          </PaperProvider>
        </TransitionProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
