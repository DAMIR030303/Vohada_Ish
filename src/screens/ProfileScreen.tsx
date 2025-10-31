/**
 * Foydalanuvchi profili ekrani
 */

import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { Button, Avatar, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { fontSize, horizontalPadding, verticalPadding } from '../utils/responsive';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();

  // Tab bar balandligi: iOS 88px, Android 80px
  const tabBarHeight = Platform.OS === 'ios' ? 88 : 80;

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
      <View style={styles.container}>
        <Text>Foydalanuvchi ma&apos;lumotlari yuklanmadi</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']}>
      <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + 20 }]}>
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label={user.fullName.charAt(0).toUpperCase()}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.fullName}</Text>
        {user.email && <Text style={styles.email}>{user.email}</Text>}
        {user.phone && <Text style={styles.phone}>{user.phone}</Text>}
      </View>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Ma&apos;lumotlar</Text>
          <Text style={styles.cardText}>
            Ro&apos;yxatdan o&apos;tgan sana: {new Date(user.createdAt).toLocaleDateString('uz-UZ')}
          </Text>
        </Card.Content>
      </Card>
      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        buttonColor={colors.error}
        icon="logout"
      >
        Chiqish
      </Button>
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
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: horizontalPadding(16),
    paddingVertical: verticalPadding(16),
  },
  header: {
    alignItems: 'center',
    marginBottom: verticalPadding(24),
    paddingTop: verticalPadding(16),
  },
  avatar: {
    backgroundColor: colors.primary,
    marginBottom: 16,
  },
  name: {
    fontSize: fontSize(24),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  email: {
    fontSize: fontSize(16),
    color: colors.textSecondary,
    marginBottom: 4,
  },
  phone: {
    fontSize: fontSize(16),
    color: colors.textSecondary,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: fontSize(18),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  cardText: {
    fontSize: fontSize(14),
    color: colors.textSecondary,
  },
  logoutButton: {
    marginTop: verticalPadding(24),
    marginBottom: 8,
    borderRadius: 12,
    elevation: 3,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonContent: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  buttonLabel: {
    fontSize: fontSize(16),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

