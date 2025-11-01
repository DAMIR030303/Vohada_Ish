# Firebase Configuration Xatosi Hal Qilish

## Muammo: "auth/configuration-not-found"

Bu xato Firebase konfiguratsiyasi to'g'ri o'qilmayotganida yuzaga keladi.

## Hal Qilish

### 1. Expo Server'ni qayta ishga tushirish (MUHIM!)

`.env` faylini o'zgartirgandan so'ng, Expo server'ni **to'liq qayta ishga tushirish** kerak:

```bash
# Terminal'da Ctrl+C bilan to'xtating
# Keyin:
npm start -- --clear
```

Yoki:

```bash
# Expo cache'ni tozalash
npx expo start --clear
```

### 2. `.env` Faylini Tekshirish

Loyiha ildizida `.env` fayl mavjudligini va quyidagi o'zgaruvchilar borligini tekshiring:

```bash
cat .env
```

Barcha `EXPO_PUBLIC_FIREBASE_*` o'zgaruvchilar to'liq bo'lishi kerak.

### 3. Expo Constants Plugin

Agar `.env` fayl o'qilmayotgan bo'lsa, `app.json` yoki `app.config.js` da sozlash kerak:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-constants",
        {
          "env": {
            "EXPO_PUBLIC_FIREBASE_API_KEY": "${EXPO_PUBLIC_FIREBASE_API_KEY}",
            "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN": "${EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN}",
            "EXPO_PUBLIC_FIREBASE_PROJECT_ID": "${EXPO_PUBLIC_FIREBASE_PROJECT_ID}",
            "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET": "${EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET}",
            "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "${EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}",
            "EXPO_PUBLIC_FIREBASE_APP_ID": "${EXPO_PUBLIC_FIREBASE_APP_ID}"
          }
        }
      ]
    ]
  }
}
```

### 4. Manual Tekshirish

Firebase'ning to'g'ri initialize qilinganligini tekshirish:

1. Ilovani ishga tushiring
2. Console'da quyidagi log'larni qidiring:
   - `Firebase Config Check:` - konfiguratsiya o'qilganligini ko'rsatadi
   - `✅ Firebase services initialized successfully` - service'lar ishga tushganligini ko'rsatadi

### 5. Firebase Console'da Tekshirish

1. **Authentication** → **Settings** → **Authorized domains**
2. `localhost` va `teak-ellipse-475721-e5.firebaseapp.com` qo'shilganligini tekshiring

## Tekshiruv

```bash
# .env faylini tekshirish
cat .env | grep EXPO_PUBLIC_FIREBASE

# Expo server'ni qayta ishga tushirish
npm start -- --clear
```

## Muammo Bo'lsa?

Agar hali ham xato bo'lsa:

1. Metro bundler cache'ni tozalash: `npx expo start --clear`
2. Node modules'ni qayta o'rnatish: `rm -rf node_modules && npm install`
3. Expo cache'ni tozalash: `npx expo start -c`
