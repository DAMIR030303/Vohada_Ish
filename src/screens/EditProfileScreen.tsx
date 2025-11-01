/**
 * Profilni tahrirlash ekrani - Avatar va ma'lumotlar
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AnimatedTouchable,
  FadeInView,
} from '../components/AnimatedComponents';
import { colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import {
  fontSize,
  horizontalPadding,
  verticalPadding,
} from '../utils/responsive';

export const EditProfileScreen: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState<string | null>(null);

  const handlePickImage = async () => {
    try {
      // Ruxsat so'raladi
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Ruxsat kerak',
          'Galeriyaga kirish uchun ruxsat berish kerak. Settings → VohadaIsh → Photos ni yoqing.',
        );
        return;
      }

      // Rasmini tanlash
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Xatolik', 'Rasm tanlashda xatolik yuz berdi');
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Xatolik', "Ism bo'sh bo'lishi mumkin emas");
      return;
    }

    setLoading(true);
    try {
      // Hozircha avatar URL ni saqlash (keyinchalik Firebase Storage ga upload qilamiz)
      await updateUserProfile({
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
        avatar: avatar || undefined,
      });

      Alert.alert('Muvaffaqiyatli', 'Profil yangilandi', [{ text: 'OK' }]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Xatolik', 'Profilni yangilashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const renderAvatar = () => {
    if (loading) {
      return (
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        </View>
      );
    }

    return (
      <AnimatedTouchable
        onPress={handlePickImage}
        style={styles.avatarContainer}
        scaleValue={0.95}
        enableHaptic
        hapticType="press"
        enableSound
        soundType="buttonPress"
        accessible
        accessibilityRole="button"
        accessibilityLabel="Rasm o'zgartirish"
      >
        <View style={styles.avatar}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          ) : user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>
              {user?.fullName.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
        <View style={styles.avatarEditBadge}>
          <MaterialCommunityIcons name="camera" size={20} color="#FFFFFF" />
        </View>
      </AnimatedTouchable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']}>
      <LinearGradient
        colors={['#1B4332', '#40916C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <FadeInView>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Profilni tahrirlash</Text>
            {renderAvatar()}
          </View>
        </FadeInView>
      </LinearGradient>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>To'liq ism *</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="account"
                size={24}
                color="#40916C"
              />
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Ismingizni kiriting"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email (Read-only) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View
              style={[styles.inputContainer, styles.inputContainerDisabled]}
            >
              <MaterialCommunityIcons name="email" size={24} color="#9CA3AF" />
              <Text style={styles.inputDisabled}>{user?.email}</Text>
            </View>
            <Text style={styles.helperText}>Email o'zgartirib bo'lmaydi</Text>
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefon</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="phone" size={24} color="#40916C" />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Telefon raqamingiz"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <AnimatedTouchable
          onPress={handleSave}
          style={styles.saveButton}
          scaleValue={0.98}
          enableHaptic
          hapticType="press"
          enableSound
          soundType="buttonPress"
          disabled={loading}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Saqlash"
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Saqlash</Text>
            </>
          )}
        </AnimatedTouchable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: horizontalPadding(16),
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSize(24),
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 56,
  },
  avatarText: {
    fontSize: fontSize(48),
    fontWeight: '800',
    color: '#FFFFFF',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#40916C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  container: {
    flex: 1,
  },
  form: {
    paddingHorizontal: horizontalPadding(16),
    paddingTop: 24,
    paddingBottom: 16,
  },
  inputGroup: {
    marginBottom: verticalPadding(20),
  },
  label: {
    fontSize: fontSize(16),
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputContainerDisabled: {
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: fontSize(16),
    color: colors.text,
    fontWeight: '500',
  },
  inputDisabled: {
    flex: 1,
    fontSize: fontSize(16),
    color: '#9CA3AF',
    fontWeight: '500',
  },
  helperText: {
    fontSize: fontSize(12),
    color: colors.textSecondary,
    marginTop: 6,
    marginLeft: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#40916C',
    marginHorizontal: horizontalPadding(16),
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#40916C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  saveButtonText: {
    fontSize: fontSize(18),
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
