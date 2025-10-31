# Firestore Rules

Firebase Console'da **Firestore Database** → **Rules** bo'limiga o'ting va quyidagi rules'ni qo'ying:

## Test Mode (Development uchun)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Hamma hujjatlarni o'qish va yozishga ruxsat beradi (faqat test uchun)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Diqqat:** Bu test mode - production'da ishlatmaydi!

## Production Rules (Tavsiya etiladi)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Jobs collection
    match /jobs/{jobId} {
      // O'qish - hamma authenticated users uchun
      allow read: if request.auth != null;
      
      // Yozish - faqat o'z e'lonini yaratish/yangilash
      allow create: if request.auth != null 
                    && request.resource.data.postedBy == request.auth.uid;
      
      allow update, delete: if request.auth != null 
                             && resource.data.postedBy == request.auth.uid;
    }
    
    // Conversations collection
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null 
                         && request.auth.uid in resource.data.participants;
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Rules'ni qo'llash

1. Firebase Console'ga kiring
2. **Firestore Database** → **Rules** bo'limiga o'ting
3. Yuqoridagi kodlardan birini tanlang va yozing
4. **Publish** tugmasini bosing

## Muammo?

Agar "Missing or insufficient permissions" xatosi bo'lsa:
- Rules'ni tekshiring
- Test mode'ni yoqing (development uchun)
- Yoki production rules'ni sozlang va authenticated users uchun ruxsat bering
