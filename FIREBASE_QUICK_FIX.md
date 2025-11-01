# Firebase Xatolikni Hal Qilish - TEZKOR

## ❌ Muammo

```
FirebaseError: Function addDoc() called with invalid data
```

## ✅ Hal qilish (2 daqiqa)

### 1. Firebase Console'ga kiring

https://console.firebase.google.com/u/0/project/teak-ellipse-475721-e5/firestore

### 2. Firestore Database yaratish (agar yo'q bo'lsa)

1. **"Create database"** tugmasini bosing
2. **Production mode** tanlang (yoki Test mode, agar development'da bo'lsangiz)
3. Location: **asia-southeast1** (Singapore) yoki qo'shni region
4. **Enable** tugmasini bosing

### 3. Security Rules'ni o'rnatish

1. Chap menuda **"Firestore Database"** → **"Rules"** ga kiring
2. Quyidagi kodni **butunlay almashtiring**:

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

3. **"Publish"** tugmasini bosing (EN MUHIM QADAM!)

### 4. Ilovani qayta yuklang

```bash
npm start -- --clear
```

iPhone'da app'ni **to'liq o'chirib yana oching**.

---

## ✅ Tekshirish

App'da e'lon joylashtirishni sinab ko'ring. Xatolik yo'qolishi kerak.

---

## 🔒 Production uchun (keyinchalik)

Developmentdan keyin production rules'ni qo'ying:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Jobs
    match /jobs/{jobId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null
        && request.resource.data.postedBy == request.auth.uid;
    }

    // Conversations
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null
        && request.auth.uid in resource.data.participants;
    }

    // Messages
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

**Muhim:** Hozir "allow read, write: if request.auth != null;" ishlatish kerak - bu faqat kirgan foydalanuvchilar uchun ochiq.
