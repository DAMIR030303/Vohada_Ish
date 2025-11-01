/**
 * FilterModal komponent testlari
 */

import React from 'react';

import { renderWithProviders } from '../../test-utils/testUtils';
import { FilterOptions } from '../../types';
import { FilterModal } from '../FilterModal';

describe('FilterModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnApplyFilters = jest.fn();
  const defaultFilters: FilterOptions = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { UNSAFE_getByType } = renderWithProviders(
      <FilterModal
        visible={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
      />,
    );
    expect(UNSAFE_getByType).toBeTruthy();
  });
});
