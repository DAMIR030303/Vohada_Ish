/**
 * Mock data - Demo uchun
 */

import { FilterOptions, Job, User } from '../types';

// Mock foydalanuvchilar
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    fullName: 'Demo Foydalanuvchi',
    phone: '+998901234567',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Mock ish e'lonlari
export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    description: 'React Native va TypeScript bilim talab qilinadi. Tajriba: 2+ yil.',
    category: 'IT',
    region: 'Toshkent',
    district: 'Yunusobod',
    salary: {
      min: 5000000,
      max: 8000000,
      currency: 'UZS',
    },
    employmentType: 'full-time',
    companyName: 'Tech Company',
    contactPhone: '+998901234567',
    contactEmail: 'hr@techcompany.uz',
    postedBy: '1',
    status: 'active',
    createdAt: new Date('2024-10-25'),
    updatedAt: new Date('2024-10-25'),
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    description: 'Mobile app dizayn uchun kreativ dizayner qidiryapmiz.',
    category: 'Dizayn',
    region: 'Toshkent',
    district: 'Chilonzor',
    salary: {
      min: 4000000,
      max: 6000000,
      currency: 'UZS',
    },
    employmentType: 'full-time',
    companyName: 'Design Studio',
    contactPhone: '+998901234568',
    contactEmail: 'info@designstudio.uz',
    postedBy: '1',
    status: 'active',
    createdAt: new Date('2024-10-24'),
    updatedAt: new Date('2024-10-24'),
  },
  {
    id: '3',
    title: 'Backend Developer',
    description: 'Node.js va MongoDB bilim talab qilinadi.',
    category: 'IT',
    region: 'Samarqand',
    salary: {
      min: 6000000,
      max: 10000000,
      currency: 'UZS',
    },
    employmentType: 'full-time',
    companyName: 'Dev Company',
    contactPhone: '+998901234569',
    postedBy: '1',
    status: 'active',
    createdAt: new Date('2024-10-23'),
    updatedAt: new Date('2024-10-23'),
  },
  {
    id: '4',
    title: 'Marketing Manager',
    description: 'SMM va digital marketing bo\'yicha tajribali mutaxassis.',
    category: 'Marketing',
    region: 'Toshkent',
    district: 'Mirzo Ulug\'bek',
    salary: {
      min: 5000000,
      max: 7000000,
      currency: 'UZS',
    },
    employmentType: 'full-time',
    companyName: 'Marketing Agency',
    contactEmail: 'jobs@marketing.uz',
    postedBy: '1',
    status: 'active',
    createdAt: new Date('2024-10-22'),
    updatedAt: new Date('2024-10-22'),
  },
];

// Featured job type
export interface FeaturedJob extends Job {
  featured: boolean;
  badge?: 'TOP' | 'YANGI' | 'PREMIUM';
}

// Featured (mashhur) ish e'lonlari
export const featuredJobs: FeaturedJob[] = mockJobs.slice(0, 5).map((job, index) => {
  const badges: Array<'TOP' | 'YANGI' | 'PREMIUM'> = ['TOP', 'YANGI', 'PREMIUM', 'TOP', 'YANGI'];
  return {
    ...job,
    featured: true,
    badge: badges[index],
  };
});

/**
 * Mock job filtrlash
 */
export const filterMockJobs = (jobs: Job[], filters?: FilterOptions): Job[] => {
  let filtered = [...jobs];

  if (filters?.category) {
    filtered = filtered.filter((job) => job.category === filters.category);
  }

  if (filters?.region) {
    filtered = filtered.filter((job) => job.region === filters.region);
  }

  if (filters?.employmentType) {
    filtered = filtered.filter(
      (job) => job.employmentType === filters.employmentType,
    );
  }

  if (filters?.searchQuery) {
    const searchLower = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (job) =>
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.companyName?.toLowerCase().includes(searchLower),
    );
  }

  return filtered.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
};

