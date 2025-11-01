/**
 * CategoryChip komponent testlari
 */

import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { CategoryChip } from '../CategoryChip';

const mockCategory = {
  id: 'IT',
  name: 'IT',
  icon: '💻',
};

describe('CategoryChip Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render category chip with name and icon', () => {
    const { getByText } = render(
      <CategoryChip category={mockCategory} onPress={mockOnPress} />,
    );

    expect(getByText('IT')).toBeTruthy();
    expect(getByText('💻')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const { getByText } = render(
      <CategoryChip category={mockCategory} onPress={mockOnPress} />,
    );

    const chip = getByText('IT');
    fireEvent.press(chip);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should show selected state', () => {
    const { getByText } = render(
      <CategoryChip category={mockCategory} selected onPress={mockOnPress} />,
    );

    expect(getByText('IT')).toBeTruthy();
  });

  it('should show unselected state by default', () => {
    const { getByText } = render(
      <CategoryChip category={mockCategory} onPress={mockOnPress} />,
    );

    expect(getByText('IT')).toBeTruthy();
  });
});
