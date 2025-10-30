/**
 * Ish kategoriyalari
 */

export const categories = [
  {
    id: 'it',
    name: 'IT va Dasturlash',
    icon: '💻',
    subcategories: [
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer',
      'Mobile Developer',
      'DevOps',
      'QA Tester',
      'UI/UX Designer',
      'Data Scientist',
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing va Reklama',
    icon: '📢',
    subcategories: [
      'Digital Marketing',
      'SEO Specialist',
      'SMM Manager',
      'Content Manager',
      'Brand Manager',
      'Marketing Manager',
    ],
  },
  {
    id: 'sales',
    name: 'Sotish va Savdo',
    icon: '💰',
    subcategories: [
      'Sales Manager',
      'Sales Representative',
      'Cashier',
      'Store Manager',
      'Sales Consultant',
    ],
  },
  {
    id: 'education',
    name: 'Ta\'lim',
    icon: '📚',
    subcategories: [
      'O\'qituvchi',
      'Mentor',
      'Tutor',
      'Education Manager',
      'Librarian',
    ],
  },
  {
    id: 'healthcare',
    name: 'Tibbiyot',
    icon: '🏥',
    subcategories: [
      'Shifokor',
      'Hamshira',
      'Doktor',
      'Farmatsevt',
      'Veterinar',
    ],
  },
  {
    id: 'finance',
    name: 'Moliya va Hisob',
    icon: '💳',
    subcategories: [
      'Accountant',
      'Financial Analyst',
      'Auditor',
      'Bank Employee',
      'Cashier',
    ],
  },
  {
    id: 'construction',
    name: 'Qurilish',
    icon: '🏗️',
    subcategories: [
      'Architect',
      'Engineer',
      'Construction Worker',
      'Foreman',
      'Surveyor',
    ],
  },
  {
    id: 'transport',
    name: 'Transport va Logistika',
    icon: '🚚',
    subcategories: [
      'Driver',
      'Logistics Manager',
      'Dispatcher',
      'Warehouse Worker',
      'Courier',
    ],
  },
  {
    id: 'hospitality',
    name: 'Mehmonxona va Restoran',
    icon: '🍽️',
    subcategories: [
      'Waiter',
      'Cook',
      'Hotel Manager',
      'Receptionist',
      'Bartender',
    ],
  },
  {
    id: 'admin',
    name: 'Ma\'muriyat',
    icon: '📋',
    subcategories: [
      'Office Manager',
      'Secretary',
      'Administrator',
      'HR Manager',
      'Receptionist',
    ],
  },
  {
    id: 'production',
    name: 'Ishlab chiqarish',
    icon: '🏭',
    subcategories: [
      'Production Worker',
      'Quality Controller',
      'Machine Operator',
      'Supervisor',
    ],
  },
  {
    id: 'other',
    name: 'Boshqa',
    icon: '🔧',
    subcategories: ['Other'],
  },
] as const;

export type CategoryId = (typeof categories)[number]['id'];

