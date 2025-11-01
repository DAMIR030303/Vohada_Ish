/**
 * LoginScreen testlari
 */

import React from 'react';

import { renderWithProviders } from '../../test-utils/testUtils';
import { LoginScreen } from '../LoginScreen';

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    user: null,
    loading: false,
  }),
}));

describe('LoginScreen', () => {
  it('should render without crashing', () => {
    const { UNSAFE_getByType } = renderWithProviders(<LoginScreen />);
    expect(UNSAFE_getByType).toBeTruthy();
  });
});
