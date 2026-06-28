import React, { useState, useMemo } from 'react';
import { useSalonStore, StaffSchedule, ContactInfo } from '../lib/store';
import { Service, ServiceCategory, Stylist, Testimonial, Promotion, Appointment } from '../types';
import { 
  DollarSign, Calendar, Users, TrendingUp, Search, Check, 
  X, Trash2, Edit2, Plus, Settings, MapPin, Phone, Mail, 
  Clock, Award, Sparkles, Scissors, Eye, LogOut, CheckCircle, 
  RefreshCw, HelpCircle, Tag, ArrowLeftRight, ChevronRight, LayoutGrid
} from 'lucide-react';

export default function AdminPortal() {
  const {
    services,
    stylists,
    testimonials,
    promotions,
    beforeAfter,
    openingHours,
    contactInfo,
    appointments,
    staffSchedules,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    updateServices,
    updateStylists,
    updateTestimonials,
    updatePromotions,
    updateBeforeAfter,
    updateOpeningHours,
    updateContactInfo,
    updateAppointments,
    updateStaffSchedules
  } = useSalonStore();

  // Admin login passcode
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Active Admin Sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'appointments' | 'analytics' | 'services' | 'staff' | 'location' | 'pages'>('appointments');

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  // Service Edit States
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [svcForm, setSvcForm] = useState<Partial<Service>>({});
  const [isAddingService, setIsAddingService] = useState(false);

  // Stylist Edit States
  const [editingStylistId, setEditingStylistId] = useState<string | null>(null);
  const [stylistForm, setStylistForm] = useState<Partial<Stylist>>({});
  const [isAddingStylist, setIsAddingStylist] = useState(false);

  // Schedule Edit States
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [schedForm, setSchedForm] = useState<Partial<StaffSchedule>>({});

  // Promo Code States
  const [promoForm, setPromoForm] = useState<Partial<Promotion>>({});
  const [isAddingPromo, setIsAddingPromo] = useState(false);

  // Testimonial States
  const [testiForm, setTestiForm] = useState<Partial<Testimonial>>({});
  const [isAddingTesti, setIsAddingTesti] = useState(false);

  // Rescheduling state
  const [rescheduleBooking, setRescheduleBooking] = useState<Appointment | null>(null);
  const [reschedDate, setReschedDate] = useState('');
  const [reschedTime, setReschedTime] = useState('');

  // Contact Info states
  const [contactForm, setContactForm] = useState<ContactInfo>(contactInfo);
  const [isContactSaved, setIsContactSaved] = useState(false);

  // Opening Hours states
  const [hoursList, setHoursList] = useState(openingHours);
  const [isHoursSaved, setIsHoursSaved] = useState(false);

  // Before After slider states
  const [beforeAfterTitle, setBeforeAfterTitle] = useState(beforeAfter.title);
  const [beforeAfterSubtitle, setBeforeAfterSubtitle] = useState(beforeAfter.subtitle);
  const [baItems, setBaItems] = useState(beforeAfter.items);
  const [isBaSaved, setIsBaSaved] = useState(false);

  // Handle Admin Auth
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(false);
    const success = loginAdmin(passcode);
    if (!success) {
      setLoginError(true);
    }
  };

  // --- Dynamic Financial Calculations for Revenue Analytics ---
  const stats = useMemo(() => {
    const completed = appointments.filter(a => a.status === 'completed');
    const totalRev = completed.reduce((sum, a) => sum + a.totalPrice, 0);
    const avgTicket = completed.length > 0 ? Math.round(totalRev / completed.length) : 0;
    
    // Revenue by category
    const categoryRev: Record<string, number> = {};
    completed.forEach(a => {
      // Find category of service
      const svc = services.find(s => s.id === a.serviceId);
      const cat = svc ? svc.category : 'Other';
      categoryRev[cat] = (categoryRev[cat] || 0) + a.totalPrice;
    });

    // Revenue by Stylist
    const stylistRev: Record<string, number> = {};
    completed.forEach(a => {
      stylistRev[a.stylistName] = (stylistRev[a.stylistName] || 0) + a.totalPrice;
    });

    // Monthly Trend Simulation (Jan - Dec)
    const monthlySales = [
      { name: 'Jan', sales: 4200 },
      { name: 'Feb', sales: 5100 },
      { name: 'Mar', sales: 4800 },
      { name: 'Apr', sales: 6200 },
      { name: 'May', sales: 7500 },
      { name: 'Jun', sales: 8900 },
      { name: 'Jul', sales: 9800 },
      { name: 'Aug', sales: 9100 },
      { name: 'Sep', sales: 8400 },
      { name: 'Oct', sales: 9600 },
      { name: 'Nov', sales: 11200 },
      { name: 'Dec', sales: 14500 }
    ];
    // Scale or append current actual sales to June (based on current 2026 local time month)
    monthlySales[5].sales += totalRev; // June is index 5

    return {
      totalRev,
      totalCount: appointments.length,
      completedCount: completed.length,
      upcomingCount: appointments.filter(a => a.status === 'upcoming').length,
      cancelledCount: appointments.filter(a => a.status === 'cancelled').length,
      avgTicket,
      categoryRev,
      stylistRev,
      monthlySales
    };
  }, [appointments, services]);

  // Filtered Appointments List
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appt => {
      const matchesSearch = 
        appt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || appt.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, statusFilter]);

  // Appointment Status Modification
  const handleUpdateApptStatus = (id: string, newStatus: 'upcoming' | 'completed' | 'cancelled') => {
    const updated = appointments.map(a => {
      if (a.id === id) {
        return { ...a, status: newStatus };
      }
      return a;
    });
    updateAppointments(updated);
  };

  // Appointment Rescheduling Save
  const handleSaveReschedule = () => {
    if (!rescheduleBooking || !reschedDate || !reschedTime) return;
    const updated = appointments.map(a => {
      if (a.id === rescheduleBooking.id) {
        return {
          ...a,
          date: reschedDate,
          time: reschedTime,
          notes: (a.notes || '') + ` (Admin rescheduled to ${reschedDate} at ${reschedTime})`
        };
      }
      return a;
    });
    updateAppointments(updated);
    setRescheduleBooking(null);
  };

  // --- Services Management ---
  const handleEditServiceClick = (svc: Service) => {
    setEditingServiceId(svc.id);
    setSvcForm(svc);
  };

  const handleSaveService = () => {
    if (!svcForm.name || !svcForm.price || !svcForm.duration) return;
    
    let updated;
    if (editingServiceId) {
      updated = services.map(s => s.id === editingServiceId ? { ...s, ...svcForm } as Service : s);
    } else {
      const newSvc: Service = {
        id: 'hair-' + Math.floor(1000 + Math.random() * 9000),
        name: svcForm.name,
        category: svcForm.category || ServiceCategory.HAIR,
        price: Number(svcForm.price),
        duration: Number(svcForm.duration),
        description: svcForm.description || '',
        imageUrl: svcForm.imageUrl || 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80',
        popular: !!svcForm.popular
      };
      updated = [...services, newSvc];
    }
    updateServices(updated);
    setEditingServiceId(null);
    setIsAddingService(false);
    setSvcForm({});
  };

  const handleDeleteService = (id: string) => {
    const confirm = window.confirm('Are you sure you would like to delete this service from the menu?');
    if (!confirm) return;
    const updated = services.filter(s => s.id !== id);
    updateServices(updated);
  };

  // --- Stylists Management ---
  const handleEditStylistClick = (sty: Stylist) => {
    setEditingStylistId(sty.id);
    setStylistForm(sty);
  };

  const handleSaveStylist = () => {
    if (!stylistForm.name || !stylistForm.role) return;

    let updated;
    if (editingStylistId) {
      updated = stylists.map(s => s.id === editingStylistId ? { ...s, ...stylistForm } as Stylist : s);
    } else {
      const newSty: Stylist = {
        id: 'stylist-' + Math.floor(10 + Math.random() * 90),
        name: stylistForm.name,
        role: stylistForm.role,
        rating: 4.90,
        imageUrl: stylistForm.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=500&q=80',
        bio: stylistForm.bio || '',
        specialties: stylistForm.specialties || ['Therapy', 'Aesthetics']
      };
      updated = [...stylists, newSty];
    }
    updateStylists(updated);
    setEditingStylistId(null);
    setIsAddingStylist(false);
    setStylistForm({});
  };

  const handleDeleteStylist = (id: string) => {
    const confirm = window.confirm('Are you sure you want to remove this stylist from your team?');
    if (!confirm) return;
    const updated = stylists.filter(s => s.id !== id);
    updateStylists(updated);
  };

  // --- Staff Scheduling Management ---
  const handleEditScheduleClick = (schedule: StaffSchedule) => {
    setEditingScheduleId(schedule.stylistId);
    setSchedForm(schedule);
  };

  const handleSaveSchedule = () => {
    if (!schedForm.stylistId) return;
    const updated = staffSchedules.map(s => s.stylistId === schedForm.stylistId ? { ...s, ...schedForm } as StaffSchedule : s);
    updateStaffSchedules(updated);
    setEditingScheduleId(null);
  };

  // Toggle day for staff schedule
  const handleToggleSchedDay = (day: string) => {
    const currentDays = schedForm.workingDays || [];
    let updatedDays;
    if (currentDays.includes(day)) {
      updatedDays = currentDays.filter(d => d !== day);
    } else {
      updatedDays = [...currentDays, day];
    }
    setSchedForm({ ...schedForm, workingDays: updatedDays });
  };

  // --- Location & Settings Save ---
  const handleSaveContactInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactInfo(contactForm);
    setIsContactSaved(true);
    setTimeout(() => setIsContactSaved(false), 2000);
  };

  const handleSaveOpeningHours = () => {
    updateOpeningHours(hoursList);
    setIsHoursSaved(true);
    setTimeout(() => setIsHoursSaved(false), 2000);
  };

  const handleUpdateHoursValue = (index: number, field: 'day' | 'hours', value: string) => {
    const newList = [...hoursList];
    newList[index] = { ...newList[index], [field]: value };
    setHoursList(newList);
  };

  // --- Promotional Coupon Management ---
  const handleSavePromotion = () => {
    if (!promoForm.title || !promoForm.code || !promoForm.discount) return;
    const newPromo: Promotion = {
      id: 'promo-' + Math.floor(100 + Math.random() * 900),
      title: promoForm.title,
      description: promoForm.description || '',
      code: promoForm.code.toUpperCase(),
      discount: promoForm.discount,
      expiry: promoForm.expiry || 'Dec 31, 2026'
    };
    const updated = [...promotions, newPromo];
    updatePromotions(updated);
    setIsAddingPromo(false);
    setPromoForm({});
  };

  const handleDeletePromo = (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this promotional coupon code?');
    if (!confirm) return;
    updatePromotions(promotions.filter(p => p.id !== id));
  };

  // --- Testimonials & Reviews Management ---
  const handleSaveTesti = () => {
    if (!testiForm.name || !testiForm.comment) return;
    const newTesti: Testimonial = {
      id: 't-' + Math.floor(100 + Math.random() * 900),
      name: testiForm.name,
      role: testiForm.role || 'Groomed Client',
      rating: testiForm.rating || 5,
      comment: testiForm.comment,
      imageUrl: testiForm.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
    };
    updateTestimonials([...testimonials, newTesti]);
    setIsAddingTesti(false);
    setTestiForm({});
  };

  const handleDeleteTesti = (id: string) => {
    const confirm = window.confirm('Delete this user review?');
    if (!confirm) return;
    updateTestimonials(testimonials.filter(t => t.id !== id));
  };

  // --- Before After Page Editor Save ---
  const handleSaveBeforeAfterSettings = () => {
    updateBeforeAfter({
      title: beforeAfterTitle,
      subtitle: beforeAfterSubtitle,
      items: baItems
    });
    setIsBaSaved(true);
    setTimeout(() => setIsBaSaved(false), 2000);
  };

  const handleUpdateBaItem = (index: number, field: string, value: string) => {
    const newItems = [...baItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setBaItems(newItems);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      
      {!isAdminLoggedIn ? (
        /* ========================================================
            ADMIN PASSCODE LOGIN CARD
            ======================================================== */
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
          <div className="bg-slate-850 border border-gold-500/30 text-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 animate-scaleIn relative overflow-hidden">
            {/* Elegant gold mesh line decoration */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400"></div>

            <div className="text-center space-y-2">
              <span className="text-[10px] tracking-[0.45em] uppercase font-mono text-gold-400 font-bold block">
                BUSINESS GATEWAY
              </span>
              <h2 className="font-serif text-2xl text-white font-semibold">
                Salon Administration
              </h2>
              <p className="text-xs text-slate-400 font-light">
                Please input your administrative security code to access business revenue, scheduling, and portal catalogs.
              </p>
            </div>

            {loginError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl text-center">
                Incorrect business passcode. (Hint: use <strong className="font-bold">admin</strong> or <strong className="font-bold">admin123</strong>)
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Security Passcode</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 focus:border-gold-500 focus:outline-none rounded-xl py-3 px-4 text-xs text-white tracking-widest text-center font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-slate-950 font-sans font-bold text-xs tracking-widest uppercase rounded-xl shadow-lg hover:shadow-gold-500/10 transition-all cursor-pointer"
              >
                Unlock Operations Panel
              </button>
            </form>

            <div className="text-center text-[10px] text-slate-500 font-mono">
              SECURE SEC SESSION &bull; PORT 3000
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================
            CORE PRIVATE ADMIN DASHBOARD LAYOUT
            ======================================================== */
        <div className="min-h-screen flex flex-col lg:flex-row">
          
          {/* Left Navigation Panel Sidebar */}
          <aside className="w-full lg:w-72 bg-slate-900 text-white flex flex-col justify-between p-6 border-b lg:border-b-0 lg:border-r border-slate-800 flex-shrink-0">
            <div className="space-y-8">
              {/* Brand Title */}
              <div className="flex flex-col border-b border-slate-800 pb-5">
                <span className="font-serif text-2xl tracking-widest text-white font-bold">LUXURY</span>
                <span className="text-[10px] tracking-[0.4em] text-gold-400 font-mono -mt-1 pl-0.5">ADMIN CONSOLE</span>
              </div>

              {/* Subtabs lists */}
              <nav className="flex flex-col space-y-1.5">
                {[
                  { id: 'appointments', label: 'Reservations CRM', icon: Calendar },
                  { id: 'analytics', label: 'Revenue Analytics', icon: TrendingUp },
                  { id: 'services', label: 'Services & Prices', icon: DollarSign },
                  { id: 'staff', label: 'Staff & Scheduling', icon: Scissors },
                  { id: 'location', label: 'Location & Contacts', icon: MapPin },
                  { id: 'pages', label: 'Page Customizer', icon: LayoutGrid }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeSubTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSubTab(tab.id as any)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-medium tracking-wide transition-all text-left cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-gold-400/20 to-gold-500/10 border-l-4 border-gold-400 text-gold-400 font-semibold'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-slate-400'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Logout footer block */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between mt-8 lg:mt-0">
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-300 truncate">Manager Account</span>
                <span className="text-[9px] font-mono text-slate-500">concierge@flagship</span>
              </div>
              <button
                onClick={logoutAdmin}
                className="p-2 border border-slate-800 hover:bg-red-500/10 hover:border-red-500/20 rounded-xl text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                title="Log Out Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </aside>

          {/* Main Subtab Workspace Panel */}
          <main className="flex-grow p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8 overflow-y-auto">
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-[0.35em] text-gold-600 font-bold block">
                  SYSTEM OVERVIEW &bull; LIVE DATA
                </span>
                <h1 className="font-serif text-3xl text-slate-900 font-semibold mt-1 capitalize">
                  {activeSubTab.replace('-', ' ')} Operations
                </h1>
              </div>

              {/* Quick Status Pill */}
              <div className="flex items-center space-x-2 text-xs font-mono bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-600 font-semibold">Durable Connection Secure</span>
              </div>
            </div>

            {/* ========================================================
                TAB 1: APPOINTMENTS WORKSPACE (CRM MODULE)
                ======================================================== */}
            {activeSubTab === 'appointments' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Search & Filter bar */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-xs">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by ID, client name, phone or treatment..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-xl py-2 pl-10 pr-4 text-xs"
                    />
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    {['all', 'upcoming', 'completed', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status as any)}
                        className={`flex-1 md:flex-initial px-4 py-2 border rounded-full text-[10px] tracking-wider uppercase font-semibold transition-all cursor-pointer ${
                          statusFilter === status
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Table Card */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-100">
                          <th className="py-4 px-6">Voucher ID</th>
                          <th className="py-4 px-6">Guest Client</th>
                          <th className="py-4 px-6">Treatment</th>
                          <th className="py-4 px-6">Therapist</th>
                          <th className="py-4 px-6">Schedule</th>
                          <th className="py-4 px-6">Cost</th>
                          <th className="py-4 px-6 text-center">Status</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {filteredAppointments.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-12 text-center text-slate-400 font-light text-sm">
                              No salon appointments found matching current parameters.
                            </td>
                          </tr>
                        ) : (
                          filteredAppointments.map((appt) => (
                            <tr key={appt.id} className="hover:bg-slate-50/50 transition-all">
                              <td className="py-4 px-6 font-mono font-semibold text-slate-500">
                                {appt.id}
                              </td>
                              <td className="py-4 px-6">
                                <div className="font-semibold text-slate-900">{appt.customerName}</div>
                                <div className="text-[10px] text-slate-400">{appt.customerEmail} &bull; {appt.customerPhone}</div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="font-medium text-slate-800">{appt.serviceName}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{appt.duration} mins</div>
                              </td>
                              <td className="py-4 px-6 font-medium text-slate-700">
                                {appt.stylistName}
                              </td>
                              <td className="py-4 px-6">
                                <div className="font-semibold text-slate-800">{appt.date}</div>
                                <div className="text-slate-500 font-mono text-[10px]">{appt.time}</div>
                              </td>
                              <td className="py-4 px-6 font-serif font-bold text-gold-600">
                                ${appt.totalPrice}
                              </td>
                              <td className="py-4 px-6 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider font-bold ${
                                  appt.status === 'completed'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : appt.status === 'cancelled'
                                      ? 'bg-red-50 text-red-500'
                                      : 'bg-amber-50 text-amber-700'
                                }`}>
                                  {appt.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                                {appt.status === 'upcoming' && (
                                  <>
                                    <button
                                      onClick={() => handleUpdateApptStatus(appt.id, 'completed')}
                                      className="p-1.5 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 rounded-lg text-emerald-600 transition-all cursor-pointer"
                                      title="Mark Complete"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setRescheduleBooking(appt);
                                        setReschedDate(appt.date);
                                        setReschedTime(appt.time);
                                      }}
                                      className="p-1.5 border border-slate-200 hover:bg-gold-50 hover:border-gold-300 rounded-lg text-gold-700 transition-all cursor-pointer"
                                      title="Reschedule Session"
                                    >
                                      <ArrowLeftRight className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleUpdateApptStatus(appt.id, 'cancelled')}
                                      className="p-1.5 border border-slate-200 hover:bg-red-50 hover:border-red-300 rounded-lg text-red-500 transition-all cursor-pointer"
                                      title="Cancel Reservation"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 2: REVENUE ANALYTICS (EXECUTIVE DASHBOARD)
                ======================================================== */}
            {activeSubTab === 'analytics' && (
              <div className="space-y-10 animate-fadeIn">
                {/* 3 Metrics KPI Cards row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Revenue card */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Total Billed Revenue</span>
                      <h3 className="font-serif text-3xl font-bold text-slate-900">${stats.totalRev}.00</h3>
                      <span className="text-[10px] text-emerald-600 font-mono font-semibold flex items-center">
                        <TrendingUp className="w-3 h-3 mr-0.5" />
                        +14.8% from last month
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <DollarSign className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Completed Sales count */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Accomplished Sessions</span>
                      <h3 className="font-serif text-3xl font-bold text-slate-900">{stats.completedCount}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">From {stats.totalCount} overall reservations</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-600 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Ticket Average (AOV) */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Average Ticket Ticket</span>
                      <h3 className="font-serif text-3xl font-bold text-slate-900">${stats.avgTicket}.00</h3>
                      <span className="text-[10px] text-indigo-600 font-mono font-semibold">Premium treatment index</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Dynamic Vector charts block */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left: Custom SVG Line Trend Chart (8 cols) */}
                  <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                    <div>
                      <h4 className="font-serif text-base font-semibold text-slate-900">Annual Gross Revenue Trend</h4>
                      <p className="text-[11px] text-slate-400">Gross monthly revenue in INR. Animated gradient baseline.</p>
                    </div>

                    {/* Highly interactive, custom vector-drawn SVG line chart */}
                    <div className="relative h-64 w-full">
                      <svg viewBox="0 0 500 200" className="w-full h-full" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#DFB25E" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#DFB25E" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Horizontal grid lines */}
                        <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                        
                        {/* Area gradient under line */}
                        <path
                          d="M 10 180 Q 50 140 90 150 T 170 120 T 250 110 T 330 90 T 410 70 T 490 30 L 490 190 L 10 190 Z"
                          fill="url(#chart-grad)"
                        />

                        {/* Gold trend line */}
                        <path
                          d="M 10 180 Q 50 140 90 150 T 170 120 T 250 110 T 330 90 T 410 70 T 490 30"
                          fill="none"
                          stroke="#DFB25E"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />

                        {/* Dots on line */}
                        <circle cx="10" cy="180" r="4" fill="#ffffff" stroke="#DFB25E" strokeWidth="2.5" />
                        <circle cx="90" cy="150" r="4" fill="#ffffff" stroke="#DFB25E" strokeWidth="2.5" />
                        <circle cx="170" cy="120" r="4" fill="#ffffff" stroke="#DFB25E" strokeWidth="2.5" />
                        <circle cx="250" cy="110" r="4" fill="#ffffff" stroke="#DFB25E" strokeWidth="2.5" />
                        <circle cx="330" cy="90" r="4" fill="#ffffff" stroke="#DFB25E" strokeWidth="2.5" />
                        <circle cx="410" cy="70" r="4" fill="#ffffff" stroke="#DFB25E" strokeWidth="2.5" />
                        <circle cx="490" cy="30" r="4" fill="#ffffff" stroke="#DFB25E" strokeWidth="2.5" />
                      </svg>
                      
                      {/* Months label row below */}
                      <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-2 px-1">
                        <span>Jan</span>
                        <span>Mar</span>
                        <span>May</span>
                        <span>Jul</span>
                        <span>Sep</span>
                        <span>Nov</span>
                        <span>Dec (Projected)</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Category Performance (4 cols) */}
                  <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                    <div>
                      <h4 className="font-serif text-base font-semibold text-slate-900">Billed Categories</h4>
                      <p className="text-[11px] text-slate-400">Revenue contribution per category.</p>
                    </div>

                    <div className="space-y-4">
                      {Object.values(ServiceCategory).map((cat) => {
                        const totalCatRev = stats.categoryRev[cat] || 0;
                        const percent = stats.totalRev > 0 ? Math.round((totalCatRev / stats.totalRev) * 100) : 0;
                        return (
                          <div key={cat} className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-medium text-slate-700">{cat}</span>
                              <span className="font-mono text-slate-500 font-semibold">${totalCatRev} ({percent}%)</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gold-400 rounded-full transition-all"
                                style={{ width: `${Math.max(4, percent)}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Team Sales performance details */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                  <div>
                    <h4 className="font-serif text-base font-semibold text-slate-900">Stylist Revenue Performance</h4>
                    <p className="text-[11px] text-slate-400">Total revenue generated by each stylist during completed treatments.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stylists.map((sty) => {
                      const totalStyRev = stats.stylistRev[sty.name] || 0;
                      return (
                        <div key={sty.id} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 flex items-center space-x-3.5">
                          <img
                            src={sty.imageUrl}
                            alt={sty.name}
                            className="w-12 h-12 rounded-full object-cover border border-gold-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block">{sty.role.split('&')[0]}</span>
                            <span className="text-xs font-semibold text-slate-800 block">{sty.name}</span>
                            <span className="font-serif text-sm font-bold text-gold-600">${totalStyRev}.00 generated</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 3: SERVICES & PRICE MANAGEMENT
                ======================================================== */}
            {activeSubTab === 'services' && (
              <div className="space-y-8 animate-fadeIn">
                {/* Header section with add action */}
                <div className="flex justify-between items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <div className="text-xs text-slate-500">
                    Instantly update therapy prices, descriptions, popular markers, or insert brand new packages.
                  </div>
                  <button
                    onClick={() => {
                      setIsAddingService(true);
                      setEditingServiceId(null);
                      setSvcForm({});
                    }}
                    className="px-4 py-2 bg-slate-900 text-white hover:bg-gold-500 hover:text-slate-950 transition-all rounded-xl text-[10px] tracking-widest uppercase font-semibold flex items-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Treatment</span>
                  </button>
                </div>

                {/* Inline Editing/Addition Card */}
                {(isAddingService || editingServiceId) && (
                  <div className="bg-white border-2 border-gold-300 rounded-3xl p-6 shadow-md space-y-4 animate-scaleIn">
                    <h3 className="font-serif text-lg font-semibold text-slate-900">
                      {editingServiceId ? 'Modify Treatment Details' : 'Design New Salon Treatment'}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Treatment Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Imperial Silk Scalp Mask"
                          value={svcForm.name || ''}
                          onChange={(e) => setSvcForm({ ...svcForm, name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-gold-400 focus:outline-none rounded-xl py-2 px-3 text-xs"
                        />
                      </div>

                      {/* Category */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Category</label>
                        <select
                          value={svcForm.category || ServiceCategory.HAIR}
                          onChange={(e) => setSvcForm({ ...svcForm, category: e.target.value as any })}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-gold-400 focus:outline-none rounded-xl py-2 px-3 text-xs"
                        >
                          {Object.values(ServiceCategory).map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      {/* Price & Duration */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Price (INR)</label>
                          <input
                            type="number"
                            placeholder="120"
                            value={svcForm.price || ''}
                            onChange={(e) => setSvcForm({ ...svcForm, price: Number(e.target.value) })}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-gold-400 focus:outline-none rounded-xl py-2 px-3 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Mins</label>
                          <input
                            type="number"
                            placeholder="60"
                            value={svcForm.duration || ''}
                            onChange={(e) => setSvcForm({ ...svcForm, duration: Number(e.target.value) })}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-gold-400 focus:outline-none rounded-xl py-2 px-3 text-xs"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Bespoke Description</label>
                        <input
                          type="text"
                          placeholder="A comprehensive nourishing botanical facial..."
                          value={svcForm.description || ''}
                          onChange={(e) => setSvcForm({ ...svcForm, description: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-gold-400 focus:outline-none rounded-xl py-2 px-3 text-xs"
                        />
                      </div>

                      {/* Popular flag */}
                      <div className="flex items-center space-x-2 pt-4">
                        <input
                          type="checkbox"
                          id="popular-flag"
                          checked={!!svcForm.popular}
                          onChange={(e) => setSvcForm({ ...svcForm, popular: e.target.checked })}
                          className="w-4 h-4 text-gold-500 border-gray-300 rounded focus:ring-gold-400"
                        />
                        <label htmlFor="popular-flag" className="text-xs text-slate-600 font-medium select-none">Popular treatment</label>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button
                        onClick={() => {
                          setEditingServiceId(null);
                          setIsAddingService(false);
                          setSvcForm({});
                        }}
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-[10px] tracking-wider uppercase font-semibold text-slate-500 cursor-pointer"
                      >
                        Discard
                      </button>
                      <button
                        onClick={handleSaveService}
                        className="px-5 py-2.5 bg-slate-900 text-white hover:bg-gold-500 hover:text-slate-950 transition-all rounded-xl text-[10px] tracking-wider uppercase font-semibold cursor-pointer"
                      >
                        Save Treatment
                      </button>
                    </div>
                  </div>
                )}

                {/* Services catalog Table list */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-100">
                          <th className="py-4 px-6">Service Name</th>
                          <th className="py-4 px-6">Category</th>
                          <th className="py-4 px-6">Duration</th>
                          <th className="py-4 px-6">Featured</th>
                          <th className="py-4 px-6">Price INR</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {services.map((svc) => (
                          <tr key={svc.id} className="hover:bg-slate-50/50 transition-all">
                            <td className="py-4 px-6 font-semibold text-slate-900">
                              <div>{svc.name}</div>
                              <div className="text-[10px] text-slate-400 font-light mt-0.5 max-w-sm line-clamp-1">{svc.description}</div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono font-medium">
                                {svc.category}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-slate-500 font-mono">
                              {svc.duration} Mins
                            </td>
                            <td className="py-4 px-6">
                              {svc.popular ? (
                                <span className="text-gold-500 font-bold text-xs">★ Popular</span>
                              ) : (
                                <span className="text-slate-300 text-xs">Standard</span>
                              )}
                            </td>
                            <td className="py-4 px-6 font-serif font-bold text-gold-600 text-sm">
                              ${svc.price}.00
                            </td>
                            <td className="py-4 px-6 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => handleEditServiceClick(svc)}
                                className="p-1.5 border border-slate-200 hover:bg-gold-50 hover:border-gold-300 rounded-lg text-gold-600 transition-all cursor-pointer"
                                title="Edit Service"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteService(svc.id)}
                                className="p-1.5 border border-slate-200 hover:bg-red-50 hover:border-red-300 rounded-lg text-red-500 transition-all cursor-pointer"
                                title="Delete Service"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 4: STAFF & SHIFT SCHEDULING MANAGEMENT
                ======================================================== */}
            {activeSubTab === 'staff' && (
              <div className="space-y-10 animate-fadeIn">
                
                {/* Stylists profiles team directory card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-slate-900">Therapists Profiles Registry</h3>
                      <p className="text-[11px] text-slate-400">Edit stylists' roles, bios, rating score index, and specialties.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stylists.map((sty) => {
                      const isEditing = editingStylistId === sty.id;
                      return (
                        <div key={sty.id} className="border border-slate-200 rounded-2xl p-4 flex flex-col justify-between gap-4 bg-slate-50/50">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={stylistForm.name || ''}
                                  onChange={(e) => setStylistForm({ ...stylistForm, name: e.target.value })}
                                  placeholder="Name"
                                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                                />
                                <input
                                  type="text"
                                  value={stylistForm.role || ''}
                                  onChange={(e) => setStylistForm({ ...stylistForm, role: e.target.value })}
                                  placeholder="Role"
                                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                                />
                              </div>
                              <textarea
                                value={stylistForm.bio || ''}
                                onChange={(e) => setStylistForm({ ...stylistForm, bio: e.target.value })}
                                placeholder="Biography..."
                                rows={2}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none resize-none"
                              />
                              <div className="flex gap-2">
                                <button onClick={handleSaveStylist} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] uppercase font-bold cursor-pointer">Save</button>
                                <button onClick={() => setEditingStylistId(null)} className="px-3 py-1.5 bg-slate-200 rounded-lg text-[10px] uppercase text-slate-600 font-bold cursor-pointer">Discard</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-4">
                              <img
                                src={sty.imageUrl}
                                alt={sty.name}
                                className="w-16 h-20 rounded-xl object-cover object-top border border-gold-200"
                                referrerPolicy="no-referrer"
                              />
                              <div className="space-y-1 min-w-0">
                                <span className="text-[8px] font-mono tracking-widest text-gold-600 uppercase block">{sty.role}</span>
                                <h4 className="font-serif text-sm font-bold text-slate-900 truncate">{sty.name}</h4>
                                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{sty.bio}</p>
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {sty.specialties.map(sp => (
                                    <span key={sp} className="text-[8px] font-mono bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">{sp}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {!isEditing && (
                            <div className="flex gap-2 self-end">
                              <button
                                onClick={() => handleEditStylistClick(sty)}
                                className="px-2.5 py-1 text-[10px] font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-gold-50 hover:text-gold-700 transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>Edit Profile</span>
                              </button>
                              <button
                                onClick={() => handleDeleteStylist(sty.id)}
                                className="px-2.5 py-1 text-[10px] font-semibold text-red-500 border border-slate-200 hover:bg-red-50 hover:border-red-200 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Staff Shift Scheduling Calendar Planner */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-slate-900">Weekly Shift & Hours Scheduling</h3>
                    <p className="text-[11px] text-slate-400">Lock working weekdays, start hours, and end shift hours for the artist group.</p>
                  </div>

                  <div className="space-y-4">
                    {staffSchedules.map((sched) => {
                      const isEditingSched = editingScheduleId === sched.stylistId;
                      const stylist = stylists.find(s => s.id === sched.stylistId);
                      if (!stylist) return null;

                      return (
                        <div key={sched.stylistId} className="border border-slate-100 rounded-2xl p-4 sm:p-5 bg-slate-50/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex items-center space-x-3">
                            <img src={stylist.imageUrl} alt={stylist.name} className="w-10 h-10 rounded-full object-cover border" referrerPolicy="no-referrer" />
                            <div>
                              <h4 className="font-serif text-sm font-bold text-slate-900">{stylist.name}</h4>
                              <p className="text-[10px] text-slate-400 font-mono">Shift: {sched.startTime} &mdash; {sched.endTime}</p>
                            </div>
                          </div>

                          {isEditingSched ? (
                            <div className="w-full sm:w-auto space-y-3 bg-white border border-gold-200 p-4 rounded-xl">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[8px] font-mono text-slate-400 block">Shift Start</label>
                                  <input type="text" value={schedForm.startTime || ''} onChange={(e) => setSchedForm({...schedForm, startTime: e.target.value})} className="border rounded px-2 py-1 text-xs w-full" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[8px] font-mono text-slate-400 block">Shift End</label>
                                  <input type="text" value={schedForm.endTime || ''} onChange={(e) => setSchedForm({...schedForm, endTime: e.target.value})} className="border rounded px-2 py-1 text-xs w-full" />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[8px] font-mono text-slate-400 block">Working Weekdays</label>
                                <div className="flex flex-wrap gap-1">
                                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                                    const isSel = schedForm.workingDays?.includes(day);
                                    return (
                                      <button key={day} onClick={() => handleToggleSchedDay(day)} className={`px-2 py-1 border rounded text-[9px] cursor-pointer ${isSel ? 'bg-gold-500 border-gold-500 text-white font-bold' : 'bg-white text-slate-600'}`}>
                                        {day.slice(0, 3)}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={handleSaveSchedule} className="px-3 py-1.5 bg-slate-900 text-white text-[9px] uppercase font-bold rounded-lg cursor-pointer">Save shift</button>
                                <button onClick={() => setEditingScheduleId(null)} className="px-3 py-1.5 bg-slate-200 text-[9px] uppercase rounded-lg text-slate-600 font-bold cursor-pointer">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                              <div className="flex flex-wrap gap-1 justify-end">
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                                  const isWorking = sched.workingDays.includes(day);
                                  return (
                                    <span key={day} className={`px-1.5 py-0.5 rounded font-mono text-[8px] font-semibold ${isWorking ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-400'}`}>
                                      {day.slice(0,3)}
                                    </span>
                                  );
                                })}
                              </div>
                              <button onClick={() => handleEditScheduleClick(sched)} className="text-[10px] font-semibold text-gold-600 hover:underline flex items-center gap-1 cursor-pointer">
                                <Clock className="w-3 h-3" />
                                <span>Adjust shift calendar</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================
                TAB 5: LOCATION, CONTACTS & EMAIL EDITING
                ======================================================== */}
            {activeSubTab === 'location' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left: Contact Info Form (8 cols) */}
                  <form onSubmit={handleSaveContactInfo} className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-slate-900">Bespoke Flagship Contact Coordinates</h3>
                      <p className="text-[11px] text-slate-400 font-light">Customize physical coordinates, support emails, reservation telephone, and brand biographies.</p>
                    </div>

                    {isContactSaved && (
                      <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-3 rounded-xl text-center text-xs">
                        ✓ Flagship Contact specifications successfully saved.
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Physical Address */}
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Flagship Address</label>
                        <input
                          type="text"
                          value={contactForm.address}
                          onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-gold-500"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Concierge Phone Number</label>
                        <input
                          type="text"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-gold-500"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Support / Reservation Email</label>
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                        />
                      </div>

                      {/* Social handles */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Instagram Handle</label>
                        <input
                          type="text"
                          value={contactForm.instagram}
                          onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Facebook Page Name</label>
                        <input
                          type="text"
                          value={contactForm.facebook}
                          onChange={(e) => setContactForm({ ...contactForm, facebook: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                        />
                      </div>

                      {/* Map Link */}
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Google Map Embed Link URL (IFrame Src)</label>
                        <input
                          type="text"
                          value={contactForm.googleMapEmbed}
                          onChange={(e) => setContactForm({ ...contactForm, googleMapEmbed: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                        />
                      </div>

                      {/* About Brand text */}
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Footer Brand Biography</label>
                        <textarea
                          value={contactForm.aboutText}
                          onChange={(e) => setContactForm({ ...contactForm, aboutText: e.target.value })}
                          rows={3}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-slate-900 text-white hover:bg-gold-500 hover:text-slate-950 transition-all text-[10px] tracking-widest uppercase font-semibold rounded-xl cursor-pointer"
                    >
                      Save Coordinates
                    </button>
                  </form>

                  {/* Right: Opening Hours editor (4 cols) */}
                  <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
                    <div>
                      <h3 className="font-serif text-base font-semibold text-slate-900">Flagship Opening Hours</h3>
                      <p className="text-[11px] text-slate-400">Weekly operational working segments.</p>
                    </div>

                    {isHoursSaved && (
                      <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-2 rounded-xl text-center text-xs">
                        ✓ Operational hours saved.
                      </div>
                    )}

                    <div className="space-y-4">
                      {hoursList.map((oh, index) => (
                        <div key={index} className="space-y-1.5 border-b border-slate-50 pb-3">
                          <input
                            type="text"
                            value={oh.day}
                            onChange={(e) => handleUpdateHoursValue(index, 'day', e.target.value)}
                            placeholder="Mon - Fri"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none font-bold"
                          />
                          <input
                            type="text"
                            value={oh.hours}
                            onChange={(e) => handleUpdateHoursValue(index, 'hours', e.target.value)}
                            placeholder="9:00 AM - 8:00 PM"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none font-mono"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleSaveOpeningHours}
                      className="w-full py-2.5 bg-slate-900 text-white hover:bg-gold-500 hover:text-slate-950 transition-all text-[10px] tracking-widest uppercase font-semibold rounded-xl cursor-pointer"
                    >
                      Save Working Hours
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 6: PAGE PORTAL CATALOG CUSTOMIZATION PREFERENCES
                ======================================================== */}
            {activeSubTab === 'pages' && (
              <div className="space-y-10 animate-fadeIn">
                
                {/* Promotions and Coupons Manager */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-slate-900">Seasonal Promotions & Coupons</h3>
                      <p className="text-[11px] text-slate-400">Manage client privilege checkout voucher discount codes.</p>
                    </div>
                    <button
                      onClick={() => setIsAddingPromo(true)}
                      className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-[10px] tracking-wider uppercase font-semibold text-gold-600 hover:bg-gold-50 hover:border-gold-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Code</span>
                    </button>
                  </div>

                  {isAddingPromo && (
                    <div className="bg-slate-50 border border-gold-300 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-3 animate-scaleIn">
                      <input
                        type="text"
                        placeholder="Voucher Code (e.g. VIP25)"
                        value={promoForm.code || ''}
                        onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value })}
                        className="bg-white border rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Discount Level (e.g. 25% Off)"
                        value={promoForm.discount || ''}
                        onChange={(e) => setPromoForm({ ...promoForm, discount: e.target.value })}
                        className="bg-white border rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Voucher Title / Benefit"
                        value={promoForm.title || ''}
                        onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })}
                        className="bg-white border rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <button onClick={handleSavePromotion} className="flex-1 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase cursor-pointer">Save</button>
                        <button onClick={() => setIsAddingPromo(false)} className="px-3 bg-slate-200 rounded-xl text-[10px] font-bold uppercase text-slate-500 cursor-pointer">X</button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {promotions.map((promo) => (
                      <div key={promo.id} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/40 flex justify-between items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-gold-600 bg-gold-50 border border-gold-100 px-2 py-0.5 rounded">
                              {promo.code}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-mono font-bold">{promo.discount}</span>
                          </div>
                          <h4 className="font-serif text-sm font-semibold text-slate-900">{promo.title}</h4>
                          <p className="text-[11px] text-slate-400 font-light">{promo.description}</p>
                        </div>
                        <button
                          onClick={() => handleDeletePromo(promo.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 border border-transparent hover:border-red-100 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Before After visual gallery editor */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-slate-900">Before & After Slider Customizer</h3>
                      <p className="text-[11px] text-slate-400">Edit visual comparison slider assets and client portfolios.</p>
                    </div>
                    {isBaSaved && <span className="text-emerald-600 text-xs font-mono">✓ Portfolio updated.</span>}
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase text-slate-400">Gallery Header Title</label>
                        <input type="text" value={beforeAfterTitle} onChange={(e) => setBeforeAfterTitle(e.target.value)} className="w-full bg-slate-50 border rounded-xl py-1.5 px-3 text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase text-slate-400">Subtitle Description</label>
                        <input type="text" value={beforeAfterSubtitle} onChange={(e) => setBeforeAfterSubtitle(e.target.value)} className="w-full bg-slate-50 border rounded-xl py-1.5 px-3 text-xs" />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      {baItems.map((item, index) => (
                        <div key={item.id} className="p-4 border rounded-xl bg-slate-50/50 space-y-3">
                          <h4 className="text-xs font-bold text-slate-700">Slide Asset #{index + 1}: {item.title}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input type="text" value={item.title} onChange={(e) => handleUpdateBaItem(index, 'title', e.target.value)} placeholder="Title" className="bg-white border rounded-lg p-1 px-2 text-xs" />
                            <input type="text" value={item.stylist} onChange={(e) => handleUpdateBaItem(index, 'stylist', e.target.value)} placeholder="Stylist" className="bg-white border rounded-lg p-1 px-2 text-xs" />
                            <input type="text" value={item.description} onChange={(e) => handleUpdateBaItem(index, 'description', e.target.value)} placeholder="Description" className="bg-white border rounded-lg p-1 px-2 text-xs" />
                            <input type="text" value={item.beforeUrl} onChange={(e) => handleUpdateBaItem(index, 'beforeUrl', e.target.value)} placeholder="Before Photo URL" className="bg-white border rounded-lg p-1 px-2 text-xs sm:col-span-3" />
                            <input type="text" value={item.afterUrl} onChange={(e) => handleUpdateBaItem(index, 'afterUrl', e.target.value)} placeholder="After Photo URL" className="bg-white border rounded-lg p-1 px-2 text-xs sm:col-span-3" />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleSaveBeforeAfterSettings}
                      className="px-5 py-2.5 bg-slate-900 text-white hover:bg-gold-500 hover:text-slate-950 transition-all text-[10px] tracking-widest uppercase font-semibold rounded-xl cursor-pointer"
                    >
                      Save Portfolio Slider Settings
                    </button>
                  </div>
                </div>

                {/* Testimonials Review management panel */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-slate-900">Verified Client Reviews Manager</h3>
                      <p className="text-[11px] text-slate-400 font-light">Moderate, remove, or post verified user testimonials inside the carousel.</p>
                    </div>
                    <button
                      onClick={() => setIsAddingTesti(true)}
                      className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-[10px] tracking-wider uppercase font-semibold text-gold-600 hover:bg-gold-50 hover:border-gold-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Insert Review</span>
                    </button>
                  </div>

                  {isAddingTesti && (
                    <div className="bg-slate-50 border border-gold-300 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 animate-scaleIn">
                      <input type="text" placeholder="Client Name" value={testiForm.name || ''} onChange={(e) => setTestiForm({...testiForm, name: e.target.value})} className="bg-white border rounded-xl px-3 py-1.5 text-xs focus:outline-none" />
                      <input type="text" placeholder="Role (e.g. Member)" value={testiForm.role || ''} onChange={(e) => setTestiForm({...testiForm, role: e.target.value})} className="bg-white border rounded-xl px-3 py-1.5 text-xs focus:outline-none" />
                      <input type="number" min={1} max={5} placeholder="Rating Score (5)" value={testiForm.rating || ''} onChange={(e) => setTestiForm({...testiForm, rating: Number(e.target.value)})} className="bg-white border rounded-xl px-3 py-1.5 text-xs focus:outline-none" />
                      <textarea placeholder="Feedback..." value={testiForm.comment || ''} onChange={(e) => setTestiForm({...testiForm, comment: e.target.value})} className="bg-white border rounded-xl p-3 text-xs focus:outline-none sm:col-span-3 resize-none" rows={2} />
                      <div className="flex gap-2 sm:col-span-3">
                        <button onClick={handleSaveTesti} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] uppercase font-bold cursor-pointer">Publish</button>
                        <button onClick={() => setIsAddingTesti(false)} className="px-4 py-2 bg-slate-200 rounded-xl text-[10px] uppercase text-slate-500 font-bold cursor-pointer">Discard</button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {testimonials.map((testi) => (
                      <div key={testi.id} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/30 flex justify-between items-center gap-4">
                        <div className="flex items-center space-x-3">
                          <img src={testi.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'} alt={testi.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                          <div>
                            <span className="text-[10px] text-slate-400 font-mono font-medium">{testi.role} &bull; Rating: {'★'.repeat(testi.rating)}</span>
                            <h4 className="font-serif text-sm font-bold text-slate-900">{testi.name}</h4>
                            <p className="text-xs text-slate-500 font-light italic mt-0.5">&ldquo;{testi.comment}&rdquo;</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTesti(testi.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 border border-transparent hover:border-red-100 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </main>

          {/* ========================================================
              MODAL WINDOW: CRM APPOINTMENT RESCHEDULER
              ======================================================== */}
          {rescheduleBooking && (
            <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl border border-gold-200 max-w-sm w-full p-6 space-y-5 shadow-2xl animate-scaleIn">
                <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-serif text-lg text-slate-900 font-semibold">Reschedule Booking Slot</h3>
                    <p className="text-[10px] text-slate-400 font-mono">Voucher ID: {rescheduleBooking.id}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">Select New Date</label>
                    <input
                      type="date"
                      value={reschedDate}
                      onChange={(e) => setReschedDate(e.target.value)}
                      className="w-full bg-slate-50 border rounded-xl py-2 px-3 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">Arrival Time Slot</label>
                    <select
                      value={reschedTime}
                      onChange={(e) => setReschedTime(e.target.value)}
                      className="w-full bg-slate-50 border rounded-xl py-2 px-3 text-xs focus:outline-none"
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                      <option value="07:00 PM">07:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-3">
                  <button
                    onClick={() => setRescheduleBooking(null)}
                    className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 border text-slate-400 text-[10px] tracking-widest uppercase font-semibold rounded-full transition-all cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSaveReschedule}
                    className="flex-1 py-2.5 bg-slate-900 text-white hover:bg-gold-500 hover:text-slate-950 text-[10px] tracking-widest uppercase font-semibold rounded-full shadow-sm transition-all cursor-pointer"
                  >
                    Confirm Reschedule
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
