import { useState, useEffect } from 'react';
import { Service, ServiceCategory, Stylist, Testimonial, Promotion, Appointment, InstagramPost, AppNotification } from '../types';
import { 
  SERVICES as INITIAL_SERVICES, 
  STYLISTS as INITIAL_STYLISTS, 
  TESTIMONIALS as INITIAL_TESTIMONIALS, 
  PROMOTIONS as INITIAL_PROMOTIONS, 
  BEFORE_AFTER_GALLERY as INITIAL_BEFORE_AFTER_GALLERY, 
  OPENING_HOURS as INITIAL_OPENING_HOURS,
  TIME_SLOTS
} from '../data';

// Custom Types for New Settings
export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  aboutText: string;
  googleMapEmbed?: string;
}

export interface Customer {
  email: string;
  name: string;
  phone: string;
  password?: string;
  createdAt: string;
}

export interface StaffSchedule {
  stylistId: string;
  workingDays: string[]; // e.g. ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  startTime: string; // e.g. '09:00 AM'
  endTime: string; // e.g. '08:00 PM'
  offDates: string[]; // e.g. ['2026-07-04']
}

// Initial Location & Contact
const INITIAL_CONTACT_INFO: ContactInfo = {
  phone: '+1 (555) 902-8800',
  email: 'reserve@luxurysalonspa.com',
  address: '100 Royal Crescent Parkway, Suite 400, Mayfair, NY 10022',
  instagram: '@LuxurySalonSpa',
  facebook: 'LuxurySalonSpa',
  aboutText: 'Established in 2023. Our premium flagship sanctuary provides an unmatched atmosphere of luxury, organic restoration, and elite aesthetic craftsmanship.',
  googleMapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.9732!3d40.7589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258ffe0!2sMayfair!5e0!3m2!1sen!2sus!4v1625000000000!5m2!1sen!2sus'
};

// Initial Staff Schedules
const INITIAL_STAFF_SCHEDULES: StaffSchedule[] = INITIAL_STYLISTS.map(s => ({
  stylistId: s.id,
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  startTime: '09:00 AM',
  endTime: '08:00 PM',
  offDates: []
}));

// Storage Keys
const KEYS = {
  SERVICES: 'luxury_salon_services_v1',
  STYLISTS: 'luxury_salon_stylists_v1',
  TESTIMONIALS: 'luxury_salon_testimonials_v1',
  PROMOTIONS: 'luxury_salon_promotions_v1',
  BEFORE_AFTER: 'luxury_salon_before_after_v1',
  OPENING_HOURS: 'luxury_salon_opening_hours_v1',
  CONTACT_INFO: 'luxury_salon_contact_info_v1',
  APPOINTMENTS: 'luxury_salon_bookings', // matches existing appointments code
  STAFF_SCHEDULES: 'luxury_salon_staff_schedules_v1',
  CUSTOMERS: 'luxury_salon_customers_v1',
  LOGGED_IN_CUSTOMER: 'luxury_salon_logged_in_customer_v1',
  IS_ADMIN_LOGGED_IN: 'luxury_salon_is_admin_logged_in_v1',
  NOTIFICATIONS: 'luxury_salon_notifications_v1'
};

// Initialize LocalStorage with initial data if empty
export const initializeStore = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(KEYS.SERVICES)) {
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
  }
  if (!localStorage.getItem(KEYS.STYLISTS)) {
    localStorage.setItem(KEYS.STYLISTS, JSON.stringify(INITIAL_STYLISTS));
  }
  if (!localStorage.getItem(KEYS.TESTIMONIALS)) {
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(INITIAL_TESTIMONIALS));
  }
  if (!localStorage.getItem(KEYS.PROMOTIONS)) {
    localStorage.setItem(KEYS.PROMOTIONS, JSON.stringify(INITIAL_PROMOTIONS));
  }
  if (!localStorage.getItem(KEYS.BEFORE_AFTER)) {
    localStorage.setItem(KEYS.BEFORE_AFTER, JSON.stringify(INITIAL_BEFORE_AFTER_GALLERY));
  }
  if (!localStorage.getItem(KEYS.OPENING_HOURS)) {
    localStorage.setItem(KEYS.OPENING_HOURS, JSON.stringify(INITIAL_OPENING_HOURS));
  }
  if (!localStorage.getItem(KEYS.CONTACT_INFO)) {
    localStorage.setItem(KEYS.CONTACT_INFO, JSON.stringify(INITIAL_CONTACT_INFO));
  }
  if (!localStorage.getItem(KEYS.STAFF_SCHEDULES)) {
    localStorage.setItem(KEYS.STAFF_SCHEDULES, JSON.stringify(INITIAL_STAFF_SCHEDULES));
  }
  if (!localStorage.getItem(KEYS.CUSTOMERS)) {
    const defaultCustomer: Customer = {
      email: 'customer@example.com',
      name: 'Victoria Belmont',
      phone: '+1 (555) 241-9988',
      password: 'password123',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify([defaultCustomer]));

    // Let's seed initial booking for this customer
    const existingBookings = localStorage.getItem(KEYS.APPOINTMENTS);
    if (!existingBookings) {
      const d = new Date();
      d.setDate(d.getDate() + 4);
      const dateStr = d.toISOString().split('T')[0];
      const initialBooking: Appointment = {
        id: 'LS-908231',
        serviceId: 'hair-1',
        serviceName: 'Couture Haircut & Style',
        stylistId: 'stylist-1',
        stylistName: 'Sophia Chen',
        stylistImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80',
        date: dateStr,
        time: '10:00 AM',
        customerName: 'Victoria Belmont',
        customerEmail: 'customer@example.com',
        customerPhone: '+1 (555) 241-9988',
        notes: 'Requested premium organic silk hair masks. Scalp therapy included.',
        status: 'upcoming',
        totalPrice: 128,
        duration: 60,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify([initialBooking]));
    }
  }

  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    const initialNotifications: AppNotification[] = [
      {
        id: 'NT-1',
        customerEmail: 'customer@example.com',
        title: 'Welcome to VIP Privilege Circle',
        message: 'Thank you for registering. You have been granted access to the Member Suite, private booking controls, and the Circular Points tier program.',
        type: 'system',
        createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        read: false
      },
      {
        id: 'NT-2',
        customerEmail: 'customer@example.com',
        title: 'Upcoming Session Confirmed',
        message: 'Your reservation for "Couture Haircut & Style" on July 2nd at 10:00 AM with Sophia Chen is confirmed. A luxury suite has been prepared.',
        type: 'booking_confirmation',
        createdAt: new Date(Date.now() - 1200 * 1000).toISOString(),
        read: true,
        bookingId: 'LS-908231'
      }
    ];
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
  }
};

