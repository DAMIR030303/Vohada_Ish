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
import { checkFirebaseConfig } from '../utils/firebaseHelpers';

import { auth, db } from './firebase';

/**
 * Ro'yxatdan o'tish
 */
export const register = async (
  email: string,
  password: string,
  fullName: string,
  phone?: string,
): Promise<User> => {
  checkFirebaseConfig(true);
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
  checkFirebaseConfig(true);
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
  checkFirebaseConfig(true);
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
  checkFirebaseConfig(true);
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
  checkFirebaseConfig(true);
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
      console.warn(
        `User document not found in Firestore for userId: ${userId}`,
      );
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};
