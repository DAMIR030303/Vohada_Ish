/**
 * Ommabop Kompaniyalar komponenti
 */

import React from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';

import { Company } from '../types';
import { fontSize, horizontalPadding } from '../utils/responsive';

import { AnimatedTouchable } from './AnimatedComponents';

interface PopularCompaniesProps {
  companies: Company[];
  onCompanyPress: (company: Company) => void;
}

interface CompanyCardProps {
  company: Company;
  onPress: () => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onPress }) => {
  return (
    <AnimatedTouchable
      onPress={onPress}
      style={styles.companyCard}
      scaleValue={0.96}
      enableHaptic
      hapticType="selection"
      enableSound
      soundType="selection"
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${company.name}, ${company.jobCount} ta ish e'loni`}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>
          {company.logo || company.name.charAt(0)}
        </Text>
      </View>
      <View style={styles.companyInfo}>
        <Text style={styles.companyName} numberOfLines={1}>
          {company.name}
        </Text>
        <Text style={styles.jobCount}>{company.jobCount} ta ish</Text>
      </View>
    </AnimatedTouchable>
  );
};

export const PopularCompanies: React.FC<PopularCompaniesProps> = ({
  companies,
  onCompanyPress,
}) => {
  const renderItem = ({ item }: { item: Company }) => (
    <CompanyCard company={item} onPress={() => onCompanyPress(item)} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ommabop kompaniyalar</Text>
      </View>
      <FlatList
        data={companies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalPadding(16),
    marginBottom: 16,
  },
  title: {
    fontSize: fontSize(20),
    fontWeight: '800',
    color: '#212529',
    letterSpacing: -0.5,
  },
  listContent: {
    paddingHorizontal: horizontalPadding(16),
    gap: 12,
  },
  companyCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E9ECEF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E9ECEF',
  },
  logo: {
    fontSize: fontSize(32),
  },
  companyInfo: {
    width: '100%',
    alignItems: 'center',
  },
  companyName: {
    fontSize: fontSize(15),
    fontWeight: '700',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 4,
  },
  jobCount: {
    fontSize: fontSize(13),
    fontWeight: '600',
    color: '#40916C',
  },
});
