/**
 * Asosiy App komponenti
 */

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/context/AuthContext';
import { JobProvider } from './src/context/JobContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <JobProvider>
            <AppNavigator />
            <StatusBar style="auto" />
          </JobProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
