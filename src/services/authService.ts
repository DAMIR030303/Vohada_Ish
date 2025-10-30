/**
 * Autentifikatsiya servisi
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import { User } from '../types';

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
  try {
    // Firebase Auth orqali ro'yxatdan o'tish
    const userCredential = await createUserWithEmailAndPassword(
      auth,
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

    await setDoc(doc(db, 'users', firebaseUser.uid), userData);

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
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
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
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

/**
 * Foydalanuvchi ma'lumotlarini olish
 */
export const getUserData = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data(),
      } as User;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

