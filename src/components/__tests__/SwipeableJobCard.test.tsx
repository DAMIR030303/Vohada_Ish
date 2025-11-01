/**
 * SwipeableJobCard komponent testlari
 */

import React from 'react';

import { renderWithProviders } from '../../test-utils/testUtils';
import { Job } from '../../types';
import { SwipeableJobCard } from '../SwipeableJobCard';

const mockJob: Job = {
  id: 'job-1',
  title: 'Senior React Native Developer',
  description: 'We are looking for an experienced developer',
  companyName: 'Tech Startup Inc',
  category: 'IT',
  region: 'Toshkent shahri',
  district: 'Chilonzor tumani',
  employmentType: 'full-time',
  salary: { min: 5000000, max: 8000000 },
  createdAt: new Date(),
  updatedAt: new Date(),
  postedBy: 'user-123',
  applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  requiredSkills: ['React Native'],
  requiredExperience: 3,
  responsibilities: ['Develop apps'],
  benefits: ['Health insurance'],
  contactEmail: 'hr@company.com',
  contactPhone: '+998901234567',
};

describe('SwipeableJobCard Component', () => {
  it('should render without crashing', () => {
    const { UNSAFE_getByType } = renderWithProviders(
      <SwipeableJobCard job={mockJob}>
        <React.Fragment>Test Content</React.Fragment>
      </SwipeableJobCard>,
    );
    expect(UNSAFE_getByType).toBeTruthy();
  });
});
