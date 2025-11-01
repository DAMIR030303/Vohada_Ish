/**
 * Bosh sahifa Header komponenti
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { User } from '../types';
import { fontSize, horizontalPadding } from '../utils/responsive';

import { AnimatedTouchable } from './AnimatedComponents';

interface HomeHeaderProps {
  user: User | null;
  unreadCount?: number;
  onNotificationPress?: () => void;
  onAvatarPress?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  user,
  unreadCount = 0,
  onNotificationPress,
  onAvatarPress,
}) => {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    // User tizimga kirgan bo'lsa, Login tugmasi ko'rsatilmaydi
    // Bu funksiya faqat defensive programming uchun
    if (__DEV__) {
      console.log(
        'Login button pressed - this should not happen when user is logged in',
      );
    }
  };

  const handleProfilePress = () => {
    if (onAvatarPress) {
      onAvatarPress();
    } else {
      // @ts-expect-error - Navigation type
      navigation.navigate('Profile');
    }
  };

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      // @ts-expect-error - Navigation type
      navigation.navigate('Messages');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Xayrli tong';
    if (hour < 18) return 'Xayrli kun';
    return 'Xayrli kech';
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {user ? (
          <>
            <AnimatedTouchable
              onPress={handleProfilePress}
              style={styles.avatarContainer}
              scaleValue={0.95}
              enableHaptic
              hapticType="selection"
              accessible
              accessibilityRole="button"
              accessibilityLabel={`Profil, ${user.fullName}`}
              accessibilityHint="Profilni ochish uchun bosing"
            >
              <View style={styles.avatar}>
                {user.avatar ? (
                  <Text style={styles.avatarText}>{user.avatar}</Text>
                ) : (
                  <Text style={styles.avatarText}>
                    {user.fullName.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
            </AnimatedTouchable>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>{getGreeting()},</Text>
              <Text style={styles.userName} numberOfLines={1}>
                {user.fullName.split(' ')[0]}!
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>VohadaIsh</Text>
            <Text style={styles.subtitle}>Ishingizni toping</Text>
          </View>
        )}
      </View>

      <View style={styles.rightSection}>
        {user ? (
          <AnimatedTouchable
            onPress={handleNotificationPress}
            style={styles.notificationButton}
            scaleValue={0.9}
            enableHaptic
            hapticType="selection"
            enableSound
            soundType="buttonPress"
            accessible
            accessibilityRole="button"
            accessibilityLabel={
              unreadCount > 0
                ? `Xabarlar, ${unreadCount} ta o'qilmagan`
                : 'Xabarlar'
            }
            accessibilityHint="Xabarlar sahifasini ochish uchun bosing"
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={26}
              color="#1B4332"
            />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </AnimatedTouchable>
        ) : (
          <AnimatedTouchable
            onPress={handleLoginPress}
            style={styles.loginButton}
            scaleValue={0.95}
            enableHaptic
            hapticType="press"
            enableSound
            soundType="buttonPress"
            accessible
            accessibilityRole="button"
            accessibilityLabel="Tizimga kirish"
          >
            <MaterialCommunityIcons name="login" size={20} color="#FFFFFF" />
            <Text style={styles.loginText}>Kirish</Text>
          </AnimatedTouchable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalPadding(16),
    paddingVertical: 16,
    backgroundColor: '#FAFBFC',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#40916C',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  avatarText: {
    fontSize: fontSize(20),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: fontSize(14),
    color: '#6C757D',
    fontWeight: '500',
  },
  userName: {
    fontSize: fontSize(20),
    color: '#1B4332',
    fontWeight: '800',
    marginTop: 2,
  },
  subtitle: {
    fontSize: fontSize(13),
    color: '#6C757D',
    fontWeight: '500',
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#DC3545',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FAFBFC',
  },
  badgeText: {
    fontSize: fontSize(10),
    color: '#FFFFFF',
    fontWeight: '700',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#40916C',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#40916C',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  loginText: {
    fontSize: fontSize(15),
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
