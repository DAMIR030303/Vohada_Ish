/**
 * Mock Autentifikatsiya servisi - Demo uchun
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { User } from '../types';

import { mockUsers } from './mockData';

const STORAGE_KEY = '@vohadaish_user';
const USERS_STORAGE_KEY = '@vohadaish_users';

/**
 * Ro'yxatdan o'tish
 */
export const register = async (
  email: string,
  _password: string,
  fullName: string,
  phone?: string,
): Promise<User> => {
  // Demo uchun - faqat AsyncStorage'da saqlaymiz
  const newUser: User = {
    id: Date.now().toString(),
    email,
    fullName,
    phone,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Users ro'yxatini olish
  const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
  const users: User[] = usersJson ? JSON.parse(usersJson) : [];

  // Yangi user qo'shish
  users.push(newUser);
  await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  // Current user sifatida saqlash
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));

  return newUser;
};

/**
 * Kirish
 */
export const login = async (email: string, _password: string): Promise<User> => {
  // Demo uchun - users ro'yxatidan topamiz
  const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
  const users: User[] = usersJson ? JSON.parse(usersJson) : [...mockUsers];

  // Email bo'yicha topish
  let user = users.find((u) => u.email === email);

  // Agar topilmasa, demo user yaratamiz
  if (!user) {
    user = {
      id: Date.now().toString(),
      email,
      fullName: email.split('@')[0],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(user);
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  // Current user sifatida saqlash
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));

  return user;
};

/**
 * Chiqish
 */
export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};

/**
 * Foydalanuvchi ma'lumotlarini olish
 */
export const getUserData = async (userId: string): Promise<User | null> => {
  const userJson = await AsyncStorage.getItem(STORAGE_KEY);
  if (userJson) {
    const user = JSON.parse(userJson) as User;
    if (user.id === userId) {
      return user;
    }
  }

  // Users ro'yxatidan qidirish
  const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
  const users: User[] = usersJson ? JSON.parse(usersJson) : [...mockUsers];
  return users.find((u) => u.id === userId) || null;
};

/**
 * Parolni tiklash (Demo uchun)
 */
export const resetPassword = async (email: string): Promise<void> => {
  // Demo uchun - email tekshirish
  const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
  const users: User[] = usersJson ? JSON.parse(usersJson) : [...mockUsers];
  
  const userExists = users.some((u) => u.email === email);
  
  if (!userExists) {
    // Demo uchun - har doim muvaffaqiyatli qaytarish
    // Haqiqiy loyihada email'ga yuborish kerak
    console.log(`Demo mode: Parolni tiklash email yuborildi: ${email}`);
  } else {
    console.log(`Demo mode: Parolni tiklash email yuborildi: ${email}`);
  }
  
  // Demo uchun - haqiqiy email yuborilmaydi
  // Faqat console'ga log yozamiz
};

/**
 * Joriy foydalanuvchini olish
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const userJson = await AsyncStorage.getItem(STORAGE_KEY);
  if (userJson) {
    const user = JSON.parse(userJson) as User;
    // Date string'larni Date object'ga o'zgartirish
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    };
  }
  return null;
};

