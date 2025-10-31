/**
 * Asosiy navigatsiya
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import React, { useEffect } from 'react';

import { colors } from '../constants/colors';
import { CustomTabBar } from '../components/CustomTabBar';
import { useAuth } from '../context/AuthContext';
import { HomeScreen } from '../screens/HomeScreen';
import { JobDetailsScreen } from '../screens/JobDetailsScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { MyJobsScreen } from '../screens/MyJobsScreen';
import { PostJobScreen } from '../screens/PostJobScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SearchScreen } from '../screens/SearchScreen';

import { AuthNavigator } from './AuthNavigator';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="PostJob" component={PostJobScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();
  const navigationRef = useNavigationContainerRef();

  // Debug: user state o'zgarishlarini kuzatish
  useEffect(() => {
    if (__DEV__) {
      console.log('AppNavigator - User state changed:', {
        hasUser: !!user,
        userEmail: user?.email,
        loading,
      });
    }
  }, [user, loading]);

  useEffect(() => {
    // Deep link handler - Firebase password reset email'dagi havola bilan ishlash
    const handleDeepLink = async (url: string) => {
      const { queryParams } = Linking.parse(url);
      
      // Firebase password reset link format:
      // vohadaish://reset-password?mode=resetPassword&oobCode=...
      // yoki https://your-project.firebaseapp.com/__/auth/action?mode=resetPassword&oobCode=...
      
      if (queryParams?.mode === 'resetPassword' && queryParams?.oobCode && navigationRef.isReady()) {
        // ResetPassword ekraniga o'tish
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (navigationRef as any).navigate('Auth', {
          screen: 'ResetPassword',
          params: { oobCode: queryParams.oobCode as string },
        });
      }
    };

    // Initial URL tekshirish (app ochilganda)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // URL o'zgarishlarini kuzatish
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [navigationRef]);

  if (loading) {
    return null; // Loading screen yoki spinner
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
            <Stack.Screen name="MyJobs" component={MyJobsScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

