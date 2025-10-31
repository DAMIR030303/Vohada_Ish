/**
 * Mock Providers test
 * 
 * @description Mock providers exportlarini tekshirish
 */

import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import {
  MockAuthProvider,
  MockJobProvider,
  MockThemeProvider,
  MockTransitionProvider,
} from '../../test-utils/mockProviders';

describe('Mock Providers', () => {
  it('barcha mock providerlar mavjud bo\'lishi kerak', () => {
    expect(MockAuthProvider).toBeDefined();
    expect(MockJobProvider).toBeDefined();
    expect(MockThemeProvider).toBeDefined();
    expect(MockTransitionProvider).toBeDefined();
  });

  it('MockAuthProvider render qilish kerak', () => {
    const TestComponent = () => <Text>Test</Text>;
    const { getByText } = render(
      <MockAuthProvider>
        <TestComponent />
      </MockAuthProvider>
    );
    expect(getByText('Test')).toBeTruthy();
  });

  it('MockJobProvider render qilish kerak', () => {
    const TestComponent = () => <Text>Test</Text>;
    const { getByText } = render(
      <MockJobProvider>
        <TestComponent />
      </MockJobProvider>
    );
    expect(getByText('Test')).toBeTruthy();
  });

  it('MockThemeProvider render qilish kerak', () => {
    const TestComponent = () => <Text>Test</Text>;
    const { getByText } = render(
      <MockThemeProvider>
        <TestComponent />
      </MockThemeProvider>
    );
    expect(getByText('Test')).toBeTruthy();
  });

  it('MockTransitionProvider render qilish kerak', () => {
    const TestComponent = () => <Text>Test</Text>;
    const { getByText } = render(
      <MockTransitionProvider>
        <TestComponent />
      </MockTransitionProvider>
    );
    expect(getByText('Test')).toBeTruthy();
  });
});

