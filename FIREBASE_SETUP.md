# Firebase Sozlash Yo'riqnomasi - Expo

Bu Expo React Native loyihasi uchun Firebase'ni sozlash bo'yicha qadamma-qadam yo'riqnoma.

## Qadam 1: Firebase Console'da Web App qo'shish

Expo loyihalari uchun Firebase'ni **Web app** sifatida qo'shish kerak (iOS/Android emas):

1. [Firebase Console](https://console.firebase.google.com/) ga kiring
2. Loyihangizni tanlang yoki yangi loyiha yarating
3. **"Add app"** tugmasini bosing va **Web app** (</> ikon) ni tanlang
4. App nickname kiriting (masalan: "VohadaIsh")
5. **"Register app"** tugmasini bosing

## Qadam 2: Firebase Config Ma'lumotlarini Olish

Config faylni olishdan keyin, quyidagi ma'lumotlarni ko'rasiz:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Qadam 3: .env Faylini Yaratish

Loyiha ildizida `.env` faylini yarating:

```bash
cp .env.example .env
```

Keyin `.env` fayliga Firebase ma'lumotlarini qo'ying:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Qadam 4: Firebase Authentication Yoqish

1. Firebase Console'da **Authentication** bo'limiga kiring
2. **"Get started"** tugmasini bosing
3. **Sign-in method** tab'iga o'ting
4. **Email/Password** ni yoqing

## Qadam 5: Firestore Database Yaratish

1. Firebase Console'da **Firestore Database** bo'limiga kiring
2. **"Create database"** tugmasini bosing
3. **Test mode** ni tanlang (keyinroq qoidalarni sozlang)
4. Location tanlang (masalan: `us-central1`)

## Qadam 6: Firebase Service'larni Yoqish

Hozir demo mode ishlayapti. Firebase'ni yoqish uchun:

### 6.1. `src/services/authService.ts` ni o'zgartiring:

```typescript
// Firebase versiyasini oching va mock export'ni comment qiling
// import { ... } from './mockAuthService';
// export { ... } from './mockAuthService';

// Firebase import'larni oching va faylni Firebase versiyasiga o'zgartiring
```

### 6.2. `src/services/jobService.ts` ni o'zgartiring:

```typescript
// Firebase versiyasini oching va mock export'ni comment qiling
```

### 6.3. `src/context/AuthContext.tsx` ni o'zgartiring:

```typescript
// Firebase Auth bilan ishlash uchun o'zgartiring
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
```

## Qadam 7: Ilovani Qayta Ishga Tushirish

```bash
npm start -- --clear
```

## Eslatmalar

- ✅ Expo loyihalarida Firebase Web SDK ishlatiladi
- ✅ `.env` fayli `.gitignore` da, shuning uchun GitHub'ga yuklanmaydi
- ✅ `EXPO_PUBLIC_` prefiksi bilan environment variable'lar client-side'da mavjud bo'ladi
- ✅ Demo mode hozir ishlayapti - Firebase'siz test qilish mumkin

## Muammolarni Hal Qilish

### Firebase xatosi: "invalid-api-key"
- `.env` faylida barcha ma'lumotlar to'g'ri kiritilganligini tekshiring
- Ilovani qayta ishga tushiring: `npm start -- --clear`

### Authentication ishlamayapti
- Firebase Console'da Authentication yoqilganligini tekshiring
- Email/Password sign-in method yoqilganligini tekshiring

### Firestore xatolari
- Firestore Database yaratilganligini tekshiring
- Database rules to'g'ri sozlanganligini tekshiring

