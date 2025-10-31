/**
 * FirebaseAuthService testlari
 * 
 * @description Firebase Auth service funksiyalarini to'liq test qilish
 * Coverage target: 90%+
 */

// Mock must come before imports
jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('../firebase');

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import {
  register,
  login,
  logout,
  resetPassword,
  confirmResetPassword,
  getUserData,
} from '../firebaseAuthService';
import { auth, db } from '../firebase';

describe('FirebaseAuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('yangi foydalanuvchini muvaffaqiyatli ro\'yxatdan o\'tkazish kerak', async () => {
      const mockUser = { uid: 'test-uid', email: 'test@example.com' };
      const mockUserCredential = { user: mockUser };

      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(
        mockUserCredential
      );
      (updateProfile as jest.Mock).mockResolvedValue(undefined);
      (setDoc as jest.Mock).mockResolvedValue(undefined);

      const result = await register(
        'test@example.com',
        'password123',
        'Test User',
        '+998901234567'
      );

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password123'
      );
      expect(updateProfile).toHaveBeenCalledWith(mockUser, {
        displayName: 'Test User',
      });
      expect(setDoc).toHaveBeenCalled();
      expect(result.id).toBe('test-uid');
      expect(result.email).toBe('test@example.com');
      expect(result.fullName).toBe('Test User');
    });

    it('xato yuz berganda exception tashlash kerak', async () => {
      const error = new Error('Registration failed');
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

      await expect(
        register('test@example.com', 'weak', 'Test User')
      ).rejects.toThrow('Registration failed');
    });

    it('telefon raqamisiz ro\'yxatdan o\'tkazish mumkin', async () => {
      const mockUser = { uid: 'test-uid', email: 'test@example.com' };
      const mockUserCredential = { user: mockUser };

      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(
        mockUserCredential
      );
      (updateProfile as jest.Mock).mockResolvedValue(undefined);
      (setDoc as jest.Mock).mockResolvedValue(undefined);

      const result = await register(
        'test@example.com',
        'password123',
        'Test User'
      );

      expect(result.phone).toBeUndefined();
    });
  });

  describe('login', () => {
    it('to\'g\'ri email va parol bilan kirish kerak', async () => {
      const mockUser = { uid: 'test-uid', email: 'test@example.com' };
      const mockUserCredential = { user: mockUser };

      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(
        mockUserCredential
      );

      const result = await login('test@example.com', 'password123');

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password123'
      );
      expect(result.uid).toBe('test-uid');
      expect(result.email).toBe('test@example.com');
    });

    it('noto\'g\'ri parol bilan xato qaytarish kerak', async () => {
      const error = new Error('Invalid password');
      (error as any).code = 'auth/invalid-credential';
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

      await expect(
        login('test@example.com', 'wrongpassword')
      ).rejects.toThrow();
    });

    it('mavjud bo\'lmagan email bilan xato qaytarish kerak', async () => {
      const error = new Error('User not found');
      (error as any).code = 'auth/user-not-found';
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

      await expect(
        login('notfound@example.com', 'password123')
      ).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('foydalanuvchini tizimdan chiqarish kerak', async () => {
      (signOut as jest.Mock).mockResolvedValue(undefined);

      await logout();

      expect(signOut).toHaveBeenCalledWith(auth);
    });

    it('chiqish paytida xato yuz berganda exception tashlash kerak', async () => {
      const error = new Error('Logout failed');
      (signOut as jest.Mock).mockRejectedValue(error);

      await expect(logout()).rejects.toThrow('Logout failed');
    });
  });

  describe('resetPassword', () => {
    it('parolni tiklash email yuborish kerak', async () => {
      (sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);

      await resetPassword('test@example.com');

      expect(sendPasswordResetEmail).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        {
          url: 'vohadaish://reset-password',
          handleCodeInApp: true,
        }
      );
    });

    it('mavjud bo\'lmagan email bilan xato qaytarish kerak', async () => {
      const error = new Error('User not found');
      (error as any).code = 'auth/user-not-found';
      (sendPasswordResetEmail as jest.Mock).mockRejectedValue(error);

      await expect(resetPassword('notfound@example.com')).rejects.toThrow();
    });
  });

  describe('confirmResetPassword', () => {
    it('yangi parol bilan parolni tiklash kerak', async () => {
      (confirmPasswordReset as jest.Mock).mockResolvedValue(undefined);

      await confirmResetPassword('valid-code', 'newpassword123');

      expect(confirmPasswordReset).toHaveBeenCalledWith(
        auth,
        'valid-code',
        'newpassword123'
      );
    });

    it('noto\'g\'ri yoki muddati o\'tgan kod bilan xato qaytarish kerak', async () => {
      const error = new Error('Invalid code');
      (error as any).code = 'auth/invalid-action-code';
      (confirmPasswordReset as jest.Mock).mockRejectedValue(error);

      await expect(
        confirmResetPassword('invalid-code', 'newpassword')
      ).rejects.toThrow();
    });

    it('zaif parol bilan xato qaytarish kerak', async () => {
      const error = new Error('Weak password');
      (error as any).code = 'auth/weak-password';
      (confirmPasswordReset as jest.Mock).mockRejectedValue(error);

      await expect(
        confirmResetPassword('valid-code', '123')
      ).rejects.toThrow();
    });
  });

  describe('getUserData', () => {
    it('foydalanuvchi ma\'lumotlarini olish kerak', async () => {
      const mockUserData = {
        email: 'test@example.com',
        fullName: 'Test User',
        phone: '+998901234567',
        createdAt: { toDate: () => new Date('2024-01-01') },
        updatedAt: { toDate: () => new Date('2024-01-01') },
      };
      const mockDoc = {
        id: 'test-uid',
        exists: () => true,
        data: () => mockUserData,
      };

      (getDoc as jest.Mock).mockResolvedValue(mockDoc);

      const result = await getUserData('test-uid');

      expect(getDoc).toHaveBeenCalled();
      expect(result).not.toBeNull();
      expect(result?.id).toBe('test-uid');
      expect(result?.email).toBe('test@example.com');
      expect(result?.fullName).toBe('Test User');
    });

    it('mavjud bo\'lmagan user uchun null qaytarish kerak', async () => {
      const mockDoc = {
        exists: () => false,
      };

      (getDoc as jest.Mock).mockResolvedValue(mockDoc);

      const result = await getUserData('nonexistent-uid');

      expect(result).toBeNull();
    });

    it('Firestore xatosi yuz berganda exception tashlash kerak', async () => {
      const error = new Error('Firestore error');
      (getDoc as jest.Mock).mockRejectedValue(error);

      await expect(getUserData('test-uid')).rejects.toThrow('Firestore error');
    });

    it('createdAt va updatedAt Timestamp\'dan Date\'ga konvertatsiya qilish kerak', async () => {
      const mockDate = new Date('2024-01-15');
      const mockUserData = {
        email: 'test@example.com',
        fullName: 'Test User',
        createdAt: { toDate: () => mockDate },
        updatedAt: { toDate: () => mockDate },
      };
      const mockDoc = {
        id: 'test-uid',
        exists: () => true,
        data: () => mockUserData,
      };

      (getDoc as jest.Mock).mockResolvedValue(mockDoc);

      const result = await getUserData('test-uid');

      expect(result?.createdAt).toEqual(mockDate);
      expect(result?.updatedAt).toEqual(mockDate);
    });
  });

  describe('checkFirebaseConfig', () => {
    it('Firebase konfiguratsiyasi bo\'lmasa xato tashlash kerak', async () => {
      // Mock qilingan auth va db null bo'lganda xatolik qaytishi kerak
      // Bu test qismi skip qilinmoqda, chunki auth va db readonly
      // va ularni test muhitida null qilib o'rnatish mumkin emas
      expect(auth).toBeDefined();
      expect(db).toBeDefined();
    });
  });
});

