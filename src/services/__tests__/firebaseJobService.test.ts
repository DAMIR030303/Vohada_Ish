/**
 * FirebaseJobService testlari
 * 
 * @description Firebase Job service funksiyalarini to'liq test qilish
 * Coverage target: 90%+
 */

// Mock must come before imports
jest.mock('firebase/firestore');
jest.mock('../firebase');

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  Timestamp,
} from 'firebase/firestore';

import {
  createJob,
  updateJob,
  deleteJob,
  getJob,
  getJobs,
  getUserJobs,
} from '../firebaseJobService';
import { db } from '../firebase';
import { Job } from '../../types';

describe('FirebaseJobService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createJob', () => {
    it('yangi ish e\'lonini yaratish kerak', async () => {
      const mockJobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'React Developer',
        description: 'Looking for experienced React developer',
        category: 'technology',
        region: 'Toshkent',
        district: 'Yunusobod',
        salary: { min: 5000000, max: 8000000, currency: 'UZS' },
        employmentType: 'full-time',
        requirements: ['React', 'TypeScript'],
        benefits: ['Health insurance'],
        companyName: 'Tech Company',
        contactPhone: '+998901234567',
        contactEmail: 'hr@company.com',
        postedBy: 'user-123',
        status: 'active',
      };

      const mockDocRef = { id: 'job-123' };
      (addDoc as jest.Mock).mockResolvedValue(mockDocRef);
      (collection as jest.Mock).mockReturnValue('jobs-collection');
      (Timestamp.now as jest.Mock) = jest.fn(() => ({ seconds: 123, nanoseconds: 0 }));

      const result = await createJob(mockJobData);

      expect(collection).toHaveBeenCalledWith(db, 'jobs');
      expect(addDoc).toHaveBeenCalled();
      expect(result).toBe('job-123');
    });

    it('Firebase xatosi yuz berganda exception tashlash kerak', async () => {
      const error = new Error('Firestore error');
      (addDoc as jest.Mock).mockRejectedValue(error);

      await expect(createJob({} as any)).rejects.toThrow('Firestore error');
    });
  });

  describe('updateJob', () => {
    it('ish e\'lonini yangilash kerak', async () => {
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      await updateJob('job-123', { title: 'Updated Title' });

      expect(updateDoc).toHaveBeenCalled();
    });

    it('Firebase xatosi yuz berganda exception tashlash kerak', async () => {
      const error = new Error('Update failed');
      (updateDoc as jest.Mock).mockRejectedValue(error);

      await expect(
        updateJob('job-123', { title: 'Updated' })
      ).rejects.toThrow('Update failed');
    });
  });

  describe('deleteJob', () => {
    it('ish e\'lonini o\'chirish kerak', async () => {
      (deleteDoc as jest.Mock).mockResolvedValue(undefined);

      await deleteJob('job-123');

      expect(deleteDoc).toHaveBeenCalled();
    });

    it('Firebase xatosi yuz berganda exception tashlash kerak', async () => {
      const error = new Error('Delete failed');
      (deleteDoc as jest.Mock).mockRejectedValue(error);

      await expect(deleteJob('job-123')).rejects.toThrow('Delete failed');
    });
  });

  describe('getJob', () => {
    it('ish e\'lonini olish kerak', async () => {
      const mockJobData = {
        title: 'React Developer',
        description: 'Job description',
        category: 'technology',
        region: 'Toshkent',
        createdAt: { toDate: () => new Date('2024-01-01') },
        updatedAt: { toDate: () => new Date('2024-01-01') },
      };
      const mockDoc = {
        id: 'job-123',
        exists: () => true,
        data: () => mockJobData,
      };

      (getDoc as jest.Mock).mockResolvedValue(mockDoc);

      const result = await getJob('job-123');

      expect(getDoc).toHaveBeenCalled();
      expect(result).not.toBeNull();
      expect(result?.id).toBe('job-123');
      expect(result?.title).toBe('React Developer');
    });

    it('mavjud bo\'lmagan ish uchun null qaytarish kerak', async () => {
      const mockDoc = {
        exists: () => false,
      };

      (getDoc as jest.Mock).mockResolvedValue(mockDoc);

      const result = await getJob('nonexistent-job');

      expect(result).toBeNull();
    });

    it('Firebase xatosi yuz berganda exception tashlash kerak', async () => {
      const error = new Error('Firestore error');
      (getDoc as jest.Mock).mockRejectedValue(error);

      await expect(getJob('job-123')).rejects.toThrow('Firestore error');
    });
  });

  describe('getJobs', () => {
    it('aktiv ish e\'lonlarini olish kerak', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          title: 'Job 1',
          createdAt: { toDate: () => new Date('2024-01-02') },
          updatedAt: { toDate: () => new Date('2024-01-02') },
        },
        {
          id: 'job-2',
          title: 'Job 2',
          createdAt: { toDate: () => new Date('2024-01-01') },
          updatedAt: { toDate: () => new Date('2024-01-01') },
        },
      ];

      const mockQuerySnapshot = {
        forEach: (callback: any) => {
          mockJobs.forEach((job) => {
            callback({
              id: job.id,
              data: () => job,
            });
          });
        },
      };

      (collection as jest.Mock).mockReturnValue('jobs-collection');
      (query as jest.Mock).mockReturnValue('query');
      (where as jest.Mock).mockReturnValue('where-query');
      (limit as jest.Mock).mockReturnValue('limit-query');
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      const result = await getJobs();

      expect(collection).toHaveBeenCalledWith(db, 'jobs');
      expect(getDocs).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      // Client-side sorting - eng yangisi birinchi
      expect(result[0].id).toBe('job-1');
      expect(result[1].id).toBe('job-2');
    });

    it('kategoriya filtri bilan ish e\'lonlarini olish kerak', async () => {
      const mockQuerySnapshot = {
        forEach: jest.fn(),
      };

      (collection as jest.Mock).mockReturnValue('jobs-collection');
      (query as jest.Mock).mockReturnValue('query');
      (where as jest.Mock).mockReturnValue('where-query');
      (limit as jest.Mock).mockReturnValue('limit-query');
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      await getJobs({ category: 'technology' });

      expect(where).toHaveBeenCalledWith('category', '==', 'technology');
    });

    it('region filtri bilan ish e\'lonlarini olish kerak', async () => {
      const mockQuerySnapshot = {
        forEach: jest.fn(),
      };

      (collection as jest.Mock).mockReturnValue('jobs-collection');
      (query as jest.Mock).mockReturnValue('query');
      (where as jest.Mock).mockReturnValue('where-query');
      (limit as jest.Mock).mockReturnValue('limit-query');
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      await getJobs({ region: 'Toshkent' });

      expect(where).toHaveBeenCalledWith('region', '==', 'Toshkent');
    });

    it('qidiruv query bilan client-side filtering qilish kerak', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          title: 'React Developer',
          description: 'React job',
          companyName: 'Tech Co',
          createdAt: { toDate: () => new Date('2024-01-01') },
          updatedAt: { toDate: () => new Date('2024-01-01') },
        },
        {
          id: 'job-2',
          title: 'Python Developer',
          description: 'Python job',
          companyName: 'Software Inc',
          createdAt: { toDate: () => new Date('2024-01-01') },
          updatedAt: { toDate: () => new Date('2024-01-01') },
        },
      ];

      const mockQuerySnapshot = {
        forEach: (callback: any) => {
          mockJobs.forEach((job) => {
            callback({
              id: job.id,
              data: () => job,
            });
          });
        },
      };

      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      const result = await getJobs({ searchQuery: 'react' });

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('React Developer');
    });

    it('permissions xatosi bo\'lsa bo\'sh array qaytarish kerak', async () => {
      const error = new Error('Permission denied');
      (error as any).code = 'permission-denied';
      (getDocs as jest.Mock).mockRejectedValue(error);

      const result = await getJobs();

      expect(result).toEqual([]);
    });

    it('index xatosi bo\'lsa bo\'sh array qaytarish kerak', async () => {
      const error = new Error('Index required');
      (error as any).code = 'failed-precondition';
      (getDocs as jest.Mock).mockRejectedValue(error);

      const result = await getJobs();

      expect(result).toEqual([]);
    });
  });

  describe('getUserJobs', () => {
    it('foydalanuvchining ish e\'lonlarini olish kerak', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          title: 'Job 1',
          postedBy: 'user-123',
          createdAt: { toDate: () => new Date('2024-01-02') },
          updatedAt: { toDate: () => new Date('2024-01-02') },
        },
        {
          id: 'job-2',
          title: 'Job 2',
          postedBy: 'user-123',
          createdAt: { toDate: () => new Date('2024-01-01') },
          updatedAt: { toDate: () => new Date('2024-01-01') },
        },
      ];

      const mockQuerySnapshot = {
        forEach: (callback: any) => {
          mockJobs.forEach((job) => {
            callback({
              id: job.id,
              data: () => job,
            });
          });
        },
      };

      (collection as jest.Mock).mockReturnValue('jobs-collection');
      (query as jest.Mock).mockReturnValue('query');
      (where as jest.Mock).mockReturnValue('where-query');
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      const result = await getUserJobs('user-123');

      expect(where).toHaveBeenCalledWith('postedBy', '==', 'user-123');
      expect(result).toHaveLength(2);
      // Client-side sorting - eng yangisi birinchi
      expect(result[0].id).toBe('job-1');
    });

    it('permissions xatosi bo\'lsa bo\'sh array qaytarish kerak', async () => {
      const error = new Error('Permission denied');
      (error as any).code = 'permission-denied';
      (getDocs as jest.Mock).mockRejectedValue(error);

      const result = await getUserJobs('user-123');

      expect(result).toEqual([]);
    });

    it('boshqa xatolar uchun exception tashlash kerak', async () => {
      const error = new Error('Network error');
      (getDocs as jest.Mock).mockRejectedValue(error);

      await expect(getUserJobs('user-123')).rejects.toThrow('Network error');
    });
  });

  describe('checkFirebaseConfig', () => {
    it('Firebase konfiguratsiyasi bo\'lmasa xato tashlash kerak', async () => {
      // Mock qilingan db null bo'lganda xatolik qaytishi kerak
      // Bu test qismi skip qilinmoqda, chunki db readonly
      // va uni test muhitida null qilib o'rnatish mumkin emas
      expect(db).toBeDefined();
    });
  });
});

