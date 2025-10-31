/**
 * Parolni yangilash ekrani (Deep link orqali)
 */

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

import { colors } from '../constants/colors';
import { confirmResetPassword } from '../services/firebaseAuthService';
import { fontSize } from '../utils/responsive';
import { isValidPassword } from '../utils/validation';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { oobCode: string };
};

type NavigationProp = StackNavigationProp<AuthStackParamList>;
type RouteParams = {
  ResetPassword: { oobCode: string };
};

export const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RouteParams, 'ResetPassword'>>();
  const oobCode = route.params?.oobCode || '';
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Xatolik', 'Barcha maydonlarni to&apos;ldiring');
      return;
    }

    if (!isValidPassword(newPassword)) {
      Alert.alert('Xatolik', 'Parol kamida 6 belgidan iborat bo&apos;lishi kerak');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Xatolik', 'Parollar mos kelmaydi');
      return;
    }

    if (!oobCode) {
      Alert.alert('Xatolik', 'Parolni tiklash kodi topilmadi');
      return;
    }

    setLoading(true);
    try {
      await confirmResetPassword(oobCode, newPassword);
      Alert.alert(
        'Muvaffaqiyatli',
        'Parolingiz muvaffaqiyatli yangilandi. Endi yangi parol bilan tizimga kirishingiz mumkin.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Parolni yangilashda xatolik yuz berdi';
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
      <View style={styles.content}>
        <Text style={styles.title}>Parolni yangilash</Text>
        <Text style={styles.subtitle}>
          Yangi parolingizni kiriting va tasdiqlang.
        </Text>
        <TextInput
          label="Yangi parol *"
          value={newPassword}
          onChangeText={setNewPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          label="Parolni tasdiqlash *"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          mode="outlined"
          secureTextEntry
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
          Parolni yangilash
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
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
});

