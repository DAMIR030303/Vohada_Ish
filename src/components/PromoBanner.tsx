/**
 * Promo Banner Carousel komponenti
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';

import { promoBanners } from '../data/homeData';
import { PromoBanner as PromoBannerType, User } from '../types';
import { fontSize, horizontalPadding } from '../utils/responsive';

import { AnimatedTouchable } from './AnimatedComponents';
import { LottieIcon } from './LottieIcon';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - horizontalPadding(16) * 2;

interface PromoBannerProps {
  user: User | null;
}

// User holatiga qarab bannerlarni filter qilish
const getUserBanners = (user: User | null): PromoBannerType[] => {
  if (user) {
    // User kirgan: faqat postJob (login/register kerak emas)
    return promoBanners.filter((b) => b.action === 'postJob');
  }
  // User kirmagan: barcha bannerlar (login, register, postJob)
  return promoBanners;
};

interface BannerItemProps {
  banner: PromoBannerType;
  onPress: () => void;
}

const BannerItem: React.FC<BannerItemProps> = ({ banner, onPress }) => {
  return (
    <AnimatedTouchable
      onPress={onPress}
      style={[styles.banner, { backgroundColor: banner.backgroundColor }]}
      scaleValue={0.98}
      enableHaptic
      hapticType="selection"
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${banner.title}. ${banner.subtitle}`}
    >
      <View style={styles.bannerContent}>
        <View style={styles.textContainer}>
          <Text style={styles.bannerTitle}>{banner.title}</Text>
          <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
        </View>
        <View style={styles.iconContainer}>
          {banner.lottieAnimation ? (
            <LottieIcon
              type={banner.lottieAnimation as any}
              size={60}
              loop
              autoPlay
            />
          ) : (
            <MaterialCommunityIcons
              name="chevron-right"
              size={32}
              color="rgba(255, 255, 255, 0.8)"
            />
          )}
        </View>
      </View>
    </AnimatedTouchable>
  );
};

export const PromoBanner: React.FC<PromoBannerProps> = ({ user }) => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const banners = getUserBanners(user);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % banners.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, banners.length]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleBannerPress = (banner: PromoBannerType) => {
    switch (banner.action) {
      case 'postJob':
        // @ts-expect-error - Navigation type
        navigation.navigate('PostJob');
        break;
      case 'login':
      case 'register':
        // These should be filtered by getUserBanners
        if (__DEV__) {
          console.warn('Login/Register banner pressed - unexpected behavior');
        }
        break;
    }
  };

  const renderItem = ({ item }: { item: PromoBannerType }) => (
    <BannerItem banner={item} onPress={() => handleBannerPress(item)} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        snapToInterval={BANNER_WIDTH + 16}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        getItemLayout={(_data, index) => ({
          length: BANNER_WIDTH + 16,
          offset: (BANNER_WIDTH + 16) * index,
          index,
        })}
      />

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  listContent: {
    paddingHorizontal: horizontalPadding(16),
  },
  banner: {
    width: BANNER_WIDTH,
    borderRadius: 20,
    padding: 20,
    marginRight: 16,
    minHeight: 140,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  bannerTitle: {
    fontSize: fontSize(20),
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 26,
  },
  bannerSubtitle: {
    fontSize: fontSize(14),
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DEE2E6',
  },
  dotActive: {
    width: 20,
    backgroundColor: '#40916C',
  },
});
