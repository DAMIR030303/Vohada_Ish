/**
 * SkeletonLoader komponent testlari
 */

import { render } from '@testing-library/react-native';
import React from 'react';

import {
  SkeletonLoader,
  JobCardSkeleton,
  SearchBarSkeleton,
  CategoryChipsSkeleton,
} from '../SkeletonLoader';

describe('SkeletonLoader Components', () => {
  describe('SkeletonLoader', () => {
    it('should render with default props', () => {
      const { root } = render(<SkeletonLoader />);
      expect(root).toBeTruthy();
    });

    it('should render with custom width', () => {
      const { root } = render(<SkeletonLoader width={100} />);
      expect(root).toBeTruthy();
    });

    it('should render with custom height', () => {
      const { root } = render(<SkeletonLoader height={50} />);
      expect(root).toBeTruthy();
    });

    it('should render with custom borderRadius', () => {
      const { root } = render(<SkeletonLoader borderRadius={16} />);
      expect(root).toBeTruthy();
    });
  });

  describe('JobCardSkeleton', () => {
    it('should render job card skeleton', () => {
      const { root } = render(<JobCardSkeleton />);
      expect(root).toBeTruthy();
    });
  });

  describe('SearchBarSkeleton', () => {
    it('should render search bar skeleton', () => {
      const { root } = render(<SearchBarSkeleton />);
      expect(root).toBeTruthy();
    });
  });

  describe('CategoryChipsSkeleton', () => {
    it('should render category chips skeleton', () => {
      const { root } = render(<CategoryChipsSkeleton />);
      expect(root).toBeTruthy();
    });
  });
});
