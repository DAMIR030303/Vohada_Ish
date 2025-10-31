/**
 * Firebase konfiguratsiyasi
 */

import { initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase v12'da AsyncStorage persistence avtomatik qo'llaniladi
// Expo muhitida @react-native-async-storage/async-storage avtomatik ishlatiladi
// Warning chiqishi mumkin, lekin bu normal va auth state saqlanadi

// Firebase konfiguratsiyasi
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Debug: Firebase konfiguratsiyasini tekshirish
if (__DEV__) {
  console.log('Firebase Config Check:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasAuthDomain: !!firebaseConfig.authDomain,
    hasProjectId: !!firebaseConfig.projectId,
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
  });
}

// Konfiguratsiyani validatsiya qilish
const isFirebaseConfigured = 
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId;

if (!isFirebaseConfigured) {
  console.warn(
    '⚠️ Firebase konfiguratsiyasi topilmadi. ' +
    'Iltimos, .env faylida EXPO_PUBLIC_FIREBASE_* o\'zgaruvchilarini to\'ldiring ' +
    'va Expo server\'ni qayta ishga tushiring: npm start -- --clear'
  );
}

// Firebase ni initialize qilish (faqat konfiguratsiya to'liq bo'lsa)
let app;
try {
  if (isFirebaseConfigured) {
    app = initializeApp(firebaseConfig);
  } else {
    // Bo'sh konfiguratsiya bilan initialize qilish (xatolikni oldini olish uchun)
    // Bu holatda Firebase ishlatilmaydi, mock service ishlatiladi
    throw new Error('Firebase konfiguratsiyasi mavjud emas');
  }
} catch (error) {
  // Firebase konfiguratsiyasi bo'lmasa, mock service ishlatiladi
  // Bu normal holat demo mode uchun
  console.warn('Firebase initialize qilinmadi. Mock service ishlatilmoqda.');
  // Dummy app yaratamiz (faqat type checking uchun)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app = null as any;
}

// Auth ni AsyncStorage bilan initialize qilish
// Firebase v12 da AsyncStorage avtomatik aniqlanadi
let auth: Auth | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let storage: ReturnType<typeof getStorage> | null = null;

if (app && isFirebaseConfigured) {
  try {
    // Firebase Auth'ni initialize qilish
    // Firebase v12'da AsyncStorage avtomatik ishlatiladi
    auth = getAuth(app);
    
    db = getFirestore(app);
    storage = getStorage(app);
    
    if (__DEV__) {
      console.log('✅ Firebase services initialized successfully');
      console.log('Auth:', !!auth);
      console.log('DB:', !!db);
      console.log('Storage:', !!storage);
    }
  } catch (error) {
    console.error('❌ Firebase service\'larni initialize qilishda xatolik:', error);
    // Xatolik bo'lsa, service'larni null qilib qoldiramiz
    auth = null;
    db = null;
    storage = null;
  }
} else {
  if (__DEV__) {
    console.warn('⚠️ Firebase not initialized:', {
      hasApp: !!app,
      isConfigured: isFirebaseConfigured,
      config: {
        apiKey: !!firebaseConfig.apiKey,
        authDomain: !!firebaseConfig.authDomain,
        projectId: !!firebaseConfig.projectId,
      },
    });
  }
}

export { auth };

// Services (null bo'lishi mumkin, lekin type-safe uchun)
export { db };
export { storage };

export default app;

