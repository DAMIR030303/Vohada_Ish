/**
 * Ish kartochkasi komponenti
 */

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';

import { colors } from '../constants/colors';
import { Job } from '../types';
import { formatCurrency, formatRelativeTime, truncateText } from '../utils/formatters';

type RootStackParamList = {
  JobDetails: { jobId: string };
  MainTabs: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate('JobDetails', { jobId: job.id });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>{job.title}</Text>
          {job.companyName && (
            <Text style={styles.company}>{job.companyName}</Text>
          )}
          <Text style={styles.description} numberOfLines={2}>
            {truncateText(job.description, 100)}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.location}>
              📍 {job.region}
              {job.district && `, ${job.district}`}
            </Text>
            <Text style={styles.time}>{formatRelativeTime(job.createdAt)}</Text>
          </View>
          {job.salary && (
            <View style={styles.salaryContainer}>
              <Text style={styles.salary}>
                💰{' '}
                {job.salary.min && job.salary.max
                  ? `${formatCurrency(job.salary.min)} - ${formatCurrency(job.salary.max)}`
                  : job.salary.min
                    ? `dan ${formatCurrency(job.salary.min)}`
                    : `gacha ${formatCurrency(job.salary.max!)}`}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  salaryContainer: {
    marginTop: 4,
  },
  salary: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
});

