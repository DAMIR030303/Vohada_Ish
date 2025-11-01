/**
 * Foydalanuvchi profili ekrani - Zamonaviy dizayn
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AnimatedTouchable,
  FadeInView,
} from '../components/AnimatedComponents';
import { colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { fontSize, horizontalPadding } from '../utils/responsive';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { userJobs } = useJobs();
  const navigation = useNavigation<any>();

  // Tab bar balandligi
  const tabBarHeight = Platform.OS === 'ios' ? 88 : 60;

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleLogout = () => {
    Alert.alert('Chiqish', 'Tizimdan chiqmoqchimisiz?', [
      { text: 'Bekor qilish', style: 'cancel' },
      {
        text: 'Chiqish',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            Alert.alert('Xatolik', 'Chiqishda xatolik yuz berdi');
          }
        },
      },
    ]);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']}>
        <View style={styles.container}>
          <Text style={styles.errorText}>
            Foydalanuvchi ma'lumotlari yuklanmadi
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const activeJobsCount = userJobs.filter(
    (job) => job.status === 'active',
  ).length;

  // Member since calculation
  const memberSince = new Date(user.createdAt);
  const now = new Date();
  const monthsSince = Math.floor(
    (now.getTime() - memberSince.getTime()) / (1000 * 60 * 60 * 24 * 30),
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Xayrli tong';
    if (hour < 18) return 'Xayrli kun';
    return 'Xayrli kech';
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 50 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Gradient Header */}
        <LinearGradient
          colors={['#1B4332', '#40916C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <FadeInView>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                {user.avatar ? (
                  <Text style={styles.avatarText}>{user.avatar}</Text>
                ) : (
                  <Text style={styles.avatarText}>
                    {user.fullName.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <View style={styles.badge}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color="#40916C"
                />
              </View>
            </View>

            <View style={styles.headerContent}>
              <Text style={styles.greetingText}>{getGreeting()}!</Text>
              <Text style={styles.name}>{user.fullName}</Text>
              {user.email && (
                <View style={styles.emailContainer}>
                  <MaterialCommunityIcons
                    name="email"
                    size={16}
                    color="rgba(255, 255, 255, 0.9)"
                  />
                  <Text style={styles.email}>{user.email}</Text>
                </View>
              )}
            </View>
          </FadeInView>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <FadeInView delay={100}>
            <AnimatedTouchable
              style={styles.statCard}
              scaleValue={0.98}
              enableHaptic
              hapticType="selection"
              accessible
              accessibilityRole="button"
              accessibilityLabel={`${activeJobsCount} ta e'lon joylashtirilgan`}
            >
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: '#E8F5EE' },
                ]}
              >
                <MaterialCommunityIcons
                  name="briefcase-check"
                  size={24}
                  color="#40916C"
                />
              </View>
              <Text style={styles.statValue}>{activeJobsCount}</Text>
              <Text style={styles.statLabel}>E'lonlar</Text>
            </AnimatedTouchable>
          </FadeInView>

          <FadeInView delay={200}>
            <AnimatedTouchable
              style={styles.statCard}
              scaleValue={0.98}
              enableHaptic
              hapticType="selection"
              accessible
              accessibilityRole="button"
              accessibilityLabel={`${monthsSince} oy a'zo`}
            >
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: '#E8F5EE' },
                ]}
              >
                <MaterialCommunityIcons
                  name="calendar-check"
                  size={24}
                  color="#40916C"
                />
              </View>
              <Text style={styles.statValue}>{monthsSince}</Text>
              <Text style={styles.statLabel}>Oylar</Text>
            </AnimatedTouchable>
          </FadeInView>

          <FadeInView delay={300}>
            <View style={styles.statCard}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: '#E8F5EE' },
                ]}
              >
                <MaterialCommunityIcons
                  name="shield-check"
                  size={24}
                  color="#40916C"
                />
              </View>
              <Text style={styles.statValue}>100%</Text>
              <Text style={styles.statLabel}>Tasdiqlangan</Text>
            </View>
          </FadeInView>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ma'lumotlar</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="account"
                size={20}
                color="#40916C"
              />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>To'liq ism</Text>
                <Text style={styles.infoValue}>{user.fullName}</Text>
              </View>
            </View>

            {user.phone && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="phone"
                  size={20}
                  color="#40916C"
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Telefon</Text>
                  <Text style={styles.infoValue}>{user.phone}</Text>
                </View>
              </View>
            )}

            {user.email && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="email"
                  size={20}
                  color="#40916C"
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{user.email}</Text>
                </View>
              </View>
            )}

            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="calendar"
                size={20}
                color="#40916C"
              />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Ro'yxatdan o'tgan</Text>
                <Text style={styles.infoValue}>
                  {memberSince.toLocaleDateString('uz-UZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sozlamalar</Text>

          <View style={styles.menuCard}>
            <AnimatedTouchable
              style={styles.menuItem}
              scaleValue={0.98}
              enableHaptic
              hapticType="selection"
              accessible
              accessibilityRole="button"
              accessibilityLabel="Mening e'lonlarim"
            >
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons
                  name="briefcase-outline"
                  size={24}
                  color="#40916C"
                />
                <Text style={styles.menuItemText}>Mening e'lonlarim</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#6C757D"
              />
            </AnimatedTouchable>

            <View style={styles.menuDivider} />

            <AnimatedTouchable
              onPress={handleEditProfile}
              style={styles.menuItem}
              scaleValue={0.98}
              enableHaptic
              hapticType="selection"
              accessible
              accessibilityRole="button"
              accessibilityLabel="Profilni tahrirlash"
            >
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons
                  name="account-edit"
                  size={24}
                  color="#40916C"
                />
                <Text style={styles.menuItemText}>Profilni tahrirlash</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#6C757D"
              />
            </AnimatedTouchable>

            <View style={styles.menuDivider} />

            <AnimatedTouchable
              style={styles.menuItem}
              scaleValue={0.98}
              enableHaptic
              hapticType="selection"
              accessible
              accessibilityRole="button"
              accessibilityLabel="Bildirishnomalar"
            >
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={24}
                  color="#40916C"
                />
                <Text style={styles.menuItemText}>Bildirishnomalar</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#6C757D"
              />
            </AnimatedTouchable>

            <View style={styles.menuDivider} />

            <AnimatedTouchable
              style={styles.menuItem}
              scaleValue={0.98}
              enableHaptic
              hapticType="selection"
              accessible
              accessibilityRole="button"
              accessibilityLabel="Qo'llab-quvvatlash"
            >
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons
                  name="help-circle-outline"
                  size={24}
                  color="#40916C"
                />
                <Text style={styles.menuItemText}>Qo'llab-quvvatlash</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#6C757D"
              />
            </AnimatedTouchable>
          </View>
        </View>

        {/* Logout Button */}
        <AnimatedTouchable
          onPress={handleLogout}
          style={styles.logoutButton}
          scaleValue={0.98}
          enableHaptic
          hapticType="press"
          enableSound
          soundType="buttonPress"
          accessible
          accessibilityRole="button"
          accessibilityLabel="Tizimdan chiqish"
        >
          <MaterialCommunityIcons name="logout" size={20} color="#FFFFFF" />
          <Text style={styles.logoutText}>Tizimdan chiqish</Text>
        </AnimatedTouchable>

        {/* Version Info */}
        <Text style={styles.versionText}>VohadaIsh v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  errorText: {
    fontSize: fontSize(16),
    color: colors.text,
    textAlign: 'center',
    marginTop: 40,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: horizontalPadding(16),
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  avatarText: {
    fontSize: fontSize(42),
    fontWeight: '800',
    color: '#FFFFFF',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  headerContent: {
    alignItems: 'center',
  },
  greetingText: {
    fontSize: fontSize(16),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  name: {
    fontSize: fontSize(28),
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  email: {
    fontSize: fontSize(14),
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: horizontalPadding(16),
    marginTop: -20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: fontSize(24),
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: fontSize(12),
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: horizontalPadding(16),
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: fontSize(20),
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: fontSize(13),
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: fontSize(15),
    fontWeight: '600',
    color: colors.text,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: fontSize(16),
    fontWeight: '600',
    color: colors.text,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 60,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    marginHorizontal: horizontalPadding(16),
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: colors.error,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  logoutText: {
    fontSize: fontSize(16),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  versionText: {
    fontSize: fontSize(12),
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
});
