# Firebase Password Reset Template - O'zbek Tilida

## Quick Setup Guide

Firebase Console'da ko'rsatilganidek, Password reset template'ni quyidagicha sozlang:

### 1. Password Reset Template'ni Tanlash

- **Authentication** → **Templates** → **Password reset**

### 2. Sozlamalar

**Subject:**

```
Parolni tiklash - %APP_NAME%
```

**Message (HTML):**

```html
<p>Assalomu alaykum!</p>
<p>Siz VohadaIsh ilovasida parolni tiklashni so'ragansiz.</p>
<p>Parolingizni yangilash uchun quyidagi havolani bosing:</p>
<p><a href="%LINK%">Parolni yangilash</a></p>
<p>
  Agar siz parolni tiklashni so'ramagan bo'lsangiz, bu xabarni e'tiborsiz
  qoldiring.
</p>
<p>Bu havola 1 soatdan keyin ishdan chiqadi.</p>
<p>Hurmat bilan,</p>
<p>%APP_NAME% jamoasi</p>
```

**Action URL (%LINK% value):**

```
vohadaish://reset-password
```

Yoki Firebase default URL ishlatish uchun:

```
https://teak-ellipse-475721-e5.firebaseapp.com
```

**"Customize action URL"** tugmasini bosing va `vohadaish://reset-password` ni kiriting.

### 3. Save Tugmasini Bosing

Bu qadar! Endi ilovada parolni tiklash funksiyasi ishlaydi.

## Test Qilish

1. Ilovada "Parolni unutdingizmi?" tugmasini bosing
2. Email manzilingizni kiriting
3. Email'ni tekshiring (spam papkasini ham)
4. Email'dagi havolani bosing → Ilova ochiladi va parolni yangilash ekraniga o'tadi

## Izoh

- Action URL `vohadaish://reset-password` formatida bo'lishi kerak (app.json'da `scheme: "vohadaish"` sozlangan)
- Firebase avtomatik ravishda `?mode=resetPassword&oobCode=...` parametrlarini qo'shadi
- Deep link handler AppNavigator'da avtomatik ishlaydi
