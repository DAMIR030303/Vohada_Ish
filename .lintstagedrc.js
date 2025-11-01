module.exports = {
  // TypeScript va TSX fayllar uchun ESLint va Prettier
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  // JSON va Markdown fayllar uchun Prettier
  '*.{json,md}': ['prettier --write'],
  // Boshqa fayllar uchun faqat Prettier
  '*.{js,jsx}': ['prettier --write'],
};
