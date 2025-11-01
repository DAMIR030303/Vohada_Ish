# Cursor Rule: Auto Test Setup for VohadaIsh

## 🎯 Maqsad

VohadaIsh React Native + TypeScript loyihasi uchun to'liq avtomatik test tizimini o'rnatish va sozlash.

## 📋 Loyiha Tuzilmasi

```
VohadaIsh/
├── src/
│   ├── screens/          # Barcha ekranlar
│   ├── components/       # Qayta ishlatiladigan komponentlar
│   ├── services/         # Backend xizmatlar
│   ├── context/          # React Context (State)
│   ├── utils/            # Helper functions
│   ├── i18n/             # Tarjima fayllari (uz, en, ru)
│   └── __tests__/        # Test fayllar
├── e2e/                  # E2E testlar (Detox)
├── jest.config.js        # Jest konfiguratsiyasi
├── detox.config.js       # Detox konfiguratsiyasi
├── .eslintrc.js          # ESLint qoidalari
├── tsconfig.json         # TypeScript sozlamalari
└── .husky/               # Git hooks (pre-commit, pre-push)
```

## 🔧 O'rnatilgan Test Tizimlari

### 1. Unit Test: Jest + React Native Testing Library

- **Konfiguratsiya:** `jest.config.js`
- **Setup:** `jest.setup.js`
- **Coverage:** HTML, LCOV, JSON formats
- **Thresholds:** Branches 15%, Lines 25%, Functions 25%

### 2. E2E Test: Detox

- **Konfiguratsiya:** `detox.config.js`
- **Test fayllar:** `e2e/**/*.e2e.ts`
- **Platformalar:** Android emulator, iOS simulator

### 3. Type Check: TypeScript

- **Komanda:** `pnpm run typecheck`
- **Strict mode:** ✅ `strict: true`
- **Module resolution:** `bundler`

### 4. Lint Check: ESLint + Prettier

- **Konfiguratsiya:** `.eslintrc.js`
- **Qoidalar:** TypeScript, React, React Hooks, Import order
- **Auto-fix:** Pre-commit hook'da

### 5. Pre-commit: Husky + Lint-staged

- **Hook:** `.husky/pre-commit`
- **Qiladigan ishlar:**
  - Lint-staged (faqat o'zgargan fayllar)
  - TypeScript check
  - Jest testlar

### 6. Pre-push: To'liq tekshiruv

- **Hook:** `.husky/pre-push`
- **Qiladigan ishlar:**
  - TypeScript check
  - ESLint
  - Jest testlar

## 🤖 MCP Rollar

### test.setup

**Fayl:** `.cursor/mcp/test.setup.mcp.json`

- O'rnatadi barcha test dependency'larni
- Yaratadi konfiguratsiya fayllarni
- Sozlaydi Jest, Detox, ESLint, Husky

### test.runner

**Fayl:** `.cursor/mcp/test.runner.mcp.json`

- Ishga tushiradi barcha testlarni
- Yaratadi markdown hisobot
- Bajaradi: lint → typecheck → test → e2e

### test.guard

**Fayl:** `.cursor/mcp/test.guard.mcp.json`

- Commit'dan oldin tekshiradi
- Agar test yiqilsa, commit'ni bloklaydi
- Pre-commit hook'da ishlaydi

### test.reporter

**Fayl:** `.cursor/mcp/test.reporter.mcp.json`

- Formatlaydi test natijalarini
- Yaratadi markdown hisobot
- Ko'rsatadi coverage ma'lumotlarni

## 📝 Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --coverage --ci --maxWorkers=2",
    "e2e": "detox test --configuration android.emu.debug",
    "e2e:ios": "detox test --configuration ios.sim.debug",
    "e2e:build:android": "detox build --configuration android.emu.debug",
    "e2e:build:ios": "detox build --configuration ios.sim.debug",
    "lint": "eslint . --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "precommit": "npm run lint && npm run typecheck && npm test"
  }
}
```

## 🎯 Cursor AI Amallari

### Loyiha aniqlash

1. **Loyiha turi:** React Native + TypeScript
2. **Package manager:** pnpm
3. **Framework:** Expo
4. **Test framework:** Jest + Detox

### MCP rollarni bajarish

#### test.setup

```bash
pnpm install --save-dev jest @testing-library/react-native @testing-library/jest-native @types/jest jest-circus detox eslint prettier husky lint-staged typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

#### test.runner

```bash
pnpm run lint && pnpm run typecheck && pnpm test && pnpm run e2e
```

#### test.guard

```bash
pnpm run precommit
```

#### test.reporter

```bash
pnpm test --coverage --json --outputFile=test-report.json
```

### Konfiguratsiya fayllarni yaratish

1. **jest.config.js** - ✅ Mavjud
2. **detox.config.js** - ✅ Yaratilgan
3. **.eslintrc.js** - ✅ Mavjud
4. **tsconfig.json** - ✅ Mavjud
5. **.husky/pre-commit** - ✅ Mavjud va yangilangan
6. **.husky/pre-push** - ✅ Mavjud

### Test fayllarni yaratish

Cursor avtomatik quyidagi test fayllarni yaratadi:

- `src/components/__tests__/JobCard.test.tsx`
- `src/components/__tests__/SearchBar.test.tsx`
- `src/services/__tests__/authService.test.ts`
- `src/services/__tests__/jobService.test.ts`
- `src/utils/__tests__/validation.test.ts`
- `e2e/*.e2e.ts` (E2E testlar)

## ✅ Tekshiruvlar

### Yakuniy tekshiruv (Cursor AI bajaradi)

```bash
# 1. Lint
pnpm run lint

# 2. Type check
pnpm run typecheck

# 3. Unit testlar
pnpm test

# 4. E2E testlar (ixtiyoriy, emulator kerak)
pnpm run e2e:build:android  # Birinchi marta build qilish kerak
pnpm run e2e
```

## 🎯 Natija

✅ Barcha test tizimlari o'rnatilgan va sozlangan:

- Jest + React Native Testing Library
- Detox (E2E)
- TypeScript type checking
- ESLint + Prettier
- Husky + Lint-staged
- MCP rollar (.cursor/mcp/\*.json)
- Cursor rules (.cursor/rules/auto_test_setup.md)

✅ Pre-commit hook ishlamoqda va commit'dan oldin tekshiradi

✅ CI/CD ga tayyor

## 📚 Qo'shimcha Ma'lumot

- **Test yozish:** `src/**/__tests__/*.test.{ts,tsx}` formatida
- **E2E test yozish:** `e2e/*.e2e.ts` formatida
- **Coverage ko'rish:** `pnpm test:coverage` va `coverage/index.html` ochish
- **Pre-commit hook'ni o'tkazish:** Agar test yiqilsa, commit bloklanadi
