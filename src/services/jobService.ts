/**
 * Ish e'lonlari servisi
 * 
 * Firebase yoqilgan bo'lsa Firebase versiyasini, aks holda Mock versiyasini ishlatadi
 */

// Ikkala versiyani ham import qilish
import * as firebaseJobs from './firebaseJobService';
import * as mockJobs from './mockJobService';

// Firebase API key mavjud bo'lsa Firebase, aks holda Mock
const useFirebase = !!process.env.EXPO_PUBLIC_FIREBASE_API_KEY;

// Runtime'da tanlash
const jobService = useFirebase ? firebaseJobs : mockJobs;

// Re-export
export const createJob = jobService.createJob;
export const deleteJob = jobService.deleteJob;
export const getJob = jobService.getJob;
export const getJobs = jobService.getJobs;
export const getUserJobs = jobService.getUserJobs;
export const updateJob = jobService.updateJob;
