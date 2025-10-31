/**
 * Ish tafsilotlari ekrani
 */

import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

import { colors } from '../constants/colors';
import { getJob } from '../services/jobService';
import { Job } from '../types';
import { formatCurrency, formatRelativeTime } from '../utils/formatters';

type RouteParams = {
  jobId: string;
};

export const JobDetailsScreen: React.FC = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const jobId = route.params?.jobId;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

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
      Alert.alert('Xatolik', 'Ish e&apos;loni yuklanmadi');
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

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Yuklanmoqda...</Text>
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.container}>
        <Text>Ish e&apos;loni topilmadi</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{job.title}</Text>
      {job.companyName && (
        <Text style={styles.companyName}>{job.companyName}</Text>
      )}
      <Text style={styles.meta}>
        {formatRelativeTime(job.createdAt)} • {job.region}
        {job.district && ` • ${job.district}`}
      </Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tavsif</Text>
        <Text style={styles.description}>{job.description}</Text>
      </View>
      {job.salary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Maosh</Text>
          <Text style={styles.salary}>
            {job.salary.min && job.salary.max
              ? `${formatCurrency(job.salary.min)} - ${formatCurrency(job.salary.max)}`
              : job.salary.min
                ? `dan ${formatCurrency(job.salary.min)}`
                : `gacha ${formatCurrency(job.salary.max!)}`}
          </Text>
        </View>
      )}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ish turi</Text>
        <Text style={styles.text}>{job.employmentType}</Text>
      </View>
      {(job.contactPhone || job.contactEmail) && (
        <View style={styles.actions}>
          {job.contactPhone && (
            <Button
              mode="contained"
              onPress={handleCall}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              buttonColor={colors.success}
              icon="phone"
            >
              Qo&apos;ng&apos;iroq qilish
            </Button>
          )}
          {job.contactEmail && (
            <Button
              mode="outlined"
              onPress={handleEmail}
              style={styles.buttonOutlined}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabelOutlined}
              icon="email"
            >
              Email yuborish
            </Button>
          )}
        </View>
      )}
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
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  companyName: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  salary: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.success,
  },
  text: {
    fontSize: 16,
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    elevation: 3,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonOutlined: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    elevation: 1,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonLabelOutlined: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: colors.primary,
  },
});

