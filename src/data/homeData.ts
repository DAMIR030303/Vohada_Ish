/**
 * Bosh sahifa uchun mock data
 */

import { Company, PromoBanner, Job } from '../types';

/**
 * Ommabop kompaniyalar
 */
export const popularCompanies: Company[] = [
  {
    id: 'uzum',
    name: 'Uzum',
    logo: '🛒',
    description: 'Yetkazib berish xizmati va marketplace',
    jobCount: 24,
  },
  {
    id: 'uzinfocom',
    name: 'Uzinfocom',
    description: 'IT kompaniya va hosting provider',
    jobCount: 18,
  },
  {
    id: 'uztelecom',
    name: 'Uztelecom',
    logo: '📡',
    description: 'Telekommunikatsiya xizmatlari',
    jobCount: 15,
  },
  {
    id: 'paynet',
    name: 'Paynet',
    logo: '💳',
    description: "To'lov tizimi va fintech",
    jobCount: 12,
  },
  {
    id: 'unired',
    name: 'UniRed',
    logo: '🏪',
    description: "Chakana savdo tarmog'i",
    jobCount: 31,
  },
  {
    id: 'goodzone',
    name: 'GoodZone',
    logo: '📱',
    description: 'Elektronika savdo markazi',
    jobCount: 9,
  },
  {
    id: 'artel',
    name: 'Artel',
    logo: '⚡',
    description: 'Texnika ishlab chiqaruvchi',
    jobCount: 22,
  },
];

/**
 * Promo bannerlar
 */
export const promoBanners: PromoBanner[] = [
  {
    id: 'banner-employer',
    title: "Ish e'lonini joylashtiring",
    subtitle: "Minglab nomzodlarni toping va to'g'ri xodimni tanlang",
    lottieAnimation: 'success',
    action: 'postJob',
    backgroundColor: '#1B4332',
  },
  {
    id: 'banner-register',
    title: "Ro'yxatdan o'ting",
    subtitle: "Barcha imkoniyatlardan foydalaning va o'z ishingizni toping",
    lottieAnimation: 'celebration',
    action: 'register',
    backgroundColor: '#40916C',
  },
  {
    id: 'banner-app',
    title: 'Yangi imkoniyatlar',
    subtitle: "Har kuni yangi ish e'lonlari va professional rivojlanish",
    lottieAnimation: 'loading',
    action: 'login',
    backgroundColor: '#2D5A3D',
  },
];

/**
 * Tavsiya etilgan ishlarni olish (user tarixiga asoslangan)
 * Real holatda bu backend API dan keladi
 */
export const getRecommendedJobs = (
  userId: string | undefined,
  allJobs: Job[],
  viewedCategories?: string[],
): Job[] => {
  if (!userId || !allJobs || allJobs.length === 0) {
    return [];
  }

  // Foydalanuvchi ko'rgan kategoriyalar asosida filtrlash
  if (viewedCategories && viewedCategories.length > 0) {
    const recommendedByCategory = allJobs
      .filter((job) => viewedCategories.includes(job.category))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    if (recommendedByCategory.length > 0) {
      return recommendedByCategory;
    }
  }

  // Default: eng yangi 5 ta ishni qaytarish
  return allJobs
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);
};

/**
 * Bugun qo'shilgan ishlar sonini hisoblash
 */
export const getTodayJobsCount = (jobs: Job[]): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return jobs.filter((job) => {
    const jobDate = new Date(job.createdAt);
    jobDate.setHours(0, 0, 0, 0);
    return jobDate.getTime() === today.getTime();
  }).length;
};

/**
 * Noyob kompaniyalar sonini hisoblash
 */
export const getUniqueCompaniesCount = (jobs: Job[]): number => {
  const companyNames = new Set(
    jobs.filter((job) => job.companyName).map((job) => job.companyName),
  );
  return companyNames.size;
};

/**
 * Kompaniya bo'yicha ishlarni filtrlash
 */
export const getJobsByCompany = (jobs: Job[], companyName: string): Job[] => {
  return jobs.filter(
    (job) => job.companyName?.toLowerCase() === companyName.toLowerCase(),
  );
};
