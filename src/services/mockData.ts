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

// Mock ish e'lonlari - To'liq ro'yxat
export const mockJobs: Job[] = [
  // IT kategoriyasi
  {
    id: '1',
    title: 'Frontend Developer',
    description:
      "React Native va TypeScript bilim talab qilinadi. Tajriba: 2+ yil. Portfolio ko'rsatish talab qilinadi.",
    category: 'IT',
    region: 'Toshkent',
    district: 'Yunusobod',
    salary: {
      min: 8000000,
      max: 12000000,
      currency: 'UZS',
    },
    employmentType: 'full-time',
    companyName: 'TechVentures',
    contactPhone: '+998901234567',
    contactEmail: 'hr@techventures.uz',
    postedBy: '1',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Backend Developer',
    description:
      'Node.js, PostgreSQL va cloud architecture tajribasi. Microservices bilan ishlash bilimi kerak.',
    category: 'IT',
    region: 'Toshkent',
    district: 'Chilonzor',
    salary: {
      min: 10000000,
      max: 15000000,
      currency: 'UZS',
    },
    employmentType: 'full-time',
    companyName: 'DevSolutions',
    contactPhone: '+998901234568',
    contactEmail: 'info@devsolutions.uz',
    postedBy: '1',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000), // 1 soat oldin
    updatedAt: new Date(Date.now() - 3600000),
  },
  {
    id: '3',
    title: 'Mobile App Developer',
    description:
      'React Native, iOS va Android ishlab chiqish. App Store va Play Store tajribasi kerak.',
    category: 'IT',
    region: 'Toshkent',
    district: "Mirzo Ulug'bek",
    salary: {
      min: 9000000,
      max: 14000000,
      currency: 'UZS',
    },
    employmentType: 'full-time',
    companyName: 'MobileFirst',
    contactPhone: '+998901234569',
    contactEmail: 'jobs@mobilefirst.uz',
    postedBy: '1',
    status: 'active',
    createdAt: new Date(Date.now() - 7200000), // 2 soat oldin
    updatedAt: new Date(Date.now() - 7200000),
  },
  // Dizayn kategoriyasi
  {
    id: '4',
    title: 'UX/UI Designer',
    description:
      "Mobile va web dizayn. Figma, Adobe XD bilim talab qilinadi. Portfolio ko'rsatish majburiy.",
    category: 'Dizayn',
    region: 'Toshkent',
    district: 'Yunusobod',
    salary: {
      min: 6000000,
      max: 9000000,
      currency: 'UZS',
    },
    employmentType: 'full-time',
    companyName: 'Design Studio Pro',
    contactPhone: '+998901234570',
    contactEmail: 'info@designstudio.uz',
    postedBy: '1',
    status: 'active',
    createdAt: new Date(Date.now() - 1800000), // 30 daqiqa oldin
    updatedAt: new Date(Date.now() - 1800000),
  },
  {
    id: '5',
    title: 'Graphic Designer',
    description:
      'Logo, brending va reklama materiallari ishlab chiqish. Creative dizayn qobiliyat kerak.',
    category: 'Dizayn',
    region: 'Toshkent',
    district: 'Shayxontohur',
    salary: {
      min: 5000000,
      max: 8000000,
      currency: 'UZS',
    },
    employmentType: 'part-time',
    companyName: 'Creative Agency',
    contactPhone: '+998901234571',
    contactEmail: 'design@creative.uz',
    postedBy: '1',
    status: 'active',
    createdAt: new Date(Date.now() - 10800000), // 3 soat oldin
    updatedAt: new Date(Date.now() - 10800000),
  },
  // Marketing kategoriyasi
  {
    id: '6',
    title: 'Digital Marketing Manager',
    description:
      'SMM, SEO, Google Ads, Meta Ads tajribasi. Analytics va reporting bilimi kerak.',
    category: 'Marketing',
    region: 'Toshkent',
    district: 'Yakkasaroy',
    salary: {
      min: 7000000,
      max: 10000000,
      currency: 'UZS',
    },
    employmentType: 'full-time',
    companyName: 'Digital Agency',
    contactPhone: '+998901234572',
    contactEmail: 'hr@digitalagency.uz',
    postedBy: '1',
    status: 'active',
    createdAt: new Date(Date.now() - 900000), // 15 daqiqa oldin
    updatedAt: new Date(Date.now() - 900000),
  },
  {
    id: '7',
    title: 'SMM Manager',
    description:
      'Social media marketing. Content creation va community management tajribasi kerak.',
    category: 'Marketing',
    region: 'Toshkent',
    district: 'Olmazor',
    salary: {
      min: 4000000,
      max: 6000000,
      currency: 'UZS',
    },
    employmentType: 'full-time',
    companyName: 'Media Group',
    contactPhone: '+998901234573',
    contactEmail: 'info@mediagroup.uz',
    postedBy: '1',
    status: 'active',
    createdAt: new Date(Date.now() - 5400000), // 1.5 soat oldin
    updatedAt: new Date(Date.now() - 5400000),
  },
  // Sotish va Savdo
  {
    id: '8',
    title: 'Sales Manager',
    description:
      "B2B sotish tajribasi. Yaxshi kommunikatsiya qobiliyatlari va maqsadlarga erishish ko'nikmasi.",
    category: 'Sales',
    region: 'Toshkent',
    district: 'Sergeli',
    salary: {
      min: 8000000,
      max: 12000000,
      currency: 'UZS',
    },
    employmentType: 'full-time',
    companyName: "SalesForce O'z",
    contactPhone: '+998901234574',
    contactEmail: 'sales@salesforce.uz',
    postedBy: '1',
    status: 'active',
    createdAt: new Date(Date.now() - 10800000), // 3 soat oldin
    updatedAt: new Date(Date.now() - 10800000),
  },
  {
    id: '9',
    title: 'Retail Sales Representative',
    description:
      "Magazinda sotish. Xizmat ko'rsatish ko'nikmalari kerak. Ish tajribasi talab qilinmaydi.",
    category: 'Sales',
    region: 'Toshkent',
    district: 'Yashnobod',
    salary: {
      min: 3000000,
      max: 5000000,
      currency: 'UZS',
    },
    employmentType: 'full-time',
    companyName: 'UniRed',
    contactPhone: '+998901234575',
    contactEmail: 'jobs@unired.uz',
    postedBy: '1',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000), // 1 soat oldin
    updatedAt: new Date(Date.now() - 3600000),
  },
  // Ta'lim
  {
    id: '10',
    title: "Ingliz tili o'qituvchisi",
    description:
      'IELTS va IELTS preparation tajribasi. Onlayn dars berish qobiliyati kerak.',
    category: 'Education',
    region: 'Toshkent',
    district: 'Yunusobod',
    salary: {
      min: 5000000,
      max: 8000000,
      currency: 'UZS',
    },
    employmentType: 'part-time',
    companyName: 'English Academy',
    contactPhone: '+998901234576',
    contactEmail: 'teach@englishacademy.uz',
    postedBy: '1',
    status: 'active',
    createdAt: new Date(Date.now() - 7200000), // 2 soat oldin
    updatedAt: new Date(Date.now() - 7200000),
  },
  // Moliya
  {
    id: '11',
    title: 'Accountant',
    description:
      '1C, buxgalteriya hisobi tajribasi. Soliqlar bilan ishlash bilimi kerak.',
    category: 'Finance',
    region: 'Toshkent',
    district: 'Yakkasaroy',
    salary: {
      min: 6000000,
      max: 9000000,
      currency: 'UZS',
    },
    employmentType: 'full-time',
    companyName: 'Finance Consulting',
    contactPhone: '+998901234577',
    contactEmail: 'hr@financeconsulting.uz',
    postedBy: '1',
    status: 'active',
    createdAt: new Date(Date.now() - 2700000), // 45 daqiqa oldin
    updatedAt: new Date(Date.now() - 2700000),
  },
  // Ma'muriyat
  {
    id: '12',
    title: 'Office Manager',
    description:
      'Ofis boshqaruvi, xujjatlar bilan ishlash, meeting tartibga solish. Rus va Ingliz tillari.',
    category: 'Admin',
    region: 'Toshkent',
    district: "Mirzo Ulug'bek",
    salary: {
      min: 5000000,
      max: 7000000,
      currency: 'UZS',
    },
    employmentType: 'full-time',
    companyName: 'Business Center',
    contactPhone: '+998901234578',
    contactEmail: 'info@businesscenter.uz',
    postedBy: '1',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000), // 1 soat oldin
    updatedAt: new Date(Date.now() - 3600000),
  },
];

// Featured job type
export interface FeaturedJob extends Job {
  featured: boolean;
  badge?: 'TOP' | 'YANGI' | 'PREMIUM';
}

// Featured (mashhur) ish e'lonlari
export const featuredJobs: FeaturedJob[] = mockJobs
  .slice(0, 5)
  .map((job, index) => {
    const badges: ('TOP' | 'YANGI' | 'PREMIUM')[] = [
      'TOP',
      'YANGI',
      'PREMIUM',
      'TOP',
      'YANGI',
    ];
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

  return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};
