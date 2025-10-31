# Firestore Rules - Tuzatilgan versiya

## Muammo
"Missing or insufficient permissions" xatosi chiqmoqda. Bu quyidagi sabablarga ko'ra bo'lishi mumkin:
1. Rules hali publish qilinmagan
2. Query'lar index talab qilishi mumkin
3. Rules'da `resource.data` yangi yaratilayotgan dokumentlar uchun mavjud emas

## Hal qilish - Development uchun oson variant

Firebase Console → Firestore Database → Rules ga quyidagi kodni qo'ying:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Jobs collection - Development uchun yanada moslashuvchan
    match /jobs/{jobId} {
      // O'qish - barcha autentifikatsiya qilingan foydalanuvchilar
      allow read: if request.auth != null;
      
      // Yaratish - barcha autentifikatsiya qilingan foydalanuvchilar
      allow create: if request.auth != null && 
        request.resource.data.postedBy == request.auth.uid;
      
      // Yangilash va o'chirish - faqat egasi
      allow update, delete: if request.auth != null && 
        resource.data.postedBy == request.auth.uid;
    }
  }
}
```

## Agar hali ham muammo bo'lsa - Vaqtinchalik test variant

Development uchun vaqtinchalik ravishda quyidagi rules'ni ishlatishingiz mumkin:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **Eslatma:** Ikkinchi variantni faqat development/test uchun ishlating!

## Qadamlar

1. Firebase Console → Firestore Database → Rules
2. Yuqoridagi kodlardan birini qo'shing (birinchi variantni avval sinab ko'ring)
3. **"Publish"** tugmasini bosing (muhim!)
4. Bir necha soniya kutib turing (rules sync qilish uchun)
5. Expo server'ni qayta ishga tushiring: `npm start -- --clear`
6. Ilovani qayta yuklang

## Tekshirish

Rules to'g'ri ishlayotganini tekshirish uchun:
- Firebase Console → Firestore Database → Rules → "Develop & Test" tugmasini bosing
- Test query'larni yuborib ko'ring

