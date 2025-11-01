/**
 * Kategoriyalar Modal komponenti
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { categories } from '../constants/categories';
import { fontSize, horizontalPadding } from '../utils/responsive';

import { AnimatedTouchable, FadeInView } from './AnimatedComponents';

const { height } = Dimensions.get('window');

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onCategorySelect?: (categoryId: string) => void;
}

interface CategoryItemProps {
  category: (typeof categories)[number];
  onPress: () => void;
  jobCount?: number;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  onPress,
  jobCount = 0,
}) => {
  return (
    <AnimatedTouchable
      onPress={onPress}
      style={styles.categoryItem}
      scaleValue={0.95}
      enableHaptic
      hapticType="selection"
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${category.name}, ${jobCount} ta ish`}
    >
      <View style={styles.categoryIconContainer}>
        <Text style={styles.categoryIcon}>{category.icon}</Text>
      </View>
      <Text style={styles.categoryName} numberOfLines={2}>
        {category.name}
      </Text>
      <Text style={styles.categoryCount}>{jobCount} ta ish</Text>
    </AnimatedTouchable>
  );
};

export const CategoryModal: React.FC<CategoryModalProps> = ({
  visible,
  onClose,
  onCategorySelect,
}) => {
  const navigation = useNavigation();

  const handleCategoryPress = (categoryId: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
    onClose();
    // Navigate to search with category filter
    // @ts-expect-error - Navigation type
    navigation.navigate('Search', { category: categoryId });
  };

  // Mock job counts (real app would get from API)
  const getCategoryJobCount = (categoryId: string): number => {
    const counts: Record<string, number> = {
      it: 45,
      marketing: 32,
      sales: 28,
      education: 18,
      healthcare: 15,
      finance: 22,
      construction: 19,
      transport: 24,
      hospitality: 17,
      admin: 26,
      production: 21,
      other: 12,
    };
    return counts[categoryId] || 0;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.modalContainer}
          onPress={(e) => e.stopPropagation()}
        >
          <FadeInView>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerDrag} />
              <Text style={styles.headerTitle}>Kategoriyalar</Text>
              <AnimatedTouchable
                onPress={onClose}
                style={styles.closeButton}
                scaleValue={0.9}
                enableHaptic
                hapticType="selection"
                accessible
                accessibilityRole="button"
                accessibilityLabel="Yopish"
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#495057"
                />
              </AnimatedTouchable>
            </View>

            {/* Categories Grid */}
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.categoriesGrid}
              showsVerticalScrollIndicator={false}
            >
              {categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  onPress={() => handleCategoryPress(category.id)}
                  jobCount={getCategoryJobCount(category.id)}
                />
              ))}
            </ScrollView>
          </FadeInView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: horizontalPadding(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerDrag: {
    width: 40,
    height: 4,
    backgroundColor: '#DEE2E6',
    borderRadius: 2,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: fontSize(20),
    fontWeight: '800',
    color: '#1B4332',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: horizontalPadding(16),
    top: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: horizontalPadding(16),
    gap: 12,
  },
  categoryItem: {
    width:
      (Dimensions.get('window').width - horizontalPadding(16) * 2 - 12) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E9ECEF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: fontSize(32),
  },
  categoryName: {
    fontSize: fontSize(14),
    fontWeight: '700',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 6,
    minHeight: 40,
  },
  categoryCount: {
    fontSize: fontSize(12),
    fontWeight: '600',
    color: '#6C757D',
  },
});
