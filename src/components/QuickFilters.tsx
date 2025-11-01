/**
 * Tezkor Filtrlar komponenti
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { regions } from '../constants/regions';
import { Job } from '../types';
import { fontSize, horizontalPadding } from '../utils/responsive';

import { AnimatedTouchable, FadeInView } from './AnimatedComponents';

interface QuickFiltersProps {
  onFilterChange: (filters: {
    region?: string;
    employmentType?: Job['employmentType'];
  }) => void;
  selectedRegion?: string;
  selectedType?: Job['employmentType'];
}

interface FilterChipProps {
  label: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({
  label,
  icon,
  selected,
  onPress,
}) => {
  return (
    <AnimatedTouchable
      onPress={onPress}
      style={[styles.filterChip, selected && styles.filterChipSelected]}
      scaleValue={0.95}
      enableHaptic
      hapticType="selection"
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
    >
      <MaterialCommunityIcons
        name={icon as any}
        size={18}
        color={selected ? '#FFFFFF' : '#495057'}
      />
      <Text
        style={[
          styles.filterChipText,
          selected && styles.filterChipTextSelected,
        ]}
      >
        {label}
      </Text>
      {selected && (
        <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
      )}
    </AnimatedTouchable>
  );
};

export const QuickFilters: React.FC<QuickFiltersProps> = ({
  onFilterChange,
  selectedRegion,
  selectedType,
}) => {
  const [regionModalVisible, setRegionModalVisible] = useState(false);
  const [typeModalVisible, setTypeModalVisible] = useState(false);

  const employmentTypes: { id: Job['employmentType']; label: string }[] = [
    { id: 'full-time', label: "To'liq kunlik" },
    { id: 'part-time', label: 'Yarim kunlik' },
    { id: 'contract', label: 'Shartnoma asosida' },
    { id: 'freelance', label: 'Freelance' },
  ];

  const handleRegionSelect = (regionId: string) => {
    onFilterChange({
      region: selectedRegion === regionId ? undefined : regionId,
      employmentType: selectedType,
    });
    setRegionModalVisible(false);
  };

  const handleTypeSelect = (typeId: Job['employmentType']) => {
    onFilterChange({
      region: selectedRegion,
      employmentType: selectedType === typeId ? undefined : typeId,
    });
    setTypeModalVisible(false);
  };

  const handleClearAll = () => {
    onFilterChange({});
  };

  const getRegionName = (regionId?: string): string => {
    if (!regionId) return 'Barcha viloyatlar';
    const region = regions.find((r) => r.id === regionId);
    return region?.name || regionId;
  };

  const getTypeName = (typeId?: Job['employmentType']): string => {
    if (!typeId) return 'Barcha turlar';
    const type = employmentTypes.find((t) => t.id === typeId);
    return type?.label || typeId;
  };

  const hasActiveFilters = selectedRegion || selectedType;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tezkor filtrlar</Text>
        {hasActiveFilters && (
          <AnimatedTouchable
            onPress={handleClearAll}
            style={styles.clearButton}
            scaleValue={0.95}
            enableHaptic
            hapticType="selection"
            accessible
            accessibilityRole="button"
            accessibilityLabel="Filtrlarni tozalash"
          >
            <MaterialCommunityIcons
              name="close-circle"
              size={18}
              color="#DC3545"
            />
            <Text style={styles.clearText}>Tozalash</Text>
          </AnimatedTouchable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        <FilterChip
          label={getRegionName(selectedRegion)}
          icon="map-marker"
          selected={!!selectedRegion}
          onPress={() => setRegionModalVisible(true)}
        />
        <FilterChip
          label={getTypeName(selectedType)}
          icon="briefcase-clock"
          selected={!!selectedType}
          onPress={() => setTypeModalVisible(true)}
        />
      </ScrollView>

      {/* Region Modal */}
      <Modal
        visible={regionModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRegionModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setRegionModalVisible(false)}
        >
          <Pressable
            style={styles.modalContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <FadeInView>
              <View style={styles.modalHeader}>
                <View style={styles.modalDrag} />
                <Text style={styles.modalTitle}>Viloyat tanlang</Text>
              </View>
              <ScrollView style={styles.modalContent}>
                {regions.map((region) => (
                  <AnimatedTouchable
                    key={region.id}
                    onPress={() => handleRegionSelect(region.id)}
                    style={[
                      styles.modalItem,
                      selectedRegion === region.id && styles.modalItemSelected,
                    ]}
                    scaleValue={0.98}
                    enableHaptic
                    hapticType="selection"
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        selectedRegion === region.id &&
                          styles.modalItemTextSelected,
                      ]}
                    >
                      {region.name}
                    </Text>
                    {selectedRegion === region.id && (
                      <MaterialCommunityIcons
                        name="check"
                        size={20}
                        color="#40916C"
                      />
                    )}
                  </AnimatedTouchable>
                ))}
              </ScrollView>
            </FadeInView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Employment Type Modal */}
      <Modal
        visible={typeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTypeModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setTypeModalVisible(false)}
        >
          <Pressable
            style={styles.modalContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <FadeInView>
              <View style={styles.modalHeader}>
                <View style={styles.modalDrag} />
                <Text style={styles.modalTitle}>Ish turini tanlang</Text>
              </View>
              <ScrollView style={styles.modalContent}>
                {employmentTypes.map((type) => (
                  <AnimatedTouchable
                    key={type.id}
                    onPress={() => handleTypeSelect(type.id)}
                    style={[
                      styles.modalItem,
                      selectedType === type.id && styles.modalItemSelected,
                    ]}
                    scaleValue={0.98}
                    enableHaptic
                    hapticType="selection"
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        selectedType === type.id &&
                          styles.modalItemTextSelected,
                      ]}
                    >
                      {type.label}
                    </Text>
                    {selectedType === type.id && (
                      <MaterialCommunityIcons
                        name="check"
                        size={20}
                        color="#40916C"
                      />
                    )}
                  </AnimatedTouchable>
                ))}
              </ScrollView>
            </FadeInView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalPadding(16),
    marginBottom: 12,
  },
  title: {
    fontSize: fontSize(16),
    fontWeight: '700',
    color: '#212529',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearText: {
    fontSize: fontSize(14),
    fontWeight: '600',
    color: '#DC3545',
  },
  filtersContainer: {
    paddingHorizontal: horizontalPadding(16),
    gap: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DEE2E6',
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  filterChipSelected: {
    backgroundColor: '#40916C',
    borderColor: '#40916C',
  },
  filterChipText: {
    fontSize: fontSize(14),
    fontWeight: '600',
    color: '#495057',
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalDrag: {
    width: 40,
    height: 4,
    backgroundColor: '#DEE2E6',
    borderRadius: 2,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: fontSize(18),
    fontWeight: '700',
    color: '#212529',
  },
  modalContent: {
    padding: horizontalPadding(16),
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F8F9FA',
  },
  modalItemSelected: {
    backgroundColor: '#E8F5EE',
  },
  modalItemText: {
    fontSize: fontSize(15),
    fontWeight: '600',
    color: '#495057',
  },
  modalItemTextSelected: {
    color: '#40916C',
  },
});
