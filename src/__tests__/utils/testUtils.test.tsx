/**
 * Test Utils testlari
 * 
 * @description Test utilities funksiyalarini tekshirish
 */

import {
  renderWithProviders,
  renderWithTheme,
  createMockJob,
  createMockUser,
  createMockJobs,
  createMockNavigation,
  createMockRoute,
} from '../../test-utils/testUtils';

describe('Test Utils', () => {
  describe('Mock generators', () => {
    it('createMockJob to\'g\'ri job yaratish kerak', () => {
      const job = createMockJob();
      expect(job).toHaveProperty('id');
      expect(job).toHaveProperty('title');
      expect(job).toHaveProperty('category');
    });

    it('createMockUser to\'g\'ri user yaratish kerak', () => {
      const user = createMockUser();
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('fullName');
    });

    it('createMockJobs to\'g\'ri miqdorda jobs yaratish kerak', () => {
      const jobs = createMockJobs(3);
      expect(jobs).toHaveLength(3);
      expect(jobs[0]).toHaveProperty('id');
    });

    it('createMockNavigation navigation mock yaratish kerak', () => {
      const navigation = createMockNavigation();
      expect(navigation).toHaveProperty('navigate');
      expect(navigation).toHaveProperty('goBack');
    });

    it('createMockRoute route mock yaratish kerak', () => {
      const route = createMockRoute({ id: '123' });
      expect(route).toHaveProperty('key');
      expect(route).toHaveProperty('name');
      expect(route.params).toEqual({ id: '123' });
    });
  });
});

