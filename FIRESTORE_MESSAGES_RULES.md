# Firestore Messages & Conversations Rules

## 📋 Collection Strukturasi

### 1. `conversations` Collection

```
conversations/
  {conversationId}/
    - id: string
    - participants: string[] (user IDs)
    - participantDetails: {
        [userId]: {
          name: string
          avatar?: string
          online?: boolean
        }
      }
    - jobId?: string
    - jobTitle?: string
    - lastMessage?: {
        content: string
        senderId: string
        createdAt: timestamp
      }
    - unreadCount?: {
        [userId]: number
      }
    - typing?: {
        [userId]: boolean
      }
    - createdAt: timestamp
    - updatedAt: timestamp
```

### 2. `messages` Collection

```
messages/
  {messageId}/
    - id: string
    - conversationId: string
    - senderId: string
    - senderName: string
    - senderAvatar?: string
    - receiverId: string
    - content: string
    - type: 'text' | 'image' | 'file'
    - mediaUrl?: string
    - read: boolean
    - createdAt: timestamp
```

---

## 🔐 Firestore Security Rules

Firebase Console → Firestore Database → Rules bo'limiga quyidagi qoidalarni qo'shing:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function: user authenticated
    function isSignedIn() {
      return request.auth != null;
    }

    // Helper function: user is owner
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    // Users collection rules (agar mavjud bo'lsa)
    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isOwner(userId);
    }

    // Conversations collection rules
    match /conversations/{conversationId} {
      // Faqat conversation'ning participant'lari o'qiy oladi
      allow read: if isSignedIn() &&
        request.auth.uid in resource.data.participants;

      // Faqat participant'lar yangilash mumkin
      allow update: if isSignedIn() &&
        request.auth.uid in resource.data.participants;

      // Faqat participant'lar (sender yoki receiver) yaratish mumkin
      allow create: if isSignedIn() &&
        request.auth.uid in request.resource.data.participants;

      // Faqat participant'lar o'chirish mumkin
      allow delete: if isSignedIn() &&
        request.auth.uid in resource.data.participants;
    }

    // Messages collection rules
    match /messages/{messageId} {
      // Faqat conversation participant'lari o'qiy oladi
      allow read: if isSignedIn() && (
        request.auth.uid == resource.data.senderId ||
        request.auth.uid == resource.data.receiverId
      );

      // Faqat sender xabar yaratish mumkin
      allow create: if isSignedIn() &&
        request.auth.uid == request.resource.data.senderId;

      // Faqat receiver read status'ni yangilash mumkin
      allow update: if isSignedIn() &&
        request.auth.uid == resource.data.receiverId &&
        request.resource.data.diff(resource.data).affectedKeys()
          .hasOnly(['read']);

      // Faqat sender o'z xabarini o'chirish mumkin
      allow delete: if isSignedIn() &&
        request.auth.uid == resource.data.senderId;
    }

    // Jobs collection rules (mavjud, faqat reference)
    match /jobs/{jobId} {
      allow read: if isSignedIn();
      allow create, update: if isSignedIn();
      allow delete: if isOwner(resource.data.postedBy);
    }
  }
}
```

---

## 📊 Composite Indexes

Firebase Console → Firestore Database → Indexes bo'limiga quyidagi indexlarni qo'shing:

### 1. Messages by Conversation

```
Collection: messages
Fields:
  - conversationId (Ascending)
  - createdAt (Ascending)
Query scope: Collection
```

### 2. Conversations by Participant

```
Collection: conversations
Fields:
  - participants (Array)
  - updatedAt (Descending)
Query scope: Collection
```

### 3. Unread Messages

```
Collection: messages
Fields:
  - conversationId (Ascending)
  - receiverId (Ascending)
  - read (Ascending)
Query scope: Collection
```

---

## 🚀 Firebase Console'da Qo'lda Sozlash

### 1. Firestore Database Yaratish (agar yo'q bo'lsa)

1. Firebase Console → Firestore Database
2. "Create database" tugmasini bosing
3. Production mode yoki Test mode tanlang
4. Location tanlang (asia-southeast1 - Singapore tavsiya etiladi)

### 2. Security Rules Qo'shish

1. Firebase Console → Firestore Database → Rules
2. Yuqoridagi rules'ni copy-paste qiling
3. "Publish" tugmasini bosing

### 3. Indexes Yaratish

Avtomatik index yaratish:

- Ilovani ishga tushiring
- Chat funksiyalarini ishlatib ko'ring
- Console'da index yaratish kerak bo'lgan query'lar haqida xabar chiqadi
- Xabardagi linkni bosib, indexni avtomatik yarating

Qo'lda index yaratish:

1. Firebase Console → Firestore Database → Indexes
2. "Create index" tugmasini bosing
3. Collection ID va Fields'ni kiriting
4. "Create" tugmasini bosing

---

## 🧪 Test Qilish

### 1. Conversation Yaratish Testi

```typescript
// Test user1 va user2 o'rtasida conversation yaratishi
const conversationId = await getOrCreateConversation(
  'user1',
  'user2',
  'job123',
  'Senior Developer',
);
console.log('Conversation ID:', conversationId);
```

### 2. Xabar Yuborish Testi

```typescript
// user1 user2'ga xabar yuborishi
await sendMessage(
  conversationId,
  'user1',
  'John Doe',
  'user2',
  "Salom! Ish e'loni haqida gaplashsak bo'ladimi?",
);
```

### 3. Real-time Kuzatish Testi

```typescript
// user2 real-time xabarlarni olishi
const unsubscribe = subscribeToMessages(conversationId, (messages) => {
  console.log('New messages:', messages);
});

// Unsubscribe when done
unsubscribe();
```

---

## 📝 Migration (Agar mavjud data bo'lsa)

Agar allaqachon `messages` yoki `conversations` collection'laringiz bo'lsa:

1. **Backup oling**: Firebase Console → Firestore → Import/Export
2. **Data strukturasini yangilang**: Migration script yozing
3. **Test muhitda sinab ko'ring**: Test project'da migration'ni test qiling
4. **Production'ga o'tkazing**: Backup bilan production'da migration

---

## ⚠️ Muhim Eslatmalar

1. **Security Rules**: Har doim eng qat'iy qoidalarni qo'llang
2. **Indexes**: Barcha query'lar uchun index yarating (performance uchun)
3. **Cost Optimization**:
   - Real-time listener'larni faqat kerakli paytda ishlating
   - Pagination qo'llang (limit() dan foydalaning)
   - Unsubscribe'ni unutmang
4. **Data Validation**: Client-side va server-side validation qo'llang
5. **Rate Limiting**: Spam oldini olish uchun rate limiting qo'shing

---

## 📚 Qo'shimcha Resurslar

- [Firestore Security Rules Docs](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Indexing Best Practices](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Real-time Updates Guide](https://firebase.google.com/docs/firestore/query-data/listen)

---

**Yaratilgan:** 2025-10-31  
**Status:** ✅ Ready for Production
