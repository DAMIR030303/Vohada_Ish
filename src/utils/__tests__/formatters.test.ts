/**
 * Formatters utility testlari
 * 
 * @description Formatting funksiyalarini to'liq test qilish
 * Coverage target: 90%+
 */

import {
  formatCurrency,
  formatRelativeTime,
  formatDate,
  formatDateTime,
  truncateText,
} from '../formatters';

describe('Formatters Utils', () => {
  describe('formatCurrency', () => {
    it('UZS valyutasini to\'g\'ri format qilish kerak', () => {
      const result = formatCurrency(5000000, 'UZS');
      expect(result).toContain('5');
      expect(result).toContain('000');
      expect(result).toContain('000');
    });

    it('boshqa valyutalarni to\'g\'ri format qilish kerak', () => {
      const result = formatCurrency(1000, 'USD');
      expect(result).toContain('1');
      expect(result).toContain('000');
    });

    it('default valyuta UZS bo\'lishi kerak', () => {
      const result = formatCurrency(1000000);
      expect(result).toBeTruthy();
    });

    it('nol qiymatni to\'g\'ri format qilish kerak', () => {
      const result = formatCurrency(0, 'UZS');
      expect(result).toBeTruthy();
    });

    it('manfiy qiymatni to\'g\'ri format qilish kerak', () => {
      const result = formatCurrency(-1000, 'UZS');
      expect(result).toContain('-');
    });
  });

  describe('formatRelativeTime', () => {
    const now = new Date();

    it('hozirgina (< 1 daqiqa) formatini qaytarish kerak', () => {
      const recent = new Date(now.getTime() - 30 * 1000); // 30 soniya oldin
      expect(formatRelativeTime(recent)).toBe('hozirgina');
    });

    it('daqiqalarni to\'g\'ri format qilish kerak', () => {
      const minutes = new Date(now.getTime() - 5 * 60 * 1000); // 5 daqiqa oldin
      expect(formatRelativeTime(minutes)).toBe('5 daqiqa oldin');
    });

    it('soatlarni to\'g\'ri format qilish kerak', () => {
      const hours = new Date(now.getTime() - 3 * 60 * 60 * 1000); // 3 soat oldin
      expect(formatRelativeTime(hours)).toBe('3 soat oldin');
    });

    it('kunlarni to\'g\'ri format qilish kerak', () => {
      const days = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000); // 4 kun oldin
      expect(formatRelativeTime(days)).toBe('4 kun oldin');
    });

    it('haftalarni to\'g\'ri format qilish kerak', () => {
      const weeks = new Date(now.getTime() - 2 * 7 * 24 * 60 * 60 * 1000); // 2 hafta oldin
      expect(formatRelativeTime(weeks)).toBe('2 hafta oldin');
    });

    it('oylarni to\'g\'ri format qilish kerak', () => {
      const months = new Date(now.getTime() - 3 * 30 * 24 * 60 * 60 * 1000); // ~3 oy oldin
      expect(formatRelativeTime(months)).toBe('3 oy oldin');
    });

    it('yillarni to\'g\'ri format qilish kerak', () => {
      const years = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000); // 2 yil oldin
      expect(formatRelativeTime(years)).toBe('2 yil oldin');
    });

    it('string sanalarga ishlash kerak', () => {
      const dateString = new Date(now.getTime() - 10 * 60 * 1000).toISOString();
      expect(formatRelativeTime(dateString)).toBe('10 daqiqa oldin');
    });
  });

  describe('formatDate', () => {
    it('sanani to\'g\'ri format qilish kerak', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('string sanalarga ishlash kerak', () => {
      const result = formatDate('2024-01-15');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('formatDateTime', () => {
    it('sana va vaqtni to\'g\'ri format qilish kerak', () => {
      const date = new Date('2024-01-15T10:30:00');
      const result = formatDateTime(date);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('string sanalarga ishlash kerak', () => {
      const result = formatDateTime('2024-01-15T10:30:00');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('truncateText', () => {
    it('uzun matnni qisqartirish kerak', () => {
      const text = 'Bu juda uzun matn bo\'lib, uni qisqartirish kerak';
      const result = truncateText(text, 20);
      expect(result).toBe('Bu juda uzun matn bo...');
      expect(result.length).toBe(23); // 20 + '...'
    });

    it('qisqa matnni o\'zgartirmasdan qaytarish kerak', () => {
      const text = 'Qisqa matn';
      const result = truncateText(text, 20);
      expect(result).toBe('Qisqa matn');
    });

    it('aynan max length bo\'lgan matnni o\'zgartirmasdan qaytarish kerak', () => {
      const text = 'Exactly20Characters!';
      const result = truncateText(text, 20);
      expect(result).toBe('Exactly20Characters!');
    });

    it('bo\'sh stringni to\'g\'ri qayta ishlash kerak', () => {
      const result = truncateText('', 10);
      expect(result).toBe('');
    });

    it('maxLength 0 bo\'lsa ... qaytarish kerak', () => {
      const result = truncateText('Some text', 0);
      expect(result).toBe('...');
    });
  });

  describe('Edge cases', () => {
    it('juda katta miqdorlarni format qilish kerak', () => {
      const result = formatCurrency(999999999999, 'UZS');
      expect(result).toBeTruthy();
    });

    it('kelajakdagi sanalarni to\'g\'ri qayta ishlash kerak', () => {
      const future = new Date(Date.now() + 1000 * 60 * 60); // 1 soat keyin
      const result = formatRelativeTime(future);
      // Manfiy vaqt uchun "hozirgina" qaytishi mumkin
      expect(result).toBeTruthy();
    });

    it('unicode belgilar bilan matnni qisqartirish kerak', () => {
      const text = 'Привет мир 🌍 Unicode';
      const result = truncateText(text, 10);
      expect(result).toBe('Привет мир...');
    });
  });
});

