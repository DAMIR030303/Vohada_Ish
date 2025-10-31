/**
 * Filtr modali komponenti
 */

import React, { useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, RadioButton } from 'react-native-paper';

import { categories } from '../constants/categories';
import { colors } from '../constants/colors';
import { regions } from '../constants/regions';
import { FilterOptions } from '../types';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApplyFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({});
    onApplyFilters({});
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Filtrlash</Text>
          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Kategoriya</Text>
              {categories.map((category) => (
                <RadioButton.Item
                  key={category.id}
                  label={category.name}
                  value={category.id}
                  status={
                    localFilters.category === category.id ? 'checked' : 'unchecked'
                  }
                  onPress={() =>
                    setLocalFilters({
                      ...localFilters,
                      category:
                        localFilters.category === category.id
                          ? undefined
                          : category.id,
                    })
                  }
                />
              ))}
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Viloyat</Text>
              {regions.map((region) => (
                <RadioButton.Item
                  key={region.id}
                  label={region.name}
                  value={region.id}
                  status={
                    localFilters.region === region.id ? 'checked' : 'unchecked'
                  }
                  onPress={() =>
                    setLocalFilters({
                      ...localFilters,
                      region:
                        localFilters.region === region.id ? undefined : region.id,
                    })
                  }
                />
              ))}
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ish turi</Text>
              <RadioButton.Item
                label="To&apos;liq kunlik"
                value="full-time"
                status={
                  localFilters.employmentType === 'full-time'
                    ? 'checked'
                    : 'unchecked'
                }
                onPress={() =>
                  setLocalFilters({
                    ...localFilters,
                    employmentType:
                      localFilters.employmentType === 'full-time'
                        ? undefined
                        : 'full-time',
                  })
                }
              />
              <RadioButton.Item
                label="Yarim kunlik"
                value="part-time"
                status={
                  localFilters.employmentType === 'part-time'
                    ? 'checked'
                    : 'unchecked'
                }
                onPress={() =>
                  setLocalFilters({
                    ...localFilters,
                    employmentType:
                      localFilters.employmentType === 'part-time'
                        ? undefined
                        : 'part-time',
                  })
                }
              />
            </View>
          </ScrollView>
          <View style={styles.actions}>
            <Button
              mode="outlined"
              onPress={handleReset}
              style={styles.buttonOutlined}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabelOutlined}
            >
              Tozalash
            </Button>
            <Button
              mode="contained"
              onPress={handleApply}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              buttonColor={colors.primary}
            >
              Qo&apos;llash
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  content: {
    maxHeight: 400,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    elevation: 3,
    shadowColor: colors.primary,
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
    paddingVertical: 10,
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

