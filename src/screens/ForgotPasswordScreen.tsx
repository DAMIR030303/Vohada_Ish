/**
 * Parolni tiklash ekrani
 */

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { fontSize, horizontalPadding, verticalPadding } from '../utils/responsive';
import { isValidEmail } from '../utils/validation';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

type NavigationProp = StackNavigationProp<AuthStackParamList>;

export const ForgotPasswordScreen: React.FC = () => {
  const { resetPassword } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Xatolik', 'Email manzilini kiriting');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Xatolik', 'Noto&apos;g&apos;ri email manzil');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        'Muvaffaqiyatli',
        'Parolni tiklash havolasi email manzilingizga yuborildi. ' +
        'Email qutisini tekshiring va havola orqali parolingizni yangilang.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Parolni tiklashda xatolik yuz berdi';
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
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
        <Text style={styles.title}>Parolni tiklash</Text>
        <Text style={styles.subtitle}>
          Email manzilingizni kiriting. Parolni tiklash havolasi email manzilingizga yuboriladi.
        </Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleResetPassword}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          buttonColor={colors.primary}
        >
          Parolni tiklash havolasini yuborish
        </Button>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.backLink}
        >
          <Text style={styles.backText}>
            Tizimga kirish sahifasiga qaytish
          </Text>
        </TouchableOpacity>
          </View>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: horizontalPadding(24),
    paddingVertical: verticalPadding(24),
    minHeight: '100%',
  },
  title: {
    fontSize: fontSize(28),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize(16),
    color: colors.textSecondary,
    marginBottom: verticalPadding(32),
    textAlign: 'center',
    lineHeight: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
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
  backLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  backText: {
    fontSize: fontSize(14),
    color: colors.primary,
    fontWeight: '600',
  },
});

