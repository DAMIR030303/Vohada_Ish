/**
 * LanguageContext testlari
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import React from 'react';

import { LanguageProvider, useLanguage } from '../LanguageContext';

describe('LanguageContext', () => {
  it('should provide default language as uz', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LanguageProvider>{children}</LanguageProvider>
    );

    const { result } = renderHook(() => useLanguage(), { wrapper });

    await waitFor(() => {
      expect(result.current.language).toBe('uz');
    });
  });

  it('should allow changing language', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LanguageProvider>{children}</LanguageProvider>
    );

    const { result } = renderHook(() => useLanguage(), { wrapper });

    await act(async () => {
      await result.current.setLanguage('en');
    });

    await waitFor(() => {
      expect(result.current.language).toBe('en');
    });
  });

  it('should translate keys correctly', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LanguageProvider>{children}</LanguageProvider>
    );

    const { result } = renderHook(() => useLanguage(), { wrapper });

    await waitFor(() => {
      const translation = result.current.t('common.appName');
      expect(typeof translation).toBe('string');
    });
  });
});
