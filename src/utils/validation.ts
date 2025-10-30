/**
 * Validation utility functions
 */

/**
 * Email validation
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Phone number validation (Uzbekistan format)
 */
export const isValidPhone = (phone: string): boolean => {
  // Format: +998901234567 or 998901234567 or 901234567
  const phoneRegex = /^(\+998|998)?[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Format phone number to standard format
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('998')) {
    return `+${cleaned}`;
  }
  if (cleaned.length === 9) {
    return `+998${cleaned}`;
  }
  return phone;
};

/**
 * Password validation (min 6 characters)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Required field validation
 */
export const isRequired = (value: string | undefined | null): boolean => {
  return value !== undefined && value !== null && value.trim().length > 0;
};

/**
 * URL validation
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

