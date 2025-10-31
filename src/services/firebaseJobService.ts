/**
 * Firebase Ish e'lonlari servisi
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';

import { Job, FilterOptions } from '../types';

import { db } from './firebase';

/**
 * Firebase konfiguratsiyasini tekshirish
 */
const checkFirebaseConfig = () => {
  if (!db) {
    throw new Error(
      'Firebase konfiguratsiyasi topilmadi. ' +
      'Iltimos, .env faylida EXPO_PUBLIC_FIREBASE_* o\'zgaruvchilarini to\'ldiring ' +
      'va Expo server\'ni qayta ishga tushiring: npm start -- --clear'
    );
  }
};

/**
 * Yangi ish e'lonini yaratish
 */
export const createJob = async (
  jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<string> => {
  checkFirebaseConfig();
  try {
    const docRef = await addDoc(collection(db!, 'jobs'), {
      ...jobData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

/**
 * Ish e'lonini yangilash
 */
export const updateJob = async (
  jobId: string,
  updates: Partial<Omit<Job, 'id' | 'createdAt'>>,
): Promise<void> => {
  checkFirebaseConfig();
  try {
    await updateDoc(doc(db!, 'jobs', jobId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Ish e'lonini o'chirish
 */
export const deleteJob = async (jobId: string): Promise<void> => {
  checkFirebaseConfig();
  try {
    await deleteDoc(doc(db!, 'jobs', jobId));
  } catch (error) {
    throw error;
  }
};

/**
 * Bitta ish e'lonini olish
 */
export const getJob = async (jobId: string): Promise<Job | null> => {
  checkFirebaseConfig();
  try {
    const jobDoc = await getDoc(doc(db!, 'jobs', jobId));
    if (jobDoc.exists()) {
      const data = jobDoc.data();
      return {
        id: jobDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Job;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

/**
 * Ish e'lonlarini olish (filtr bilan)
 */
export const getJobs = async (
  filters?: FilterOptions,
  itemsPerPage: number = 20,
): Promise<Job[]> => {
  checkFirebaseConfig();
  try {
    // Firestore composite index talab qilmasligi uchun query'ni optimallashtirish
    // Avval orderBy, keyin where - bu index talab qilmaydi
    // Yoki index yaratish kerak: status == 'active' + orderBy('createdAt')
    
    // Yondashuv 1: OrderBy'ni olib tashlash va client-side sorting
    let q = query(collection(db!, 'jobs'), where('status', '==', 'active'));

    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }

    if (filters?.region) {
      q = query(q, where('region', '==', filters.region));
    }

    if (filters?.employmentType) {
      q = query(q, where('employmentType', '==', filters.employmentType));
    }

    // Limit qo'shamiz (index talab qilmasligi uchun orderBy'ni olib tashlaymiz)
    q = query(q, limit(itemsPerPage * 2)); // Ko'proq olish va client-side sort qilish

    const querySnapshot = await getDocs(q);
    const jobs: Job[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      jobs.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Job);
    });

    // Client-side sorting (createdAt bo'yicha)
    jobs.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    // Limit qo'llash
    const sortedJobs = jobs.slice(0, itemsPerPage);

    // Agar searchQuery bo'lsa, client-side filtering
    if (filters?.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      return sortedJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.companyName?.toLowerCase().includes(searchLower),
      );
    }

    return sortedJobs;
  } catch (error: any) {
    // Firestore permissions xatosi bo'lsa, foydalanuvchiga tushuntirish
    if (error?.code === 'permission-denied') {
      console.error(
        'Firestore permissions xatosi. ' +
        'Firebase Console\'da Firestore Rules\'ni tekshiring. ' +
        'Test mode\'da qo\'shib ko\'ring yoki authenticated users uchun ruxsat bering.',
      );
      // Demo mode'ga o'tish yoki bo'sh ro'yxat qaytarish
      return [];
    }
    // Firestore index xatosi bo'lsa, foydalanuvchiga tushuntirish
    if (error?.code === 'failed-precondition' || error?.message?.includes('index')) {
      console.warn(
        'Firestore index xatosi. ' +
        'Firebase Console\'da index yaratish kerak yoki query\'ni optimallashtirish. ' +
        'Hozir client-side sorting ishlatilmoqda.',
      );
      // Client-side sorting bilan davom etish
      return [];
    }
    throw error;
  }
};

/**
 * Foydalanuvchining ish e'lonlarini olish
 */
export const getUserJobs = async (userId: string): Promise<Job[]> => {
  checkFirebaseConfig();
  try {
    // Composite index talab qilmasligi uchun orderBy'ni olib tashlaymiz
    // va client-side sorting ishlatamiz
    const q = query(
      collection(db!, 'jobs'),
      where('postedBy', '==', userId),
      // orderBy'ni olib tashlaymiz - client-side sorting ishlatamiz
    );
    const querySnapshot = await getDocs(q);
    const jobs: Job[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      jobs.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Job);
    });

    // Client-side sorting (createdAt bo'yicha - eng yangisi birinchi)
    jobs.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    return jobs;
  } catch (error: any) {
    // Firestore permissions xatosi bo'lsa
    if (error?.code === 'permission-denied') {
      console.error(
        'Firestore permissions xatosi. ' +
        'Firebase Console\'da Firestore Rules\'ni tekshiring.',
      );
      return [];
    }
    // Firestore index xatosi bo'lsa (eski kod uchun)
    if (error?.code === 'failed-precondition' || error?.message?.includes('index')) {
      console.warn(
        'Firestore index xatosi. ' +
        'Client-side sorting ishlatilmoqda, lekin index yaratish tavsiya etiladi.',
      );
      return [];
    }
    throw error;
  }
};

