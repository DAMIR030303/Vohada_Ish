/**
 * JobCard komponent testlari
 */

import React from 'react';

import { renderWithProviders } from '../../test-utils/testUtils';
import { Job } from '../../types';
import { JobCard } from '../JobCard';

const mockJob: Job = {
  id: 'job-1',
  title: 'Senior React Native Developer',
  description: 'We are looking for an experienced React Native developer',
  companyName: 'Tech Startup Inc',
  category: 'IT',
  region: 'Toshkent shahri',
  district: 'Chilonzor tumani',
  employmentType: 'full-time',
  salary: {
    min: 5000000,
    max: 8000000,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  postedBy: 'user-123',
  applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  requiredSkills: ['React Native', 'TypeScript'],
  requiredExperience: 3,
  responsibilities: ['Develop mobile apps', 'Code review'],
  benefits: ['Health insurance', 'Remote work'],
  contactEmail: 'hr@company.com',
  contactPhone: '+998901234567',
};

describe('JobCard Component', () => {
  it('should render without crashing', () => {
    const { UNSAFE_getByType } = renderWithProviders(<JobCard job={mockJob} />);
    expect(UNSAFE_getByType).toBeTruthy();
  });
});
