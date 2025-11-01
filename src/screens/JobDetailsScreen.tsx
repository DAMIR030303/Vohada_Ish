/**
 * Ish tafsilotlari ekrani - Zamonaviy dizayn
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import { colors } from '../constants/colors';
import { getJob } from '../services/jobService';
import { Job } from '../types';
import { formatCurrency, formatRelativeTime } from '../utils/formatters';
import { fontSize } from '../utils/responsive';

type RouteParams = {
  jobId: string;
};

export const JobDetailsScreen: React.FC = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const jobId = route.params?.jobId;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  // const { colors: themeColors } = useTheme();

  useEffect(() => {
    if (jobId) {
      loadJob();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const loadJob = async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const jobData = await getJob(jobId);
      setJob(jobData);
    } catch (error) {
      Alert.alert('Xatolik', "Ish e'loni yuklanmadi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (job?.contactPhone) {
      Linking.openURL(`tel:${job.contactPhone}`);
    }
  };

  const handleEmail = () => {
    if (job?.contactEmail) {
      Linking.openURL(`mailto:${job.contactEmail}`);
    }
  };

  // Gradient ranglarni tanlash
  const getGradientColors = (): [string, string] => {
    if (job?.category === 'IT') {
      return ['#1B4332', '#40916C']; // to'q yashildan yorqin yashilga
    } else if (job?.category === 'Dizayn') {
      return ['#0F2419', '#1B4332']; // quyuq yashildan to'q yashilga
    } else if (job?.category === 'Marketing') {
      return ['#40916C', '#52B788']; // yorqin yashildan ochroq yashilga
    }
    return ['#2D5A3D', '#40916C']; // o'rtacha yashildan yorqin yashilga
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Yuklanmoqda...</Text>
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Ish e'loni topilmadi</Text>
      </View>
    );
  }

  const gradientColors = getGradientColors();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Gradient Header */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          {/* Category Icon */}
          <View style={styles.categoryIconContainer}>
            <MaterialCommunityIcons
              name={
                job.category === 'IT'
                  ? 'laptop'
                  : job.category === 'Dizayn'
                    ? 'palette'
                    : job.category === 'Marketing'
                      ? 'bullhorn'
                      : 'briefcase'
              }
              size={32}
              color="#FFFFFF"
            />
          </View>

          {/* Title */}
          <Text style={styles.headerTitle} numberOfLines={2}>
            {job.title}
          </Text>

          {/* Company & Location */}
          <View style={styles.headerMeta}>
            {job.companyName && (
              <View style={styles.metaItem}>
                <MaterialCommunityIcons
                  name="office-building"
                  size={16}
                  color="rgba(255, 255, 255, 0.9)"
                />
                <Text style={styles.metaText} numberOfLines={1}>
                  {job.companyName}
                </Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name="map-marker"
                size={16}
                color="rgba(255, 255, 255, 0.9)"
              />
              <Text style={styles.metaText}>
                {job.region}
                {job.district && `, ${job.district}`}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color="rgba(255, 255, 255, 0.9)"
              />
              <Text style={styles.metaText}>
                {formatRelativeTime(job.createdAt)}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Content Sections */}
      <View style={styles.sectionsContainer}>
        {/* Salary Card */}
        {job.salary && (
          <View style={styles.salaryCard}>
            <View style={styles.salaryHeader}>
              <MaterialCommunityIcons
                name="cash-multiple"
                size={28}
                color={colors.accent}
              />
              <Text style={styles.salaryTitle}>Maosh</Text>
            </View>
            <Text style={styles.salaryAmount}>
              {job.salary.min && job.salary.max
                ? `${formatCurrency(job.salary.min)} - ${formatCurrency(job.salary.max)}`
                : job.salary.min
                  ? `${formatCurrency(job.salary.min)}+`
                  : `${formatCurrency(job.salary.max!)} gacha`}
            </Text>
          </View>
        )}

        {/* Description Card */}
        <View style={styles.infoCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="text-box"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.sectionTitle}>Tavsif</Text>
          </View>
          <Text style={styles.description}>{job.description}</Text>
        </View>

        {/* Job Details Card */}
        <View style={styles.infoCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="briefcase-outline"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.sectionTitle}>Ish Tafsilotlari</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name="briefcase-variant"
              size={20}
              color={colors.textSecondary}
            />
            <Text style={styles.detailLabel}>Ish turi:</Text>
            <Text style={styles.detailValue}>{job.employmentType}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name="tag"
              size={20}
              color={colors.textSecondary}
            />
            <Text style={styles.detailLabel}>Kategoriya:</Text>
            <Text style={styles.detailValue}>{job.category}</Text>
          </View>
        </View>

        {/* Requirements Card */}
        {job.requirements && job.requirements.length > 0 && (
          <View style={styles.infoCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="check-circle"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.sectionTitle}>Talablar</Text>
            </View>
            {job.requirements.map((req, index) => (
              <View key={index} style={styles.requirementItem}>
                <MaterialCommunityIcons
                  name="check"
                  size={18}
                  color={colors.success}
                />
                <Text style={styles.requirementText}>{req}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Benefits Card */}
        {job.benefits && job.benefits.length > 0 && (
          <View style={styles.infoCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="gift"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.sectionTitle}>Afzalliklar</Text>
            </View>
            {job.benefits.map((benefit, index) => (
              <View key={index} style={styles.requirementItem}>
                <MaterialCommunityIcons
                  name="star"
                  size={18}
                  color={colors.accent}
                />
                <Text style={styles.requirementText}>{benefit}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Contact Actions */}
        {(job.contactPhone || job.contactEmail) && (
          <View style={styles.actionsCard}>
            <Text style={styles.actionsTitle}>Bog'lanish</Text>

            {job.contactPhone && (
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={handleCall}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#40916C', '#52B788']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <MaterialCommunityIcons
                    name="phone"
                    size={24}
                    color="#FFFFFF"
                  />
                  <Text style={styles.primaryButtonText}>
                    Qo'ng'iroq qilish
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {job.contactEmail && (
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={handleEmail}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="email"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.secondaryButtonText}>Email yuborish</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  loadingText: {
    fontSize: fontSize(16),
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 100,
  },
  errorText: {
    fontSize: fontSize(16),
    color: colors.error,
    textAlign: 'center',
    marginTop: 100,
  },
  // Header Gradient
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContent: {
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  headerTitle: {
    fontSize: fontSize(26),
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  headerMeta: {
    width: '100%',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: fontSize(14),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
  },
  // Sections
  sectionsContainer: {
    padding: 20,
    gap: 16,
  },
  salaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginTop: -16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
    borderWidth: 1,
    borderColor: colors.border,
  },
  salaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  salaryTitle: {
    fontSize: fontSize(18),
    fontWeight: '700',
    color: colors.text,
  },
  salaryAmount: {
    fontSize: fontSize(24),
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: fontSize(20),
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    fontSize: fontSize(16),
    color: colors.text,
    lineHeight: 26,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: fontSize(15),
    fontWeight: '600',
    color: colors.textSecondary,
    minWidth: 100,
  },
  detailValue: {
    fontSize: fontSize(15),
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  requirementText: {
    fontSize: fontSize(15),
    color: colors.text,
    lineHeight: 22,
    flex: 1,
  },
  actionsCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionsTitle: {
    fontSize: fontSize(20),
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  actionButton: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    ...Platform.select({
      android: {
        elevation: 4,
      },
    }),
  },
  primaryButton: {
    // Gradient button
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 10,
  },
  primaryButtonText: {
    fontSize: fontSize(16),
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    fontSize: fontSize(16),
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
});
