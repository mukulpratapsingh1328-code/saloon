export enum ServiceCategory {
  HAIR = 'Hair',
  SKIN = 'Skin & Facial',
  BODY = 'Body & Massage',
  GROOMING = 'Grooming & Barber',
  SPA = 'Spa Packages'
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  duration: number; // in minutes
  price: number; // in INR
  description: string;
  imageUrl: string;
  popular?: boolean;
}

export interface Stylist {
  id: string;
  name: string;
  role: string;
  rating: number;
  imageUrl: string;
  bio: string;
  specialties: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  imageUrl?: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: string;
  expiry: string;
}

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  stylistId: string;
  stylistName: string;
  stylistImage: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  totalPrice: number;
  duration: number;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  customerEmail: string;
  title: string;
  message: string;
  type: 'info' | 'booking_confirmation' | 'reminder' | 'system';
  createdAt: string;
  read: boolean;
  bookingId?: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  likes: number;
  comments: number;
  caption: string;
}
