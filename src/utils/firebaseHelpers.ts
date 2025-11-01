/**
 * Firebase helper funksiyalari
 */

import { auth, db } from '../services/firebase';

/**
 * Firebase konfiguratsiyasini tekshirish
 * @param requireAuth - Agar true bo'lsa, auth ham tekshiriladi
 * @throws Error agar Firebase konfiguratsiyasi to'liq emas
 */
export const checkFirebaseConfig = (requireAuth: boolean = false): void => {
  if (requireAuth && !auth) {
    const error = new Error(
      'Firebase Auth konfiguratsiyasi topilmadi.\n\n' +
        'Iltimos, quyidagi qadamlarni bajaring:\n' +
        '1. .env faylini yarating (loyiha ildizida)\n' +
        "2. Firebase Console'dan ma'lumotlarni oling\n" +
        "3. .env fayliga quyidagilarni qo'ying:\n" +
        '   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key\n' +
        '   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain\n' +
        '   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id\n' +
        '   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket\n' +
        '   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id\n' +
        '   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id\n' +
        "4. Expo server'ni qayta ishga tushiring: npm start -- --clear",
    );
    // Firebase xatosi formatida qaytarish
    (error as any).code = 'auth/configuration-not-found';
    (error as any).message = 'Firebase: Error (auth/configuration-not-found)';
    throw error;
  }

  if (!db) {
    throw new Error(
      'Firebase konfiguratsiyasi topilmadi. ' +
        "Iltimos, .env faylida EXPO_PUBLIC_FIREBASE_* o'zgaruvchilarini to'ldiring " +
        "va Expo server'ni qayta ishga tushiring: npm start -- --clear",
    );
  }
};
