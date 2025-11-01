/**
 * LottieEmptyState komponent testlari
 */

import React from 'react';

import { renderWithProviders } from '../../test-utils/testUtils';
import { LottieEmptyState } from '../LottieEmptyState';

describe('LottieEmptyState Component', () => {
  it('should render without crashing', () => {
    const { UNSAFE_getByType } = renderWithProviders(
      <LottieEmptyState title="No items found" />,
    );
    expect(UNSAFE_getByType).toBeTruthy();
  });
});
