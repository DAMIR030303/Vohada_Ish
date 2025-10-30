/**
 * Foydalanuvchi profili ekrani
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Avatar, Card } from 'react-native-paper';

import { colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
        buttonColor={colors.error}
      >
        Chiqish
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: colors.primary,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  logoutButton: {
    marginTop: 24,
  },
});

