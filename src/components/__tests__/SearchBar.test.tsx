/**
 * SearchBar komponent testlari
 */

import React from 'react';

import { renderWithProviders } from '../../test-utils/testUtils';
import { SearchBar } from '../SearchBar';

// Mock JobProvider
const mockFilters = {
  searchQuery: '',
  category: undefined,
  region: undefined,
  employmentType: undefined,
};

const mockSetFilters = jest.fn();

jest.mock('../../context/JobContext', () => {
  const actual = jest.requireActual('../../context/JobContext');
  return {
    ...actual,
    useJobs: () => ({
      filters: mockFilters,
      setFilters: mockSetFilters,
      jobs: [],
      loading: false,
    }),
  };
});

describe('SearchBar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFilters.searchQuery = '';
  });

  it('should render without crashing', () => {
    const { UNSAFE_getByType } = renderWithProviders(<SearchBar />);
    expect(UNSAFE_getByType).toBeTruthy();
  });
});
