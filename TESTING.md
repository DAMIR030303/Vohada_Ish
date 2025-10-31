# VohadaIsh Test Documentation

## Test Tizimi

VohadaIsh loyihasida to'liq test coverage tizimi sozlangan va faol ishlayapti.

### Test Statistikasi

- **Test Suites**: 20 ta
- **Testlar**: 227 ta (213 passing, 5 skipped, 9 failed)
- **Coverage**: ~26% (davom etish uchun joy bor)

### Test Turlari

1. **Service Tests** (3 ta)
   - firebaseAuthService.test.ts
   - firebaseJobService.test.ts
   - validation.test.ts

2. **Context Tests** (3 ta)
   - AuthContext.test.tsx (10 passing, 5 skipped)
   - JobContext.test.tsx (100% coverage!)
   - TransitionContext.test.tsx (97% coverage)

3. **Utils Tests** (5 ta)
   - formatters.test.ts
   - validation.test.ts
   - responsive.test.ts
   - soundEffects.test.ts
   - screenTransitions.test.ts

4. **Component Tests** (2 ta)
   - Button.test.tsx (90% coverage)
   - Mock providers va services

### Testlarni Ishga Tushirish

\`\`\`bash
# Barcha testlar
npm test

# Coverage bilan
npm run test:coverage

# Watch mode (development)
npm run test:watch

# CI mode
npm run test:ci
\`\`\`

### Git Hooks

- **pre-commit**: ESLint va Prettier
- **pre-push**: TypeCheck + Lint + Tests + Coverage

### Test Yozish

Test yozish uchun \`src/__tests__/utils/testUtils.tsx\` dan foydalaning:

\`\`\`typescript
import { renderWithProviders, createMockJob } from '@/__tests__/utils/testUtils';

it('test nomi', () => {
  const mockJob = createMockJob();
  const { getByText } = renderWithProviders(<Component />);
  expect(getByText('Title')).toBeTruthy();
});
\`\`\`

### Coverage Thresholds

- Global: 25% (statements, branches, functions, lines)
- Critical files: 85-100%
  - JobContext: 100%
  - TransitionContext: 97%
  - validation: 95%

## Keyingi Qadamlar

1. Screen testlarini qo'shish (11 ta)
2. Qolgan component testlari (14 ta)
3. Integration testlar (3 ta)
4. Coverage 80%+ ga yetkazish

