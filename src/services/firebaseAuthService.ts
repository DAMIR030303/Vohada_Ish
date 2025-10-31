/**
 * Firebase Autentifikatsiya servisi
 */

import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import { User } from '../types';

import { auth, db } from './firebase';

/**
 * Firebase konfiguratsiyasini tekshirish
 */
const checkFirebaseConfig = () => {
  if (!auth || !db) {
    // Firebase konfiguratsiyasi topilmadi - aniq xatolik xabari
    const error = new Error(
      'Firebase konfiguratsiyasi topilmadi.\n\n' +
      'Iltimos, quyidagi qadamlarni bajaring:\n' +
      '1. .env faylini yarating (loyiha ildizida)\n' +
      '2. Firebase Console\'dan ma\'lumotlarni oling\n' +
      '3. .env fayliga quyidagilarni qo\'ying:\n' +
      '   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key\n' +
      '   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain\n' +
      '   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id\n' +
      '   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket\n' +
      '   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id\n' +
      '   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id\n' +
      '4. Expo server\'ni qayta ishga tushiring: npm start -- --clear'
    );
    // Firebase xatosi formatida qaytarish
    (error as any).code = 'auth/configuration-not-found';
    (error as any).message = 'Firebase: Error (auth/configuration-not-found)';
    throw error;
  }
};

/**
 * Ro'yxatdan o'tish
 */
export const register = async (
  email: string,
  password: string,
  fullName: string,
  phone?: string,
): Promise<User> => {
  checkFirebaseConfig();
  try {
    // Firebase Auth orqali ro'yxatdan o'tish
    const userCredential = await createUserWithEmailAndPassword(
      auth!,
      email,
      password,
    );
    const firebaseUser = userCredential.user;

    // Profilni yangilash
    await updateProfile(firebaseUser, {
      displayName: fullName,
    });

    // Firestore'da foydalanuvchi ma'lumotlarini saqlash
    const userData: Omit<User, 'id'> = {
      email,
      fullName,
      phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db!, 'users', firebaseUser.uid), userData);

    return {
      id: firebaseUser.uid,
      ...userData,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Kirish
 */
export const login = async (
  email: string,
  password: string,
): Promise<FirebaseUser> => {
  checkFirebaseConfig();
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth!,
      email,
      password,
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

/**
 * Chiqish
 */
export const logout = async (): Promise<void> => {
  checkFirebaseConfig();
  try {
    await signOut(auth!);
  } catch (error) {
    throw error;
  }
};

/**
 * Parolni tiklash email yuborish
 */
export const resetPassword = async (email: string): Promise<void> => {
  checkFirebaseConfig();
  try {
    // Firebase Console'da Action URL sozlang:
    // Custom URL: vohadaish://reset-password?oobCode=%OOB_CODE%&mode=resetPassword
    // yoki default Firebase URL ishlatiladi
    await sendPasswordResetEmail(auth!, email, {
      url: 'vohadaish://reset-password',
      handleCodeInApp: true,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Parolni yangilash (oobCode bilan)
 */
export const confirmResetPassword = async (
  oobCode: string,
  newPassword: string,
): Promise<void> => {
  checkFirebaseConfig();
  try {
    await confirmPasswordReset(auth!, oobCode, newPassword);
  } catch (error) {
    throw error;
  }
};

/**
 * Foydalanuvchi ma'lumotlarini olish
 */
export const getUserData = async (userId: string): Promise<User | null> => {
  checkFirebaseConfig();
  try {
    const userDoc = await getDoc(doc(db!, 'users', userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        id: userDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as User;
    }
    // Agar user dokumenti bo'lmasa, null qaytarish
    // AuthContext'da Firebase Auth ma'lumotlaridan yaratiladi
    if (__DEV__) {
      console.warn(`User document not found in Firestore for userId: ${userId}`);
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

