/**
 * Autentifikatsiya Context
 */

import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { getUserData, login, logout, register, resetPassword } from '../services/authService';
import { auth } from '../services/firebase';
import { getCurrentUser } from '../services/mockAuthService';
import { User } from '../types';

// Firebase yoqilgan yoki yo'qligini tekshirish
const useFirebase = !!process.env.EXPO_PUBLIC_FIREBASE_API_KEY;

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  register: (
    email: string,
    password: string,
    fullName: string,
    phone?: string,
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (useFirebase && auth) {
      // Firebase mode
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (__DEV__) {
          console.log('onAuthStateChanged triggered:', {
            hasUser: !!fbUser,
            userId: fbUser?.uid,
          });
        }
        setFirebaseUser(fbUser);
        if (fbUser) {
          try {
            const userData = await getUserData(fbUser.uid);
            if (userData) {
              setUser(userData);
              if (__DEV__) {
                console.log('User data loaded from Firestore:', userData.email);
              }
            } else {
              // Firestore'da user dokumenti bo'lmasa, Firebase Auth ma'lumotlaridan yaratish
              const fallbackUser = {
                id: fbUser.uid,
                email: fbUser.email || '',
                fullName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
                phone: fbUser.phoneNumber || undefined,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              setUser(fallbackUser);
              if (__DEV__) {
                console.log('User data created from Firebase Auth:', fallbackUser.email);
              }
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            // Xatolik bo'lsa ham, Firebase Auth ma'lumotlaridan yaratish
            const fallbackUser = {
              id: fbUser.uid,
              email: fbUser.email || '',
              fullName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
              phone: fbUser.phoneNumber || undefined,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            setUser(fallbackUser);
          }
        } else {
          setUser(null);
          if (__DEV__) {
            console.log('User logged out');
          }
        }
        setLoading(false);
      });

      return unsubscribe;
    } else {
      // Mock mode - AsyncStorage'dan user o'qish
      const loadUser = async () => {
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Error loading user:', error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      loadUser();
    }
  }, []);

  const handleRegister = async (
    email: string,
    password: string,
    fullName: string,
    phone?: string,
  ) => {
    if (useFirebase) {
      const newUser = await register(email, password, fullName, phone);
      setUser(newUser);
    } else {
      const newUser = await register(email, password, fullName, phone);
      setUser(newUser as User);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    if (useFirebase) {
      try {
        // Firebase Auth'da login qilish
        // onAuthStateChanged avtomatik yangilanadi va user state o'rnatiladi
        await login(email, password);
        if (__DEV__) {
          console.log('Login successful, waiting for onAuthStateChanged...');
        }
        // onAuthStateChanged avtomatik yangilanadi, shuning uchun bu yerda qo'shimcha ish qilmaymiz
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    } else {
      // Mock mode
      const loggedInUser = await login(email, password);
      setUser(loggedInUser as User);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setFirebaseUser(null);
  };

  const handleResetPassword = async (email: string) => {
    await resetPassword(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        register: handleRegister,
        login: handleLogin,
        logout: handleLogout,
        resetPassword: handleResetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

