# Firebase Parolni Tiklash Sozlash

Firebase'da haqiqiy parolni tiklash funksiyasini ishlatish uchun quyidagi qadamlarni bajaring:

## 1. Firebase Console'da Email Template Sozlash

1. [Firebase Console](https://console.firebase.google.com/) ga kiring
2. Loyihangizni tanlang
3. **Authentication** → **Templates** bo'limiga o'ting
4. **Password reset** template'ni tanlang
5. Email template'ni sozlang:

### Email Template Sozlamalari:

**Subject (Mavzu):**

```
Parolni tiklash - VohadaIsh
```

**Email Body (HTML):**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background-color: #2196f3;
        color: white;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 20px;
        background-color: #f9f9f9;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #2196f3;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        margin: 20px 0;
      }
      .footer {
        padding: 20px;
        text-align: center;
        color: #666;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Parolni Tiklash</h1>
      </div>
      <div class="content">
        <p>Salom!</p>
        <p>Siz VohadaIsh ilovasida parolni tiklashni so'ragansiz.</p>
        <p>Quyidagi tugmani bosib, parolingizni yangilang:</p>
        <p style="text-align: center;">
          <a href="%LINK%" class="button">Parolni yangilash</a>
        </p>
        <p>
          Agar siz parolni tiklashni so'ramagan bo'lsangiz, bu xabarni
          e'tiborsiz qoldiring.
        </p>
        <p>Havola 1 soatdan keyin ishdan chiqadi.</p>
      </div>
      <div class="footer">
        <p>VohadaIsh - Ish e'lonlari platformasi</p>
        <p>Bu avtomatik email. Iltimos, javob yozmang.</p>
      </div>
    </div>
  </body>
</html>
```

**Action URL (Havola):**

```
https://your-app-domain.com/reset-password?oobCode=%OOB_CODE%&mode=resetPassword
```

Yoki Expo'da:

```
exp://your-project-id.exp.direct:80/reset-password?oobCode=%OOB_CODE%&mode=resetPassword
```

## 2. Firebase Console'da Authorized Domains

1. **Authentication** → **Settings** → **Authorized domains** bo'limiga o'ting
2. Quyidagi domain'larni qo'shing:
   - `localhost` (development uchun)
   - `your-app-domain.com` (production uchun)
   - Expo'da `exp.direct` domain'lari avtomatik qo'shiladi

## 3. Email Action Handler (Expo/React Native)

Expo'da deep linking orqali email'dagi havola bilan ishlash uchun `app.json` yoki `app.config.js` da sozlash kerak:

```json
{
  "expo": {
    "scheme": "vohadaish",
    "associatedDomains": ["applinks:your-app-domain.com"]
  }
}
```

## 4. Code'da Deep Link Handler

`App.tsx` yoki alohida faylda deep link handler qo'shing:

```typescript
import * as Linking from 'expo-linking';
import { useEffect } from 'react';

useEffect(() => {
  const handleDeepLink = async (event: { url: string }) => {
    const { queryParams } = Linking.parse(event.url);

    if (queryParams?.mode === 'resetPassword' && queryParams?.oobCode) {
      // Parolni yangilash ekraniga o'tish
      navigation.navigate('ResetPassword', {
        oobCode: queryParams.oobCode as string,
      });
    }
  };

  // Initial URL
  Linking.getInitialURL().then((url) => {
    if (url) {
      handleDeepLink({ url });
    }
  });

  // URL changes
  const subscription = Linking.addEventListener('url', handleDeepLink);

  return () => {
    subscription.remove();
  };
}, []);
```

## 5. Parolni Yangilash Ekrani

Deep link orqali kelgan `oobCode` bilan parolni yangilash ekrani yaratish kerak. Bu keyingi qadamda qo'shiladi.

## 6. Test Qilish

1. Firebase Console'da **Authentication** → **Users** bo'limiga o'ting
2. Test user yarating
3. Ilovada "Parolni unutdingizmi?" tugmasini bosing
4. Email'ni tekshiring
5. Email'dagi havolani bosing va parolni yangilang

## Muammo?

- Email kelmayapti? → Spam papkasini tekshiring
- Havola ishlamayapti? → Deep linking sozlamalarini tekshiring
- Firebase xatosi? → Firebase Console'da Authentication yoqilganligini tekshiring
