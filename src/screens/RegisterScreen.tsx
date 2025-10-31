/**
 * Ro'yxatdan o'tish ekrani
 */

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { fontSize, horizontalPadding, verticalPadding } from '../utils/responsive';
import { isValidEmail, isValidPassword, isValidPhone, formatPhone } from '../utils/validation';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type NavigationProp = StackNavigationProp<AuthStackParamList>;

export const RegisterScreen: React.FC = () => {
  const { register } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      Alert.alert('Xatolik', 'Barcha majburiy maydonlarni to&apos;ldiring');
      return;
    }

    if (!isValidEmail(formData.email)) {
      Alert.alert('Xatolik', 'Noto&apos;g&apos;ri email manzil');
      return;
    }

    if (!isValidPassword(formData.password)) {
      Alert.alert('Xatolik', 'Parol kamida 6 belgidan iborat bo&apos;lishi kerak');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Xatolik', 'Parollar mos kelmaydi');
      return;
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      Alert.alert('Xatolik', 'Noto&apos;g&apos;ri telefon raqami');
      return;
    }

    setLoading(true);
    try {
      await register(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phone ? formatPhone(formData.phone) : undefined,
      );
      Alert.alert('Muvaffaqiyatli', 'Ro&apos;yxatdan o&apos;tdingiz!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ro&apos;yxatdan o&apos;tishda xatolik yuz berdi';
      Alert.alert('Xatolik', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <Text style={styles.title}>Ro&apos;yxatdan o&apos;tish</Text>
        <TextInput
          label="To'liq ism *"
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Email *"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          label="Telefon raqami"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
        />
        <TextInput
          label="Parol *"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          label="Parolni tasdiqlash *"
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          buttonColor={colors.primary}
        >
          Ro&apos;yxatdan o&apos;tish
        </Button>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.loginLink}
        >
          <Text style={styles.loginText}>
            Allaqachon akkauntingiz bormi?{' '}
            <Text style={styles.loginLinkText}>Tizimga kirish</Text>
          </Text>
        </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: horizontalPadding(24),
    paddingVertical: verticalPadding(24),
    paddingTop: verticalPadding(60),
  },
  title: {
    fontSize: fontSize(28),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: verticalPadding(32),
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 12,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  buttonLabel: {
    fontSize: fontSize(16),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  loginLink: {
    marginTop: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  loginText: {
    fontSize: fontSize(14),
    color: colors.textSecondary,
  },
  loginLinkText: {
    color: colors.primary,
    fontWeight: '600',
  },
});

