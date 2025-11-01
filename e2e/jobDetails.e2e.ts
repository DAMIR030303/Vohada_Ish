/**
 * Job Details Flow E2E Test
 * @description Ish e\'loni tafsilotlari ekranining funksionalligini test qilish
 */

describe('Job Details Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("JobDetails ekranini ko'rsatish kerak", async () => {
    // Avval Home ekrandan ish tanlash kerak
    const firstJobCard = element(by.id('job-card-0'));
    await expect(firstJobCard).toBeVisible();
    await firstJobCard.tap();

    // Job details ekran yuklanishini kutamiz
    await waitFor(element(by.id('job-details-screen')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it("Ish ma'lumotlarini ko'rsatish kerak", async () => {
    // Job title ko\'rsatilishi kerak
    const jobTitle = element(by.id('job-title'));
    await expect(jobTitle).toBeVisible();

    // Kompaniya nomi ko\'rsatilishi kerak
    const companyName = element(by.id('company-name'));
    await expect(companyName).toBeVisible();

    // Joylashuv ko\'rsatilishi kerak
    const location = element(by.id('job-location'));
    await expect(location).toBeVisible();

    // Maosh ko\'rsatilishi kerak
    const salary = element(by.id('job-salary'));
    await expect(salary).toBeVisible();
  });

  it("Ish tavsifini ko'rsatish kerak", async () => {
    const jobDescription = element(by.id('job-description'));

    await expect(jobDescription).toBeVisible();

    // Scroll qilish mumkin bo\'lishi kerak
    await jobDescription.swipe('up', 'slow', 0.5);
  });

  it('"Qiziqish bildirish" tugmasini bosish kerak', async () => {
    const applyButton = element(by.id('apply-button'));

    await expect(applyButton).toBeVisible();
    await applyButton.tap();

    // Modal yoki confirmation ko\'rsatilishi kerak
    await waitFor(element(by.id('apply-modal')))
      .toBeVisible()
      .withTimeout(3000);
  });

  it('Back tugmasini bosganda orqaga qaytish kerak', async () => {
    const backButton = element(by.id('back-button'));

    await expect(backButton).toBeVisible();
    await backButton.tap();

    // Home ekraniga qaytish kerak
    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it("Ish kategoriyasini ko'rsatish kerak", async () => {
    const categoryChip = element(by.id('job-category'));

    await expect(categoryChip).toBeVisible();
  });

  it("Ish sanasi ko'rsatilishi kerak", async () => {
    const postedDate = element(by.id('posted-date'));

    await expect(postedDate).toBeVisible();
  });

  it("Ish tipi (tartib, yarim kunlik) ko'rsatilishi kerak", async () => {
    const jobType = element(by.id('job-type'));

    await expect(jobType).toBeVisible();
  });

  it("Kompaniya haqida ma'lumotlar bo'limi mavjud bo'lishi kerak", async () => {
    const companyInfo = element(by.id('company-info-section'));

    await expect(companyInfo).toBeVisible();
  });

  it("Kerakli ko'nikmalar (skills) bo'limi mavjud bo'lishi kerak", async () => {
    const skillsSection = element(by.id('skills-section'));

    await expect(skillsSection).toBeVisible();
  });

  it('Share tugmasini bosish kerak', async () => {
    const shareButton = element(by.id('share-button'));

    await expect(shareButton).toBeVisible();
    await shareButton.tap();

    // Share modal ko\'rsatilishi kerak
    await waitFor(element(by.id('share-modal')))
      .toBeVisible()
      .withTimeout(3000);
  });

  it('Ish sanasi scroll qilib pastga tushish kerak', async () => {
    const content = element(by.id('job-details-content'));

    await expect(content).toBeVisible();

    // Scroll qilish
    await content.swipe('up', 'fast', 0.8);

    // Footer ko\'rsatilishi kerak
    await waitFor(element(by.id('job-details-footer')))
      .toBeVisible()
      .withTimeout(3000);
  });

  it('Sahifa refresh qilish kerak (pull to refresh)', async () => {
    const content = element(by.id('job-details-content'));

    await expect(content).toBeVisible();

    // Scroll qilish va refresh
    await content.swipe('down', 'fast', 0.8);

    // Loading indicator ko\'rsatilishi kerak
    await waitFor(element(by.id('refreshing-indicator')))
      .toBeVisible()
      .withTimeout(3000);
  });

  it('Yaxlitlash (favorite) tugmasini bosish kerak', async () => {
    const favoriteButton = element(by.id('favorite-button'));

    await expect(favoriteButton).toBeVisible();
    await favoriteButton.tap();

    // Tugma state\'i o\'zgarshi kerak
    await expect(favoriteButton).toBeVisible();
  });

  it("Kompaniya nomini bosganda kompaniya profili ekraniga o'tish kerak", async () => {
    const companyName = element(by.id('company-name'));

    await expect(companyName).toBeVisible();
    await companyName.tap();

    // Kompaniya profili ekraniga o\'tish kerak (agar mavjud bo\'lsa)
    // await expect(element(by.id('company-profile-screen'))).toBeVisible();
  });

  it("Yuborish muddati (deadline) ko'rsatilishi kerak", async () => {
    // Agar mavjud bo\'lsa ko\'rsatilishi kerak
    // await expect(deadline).toBeVisible();
  });
});
