# Test va Ishga Tushirish Skripti

Bu skript loyihani to'liq tekshiradi va ishga tushiradi.

## Qanday Ishlatiladi

### 1. To'g'ridan-to'g'ri

```bash
bash scripts/test-and-start.sh
```

yoki

```bash
./scripts/test-and-start.sh
```

### 2. Package manager orqali

```bash
# pnpm bilan
pnpm run test:full
# yoki
pnpm run qa:check

# npm bilan (pnpm yo'q bo'lsa)
npm run test:full
# yoki
npm run qa:check
```

**Eslatma:** Skript avtomatik ravishda `pnpm` topilmasa, `npm` dan foydalanadi. `npx pnpm` ham qo'llab-quvvatlanadi.

## Nima Qiladi?

Skript quyidagi tekshiruvlarni o'tkazadi:

1. **Tools** - Node.js, pnpm, corepack
2. **Installation** - node_modules, dependencies
3. **package.json scripts** - typecheck, lint, test, format
4. **tsconfig.json** - strict mode, moduleResolution
5. **ESLint** - config, rules (import/order, react-native)
6. **Jest** - config, preset, transformIgnorePatterns
7. **Struktura** - papkalar (src/, features/, shared/, assets/, i18n/)
8. **i18n** - uz.json, en.json, ru.json
9. **Scripts ishga tushirish** - typecheck, lint, test
10. **Husky** - pre-push hook
11. **Env** - .env.example, API_URL
12. **Platform** - Android (gradlew), iOS (Podfile)
13. **Ishga tushirish** - pnpm start (Expo Metro bundler)

## Natijalar

Skript quyidagilarni yaratadi:

- **Hisobot fayli:** `test-report-YYYYMMDD-HHMMSS.md`
- **Log fayllari:**
  - `typecheck.log` - TypeScript tekshiruv logi
  - `lint.log` - ESLint logi
  - `test.log` - Jest test logi
  - `start.log` - Expo start logi

## Hisobot Formati

Hisobot markdown jadval formatida:

| #   | Tekshiruv      | Usul    | Natija | Izoh    |
| --- | -------------- | ------- | ------ | ------- |
| 1   | Node.js mavjud | node -v | PASS   | v18.0.0 |
| 2   | ...            | ...     | ...    | ...     |

## Server

Agar ilova muvaffaqiyatli ishga tushsa:

- Server fon rejimda ishlaydi
- Process ID ko'rsatiladi
- To'xtatish uchun: `kill <PID>`

## Exit Code

- **0** - Barcha tekshiruvlar muvaffaqiyatli (yoki faqat warning'lar)
- **1** - Kamida bitta tekshiruv muvaffaqiyatsiz

## Misol Natija

```
==========================================
🔍 BoshqaruvMobile - To'liq Tekshiruv
==========================================

📦 1. Tools tekshiruvi...
-------------------------
✓ PASS: Node.js mavjud
✓ PASS: pnpm mavjud
...

📊 Hisobot tayyorlanmoqda...
==========================================
✅ Hisobot yaratildi: test-report-20240101-120000.md

==========================================
📋 QISQA XULOSA
==========================================
Jami: 25 tekshiruv
✅ Pass: 23
❌ Fail: 0
⚠️  Warn: 2

🚀 Ilova ishlamoqda (PID: 12345)
📄 To'liq hisobot: test-report-20240101-120000.md
```
