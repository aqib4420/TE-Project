export enum Category {
  DESIGN = 'Graphics & Design',
  DEV = 'Programming & Tech',
  WRITING = 'Writing & Translation',
  MARKETING = 'Digital Marketing',
  VIDEO = 'Video & Animation'
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SiteReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: Category;
  deliveryTime: string;
  features: string[];
  reviews: Review[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  role: 'client' | 'admin';
  password?: string;
  isVerified?: boolean;
  verificationCode?: string;
}

export interface CheckoutData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zip: string;
}

export interface Order {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  price: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  date: string;
  clientName?: string;
  deliverables?: string; // URL or file name
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string; // 'admin' or userId
  text: string;
  attachment?: string; // URL
  timestamp: Date;
  isRead: boolean;
}