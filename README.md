# VohadaIsh - Ish e'lonlari mobil ilovasi

React Native + TypeScript + Expo bilan yaratilgan ish e'lonlari mobil ilovasi.

## Texnologiyalar

- **React Native** - Mobil ilova framework
- **Expo** - Development platform
- **TypeScript** - Type-safe JavaScript
- **Firebase** - Backend (Authentication, Firestore, Storage)
- **React Navigation** - Navigation
- **React Native Paper** - UI komponentlar
- **Zustand** (kechroq qo'shiladi) - State management

## O'rnatish

1. Dependencies o'rnatish:

```bash
npm install
```

2. Ilovani ishga tushirish (Demo mode - Firebase'siz):

```bash
npm start
```

### Demo Mode (Default)

Ilova hozir **demo mode**'da ishlaydi - Firebase'siz, AsyncStorage bilan. Bu demo uchun yetarli:

- ✅ Ro'yxatdan o'tish va kirish ishlaydi
- ✅ Ish e'lonlarini ko'rish va qo'shish mumkin
- ✅ Barcha ma'lumotlar AsyncStorage'da saqlanadi
- ✅ Mock data bilan tayyor demo mavjud

### Firebase'ni yoqish

Firebase allaqachon sozlangan! ✅

`.env` faylida Firebase config ma'lumotlari mavjud. Ilova avtomatik ravishda:

- `.env` faylida `EXPO_PUBLIC_FIREBASE_API_KEY` bo'lsa → Firebase ishlatadi
- Aks holda → Mock/Demo mode ishlaydi

**Firebase Console'da qilish kerak:**

1. **Authentication** → Email/Password yoqing
2. **Firestore Database** → Yaratib, Test mode'da qoldiring
3. Ilovani qayta ishga tushiring: `npm start -- --clear`

## Struktura

```
VohadaIsh/
├── src/
│   ├── screens/          # Barcha ekranlar
│   ├── components/      # Qayta ishlatiladigan komponentlar
│   ├── navigation/      # Navigation setup
│   ├── services/        # Backend xizmatlar
│   ├── context/         # React Context (State)
│   ├── constants/       # Doimiy ma'lumotlar
│   ├── types/           # TypeScript types
│   └── utils/           # Helper functions
├── assets/              # Rasmlar va ikonlar
└── App.tsx             # Asosiy fayl
```

## Scripts

- `npm start` - Expo development server ni ishga tushirish
- `npm run android` - Android da ishga tushirish
- `npm run ios` - iOS da ishga tushirish
- `npm run web` - Web da ishga tushirish
- `npm run typecheck` - TypeScript tekshiruvi
- `npm run lint` - ESLint tekshiruvi
- `npm run test` - Jest testlar
- `npm run format` - Prettier bilan formatlash

## Qo'llab-quvvatlash

Loyiha hali rivojlanmoqda. Xatolarni topilsa, issue yaratish mumkin.
