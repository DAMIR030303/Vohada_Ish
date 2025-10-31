/**
 * Ish e'lonini joylashtirish ekrani
 */

import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { createJob } from '../services/jobService';
import { horizontalPadding, verticalPadding } from '../utils/responsive';
import { isValidEmail, isValidPhone } from '../utils/validation';

export const PostJobScreen: React.FC = () => {
  const { user } = useAuth();
  const { refreshUserJobs } = useJobs();
  const [loading, setLoading] = useState(false);

  // Tab bar balandligi: iOS 88px, Android 80px
  const tabBarHeight = Platform.OS === 'ios' ? 88 : 80;
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    region: '',
    district: '',
    salaryMin: '',
    salaryMax: '',
    employmentType: 'full-time' as const,
    contactPhone: '',
    contactEmail: '',
    companyName: '',
  });

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Xatolik', 'Avval tizimga kiring');
      return;
    }

    if (!formData.title || !formData.description || !formData.category || !formData.region) {
      Alert.alert('Xatolik', 'Barcha majburiy maydonlarni to&apos;ldiring');
      return;
    }

    if (formData.contactEmail && !isValidEmail(formData.contactEmail)) {
      Alert.alert('Xatolik', 'Noto&apos;g&apos;ri email manzil');
      return;
    }

    if (formData.contactPhone && !isValidPhone(formData.contactPhone)) {
      Alert.alert('Xatolik', 'Noto&apos;g&apos;ri telefon raqami');
      return;
    }

    setLoading(true);
    try {
      await createJob({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        region: formData.region,
        district: formData.district || undefined,
        salary: formData.salaryMin || formData.salaryMax
          ? {
              min: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
              max: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
              currency: 'UZS',
            }
          : undefined,
        employmentType: formData.employmentType,
        contactPhone: formData.contactPhone || undefined,
        contactEmail: formData.contactEmail || undefined,
        companyName: formData.companyName || undefined,
        postedBy: user.id,
        status: 'active',
      });

      Alert.alert('Muvaffaqiyatli', 'Ish e&apos;loni muvaffaqiyatli joylashtirildi');
      refreshUserJobs();
      // Formani tozalash
      setFormData({
        title: '',
        description: '',
        category: '',
        region: '',
        district: '',
        salaryMin: '',
        salaryMax: '',
        employmentType: 'full-time',
        contactPhone: '',
        contactEmail: '',
        companyName: '',
      });
    } catch (error) {
      Alert.alert('Xatolik', 'Ish e&apos;loni joylashtirishda xatolik yuz berdi');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + 20 }]}
        showsVerticalScrollIndicator={false}
      >
      <TextInput
        label="Ish nomi *"
        value={formData.title}
        onChangeText={(text) => setFormData({ ...formData, title: text })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Tavsif *"
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        mode="outlined"
        multiline
        numberOfLines={5}
        style={styles.input}
      />
      <TextInput
        label="Kategoriya *"
        value={formData.category}
        onChangeText={(text) => setFormData({ ...formData, category: text })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Viloyat *"
        value={formData.region}
        onChangeText={(text) => setFormData({ ...formData, region: text })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Tuman"
        value={formData.district}
        onChangeText={(text) => setFormData({ ...formData, district: text })}
        mode="outlined"
        style={styles.input}
      />
      <View style={styles.row}>
        <TextInput
          label="Minimal maosh"
          value={formData.salaryMin}
          onChangeText={(text) => setFormData({ ...formData, salaryMin: text })}
          mode="outlined"
          keyboardType="numeric"
          style={[styles.input, styles.halfInput]}
        />
        <TextInput
          label="Maksimal maosh"
          value={formData.salaryMax}
          onChangeText={(text) => setFormData({ ...formData, salaryMax: text })}
          mode="outlined"
          keyboardType="numeric"
          style={[styles.input, styles.halfInput]}
        />
      </View>
      <TextInput
        label="Kompaniya nomi"
        value={formData.companyName}
        onChangeText={(text) => setFormData({ ...formData, companyName: text })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Telefon raqami"
        value={formData.contactPhone}
        onChangeText={(text) => setFormData({ ...formData, contactPhone: text })}
        mode="outlined"
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={formData.contactEmail}
        onChangeText={(text) => setFormData({ ...formData, contactEmail: text })}
        mode="outlined"
        keyboardType="email-address"
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        buttonColor={colors.primary}
      >
        Joylashtirish
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
  input: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  halfInput: {
    flex: 1,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonContent: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

