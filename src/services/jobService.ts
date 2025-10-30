/**
 * Ish e'lonlari servisi
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
 * Yangi ish e'lonini yaratish
 */
export const createJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'jobs'), {
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
  try {
    await updateDoc(doc(db, 'jobs', jobId), {
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
  try {
    await deleteDoc(doc(db, 'jobs', jobId));
  } catch (error) {
    throw error;
  }
};

/**
 * Bitta ish e'lonini olish
 */
export const getJob = async (jobId: string): Promise<Job | null> => {
  try {
    const jobDoc = await getDoc(doc(db, 'jobs', jobId));
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
  try {
    let q = query(collection(db, 'jobs'), where('status', '==', 'active'));

    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }

    if (filters?.region) {
      q = query(q, where('region', '==', filters.region));
    }

    if (filters?.employmentType) {
      q = query(q, where('employmentType', '==', filters.employmentType));
    }

    q = query(q, orderBy('createdAt', 'desc'), limit(itemsPerPage));

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

    // Agar searchQuery bo'lsa, client-side filtering
    if (filters?.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      return jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.companyName?.toLowerCase().includes(searchLower),
      );
    }

    return jobs;
  } catch (error) {
    throw error;
  }
};

/**
 * Foydalanuvchining ish e'lonlarini olish
 */
export const getUserJobs = async (userId: string): Promise<Job[]> => {
  try {
    const q = query(
      collection(db, 'jobs'),
      where('postedBy', '==', userId),
      orderBy('createdAt', 'desc'),
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

    return jobs;
  } catch (error) {
    throw error;
  }
};

