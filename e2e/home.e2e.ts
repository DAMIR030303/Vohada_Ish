/**
 * Home Screen Flow E2E Test
 * @description Home ekranining to'liq funksionalligini test qilish
 */

describe('Home Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("Home ekranini ko'rsatish kerak", async () => {
    // Login ekranidan o\'tish kerak (agar kerak bo\'lsa)
    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it("SearchBar mavjud bo'lishi va qidiruvni bajarish kerak", async () => {
    const searchBar = element(by.id('search-bar'));

    await expect(searchBar).toBeVisible();
    await searchBar.typeText('developer');

    // Natijalar ko\'rsatilishi kerak
    await waitFor(element(by.id('job-list')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it("JobCardlarni ko'rsatish kerak", async () => {
    const jobList = element(by.id('job-list'));

    await expect(jobList).toBeVisible();

    // Kamida bir yoki bir nechta ish e\'lonlari ko\'rsatilishi kerak
    const jobCards = element(by.id('job-card'));
    await expect(jobCards).toBeVisible();
  });

  it("JobCard ni bosganda JobDetails ekraniga o'tish kerak", async () => {
    const firstJobCard = element(by.id('job-card-0'));

    await expect(firstJobCard).toBeVisible();
    await firstJobCard.tap();

    // Job details ekraniga o\'tish kerak
    await waitFor(element(by.id('job-details-screen')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it("Bottom Navigation mavjud bo'lishi va ishlashi kerak", async () => {
    const bottomNav = element(by.id('bottom-navigation'));

    await expect(bottomNav).toBeVisible();

    // Qidiruv tab\'iga o\'tish
    const searchTab = element(by.id('search-tab'));
    await expect(searchTab).toBeVisible();
    await searchTab.tap();

    // Search ekraniga o\'tish kerak
    await expect(element(by.id('search-screen'))).toBeVisible();

    // Profil tab\'iga o\'tish
    const profileTab = element(by.id('profile-tab'));
    await expect(profileTab).toBeVisible();
    await profileTab.tap();

    // Profile ekraniga o\'tish kerak
    await expect(element(by.id('profile-screen'))).toBeVisible();

    // Home tab\'iga qaytish
    const homeTab = element(by.id('home-tab'));
    await expect(homeTab).toBeVisible();
    await homeTab.tap();

    // Home ekraniga qaytish kerak
    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it('Filter tugmasini bosish kerak', async () => {
    const filterButton = element(by.id('filter-button'));

    await expect(filterButton).toBeVisible();
    await filterButton.tap();

    // Filter modal o\'chilishi kerak
    await expect(element(by.id('filter-modal'))).toBeVisible();
  });

  it('Refresh qilish kerak (pull to refresh)', async () => {
    const jobList = element(by.id('job-list'));

    await expect(jobList).toBeVisible();

    // Scroll qilish va refresh qilish
    await jobList.swipe('down', 'fast', 0.8);

    // Loading indicator ko\'rsatilishi kerak
    await waitFor(element(by.id('refreshing-indicator')))
      .toBeVisible()
      .withTimeout(3000);
  });

  it("Statistika kartalarini ko'rsatish kerak", async () => {
    const statsCards = element(by.id('stats-cards'));

    await expect(statsCards).toBeVisible();

    // Kamida bir statistika karti ko\'rsatilishi kerak
    const activeJobs = element(by.id('active-jobs-stat'));
    await expect(activeJobs).toBeVisible();
  });

  it("Kategoriya chip'larini ko'rsatish va filtr qilish kerak", async () => {
    const categories = element(by.id('categories-section'));

    await expect(categories).toBeVisible();

    // Biror kategoriyani tanlash
    const itCategory = element(by.id('category-IT'));
    await expect(itCategory).toBeVisible();
    await itCategory.tap();

    // Faqat IT kategoriyasidagi ishlar ko\'rsatilishi kerak
    await waitFor(element(by.id('job-list')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it("O'qilishi uchun ko'rsatilmaslik holatida empty state ko'rsatish kerak", async () => {
    // Qidiruv natijasi bo\'sh bo\'lsa
    const searchBar = element(by.id('search-bar'));
    await searchBar.clearText();
    await searchBar.typeText('nonexistentjobxyz123');

    // Empty state ko\'rsatilishi kerak
    await waitFor(element(by.id('empty-state')))
      .toBeVisible()
      .withTimeout(5000);
  });
});
