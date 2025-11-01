/**
 * Mock Services test
 *
 * @description Mock services exportlarini tekshirish
 */

import {
  mockHaptics,
  mockSoundEffects,
  mockFirebaseAuth,
  mockFirestore,
  mockAsyncStorage,
  mockNavigation,
} from '../../test-utils/mockServices';

describe('Mock Services', () => {
  it("barcha mock exportlar mavjud bo'lishi kerak", () => {
    expect(mockHaptics).toBeDefined();
    expect(mockSoundEffects).toBeDefined();
    expect(mockFirebaseAuth).toBeDefined();
    expect(mockFirestore).toBeDefined();
    expect(mockAsyncStorage).toBeDefined();
    expect(mockNavigation).toBeDefined();
  });

  it("mockHaptics funksiyalarga ega bo'lishi kerak", () => {
    expect(mockHaptics.impactAsync).toBeDefined();
    expect(mockHaptics.notificationAsync).toBeDefined();
    expect(mockHaptics.selectionAsync).toBeDefined();
  });

  it("mockSoundEffects funksiyalarga ega bo'lishi kerak", () => {
    expect(mockSoundEffects.tap).toBeDefined();
    expect(mockSoundEffects.success).toBeDefined();
    expect(mockSoundEffects.error).toBeDefined();
  });
});
