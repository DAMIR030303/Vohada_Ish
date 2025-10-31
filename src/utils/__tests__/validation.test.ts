/**
 * Validation utility testlari
 * 
 * @description Validation funksiyalarini to'liq test qilish
 * Coverage target: 90%+
 */

import {
  isValidEmail,
  isValidPhone,
  formatPhone,
  isValidPassword,
  isRequired,
  isValidUrl,
} from '../validation';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('to\'g\'ri email formatini qabul qilish kerak', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('email+tag@test.com')).toBe(true);
    });

    it('noto\'g\'ri email formatini rad etish kerak', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test @example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('O\'zbekiston telefon raqamlarini qabul qilish kerak', () => {
      // +998 prefiksi bilan
      expect(isValidPhone('+998901234567')).toBe(true);
      expect(isValidPhone('+998 90 123 45 67')).toBe(true);
      
      // 998 prefiksi bilan
      expect(isValidPhone('998901234567')).toBe(true);
      expect(isValidPhone('998 90 123 45 67')).toBe(true);
      
      // Faqat 9 raqam
      expect(isValidPhone('901234567')).toBe(true);
      expect(isValidPhone('90 123 45 67')).toBe(true);
    });

    it('noto\'g\'ri telefon raqamlarini rad etish kerak', () => {
      expect(isValidPhone('12345')).toBe(false);
      expect(isValidPhone('+7901234567')).toBe(false); // Rossiya kodi
      expect(isValidPhone('abcdefghi')).toBe(false);
      expect(isValidPhone('')).toBe(false);
      expect(isValidPhone('+998 90 123')).toBe(false); // Qisqa
    });
  });

  describe('formatPhone', () => {
    it('telefon raqamini standart formatga keltirish kerak', () => {
      expect(formatPhone('901234567')).toBe('+998901234567');
      expect(formatPhone('90 123 45 67')).toBe('+998901234567');
      expect(formatPhone('998901234567')).toBe('+998901234567');
      expect(formatPhone('998 90 123 45 67')).toBe('+998901234567');
      expect(formatPhone('+998901234567')).toBe('+998901234567');
    });

    it('noto\'g\'ri formatni o\'zgartirsiz qaytarish kerak', () => {
      expect(formatPhone('invalid')).toBe('invalid');
      expect(formatPhone('123')).toBe('123');
    });

    it('bo\'sh stringni o\'zgartirmasdan qaytarish kerak', () => {
      expect(formatPhone('')).toBe('');
    });
  });

  describe('isValidPassword', () => {
    it('kamida 6 belgili parollarni qabul qilish kerak', () => {
      expect(isValidPassword('123456')).toBe(true);
      expect(isValidPassword('password')).toBe(true);
      expect(isValidPassword('Pass@123')).toBe(true);
      expect(isValidPassword('verylongpassword12345')).toBe(true);
    });

    it('6 belgidan qisqa parollarni rad etish kerak', () => {
      expect(isValidPassword('12345')).toBe(false);
      expect(isValidPassword('pass')).toBe(false);
      expect(isValidPassword('abc')).toBe(false);
      expect(isValidPassword('')).toBe(false);
    });
  });

  describe('isRequired', () => {
    it('to\'ldirilgan maydonlarni qabul qilish kerak', () => {
      expect(isRequired('test')).toBe(true);
      expect(isRequired('some value')).toBe(true);
      expect(isRequired('  with spaces  ')).toBe(true);
    });

    it('bo\'sh maydonlarni rad etish kerak', () => {
      expect(isRequired('')).toBe(false);
      expect(isRequired('   ')).toBe(false); // Faqat bo'sh joylar
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('to\'g\'ri URL formatlarini qabul qilish kerak', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://test.org')).toBe(true);
      expect(isValidUrl('https://subdomain.example.com/path')).toBe(true);
      expect(isValidUrl('https://example.com:8080')).toBe(true);
      expect(isValidUrl('https://example.com/path?query=1')).toBe(true);
    });

    it('noto\'g\'ri URL formatlarini rad etish kerak', () => {
      expect(isValidUrl('invalid')).toBe(false);
      expect(isValidUrl('just text')).toBe(false);
      expect(isValidUrl('www.example.com')).toBe(false); // Protocol yo'q
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('http://')).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('maxsus belgilar bilan email to\'g\'ri ishlash kerak', () => {
      expect(isValidEmail('test+123@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('turli xil telefon formatlarini to\'g\'ri format qilish kerak', () => {
      expect(formatPhone('+998(90)123-45-67')).toBe('+998901234567');
      expect(formatPhone('998-90-123-45-67')).toBe('+998901234567');
    });

    it('unicode belgilar bilan parol ishlash kerak', () => {
      expect(isValidPassword('пароль')).toBe(true); // 6 belgi
      expect(isValidPassword('密碼12')).toBe(false); // 4 belgi
      expect(isValidPassword('مرور')).toBe(false); // 4 belgi
    });

    it('juda uzun qiymatlarni to\'g\'ri tekshirish kerak', () => {
      const longString = 'a'.repeat(1000);
      expect(isRequired(longString)).toBe(true);
      expect(isValidPassword(longString)).toBe(true);
    });
  });
});

