/**
 * Login Flow E2E Test
 * @description Login ekranining to'liq funksionalligini test qilish
 */

describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("Login ekranini ko'rsatish kerak", async () => {
    // Ekran yuklanishini kutamiz
    await expect(element(by.id('login-screen'))).toBeVisible();
  });

  it("Email input ni to'ldirish va validation tekshirish", async () => {
    const emailInput = element(by.id('email-input'));

    await expect(emailInput).toBeVisible();
    await emailInput.typeText('test@example.com');
    await expect(emailInput).toHaveText('test@example.com');
  });

  it("Parol input ni to'ldirish", async () => {
    const passwordInput = element(by.id('password-input'));

    await expect(passwordInput).toBeVisible();
    await passwordInput.typeText('password123');
    // Parol mask qilingan bo\'lishi kerak
    await expect(passwordInput).toHaveText('password123');
  });

  it('"Tizimga kirish" tugmasi bosilganda login jarayonini boshlash kerak', async () => {
    const emailInput = element(by.id('email-input'));
    const passwordInput = element(by.id('password-input'));
    const loginButton = element(by.id('login-button'));

    await emailInput.typeText('test@example.com');
    await passwordInput.typeText('password123');
    await loginButton.tap();

    // Login jarayoni boshlangandan keyin loading ko\'rsatilishi kerak
    await waitFor(element(by.id('loading-indicator')))
      .toBeVisible()
      .withTimeout(3000);
  });

  it('"Ro\'yxatdan o\'tish" linkini bosish kerak', async () => {
    const registerLink = element(by.id('register-link'));

    await expect(registerLink).toBeVisible();
    await registerLink.tap();

    // Register ekraniga o\'tish kerak
    await expect(element(by.id('register-screen'))).toBeVisible();
  });

  it('"Parolni unutdingizmi?" linkini bosish kerak', async () => {
    const forgotPasswordLink = element(by.id('forgot-password-link'));

    await expect(forgotPasswordLink).toBeVisible();
    await forgotPasswordLink.tap();

    // Forgot password ekraniga o\'tish kerak
    await expect(element(by.id('forgot-password-screen'))).toBeVisible();
  });

  it("Noto'g'ri email formatida xatolik ko'rsatish kerak", async () => {
    const emailInput = element(by.id('email-input'));
    const loginButton = element(by.id('login-button'));

    await emailInput.typeText('notvalidemail');
    await loginButton.tap();

    // Validation xatosi ko\'rsatilishi kerak
    await expect(element(by.id('email-error'))).toBeVisible();
  });

  it("Bo'sh maydon bilan submit qilishda xatolik ko'rsatish kerak", async () => {
    const loginButton = element(by.id('login-button'));

    await loginButton.tap();

    // Har ikki maydon uchun xatolik ko\'rsatilishi kerak
    await expect(element(by.id('email-error'))).toBeVisible();
    await expect(element(by.id('password-error'))).toBeVisible();
  });

  it("Muvaffaqiyatli login qilgandan keyin Home ekraniga o'tish kerak", async () => {
    const emailInput = element(by.id('email-input'));
    const passwordInput = element(by.id('password-input'));
    const loginButton = element(by.id('login-button'));

    await emailInput.typeText('test@example.com');
    await passwordInput.typeText('password123');
    await loginButton.tap();

    // Mock user bo\'lsa, Home ekraniga o\'tish kerak
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(10000);
  });
});
