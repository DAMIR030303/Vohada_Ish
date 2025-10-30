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
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[]; // User IDs
  jobId?: string; // Agar ish e'loniga bog'liq bo'lsa
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
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

