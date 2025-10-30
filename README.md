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

2. Firebase konfiguratsiyasini sozlash:
   - `.env.example` faylini `.env` ga nusxalang
   - Firebase loyihangizdan kerakli ma'lumotlarni qo'ying

3. Ilovani ishga tushirish:
```bash
npm start
```

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

