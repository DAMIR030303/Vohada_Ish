# Firestore Index Sozlash (Ixtiyoriy)

## Muammo

`getUserJobs` funksiyasi `where('postedBy')` va `orderBy('createdAt')` ishlatganda Firestore composite index talab qiladi.

## Hal Qilish

Biz allaqachon **client-side sorting** qo'lladik, shuning uchun index kerak emas. Lekin agar performance'ni yaxshilashni xohlasangiz, index yaratishingiz mumkin.

## Index Yaratish (Ixtiyoriy)

1. Firebase Console'ga kiring: https://console.firebase.google.com/
2. Loyihangizni tanlang
3. **Firestore Database** → **Indexes** bo'limiga o'ting
4. Quyidagi index'ni yarating:

**Collection ID:** `jobs`

**Fields:**
- `postedBy` - Ascending
- `createdAt` - Descending

**Query scope:** Collection

## Yoki Link Orqali

Xatodagi linkga o'ting:
```
https://console.firebase.google.com/v1/r/project/teak-ellipse-475721-e5/firestore/indexes?create_composite=ClNwcm9qZWN0cy90ZWFrLWVsbGlwc2UtNDc1NzIxLWU1L2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9qb2JzL2luZGV4ZXMvXxABGgwKCHBvc3RlZEJ5EAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg
```

## Hozirgi Holat

- ✅ Client-side sorting ishlatilmoqda
- ✅ Index kerak emas (ishlaydi)
- ⚠️ Index yaratish performance'ni yaxshilaydi (100+ job bo'lsa)

## Tekshirish

Index yaratilgandan keyin, u bir necha daqiqa ichida tayyor bo'ladi. Keyin kodni o'zgartirishga hojat yo'q - avtomatik ishlatiladi.