// Dispatch standard storage change event
const triggerUpdate = () => {
  window.dispatchEvent(new Event('luxury_salon_store_update'));
};

export const useSalonStore = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [beforeAfter, setBeforeAfter] = useState<typeof INITIAL_BEFORE_AFTER_GALLERY>(INITIAL_BEFORE_AFTER_GALLERY);
  const [openingHours, setOpeningHours] = useState<{ day: string; hours: string }[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(INITIAL_CONTACT_INFO);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [staffSchedules, setStaffSchedules] = useState<StaffSchedule[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const loadAll = () => {
    initializeStore();
    try {
      setServices(JSON.parse(localStorage.getItem(KEYS.SERVICES) || '[]'));
      setStylists(JSON.parse(localStorage.getItem(KEYS.STYLISTS) || '[]'));
      setTestimonials(JSON.parse(localStorage.getItem(KEYS.TESTIMONIALS) || '[]'));
      setPromotions(JSON.parse(localStorage.getItem(KEYS.PROMOTIONS) || '[]'));
      setBeforeAfter(JSON.parse(localStorage.getItem(KEYS.BEFORE_AFTER) || JSON.stringify(INITIAL_BEFORE_AFTER_GALLERY)));
      setOpeningHours(JSON.parse(localStorage.getItem(KEYS.OPENING_HOURS) || '[]'));
      setContactInfo(JSON.parse(localStorage.getItem(KEYS.CONTACT_INFO) || JSON.stringify(INITIAL_CONTACT_INFO)));
      setAppointments(JSON.parse(localStorage.getItem(KEYS.APPOINTMENTS) || '[]'));
      setStaffSchedules(JSON.parse(localStorage.getItem(KEYS.STAFF_SCHEDULES) || '[]'));
      setCustomers(JSON.parse(localStorage.getItem(KEYS.CUSTOMERS) || '[]'));
      setNotifications(JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]'));
      
      const loggedInStr = localStorage.getItem(KEYS.LOGGED_IN_CUSTOMER);
      setCurrentCustomer(loggedInStr ? JSON.parse(loggedInStr) : null);
      
      setIsAdminLoggedIn(localStorage.getItem(KEYS.IS_ADMIN_LOGGED_IN) === 'true');
    } catch (e) {
      console.error('Failed to load storage data', e);
    }
  };

  useEffect(() => {
    loadAll();
    const handleUpdate = () => {
      loadAll();
    };
    window.addEventListener('luxury_salon_store_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('luxury_salon_store_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Update Services
  const updateServices = (newServices: Service[]) => {
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(newServices));
    setServices(newServices);
    triggerUpdate();
  };

  // Update Stylists
  const updateStylists = (newStylists: Stylist[]) => {
    localStorage.setItem(KEYS.STYLISTS, JSON.stringify(newStylists));
    setStylists(newStylists);
    triggerUpdate();
  };

  // Update Testimonials
  const updateTestimonials = (newTestimonials: Testimonial[]) => {
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(newTestimonials));
    setTestimonials(newTestimonials);
    triggerUpdate();
  };

  // Update Promotions
  const updatePromotions = (newPromotions: Promotion[]) => {
    localStorage.setItem(KEYS.PROMOTIONS, JSON.stringify(newPromotions));
    setPromotions(newPromotions);
    triggerUpdate();
  };

  // Update Before After Gallery
  const updateBeforeAfter = (newBeforeAfter: typeof INITIAL_BEFORE_AFTER_GALLERY) => {
    localStorage.setItem(KEYS.BEFORE_AFTER, JSON.stringify(newBeforeAfter));
    setBeforeAfter(newBeforeAfter);
    triggerUpdate();
  };

  // Update Opening Hours
  const updateOpeningHours = (newOpeningHours: { day: string; hours: string }[]) => {
    localStorage.setItem(KEYS.OPENING_HOURS, JSON.stringify(newOpeningHours));
    setOpeningHours(newOpeningHours);
    triggerUpdate();
  };

  // Update Contact & Email Info
  const updateContactInfo = (newContact: ContactInfo) => {
    localStorage.setItem(KEYS.CONTACT_INFO, JSON.stringify(newContact));
    setContactInfo(newContact);
    triggerUpdate();
  };

  // Update Appointments (add, edit, status change)
  const updateAppointments = (newAppts: Appointment[]) => {
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(newAppts));
    setAppointments(newAppts);
    triggerUpdate();
  };

  // Update Staff Schedules
  const updateStaffSchedules = (newSchedules: StaffSchedule[]) => {
    localStorage.setItem(KEYS.STAFF_SCHEDULES, JSON.stringify(newSchedules));
    setStaffSchedules(newSchedules);
    triggerUpdate();
  };

  // Customer registration & Auth
  const registerCustomer = (customer: Customer): { success: boolean; message: string } => {
    const list = [...customers];
    const exists = list.some(c => c.email.toLowerCase() === customer.email.toLowerCase());
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    list.push(customer);
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(list));
    setCustomers(list);
    
    // Auto login
    localStorage.setItem(KEYS.LOGGED_IN_CUSTOMER, JSON.stringify(customer));
    setCurrentCustomer(customer);
    triggerUpdate();
    return { success: true, message: 'Account registered successfully.' };
  };

  const loginCustomer = (email: string, pass: string): { success: boolean; message: string } => {
    const found = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, message: 'No registered customer account found under this email.' };
    }
    if (found.password && found.password !== pass) {
      return { success: false, message: 'Incorrect passcode. Please try again.' };
    }
    
    localStorage.setItem(KEYS.LOGGED_IN_CUSTOMER, JSON.stringify(found));
    setCurrentCustomer(found);
    triggerUpdate();
    return { success: true, message: 'Welcome back!' };
  };

  const logoutCustomer = () => {
    localStorage.removeItem(KEYS.LOGGED_IN_CUSTOMER);
    setCurrentCustomer(null);
    triggerUpdate();
  };

  // Admin Auth
  const loginAdmin = (password: string): boolean => {
    if (password === 'admin123' || password === 'admin') {
      localStorage.setItem(KEYS.IS_ADMIN_LOGGED_IN, 'true');
      setIsAdminLoggedIn(true);
      triggerUpdate();
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    localStorage.setItem(KEYS.IS_ADMIN_LOGGED_IN, 'false');
    setIsAdminLoggedIn(false);
    triggerUpdate();
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    const id = 'NT-' + Math.floor(100000 + Math.random() * 900000);
    const newNotif: AppNotification = {
      ...notif,
      id,
      createdAt: new Date().toISOString(),
      read: false
    };
    const currentList = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]');
    const newList = [newNotif, ...currentList];
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(newList));
    setNotifications(newList);
    triggerUpdate();
  };

  const markNotificationAsRead = (id: string) => {
    const currentList = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]');
    const newList = currentList.map((n: AppNotification) => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(newList));
    setNotifications(newList);
    triggerUpdate();
  };

  const clearAllNotifications = (customerEmail: string) => {
    const currentList = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]');
    const newList = currentList.filter((n: AppNotification) => n.customerEmail.toLowerCase() !== customerEmail.toLowerCase());
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(newList));
    setNotifications(newList);
    triggerUpdate();
  };

  const deleteNotification = (id: string) => {
    const currentList = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]');
    const newList = currentList.filter((n: AppNotification) => n.id !== id);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(newList));
    setNotifications(newList);
    triggerUpdate();
  };

  return {
    services,
    stylists,
    testimonials,
    promotions,
    beforeAfter,
    openingHours,
    contactInfo,
    appointments,
    staffSchedules,
    customers,
    currentCustomer,
    isAdminLoggedIn,
    notifications,
    updateServices,
    updateStylists,
    updateTestimonials,
    updatePromotions,
    updateBeforeAfter,
    updateOpeningHours,
    updateContactInfo,
    updateAppointments,
    updateStaffSchedules,
    registerCustomer,
    loginCustomer,
    logoutCustomer,
    loginAdmin,
    logoutAdmin,
    addNotification,
    markNotificationAsRead,
    clearAllNotifications,
    deleteNotification
  };
};
