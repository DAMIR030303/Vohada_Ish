/**
 * Ish e'lonlari uchun types
 */

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  region: string;
  district?: string;
  salary?: {
    min?: number;
    max?: number;
    currency: string;
  };
  employmentType: 'full-time' | 'part-time' | 'contract' | 'freelance';
  requirements?: string[];
  benefits?: string[];
  companyName?: string;
  companyLogo?: string;
  contactPhone?: string;
  contactEmail?: string;
  images?: string[];
  postedBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'closed' | 'draft';
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file'; // Message turi
  mediaUrl?: string; // Rasm yoki fayl URL
  read: boolean;
  createdAt: Date;
  // New fields for modern messaging
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
  reactions?: Record<string, string[]>; // emoji -> userIds
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  editedAt?: Date;
}

export interface Conversation {
  id: string;
  participants: string[]; // User IDs
  participantDetails?: Record<
    string,
    {
      name: string;
      avatar?: string;
      online?: boolean;
    }
  >; // Tez ko'rsatish uchun
  jobId?: string; // Agar ish e'loniga bog'liq bo'lsa
  jobTitle?: string; // Ish nomi (context uchun)
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: Date;
  };
  unreadCount?: Record<string, number>; // Har bir user uchun unread count
  typing?: Record<string, boolean>; // Har bir user yozayaptimi
  createdAt: Date;
  updatedAt: Date;
  // New fields for modern messaging
  isPinned?: boolean;
  isArchived?: boolean;
}

export interface FilterOptions {
  category?: string;
  region?: string;
  district?: string;
  employmentType?: Job['employmentType'];
  salaryMin?: number;
  salaryMax?: number;
  searchQuery?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  jobCount: number;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  lottieAnimation?: string;
  action: 'login' | 'register' | 'postJob';
  backgroundColor: string;
}

export interface HomeStats {
  totalJobs: number;
  newToday: number;
  companiesCount: number;
}
