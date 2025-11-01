/**
 * Mock Ish e'lonlari servisi - Demo uchun
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { FilterOptions, Job } from '../types';

import { filterMockJobs, mockJobs } from './mockData';

const JOBS_STORAGE_KEY = '@vohadaish_jobs';

/**
 * AsyncStorage'dan jobs olish
 */
const getStoredJobs = async (): Promise<Job[]> => {
  const jobsJson = await AsyncStorage.getItem(JOBS_STORAGE_KEY);
  if (jobsJson) {
    const jobs = JSON.parse(jobsJson) as Job[];
    // Date string'larni Date object'ga o'zgartirish
    return jobs.map((job) => ({
      ...job,
      createdAt: new Date(job.createdAt),
      updatedAt: new Date(job.updatedAt),
    }));
  }
  // Agar hech narsa yo'q bo'lsa, mock data'ni qaytaramiz
  return mockJobs;
};

/**
 * AsyncStorage'ga jobs saqlash
 */
const saveJobs = async (jobs: Job[]): Promise<void> => {
  await AsyncStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
};

/**
 * Yangi ish e'lonini yaratish
 */
export const createJob = async (
  jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<string> => {
  const jobs = await getStoredJobs();
  const newJob: Job = {
    ...jobData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  jobs.push(newJob);
  await saveJobs(jobs);
  return newJob.id;
};

/**
 * Ish e'lonini yangilash
 */
export const updateJob = async (
  jobId: string,
  updates: Partial<Omit<Job, 'id' | 'createdAt'>>,
): Promise<void> => {
  const jobs = await getStoredJobs();
  const index = jobs.findIndex((job) => job.id === jobId);
  if (index !== -1) {
    jobs[index] = {
      ...jobs[index],
      ...updates,
      updatedAt: new Date(),
    };
    await saveJobs(jobs);
  }
};

/**
 * Ish e'lonini o'chirish
 */
export const deleteJob = async (jobId: string): Promise<void> => {
  const jobs = await getStoredJobs();
  const filtered = jobs.filter((job) => job.id !== jobId);
  await saveJobs(filtered);
};

/**
 * Bitta ish e'lonini olish
 */
export const getJob = async (jobId: string): Promise<Job | null> => {
  const jobs = await getStoredJobs();
  return jobs.find((job) => job.id === jobId) || null;
};

/**
 * Ish e'lonlarini olish (filtr bilan)
 */
export const getJobs = async (
  filters?: FilterOptions,
  itemsPerPage: number = 20,
): Promise<Job[]> => {
  const jobs = await getStoredJobs();
  const activeJobs = jobs.filter((job) => job.status === 'active');
  const filtered = filterMockJobs(activeJobs, filters);
  return filtered.slice(0, itemsPerPage);
};

/**
 * Foydalanuvchining ish e'lonlarini olish
 */
export const getUserJobs = async (userId: string): Promise<Job[]> => {
  const jobs = await getStoredJobs();
  return jobs
    .filter((job) => job.postedBy === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};
