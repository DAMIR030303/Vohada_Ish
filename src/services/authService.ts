/**
 * Autentifikatsiya servisi
 * 
 * Firebase yoqilgan bo'lsa Firebase versiyasini, aks holda Mock versiyasini ishlatadi
 */

// Ikkala versiyani ham import qilish
import * as firebaseAuth from './firebaseAuthService';
import * as mockAuth from './mockAuthService';

// Firebase API key mavjud bo'lsa Firebase, aks holda Mock
const useFirebase = !!process.env.EXPO_PUBLIC_FIREBASE_API_KEY;

// Runtime'da tanlash
const authService = useFirebase ? firebaseAuth : mockAuth;

// Re-export
export const getUserData = authService.getUserData;
export const login = authService.login;
export const logout = authService.logout;
export const register = authService.register;
export const resetPassword = authService.resetPassword;

// confirmResetPassword faqat Firebase mode'da mavjud
export const confirmResetPassword = useFirebase 
  ? (firebaseAuth as typeof firebaseAuth & { confirmResetPassword: typeof firebaseAuth.confirmResetPassword }).confirmResetPassword
  : undefined;
