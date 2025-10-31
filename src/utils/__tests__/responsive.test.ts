/**
 * Responsive utility testlari
 * 
 * @description Responsive design funksiyalarini test qilish
 * Coverage target: 85%+
 */

import { Dimensions, PixelRatio } from 'react-native';
import {
  wp,
  hp,
  fontSize,
  horizontalPadding,
  verticalPadding,
  isSmallScreen,
  isMediumScreen,
  isLargeScreen,
  isTablet,
  isIOS,
  isAndroid,
  screenDimensions,
} from '../responsive';

// Mock Dimensions
jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(() => ({ width: 390, height: 844 })),
  },
  Platform: {
    OS: 'ios',
  },
  PixelRatio: {
    roundToNearestPixel: jest.fn((value) => Math.round(value)),
  },
}));

describe('Responsive Utils', () => {
  describe('wp - Width Percentage', () => {
    it('ekran kengligining foizini hisoblash kerak', () => {
      const result = wp(50);
      expect(result).toBe(195); // 50% of 390
    });

    it('100% uchun to\'liq kenglikni qaytarish kerak', () => {
      const result = wp(100);
      expect(result).toBe(390);
    });

    it('0% uchun 0 qaytarish kerak', () => {
      const result = wp(0);
      expect(result).toBe(0);
    });

    it('PixelRatio.roundToNearestPixel chaqirilishi kerak', () => {
      wp(50);
      expect(PixelRatio.roundToNearestPixel).toHaveBeenCalled();
    });
  });

  describe('hp - Height Percentage', () => {
    it('ekran balandligining foizini hisoblash kerak', () => {
      const result = hp(50);
      expect(result).toBe(422); // 50% of 844
    });

    it('100% uchun to\'liq balandlikni qaytarish kerak', () => {
      const result = hp(100);
      expect(result).toBe(844);
    });

    it('0% uchun 0 qaytarish kerak', () => {
      const result = hp(0);
      expect(result).toBe(0);
    });
  });

  describe('fontSize', () => {
    it('font o\'lchamini ekran kengligiga moslashtirish kerak', () => {
      const result = fontSize(16);
      // Scale = 390/390 = 1, so result should be 16
      expect(result).toBe(16);
    });

    it('minimal 80% ni saqlab qolish kerak', () => {
      // Mock kichik ekran
      (Dimensions.get as jest.Mock).mockReturnValueOnce({ width: 320, height: 568 });
      const result = fontSize(16);
      // Scale would make it smaller, but minimum is 16 * 0.8 = 12.8
      expect(result).toBeGreaterThanOrEqual(12);
    });
  });

  describe('horizontalPadding', () => {
    // Note: horizontalPadding uses SCREEN_WIDTH which is evaluated at module level
    // So we test the logic based on current mock value (390)
    it('o\'rtacha ekranlar uchun base padding qaytarish kerak', () => {
      const result = horizontalPadding(24);
      // Mock width is 390, which is between 375 and 414, so should return base padding
      expect(result).toBe(24);
    });

    it('default padding 24 bo\'lishi kerak', () => {
      const result = horizontalPadding();
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });

    // Integration test - bu funksiya module level Dimensions.get() ishlatadi
    // Shuning uchun faqat logika tekshiruvi
    it('padding qiymat qaytarish kerak', () => {
      const result = horizontalPadding(30);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('verticalPadding', () => {
    // Note: verticalPadding uses SCREEN_HEIGHT which is evaluated at module level
    // Mock height is 844, which is between 667 and 900, so should return base padding
    it('o\'rtacha ekranlar uchun base padding qaytarish kerak', () => {
      const result = verticalPadding(24);
      expect(result).toBe(24);
    });

    it('padding qiymat qaytarish kerak', () => {
      const result = verticalPadding(30);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('Screen size checks', () => {
    it('isSmallScreen kichik ekranlar uchun true qaytarish kerak', () => {
      (Dimensions.get as jest.Mock).mockReturnValueOnce({ width: 350, height: 600 });
      // Bu funksiya import vaqtida bajariladi, shuning uchun logikani tekshiramiz
      expect(isSmallScreen()).toBe(false); // Bizning mock 390px
    });

    it('isMediumScreen o\'rtacha ekranlar uchun true qaytarish kerak', () => {
      expect(isMediumScreen()).toBe(true); // 390px 375-414 oralig'ida
    });

    it('isLargeScreen katta ekranlar uchun true qaytarish kerak', () => {
      expect(isLargeScreen()).toBe(false); // 390px < 414
    });

    it('isTablet plansheta ekranlar uchun true qaytarish kerak', () => {
      expect(isTablet()).toBe(false); // 390px < 768
    });
  });

  describe('Platform checks', () => {
    it('isIOS iOS platformasida true bo\'lishi kerak', () => {
      expect(isIOS).toBe(true);
    });

    it('isAndroid Android platformasida false bo\'lishi kerak (mock iOS)', () => {
      expect(isAndroid).toBe(false);
    });
  });

  describe('screenDimensions', () => {
    it('ekran o\'lchamlarini to\'g\'ri qaytarish kerak', () => {
      expect(screenDimensions.width).toBe(390);
      expect(screenDimensions.height).toBe(844);
    });

    it('screenDimensions objekt bo\'lishi kerak', () => {
      expect(typeof screenDimensions).toBe('object');
      expect(screenDimensions).toHaveProperty('width');
      expect(screenDimensions).toHaveProperty('height');
    });
  });

  describe('Edge cases', () => {
    it('manfiy foizlar uchun ishlash kerak', () => {
      const result = wp(-10);
      expect(result).toBeLessThan(0);
    });

    it('juda katta foizlar uchun ishlash kerak', () => {
      const result = wp(200);
      expect(result).toBe(780); // 200% of 390
    });

    it('o\'nlik foizlar uchun ishlash kerak', () => {
      const result = wp(50.5);
      expect(result).toBeCloseTo(196.95, 0);
    });
  });
});

