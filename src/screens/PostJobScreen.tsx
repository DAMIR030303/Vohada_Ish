/**
 * Ish e'lonini joylashtirish ekrani - Zamonaviy dizayn
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
import { createJob } from '../services/jobService';
import { horizontalPadding, fontSize } from '../utils/responsive';
import { isValidEmail, isValidPhone } from '../utils/validation';

const CATEGORIES = [
  { id: 'IT', label: 'IT & Texnologiya', icon: 'laptop' as const },
  { id: 'Dizayn', label: 'Dizayn', icon: 'palette' as const },
  { id: 'Marketing', label: 'Marketing', icon: 'bullhorn' as const },
  { id: 'Sales', label: 'Sotish', icon: 'store' as const },
  { id: 'Education', label: "Ta'lim", icon: 'school' as const },
  { id: 'Finance', label: 'Moliya', icon: 'cash-multiple' as const },
  { id: 'Admin', label: "Ma'muriyat", icon: 'briefcase' as const },
  { id: 'Other', label: 'Boshqa', icon: 'dots-horizontal' as const },
];

const REGIONS = [
  'Toshkent',
  'Fargʻona',
  'Namangan',
  'Andijon',
  'Samarqand',
  'Buxoro',
  'Navoiy',
  'Qarshi',
  'Jizzax',
  'Guliston',
  'Termiz',
  'Nukus',
];

const EMPLOYMENT_TYPES = [
  { id: 'full-time', label: "To'liq kunlik", icon: 'briefcase-clock' as const },
  { id: 'part-time', label: 'Yarim kunlik', icon: 'clock-time-four' as const },
  { id: 'contract', label: 'Kontrakt', icon: 'file-document-edit' as const },
];

const PRICE = 50000; // 50,000 so'm

export const PostJobScreen: React.FC = () => {
  const { user } = useAuth();
  const { refreshUserJobs } = useJobs();
  const [loading, setLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    region: '',
    district: '',
    salaryMin: '',
    salaryMax: '',
    employmentType: 'full-time',
    contactPhone: user?.phone || '',
    contactEmail: user?.email || '',
    companyName: '',
  });

  const [currentStep, setCurrentStep] = useState(1); // Wizard steps
  const totalSteps = 3;

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Xatolik', 'Avval tizimga kiring');
      return;
    }

    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.region
    ) {
      Alert.alert('Xatolik', "Barcha majburiy maydonlarni to'ldiring");
      return;
    }

    if (formData.contactEmail && !isValidEmail(formData.contactEmail)) {
      Alert.alert('Xatolik', "Noto'g'ri email manzil");
      return;
    }

    if (formData.contactPhone && !isValidPhone(formData.contactPhone)) {
      Alert.alert('Xatolik', "Noto'g'ri telefon raqami");
      return;
    }

    // To'lov qilish
    setPaymentProcessing(true);

    // Simulated payment (keyinchalik real payment gateway qo'shamiz)
    setTimeout(async () => {
      setLoading(true);
      try {
        await createJob({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          region: formData.region,
          district: formData.district || undefined,
          salary:
            formData.salaryMin || formData.salaryMax
              ? {
                  min: formData.salaryMin
                    ? parseInt(formData.salaryMin)
                    : undefined,
                  max: formData.salaryMax
                    ? parseInt(formData.salaryMax)
                    : undefined,
                  currency: 'UZS',
                }
              : undefined,
          employmentType: formData.employmentType as any,
          contactPhone: formData.contactPhone || undefined,
          contactEmail: formData.contactEmail || undefined,
          companyName: formData.companyName || undefined,
          postedBy: user.id,
          status: 'active',
        });

        setPaymentProcessing(false);
        Alert.alert(
          'Muvaffaqiyatli! 🎉',
          "Ish e'loni muvaffaqiyatli joylashtirildi",
          [
            {
              text: 'OK',
              onPress: () => {
                refreshUserJobs();
                setFormData({
                  title: '',
                  description: '',
                  category: '',
                  region: '',
                  district: '',
                  salaryMin: '',
                  salaryMax: '',
                  employmentType: 'full-time',
                  contactPhone: user?.phone || '',
                  contactEmail: user?.email || '',
                  companyName: '',
                });
                setCurrentStep(1);
                setShowPriceModal(false);
              },
            },
          ],
        );
      } catch (error) {
        console.error(error);
        setPaymentProcessing(false);
        Alert.alert('Xatolik', "Ish e'loni joylashtirishda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  const handleFinalSubmit = () => {
    setShowPriceModal(true);
  };

  const renderHeader = () => (
    <LinearGradient
      colors={['#1B4332', '#40916C']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <FadeInView>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons
              name="briefcase-plus"
              size={40}
              color="#FFFFFF"
            />
          </View>
          <Text style={styles.headerTitle}>Ish e'lonini joylashtirish</Text>
          <Text style={styles.headerSubtitle}>
            {currentStep} / {totalSteps} qadam
          </Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${(currentStep / totalSteps) * 100}%` },
            ]}
          />
        </View>
      </FadeInView>
    </LinearGradient>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Asosiy ma'lumotlar</Text>

      {/* Ish nomi */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ish nomi *</Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="briefcase" size={24} color="#40916C" />
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            placeholder="Masalan: Senior Developer"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Kategoriya */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Kategoriya *</Text>
        <AnimatedTouchable
          onPress={() => setShowCategoryModal(true)}
          style={styles.pickerContainer}
          scaleValue={0.98}
          enableHaptic
          accessible
          accessibilityRole="button"
          accessibilityLabel="Kategoriya tanlash"
        >
          <View style={styles.pickerContent}>
            <MaterialCommunityIcons
              name={
                CATEGORIES.find((c) => c.id === formData.category)?.icon ||
                'apps'
              }
              size={24}
              color={formData.category ? '#40916C' : '#9CA3AF'}
            />
            <Text
              style={[
                styles.pickerText,
                !formData.category && styles.pickerPlaceholder,
              ]}
            >
              {formData.category
                ? CATEGORIES.find((c) => c.id === formData.category)?.label
                : 'Kategoriya tanlang'}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color="#6C757D"
          />
        </AnimatedTouchable>
      </View>

      {/* Tavsif */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tavsif *</Text>
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            placeholder="Ish vazifalari, talablar va boshqa ma'lumotlar..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={6}
          />
        </View>
      </View>

      {/* Ish turi */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ish turi</Text>
        <View style={styles.employmentTypeContainer}>
          {EMPLOYMENT_TYPES.map((type) => (
            <AnimatedTouchable
              key={type.id}
              onPress={() =>
                setFormData({ ...formData, employmentType: type.id })
              }
              style={[
                styles.employmentTypeButton,
                formData.employmentType === type.id &&
                  styles.employmentTypeButtonActive,
              ]}
              scaleValue={0.97}
              enableHaptic
              accessible
              accessibilityRole="button"
            >
              <MaterialCommunityIcons
                name={type.icon}
                size={20}
                color={
                  formData.employmentType === type.id ? '#FFFFFF' : '#40916C'
                }
              />
              <Text
                style={[
                  styles.employmentTypeText,
                  formData.employmentType === type.id &&
                    styles.employmentTypeTextActive,
                ]}
              >
                {type.label}
              </Text>
            </AnimatedTouchable>
          ))}
        </View>
      </View>

      <AnimatedTouchable
        onPress={() => setCurrentStep(2)}
        style={styles.nextButton}
        scaleValue={0.98}
        enableHaptic
        enableSound
        disabled={
          !formData.title || !formData.category || !formData.description
        }
        accessible
        accessibilityRole="button"
        accessibilityLabel="Keyingi qadam"
      >
        <Text style={styles.nextButtonText}>Keyingi qadam</Text>
        <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
      </AnimatedTouchable>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Joy va maosh</Text>

      {/* Viloyat */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Viloyat *</Text>
        <AnimatedTouchable
          onPress={() => setShowRegionModal(true)}
          style={styles.pickerContainer}
          scaleValue={0.98}
          enableHaptic
          accessible
          accessibilityRole="button"
        >
          <View style={styles.pickerContent}>
            <MaterialCommunityIcons
              name="map-marker"
              size={24}
              color={formData.region ? '#40916C' : '#9CA3AF'}
            />
            <Text
              style={[
                styles.pickerText,
                !formData.region && styles.pickerPlaceholder,
              ]}
            >
              {formData.region || 'Viloyat tanlang'}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color="#6C757D"
          />
        </AnimatedTouchable>
      </View>

      {/* Tuman */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tuman</Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="map" size={24} color="#40916C" />
          <TextInput
            style={styles.input}
            value={formData.district}
            onChangeText={(text) =>
              setFormData({ ...formData, district: text })
            }
            placeholder="Tuman nomi (ixtiyoriy)"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Maosh */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Maosh</Text>
        <View style={styles.salaryRow}>
          <View style={styles.salaryInput}>
            <Text style={styles.salaryLabel}>Minimal</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={formData.salaryMin}
                onChangeText={(text) =>
                  setFormData({ ...formData, salaryMin: text })
                }
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
              <Text style={styles.salaryCurrency}>UZS</Text>
            </View>
          </View>
          <View style={styles.salaryInput}>
            <Text style={styles.salaryLabel}>Maksimal</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={formData.salaryMax}
                onChangeText={(text) =>
                  setFormData({ ...formData, salaryMax: text })
                }
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
              <Text style={styles.salaryCurrency}>UZS</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.stepButtons}>
        <AnimatedTouchable
          onPress={() => setCurrentStep(1)}
          style={styles.backButton}
          scaleValue={0.98}
          enableHaptic
          accessible
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color="#40916C" />
          <Text style={styles.backButtonText}>Orqaga</Text>
        </AnimatedTouchable>

        <AnimatedTouchable
          onPress={() => setCurrentStep(3)}
          style={styles.nextButton}
          scaleValue={0.98}
          enableHaptic
          enableSound
          disabled={!formData.region}
          accessible
          accessibilityRole="button"
        >
          <Text style={styles.nextButtonText}>Keyingi qadam</Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={20}
            color="#FFFFFF"
          />
        </AnimatedTouchable>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Aloqa ma'lumotlari</Text>

      {/* Kompaniya nomi */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Kompaniya nomi</Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="office-building"
            size={24}
            color="#40916C"
          />
          <TextInput
            style={styles.input}
            value={formData.companyName}
            onChangeText={(text) =>
              setFormData({ ...formData, companyName: text })
            }
            placeholder="Kompaniya nomi (ixtiyoriy)"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Telefon */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Telefon raqami</Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="phone" size={24} color="#40916C" />
          <TextInput
            style={styles.input}
            value={formData.contactPhone}
            onChangeText={(text) =>
              setFormData({ ...formData, contactPhone: text })
            }
            placeholder="+998901234567"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email" size={24} color="#40916C" />
          <TextInput
            style={styles.input}
            value={formData.contactEmail}
            onChangeText={(text) =>
              setFormData({ ...formData, contactEmail: text })
            }
            placeholder="email@example.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
          />
        </View>
      </View>

      {/* Price info */}
      <View style={styles.priceInfoBox}>
        <MaterialCommunityIcons name="information" size={24} color="#40916C" />
        <View style={styles.priceInfoContent}>
          <Text style={styles.priceInfoTitle}>E'lon narxi</Text>
          <Text style={styles.priceAmount}>{PRICE.toLocaleString()} so'm</Text>
          <Text style={styles.priceInfoText}>
            To'lov kartasi orqali. E'lon 30 kun davomida faol bo'ladi.
          </Text>
        </View>
      </View>

      <View style={styles.stepButtons}>
        <AnimatedTouchable
          onPress={() => setCurrentStep(2)}
          style={styles.backButton}
          scaleValue={0.98}
          enableHaptic
          accessible
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color="#40916C" />
          <Text style={styles.backButtonText}>Orqaga</Text>
        </AnimatedTouchable>

        <AnimatedTouchable
          onPress={handleFinalSubmit}
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          scaleValue={0.98}
          enableHaptic
          enableSound
          disabled={loading || paymentProcessing}
          accessible
          accessibilityRole="button"
          accessibilityLabel="E'lonni joylashtirish va to'lov"
        >
          {loading || paymentProcessing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Joylashtirish</Text>
              <MaterialCommunityIcons
                name="credit-card"
                size={20}
                color="#FFFFFF"
              />
            </>
          )}
        </AnimatedTouchable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']}>
      {renderHeader()}

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ScrollView>

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kategoriya tanlang</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#6C757D"
                />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {CATEGORIES.map((category) => (
                <AnimatedTouchable
                  key={category.id}
                  onPress={() => {
                    setFormData({ ...formData, category: category.id });
                    setShowCategoryModal(false);
                  }}
                  style={styles.modalItem}
                  scaleValue={0.98}
                  enableHaptic
                >
                  <MaterialCommunityIcons
                    name={category.icon}
                    size={24}
                    color="#40916C"
                  />
                  <Text style={styles.modalItemText}>{category.label}</Text>
                  {formData.category === category.id && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={24}
                      color="#40916C"
                    />
                  )}
                </AnimatedTouchable>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Region Modal */}
      <Modal
        visible={showRegionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRegionModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowRegionModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Viloyat tanlang</Text>
              <TouchableOpacity onPress={() => setShowRegionModal(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#6C757D"
                />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {REGIONS.map((region) => (
                <AnimatedTouchable
                  key={region}
                  onPress={() => {
                    setFormData({ ...formData, region });
                    setShowRegionModal(false);
                  }}
                  style={styles.modalItem}
                  scaleValue={0.98}
                  enableHaptic
                >
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={24}
                    color="#40916C"
                  />
                  <Text style={styles.modalItemText}>{region}</Text>
                  {formData.region === region && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={24}
                      color="#40916C"
                    />
                  )}
                </AnimatedTouchable>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Payment Modal */}
      <Modal
        visible={showPriceModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPriceModal(false)}
      >
        <View style={styles.paymentModalOverlay}>
          <FadeInView>
            <View style={styles.paymentModalContent}>
              <LinearGradient
                colors={['#1B4332', '#40916C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.paymentModalHeader}
              >
                <MaterialCommunityIcons
                  name="credit-card"
                  size={48}
                  color="#FFFFFF"
                />
                <Text style={styles.paymentModalTitle}>To'lov</Text>
              </LinearGradient>

              <View style={styles.paymentModalBody}>
                {paymentProcessing ? (
                  <View style={styles.paymentProcessing}>
                    <ActivityIndicator size="large" color="#40916C" />
                    <Text style={styles.paymentProcessingText}>
                      To'lov qilinmoqda...
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.paymentAmount}>
                      {PRICE.toLocaleString()} so'm
                    </Text>
                    <Text style={styles.paymentDescription}>
                      E'loningiz 30 kun davomida faol bo'ladi
                    </Text>

                    <AnimatedTouchable
                      onPress={handleSubmit}
                      style={styles.payButton}
                      scaleValue={0.98}
                      enableHaptic
                      enableSound
                      accessible
                      accessibilityRole="button"
                    >
                      <MaterialCommunityIcons
                        name="credit-card"
                        size={20}
                        color="#FFFFFF"
                      />
                      <Text style={styles.payButtonText}>
                        To'lov kartasi orqali to'lash
                      </Text>
                    </AnimatedTouchable>

                    <TouchableOpacity
                      onPress={() => setShowPriceModal(false)}
                      style={styles.cancelPaymentButton}
                    >
                      <Text style={styles.cancelPaymentText}>Bekor qilish</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </FadeInView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: horizontalPadding(16),
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: fontSize(24),
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: fontSize(14),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  progressContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  container: {
    flex: 1,
  },
  stepContainer: {
    padding: horizontalPadding(16),
    paddingTop: 24,
  },
  stepTitle: {
    fontSize: fontSize(20),
    fontWeight: '800',
    color: colors.text,
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: fontSize(16),
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
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
  input: {
    flex: 1,
    fontSize: fontSize(16),
    color: colors.text,
    fontWeight: '500',
  },
  textAreaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
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
  textArea: {
    flex: 1,
    fontSize: fontSize(16),
    color: colors.text,
    fontWeight: '500',
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
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
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  pickerText: {
    fontSize: fontSize(16),
    fontWeight: '600',
    color: colors.text,
  },
  pickerPlaceholder: {
    fontWeight: '400',
    color: '#9CA3AF',
  },
  employmentTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  employmentTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#40916C',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
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
  employmentTypeButtonActive: {
    backgroundColor: '#40916C',
  },
  employmentTypeText: {
    fontSize: fontSize(14),
    fontWeight: '600',
    color: '#40916C',
  },
  employmentTypeTextActive: {
    color: '#FFFFFF',
  },
  salaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  salaryInput: {
    flex: 1,
  },
  salaryLabel: {
    fontSize: fontSize(14),
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  salaryCurrency: {
    fontSize: fontSize(14),
    fontWeight: '600',
    color: '#40916C',
    marginRight: 8,
  },
  priceInfoBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F5EE',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    marginTop: 8,
  },
  priceInfoContent: {
    flex: 1,
  },
  priceInfoTitle: {
    fontSize: fontSize(14),
    fontWeight: '700',
    color: '#40916C',
    marginBottom: 4,
  },
  priceAmount: {
    fontSize: fontSize(28),
    fontWeight: '800',
    color: '#40916C',
    marginBottom: 8,
  },
  priceInfoText: {
    fontSize: fontSize(12),
    fontWeight: '500',
    color: colors.textSecondary,
  },
  stepButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#40916C',
    borderRadius: 16,
    paddingVertical: 16,
  },
  backButtonText: {
    fontSize: fontSize(16),
    fontWeight: '700',
    color: '#40916C',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
    backgroundColor: '#40916C',
    borderRadius: 16,
    paddingVertical: 16,
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
  nextButtonText: {
    fontSize: fontSize(16),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
    backgroundColor: '#40916C',
    borderRadius: 16,
    paddingVertical: 16,
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
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: fontSize(16),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSize(20),
    fontWeight: '800',
    color: colors.text,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalItemText: {
    flex: 1,
    fontSize: fontSize(16),
    fontWeight: '600',
    color: colors.text,
  },
  paymentModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  paymentModalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  paymentModalHeader: {
    padding: 32,
    alignItems: 'center',
  },
  paymentModalTitle: {
    fontSize: fontSize(24),
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 16,
    letterSpacing: -0.5,
  },
  paymentModalBody: {
    padding: 32,
  },
  paymentAmount: {
    fontSize: fontSize(42),
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  paymentDescription: {
    fontSize: fontSize(16),
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#40916C',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 16,
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
  payButtonText: {
    fontSize: fontSize(16),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelPaymentButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelPaymentText: {
    fontSize: fontSize(14),
    fontWeight: '600',
    color: colors.textSecondary,
  },
  paymentProcessing: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  paymentProcessingText: {
    fontSize: fontSize(16),
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
});
