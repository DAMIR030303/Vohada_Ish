/**
 * Ro'yxatdan o'tish ekrani
 */

import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

import { colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { isValidEmail, isValidPassword, isValidPhone, formatPhone } from '../utils/validation';

export const RegisterScreen: React.FC = () => {
  const { register } = useAuth();
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
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
        >
          Ro&apos;yxatdan o&apos;tish
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    marginBottom: 32,
  },
});

