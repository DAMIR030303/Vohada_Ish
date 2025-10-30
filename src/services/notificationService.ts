/**
 * Bildirishnomalar servisi
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Bildirishnomalar sozlamalarini o'rnatish
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Bildirishnoma ruxsatini so'rash
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    // Android uchun notification channel yaratish
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
  } catch (error) {
    console.error('Notification permission error:', error);
    return false;
  }
};

/**
 * Push notification token olish
 */
export const getPushToken = async (): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    });

    return token.data;
  } catch (error) {
    console.error('Get push token error:', error);
    return null;
  }
};

/**
 * Lokal bildirishnoma yuborish
 */
export const sendLocalNotification = async (
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // Hozir o'z vaqtida
    });
  } catch (error) {
    console.error('Send notification error:', error);
  }
};

