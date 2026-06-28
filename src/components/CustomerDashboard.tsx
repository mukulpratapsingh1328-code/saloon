import React, { useState, useEffect } from 'react';
import { useSalonStore, Customer } from '../lib/store';
import { 
  User, Mail, Phone, Lock, Calendar, Clock, LogOut, Check, 
  Trash2, ArrowRight, Shield, Sparkles, Receipt, CalendarDays,
  FileText, ArrowLeftRight, LayoutDashboard, Bell, BellRing,
  Gift, Trash, Flame, CheckCircle, ShieldAlert, Award, Compass,
  BellOff
} from 'lucide-react';

interface CustomerDashboardProps {
  setCurrentTab: (tab: 'home' | 'booking' | 'appointments' | 'customer-portal' | 'admin-portal') => void;
  onBookSelected: () => void;
}

export default function CustomerDashboard({ setCurrentTab, onBookSelected }: CustomerDashboardProps) {
  const { 
    currentCustomer, 
    appointments, 
    notifications,
    services,
    stylists,
    loginCustomer, 
    registerCustomer, 
    logoutCustomer, 
    updateAppointments,
    addNotification,
    markNotificationAsRead,
    clearAllNotifications,
    deleteNotification
  } = useSalonStore();

  // Active sub-tab under logged-in view
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'member-suite' | 'notifications'>('dashboard');

  // Auth form states
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Rescheduling modal states
  const [rescheduleBooking, setRescheduleBooking] = useState<any | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  // Simulation controls
  const [simulationServiceId, setSimulationServiceId] = useState('');
  const [simulationStylistId, setSimulationStylistId] = useState('');
  const [simulationSuccessToast, setSimulationSuccessToast] = useState('');

  // Set default values for simulator dropdowns on mount
  useEffect(() => {
    if (services.length > 0) setSimulationServiceId(services[0].id);
    if (stylists.length > 0) setSimulationStylistId(stylists[0].id);
  }, [services, stylists]);

  // Filtered bookings & notifications for the logged-in customer
  const customerBookings = appointments.filter(
    b => b.customerEmail.toLowerCase() === currentCustomer?.email.toLowerCase()
  );

  const customerNotifications = notifications.filter(
    n => n.customerEmail.toLowerCase() === currentCustomer?.email.toLowerCase()
  );

  const unreadNotificationsCount = customerNotifications.filter(n => !n.read).length;

  // Calculates Circular points: 150 points for each appointment + 250 registration bonus
  const circularPoints = (customerBookings.length * 150) + 250;
  
  // Custom Membership tier determination
  let memberTier = 'Silver Circle';
  let tierColor = 'text-slate-500 bg-slate-50 border-slate-200';
  let tierAccent = 'from-slate-400 to-slate-600';
  if (customerBookings.length >= 3) {
    memberTier = 'Diamond Sanctuary VIP';
    tierColor = 'text-gold-600 bg-gold-50 border-gold-200';
    tierAccent = 'from-gold-400 via-yellow-500 to-gold-600';
  } else if (customerBookings.length >= 1) {
    memberTier = 'Platinum Privilege';
    tierColor = 'text-indigo-600 bg-indigo-50 border-indigo-200';
    tierAccent = 'from-indigo-400 via-purple-500 to-pink-500';
  }

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isLogin) {
      const res = loginCustomer(email, password || 'password123');
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setSuccessMsg('Successfully signed in. Welcome to your luxury suite!');
      }
    } else {
      if (!name || !email || !phone) {
        setErrorMsg('Please populate all personal details.');
        return;
      }
      const res = registerCustomer({
        name,
        email,
        phone,
        password: password || 'password123',
        createdAt: new Date().toISOString()
      });
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setSuccessMsg('Welcome! Your private circular membership is active.');
      }
    }
  };

  // Quick fill for testing
  const handleDemoSignIn = () => {
    setEmail('customer@example.com');
    setPassword('password123');
    setIsLogin(true);
  };

  // Cancel dynamic booking
  const handleCancelBooking = (bookingId: string) => {
    const confirm = window.confirm('Are you sure you would like to void this appointment reservation?');
    if (!confirm) return;

    const updated = appointments.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'cancelled' as const };
      }
      return b;
    });
    updateAppointments(updated);

    // Create a system warning notification
    if (currentCustomer) {
      const bObj = appointments.find(x => x.id === bookingId);
      addNotification({
        customerEmail: currentCustomer.email,
        title: 'Booking Voided & Cancelled',
        message: `Your reservation for "${bObj?.serviceName || 'Treatment'}" has been voided. Any points credited have been adjusted.`,
        type: 'system',
        bookingId: bookingId
      });
    }
  };

  // Reschedule save
  const handleSaveReschedule = () => {
    if (!rescheduleBooking || !newDate || !newTime) return;

    const updated = appointments.map(b => {
      if (b.id === rescheduleBooking.id) {
        return {
          ...b,
          date: newDate,
          time: newTime,
          notes: (b.notes || '') + ` (Rescheduled to ${newDate} at ${newTime})`
        };
      }
      return b;
    });

    updateAppointments(updated);
    
    // Create an update notification
    if (currentCustomer) {
      addNotification({
        customerEmail: currentCustomer.email,
        title: 'Schedule Updated Successfully',
        message: `Your reservation ${rescheduleBooking.id} has been successfully rescheduled to ${newDate} at ${newTime}.`,
        type: 'reminder',
        bookingId: rescheduleBooking.id
      });
    }

    setRescheduleSuccess(true);
    setTimeout(() => {
      setRescheduleSuccess(false);
      setRescheduleBooking(null);
    }, 1500);
  };

  // Trigger simulated booking notification flow
  const handleSimulateBooking = () => {
    if (!currentCustomer) return;

    const chosenService = services.find(s => s.id === simulationServiceId);
    const chosenStylist = stylists.find(s => s.id === simulationStylistId);

    if (!chosenService || !chosenStylist) return;

    // Create custom reservation ID
    const bookingId = 'LS-' + Math.floor(100000 + Math.random() * 900000);
    const randomDaysAhead = Math.floor(Math.random() * 8) + 2;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + randomDaysAhead);
    const dateStr = futureDate.toISOString().split('T')[0];
    const timeSlots = ['10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '04:00 PM', '06:00 PM'];
    const timeStr = timeSlots[Math.floor(Math.random() * timeSlots.length)];

    const newSimBooking = {
      id: bookingId,
      serviceId: chosenService.id,
      serviceName: chosenService.name,
      stylistId: chosenStylist.id,
      stylistName: chosenStylist.name,
      stylistImage: chosenStylist.imageUrl,
      date: dateStr,
      time: timeStr,
      customerName: currentCustomer.name,
      customerEmail: currentCustomer.email,
      customerPhone: currentCustomer.phone,
      notes: 'Simulated trial treatment via sandbox console.',
      status: 'upcoming' as const,
      totalPrice: chosenService.price,
      duration: chosenService.duration,
      createdAt: new Date().toISOString()
    };

    // Save to appointments array
    const updatedBookings = [newSimBooking, ...appointments];
    updateAppointments(updatedBookings);

    // Save corresponding notification
    addNotification({
      customerEmail: currentCustomer.email,
      title: 'Simulation: Booking Confirmed',
      message: `Simulated Booking alert! Received instant confirmation for "${chosenService.name}" with ${chosenStylist.name} on ${dateStr} at ${timeStr}. Reservation code: ${bookingId}.`,
      type: 'booking_confirmation',
      bookingId: bookingId
    });

    // Show temporary success toast on screen
    setSimulationSuccessToast(`Simulated booking successful! Added ${bookingId} and dispatched a real-time booking confirmation alert.`);
    setTimeout(() => {
      setSimulationSuccessToast('');
    }, 4500);
  };

  return (
    <div id="customer-dashboard-container" className="py-16 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {!currentCustomer ? (
          /* ========================================================
              CUSTOMER LOGIN PAGE / AUTH PORTAL
              ======================================================== */
          <div className="max-w-md mx-auto bg-luxury-cream border border-gold-200/50 rounded-3xl p-8 shadow-xl animate-fadeIn space-y-6">
            <div className="text-center space-y-2">
              <span className="text-[9px] tracking-[0.4em] uppercase font-mono text-gold-500 font-bold block">
                Privilege circle
              </span>
              <h2 className="font-serif text-2xl text-luxury-dark font-semibold">
                {isLogin ? 'Customer Login' : 'Create Member Account'}
              </h2>
              <p className="text-xs text-gray-500 font-light">
                {isLogin 
                  ? 'Access your reservations, reschedule treatments, and view luxury history.' 
                  : 'Join the circle to save booking profiles and secure bespoke rewards.'
                }
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-3 rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs p-3 rounded-xl text-center">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-400 block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-gold-500" />
                      <input
                        type="text"
                        required
                        placeholder="Victoria Belmont"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-gray-200 focus:border-gold-400 focus:outline-none rounded-xl py-2.5 pl-11 pr-4 text-xs tracking-wide"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-400 block">Mobile Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gold-500" />
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 241-9988"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-gray-200 focus:border-gold-400 focus:outline-none rounded-xl py-2.5 pl-11 pr-4 text-xs tracking-wide"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-gray-400 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gold-500" />
                  <input
                    type="email"
                    required
                    placeholder="customer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-200 focus:border-gold-400 focus:outline-none rounded-xl py-2.5 pl-11 pr-4 text-xs tracking-wide"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono uppercase text-gray-400 block">Passcode</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gold-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-gray-200 focus:border-gold-400 focus:outline-none rounded-xl py-2.5 pl-11 pr-4 text-xs tracking-wide"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-luxury-dark text-white rounded-xl text-[10px] tracking-widest uppercase font-semibold hover:bg-gold-500 hover:text-luxury-dark transition-all flex items-center justify-center space-x-1 cursor-pointer shadow-md"
              >
                <span>{isLogin ? 'Sign In' : 'Register Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {isLogin && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  className="w-full py-2 bg-gold-50 hover:bg-gold-100/60 border border-gold-200/50 text-[10px] tracking-wider uppercase font-semibold rounded-xl text-gold-700 transition-all cursor-pointer"
                >
                  ⚡ Quick Demo Access (Test Client)
                </button>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200/50 text-center text-xs">
              <span className="text-gray-400">
                {isLogin ? "Don't have a luxury account?" : 'Already registered?'}
              </span>{' '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMsg('');
                }}
                className="text-gold-600 font-semibold hover:underline cursor-pointer"
              >
                {isLogin ? 'Join Circle Membership' : 'Sign in to account'}
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================
              LOGGED IN WORKSPACE: COMPRISING MULTIPLE ATTACHMENTS
              ======================================================== */
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header / Premium Member Welcome Suite Header */}
            <div className="bg-luxury-cream border border-gold-200/50 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
              <div className="flex items-center space-x-4 text-center sm:text-left">
                <div className="w-16 h-16 rounded-full bg-gold-400/10 border border-gold-300 flex items-center justify-center text-gold-600 flex-shrink-0">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-[9px] tracking-[0.35em] uppercase font-mono text-gold-500 font-bold block">
                      Circular Member Suite
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-semibold tracking-wider uppercase border ${tierColor}`}>
                      {memberTier}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl text-luxury-dark font-semibold mt-1">
                    Welcome, {currentCustomer.name}
                  </h2>
                  <p className="text-xs text-gray-500 font-light mt-0.5">
                    Premium Member &bull; {currentCustomer.email} &bull; {circularPoints} Circular Points
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 justify-center">
                <button
                  onClick={onBookSelected}
                  className="px-5 py-2.5 bg-luxury-dark text-white rounded-full text-[10px] tracking-widest uppercase font-semibold hover:bg-gold-500 hover:text-luxury-dark transition-all cursor-pointer shadow-sm"
                >
                  Book New Session
                </button>
                <button
                  onClick={logoutCustomer}
                  className="p-2.5 border border-gray-200 hover:bg-red-50 hover:border-red-200 rounded-full text-gray-400 hover:text-red-500 transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Inner Suite Tab Navigation (Attaches Customer Dashboard, Member Suite and Notification Centre) */}
            <div className="border-b border-gray-200 flex space-x-8 items-center overflow-x-auto pb-px">
              <button
                onClick={() => setActiveSubTab('dashboard')}
                className={`py-4 px-1 text-xs tracking-wider uppercase font-semibold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
                  activeSubTab === 'dashboard'
                    ? 'border-gold-500 text-gold-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Customer Dashboard</span>
              </button>

              <button
                onClick={() => setActiveSubTab('member-suite')}
                className={`py-4 px-1 text-xs tracking-wider uppercase font-semibold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
                  activeSubTab === 'member-suite'
                    ? 'border-gold-500 text-gold-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                <span>Member Suite</span>
              </button>

              <button
                onClick={() => setActiveSubTab('notifications')}
                className={`py-4 px-1 text-xs tracking-wider uppercase font-semibold flex items-center space-x-2 border-b-2 transition-all relative transition-all cursor-pointer ${
                  activeSubTab === 'notifications'
                    ? 'border-gold-500 text-gold-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {unreadNotificationsCount > 0 ? (
                  <BellRing className="w-4 h-4 text-gold-500 animate-swing" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
                <span>Notification Centre</span>
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-4 bg-gold-500 text-luxury-dark text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Simulation Toast Alert Banner */}
            {simulationSuccessToast && (
              <div className="bg-gold-50 border-l-4 border-gold-500 p-4 rounded-xl shadow-xs text-xs text-gold-800 flex items-start space-x-3 animate-slideIn">
                <CheckCircle className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold uppercase tracking-wider block text-[10px]">Real-Time Sandbox Signal Received</span>
                  <p className="mt-0.5 font-light">{simulationSuccessToast}</p>
                </div>
              </div>
            )}

            {/* TAB CONTENTS */}
            
            {/* ========================================================
                ATTACHMENT A: CUSTOMER DASHBOARD (OVERVIEW & SIMULATION CENTRE)
                ======================================================== */}
            {activeSubTab === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                
                {/* Left side: Points, loyalty tier and active statistics */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Circular Points Banner */}
                  <div className="relative bg-gradient-to-r from-luxury-dark to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-lg">
                    {/* Background abstract art */}
                    <div className="absolute right-0 bottom-0 w-48 h-48 bg-gold-400/5 rounded-full blur-2xl"></div>
                    
                    <div className="relative space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] tracking-[0.25em] uppercase font-mono text-gold-400 font-bold block">
                          VIP Privilege Points Program
                        </span>
                        <Award className="w-6 h-6 text-gold-400" />
                      </div>

                      <div className="flex items-baseline space-x-2">
                        <span className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-gold-400">
                          {circularPoints}
                        </span>
                        <span className="text-xs font-mono text-slate-300 uppercase tracking-widest">
                          points
                        </span>
                      </div>

                      <div className="pt-2">
                        <div className="flex justify-between text-[11px] text-slate-300 font-mono mb-1.5">
                          <span>Reward Tier Level Progress ({memberTier})</span>
                          <span>{circularPoints} / 1000 pts</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${tierAccent} rounded-full transition-all duration-1000`}
                            style={{ width: `${Math.min((circularPoints / 1000) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-sans block mt-2 font-light">
                          * Earn 150 points with every luxury session. Reach 1,000 points to unlock a complimentary botanical therapy kit.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick stats panel */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-luxury-cream border border-gold-100/30 rounded-2xl p-4 text-center">
                      <span className="text-[9px] tracking-wider uppercase font-mono text-gray-400 block">Reservations</span>
                      <span className="font-serif text-2xl font-bold text-luxury-dark block mt-1">
                        {customerBookings.filter(b => b.status === 'upcoming').length}
                      </span>
                      <span className="text-[9px] text-gray-500 font-light block">Active sessions booked</span>
                    </div>

                    <div className="bg-luxury-cream border border-gold-100/30 rounded-2xl p-4 text-center relative">
                      {unreadNotificationsCount > 0 && (
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-gold-500 animate-ping"></span>
                      )}
                      <span className="text-[9px] tracking-wider uppercase font-mono text-gray-400 block">Notifications</span>
                      <span className="font-serif text-2xl font-bold text-luxury-dark block mt-1">
                        {customerNotifications.length}
                      </span>
                      <span className="text-[9px] text-gray-500 font-light block">
                        {unreadNotificationsCount} unread currently
                      </span>
                    </div>

                    <div className="bg-luxury-cream border border-gold-100/30 rounded-2xl p-4 text-center col-span-2 sm:col-span-1">
                      <span className="text-[9px] tracking-wider uppercase font-mono text-gray-400 block">Circular Tier</span>
                      <span className="text-xs font-bold font-serif text-luxury-dark block mt-2 truncate px-1">
                        {memberTier.split(' ')[0]} Star
                      </span>
                      <span className="text-[9px] text-gray-500 font-light block">Privilege membership</span>
                    </div>
                  </div>

                  {/* Notification sandbox tutorial block */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3.5">
                    <h4 className="font-serif text-sm font-semibold text-luxury-dark flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-gold-500" />
                      About The Simulated Booking Confirmations
                    </h4>
                    <p className="text-xs text-gray-500 font-light leading-relaxed">
                      This system features a real-time **booking notification simulation simulator**. Under the <strong>Notification Simulator</strong> on the right sidebar, you can trigger simulated reservation receipts from any of our therapists. 
                    </p>
                    <p className="text-xs text-gray-500 font-light leading-relaxed">
                      Confirming a real reservation on the <em>Book Now</em> tab will also automatically write an instant notification to the <strong>Notification Centre</strong> sub-tab, allowing you to view circular alerts and booking status updates live.
                    </p>
                  </div>
                </div>

                {/* Right side: INTERACTIVE NOTIFICATION SIMULATOR CONSOLE */}
                <div className="space-y-6">
                  <div className="bg-luxury-cream border border-gold-200/60 rounded-3xl p-6 shadow-sm space-y-5">
                    <div className="space-y-1 pb-3 border-b border-gold-200/40">
                      <div className="flex items-center space-x-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
                        </span>
                        <h4 className="font-serif text-sm font-bold text-luxury-dark uppercase tracking-wider">
                          Notification Simulator
                        </h4>
                      </div>
                      <p className="text-[11px] text-gray-500 font-sans font-light">
                        Simulate receiving a luxurious automated booking confirmation alert in real-time.
                      </p>
                    </div>

                    <div className="space-y-4 text-xs">
                      {/* Select Simulated Treatment */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-gray-400 block">Select Treatment</label>
                        <select 
                          value={simulationServiceId}
                          onChange={(e) => setSimulationServiceId(e.target.value)}
                          className="w-full bg-white border border-gray-200 focus:border-gold-400 focus:outline-none rounded-xl px-3 py-2 text-xs"
                        >
                          {services.map(s => (
                            <option key={s.id} value={s.id}>{s.name} (${s.price})</option>
                          ))}
                        </select>
                      </div>

                      {/* Select Therapist */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-gray-400 block">Select Therapist</label>
                        <select 
                          value={simulationStylistId}
                          onChange={(e) => setSimulationStylistId(e.target.value)}
                          className="w-full bg-white border border-gray-200 focus:border-gold-400 focus:outline-none rounded-xl px-3 py-2 text-xs"
                        >
                          {stylists.map(st => (
                            <option key={st.id} value={st.id}>{st.name} - {st.role}</option>
                          ))}
                        </select>
                      </div>

                      {/* Simulated trigger action button */}
                      <button
                        onClick={handleSimulateBooking}
                        className="w-full py-3 bg-luxury-dark hover:bg-gold-500 hover:text-luxury-dark text-white text-[10px] tracking-widest uppercase font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Trigger Simulated Receipt</span>
                      </button>
                    </div>

                    <div className="bg-white border border-gold-100 rounded-xl p-3 text-[10px] text-gray-400 font-mono leading-relaxed space-y-1">
                      <span className="text-[8px] uppercase tracking-wider text-gold-600 font-bold block">Sandbox Status</span>
                      <div>&bull; Client: {currentCustomer.name}</div>
                      <div>&bull; Environment: Active Live Preview</div>
                      <div>&bull; Channel: SMS / App In-App Alerts</div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================
                ATTACHMENT B: MEMBER SUITE (RESERVATIONS & GUIDELINES)
                ======================================================== */}
            {activeSubTab === 'member-suite' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fadeIn">
                
                {/* Left Column: Appointments List (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  <div>
                    <h3 className="font-serif text-xl text-luxury-dark font-medium flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-gold-500" />
                      My Active Reservations ({customerBookings.filter(b => b.status === 'upcoming').length})
                    </h3>
                    <p className="text-xs text-gray-400">View details, download credentials, or reschedule treatments.</p>
                  </div>

                  {customerBookings.length === 0 ? (
                    <div className="text-center py-16 bg-luxury-cream border border-gold-100/30 rounded-3xl p-8">
                      <Sparkles className="w-10 h-10 text-gold-500 mx-auto mb-3" />
                      <h4 className="font-serif text-base text-luxury-dark font-semibold">No reservations logged</h4>
                      <p className="text-xs text-gray-400 font-light mt-1 mb-5">You currently have no luxury treatments scheduled.</p>
                      <button
                        onClick={onBookSelected}
                        className="px-6 py-2.5 bg-luxury-dark text-white text-[10px] tracking-widest font-semibold uppercase rounded-full hover:bg-gold-500 hover:text-luxury-dark transition-all cursor-pointer"
                      >
                        Book First Treatment
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {customerBookings.map((booking) => {
                        const isUpcoming = booking.status === 'upcoming';
                        const isCancelled = booking.status === 'cancelled';
                        
                        return (
                          <div
                            key={booking.id}
                            className={`bg-luxury-cream border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 flex flex-col sm:flex-row justify-between ${
                              isCancelled ? 'border-gray-100 opacity-60' : 'border-gold-100/40 hover:shadow-md'
                            }`}
                          >
                            <div className="p-6 flex-1 space-y-4">
                              <div className="flex items-center justify-between gap-2 pb-3 border-b border-gold-100/10">
                                <span className="font-mono text-xs text-gray-500">ID: {booking.id}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono uppercase tracking-wider font-bold ${
                                  isCancelled 
                                    ? 'bg-gray-100 text-gray-400' 
                                    : 'bg-gold-100 text-gold-800'
                                }`}>
                                  {booking.status}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <span className="text-[8px] uppercase tracking-wider text-gray-400 font-mono block">Therapy Treatment</span>
                                  <span className="font-serif text-sm font-semibold text-luxury-dark leading-snug">{booking.serviceName}</span>
                                  <span className="text-[11px] text-gray-400 font-mono block mt-0.5">{booking.duration} mins &bull; ${booking.totalPrice}</span>
                                </div>

                                <div>
                                  <span className="text-[8px] uppercase tracking-wider text-gray-400 font-mono block">Assigned Therapist</span>
                                  <div className="flex items-center space-x-2 mt-1">
                                    {booking.stylistImage && (
                                      <img
                                        src={booking.stylistImage}
                                        alt={booking.stylistName}
                                        className="w-6 h-6 rounded-full object-cover border border-gold-200"
                                        referrerPolicy="no-referrer"
                                      />
                                    )}
                                    <span className="text-xs font-medium text-gray-700">{booking.stylistName}</span>
                                  </div>
                                </div>

                                <div className="sm:col-span-2 pt-2 border-t border-gold-100/10 flex flex-wrap gap-x-6 gap-y-2 text-xs">
                                  <div>
                                    <span className="text-[8px] uppercase tracking-wider text-gray-400 font-mono block">Session Schedule</span>
                                    <div className="flex items-center space-x-1 text-gray-700 font-medium">
                                      <Calendar className="w-3.5 h-3.5 text-gold-500" />
                                      <span>{booking.date} at {booking.time}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {booking.notes && (
                                <div className="pt-2 border-t border-gold-100/10 text-xs text-gray-500 font-light italic">
                                  "{booking.notes}"
                                </div>
                              )}
                            </div>

                            {/* Dynamic actions right rail */}
                            <div className="p-6 bg-white border-t sm:border-t-0 sm:border-l border-gold-100/30 min-w-[150px] flex flex-col justify-between items-center text-center">
                              {/* Barcode representation */}
                              <div className="flex flex-col items-center">
                                <div className="h-6 w-24 flex space-x-[1px] items-stretch opacity-60">
                                  {[1,2,1,3,1,2,1,4,1,2].map((w, idx) => (
                                    <div key={idx} className="bg-luxury-dark rounded-xs" style={{ width: `${w * 1.5}px` }}></div>
                                  ))}
                                </div>
                                <span className="text-[8px] font-mono text-gray-400 mt-1 uppercase">VOUCHER {booking.id}</span>
                              </div>

                              {isUpcoming ? (
                                <div className="w-full space-y-1.5 mt-4">
                                  <button
                                    onClick={() => {
                                      setRescheduleBooking(booking);
                                      setNewDate(booking.date);
                                      setNewTime(booking.time);
                                    }}
                                    className="w-full py-1.5 bg-white hover:bg-gold-50 border border-gold-200 text-[9px] tracking-widest uppercase font-semibold text-gold-700 rounded-full transition-all flex items-center justify-center space-x-1 cursor-pointer"
                                  >
                                    <ArrowLeftRight className="w-3 h-3" />
                                    <span>Reschedule</span>
                                  </button>
                                  <button
                                    onClick={() => handleCancelBooking(booking.id)}
                                    className="w-full py-1.5 bg-white hover:bg-red-50 border border-red-100 text-[9px] tracking-widest uppercase font-semibold text-red-500 rounded-full transition-all flex items-center justify-center space-x-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Cancel Booking</span>
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[9px] font-mono text-gray-400 font-bold block mt-4 tracking-wider uppercase">
                                  {isCancelled ? 'VOIDED' : 'VISITED'}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Column: Profile & Perks (4 cols) */}
                <div className="lg:col-span-4 space-y-8">
                  {/* Member Profile Details */}
                  <div className="bg-luxury-cream border border-gold-100/30 rounded-3xl p-6 space-y-5">
                    <h3 className="font-serif text-lg text-luxury-dark font-medium border-b border-gold-100 pb-2">
                      Membership Profile
                    </h3>
                    <div className="space-y-3.5 text-xs">
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-gray-400 font-mono block">Registered Name</span>
                        <span className="font-medium text-gray-800">{currentCustomer.name}</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-gray-400 font-mono block">Secure Phone</span>
                        <span className="font-medium text-gray-800">{currentCustomer.phone}</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-gray-400 font-mono block">Registered Email</span>
                        <span className="font-medium text-gray-800">{currentCustomer.email}</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-gray-400 font-mono block">Security Protocol</span>
                        <span className="font-medium text-emerald-600 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Encrypted SSL Session
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Spa Ritual Guidelines */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-4 shadow-sm">
                    <h4 className="font-serif text-sm text-luxury-dark font-semibold">Spa Guest Ritual Guidelines</h4>
                    <ul className="text-xs text-gray-500 space-y-3 font-light">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 flex-shrink-0"></div>
                        <span>Please arrive 15 minutes before your scheduled therapy to partake in our thermal welcome sensory tea.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 flex-shrink-0"></div>
                        <span>Rescheduling must occur at least 12 hours prior to avoid late reservation void penalties.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 flex-shrink-0"></div>
                        <span>Specify any material allergies in special instructions during booking updates.</span>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================
                ATTACHMENT C: NOTIFICATION CENTRE PANEL
                ======================================================== */}
            {activeSubTab === 'notifications' && (
              <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-serif text-xl text-luxury-dark font-medium flex items-center gap-2">
                      <BellRing className="w-5 h-5 text-gold-500" />
                      Sanctuary Circular Messages ({customerNotifications.length})
                    </h3>
                    <p className="text-xs text-gray-400">Receive private messages, circular bookings confirmation, and elite luxury reminders.</p>
                  </div>

                  {customerNotifications.length > 0 && (
                    <button
                      onClick={() => clearAllNotifications(currentCustomer.email)}
                      className="px-4 py-1.5 border border-gold-200 text-gold-700 hover:bg-gold-50 rounded-full text-[10px] tracking-widest font-semibold uppercase transition-all cursor-pointer"
                    >
                      Clear All Messages
                    </button>
                  )}
                </div>

                {customerNotifications.length === 0 ? (
                  <div className="text-center py-20 bg-luxury-cream border border-gold-100/30 rounded-3xl p-8 space-y-3">
                    <BellOff className="w-12 h-12 text-gold-300 mx-auto" />
                    <h4 className="font-serif text-base text-luxury-dark font-semibold">Your Circular Inbox is Empty</h4>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto font-light">
                      No alerts logged yet. Go to your **Customer Dashboard** tab on the left to trigger simulated booking receipt confirmations!
                    </p>
                    <div className="pt-3">
                      <button
                        onClick={() => setActiveSubTab('dashboard')}
                        className="px-5 py-2.5 bg-luxury-dark text-white rounded-full text-[10px] tracking-widest uppercase font-semibold hover:bg-gold-500 hover:text-luxury-dark transition-all"
                      >
                        Launch Notification Simulator
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customerNotifications.map((notif) => {
                      let typeIcon = <Sparkles className="w-4 h-4 text-amber-500" />;
                      let typeTitle = 'Alert Update';
                      let typeBg = 'bg-amber-50/50 border-amber-200/50';

                      if (notif.type === 'booking_confirmation') {
                        typeIcon = <CalendarDays className="w-4 h-4 text-gold-600" />;
                        typeTitle = 'Booking Confirmed';
                        typeBg = 'bg-gold-50/70 border-gold-200/60';
                      } else if (notif.type === 'reminder') {
                        typeIcon = <Clock className="w-4 h-4 text-indigo-600" />;
                        typeTitle = 'Treatment Reminder';
                        typeBg = 'bg-indigo-50/50 border-indigo-200/40';
                      } else if (notif.type === 'system') {
                        typeIcon = <Shield className="w-4 h-4 text-slate-600" />;
                        typeTitle = 'System Signal';
                        typeBg = 'bg-slate-50 border-slate-200';
                      }

                      return (
                        <div
                          key={notif.id}
                          className={`border rounded-2xl p-5 flex items-start gap-4 transition-all duration-300 relative overflow-hidden ${typeBg} ${
                            notif.read ? 'opacity-85' : 'shadow-sm ring-1 ring-gold-400/20'
                          }`}
                        >
                          {/* Unread marker bar */}
                          {!notif.read && (
                            <div className="absolute top-0 bottom-0 left-0 w-1 bg-gold-500"></div>
                          )}

                          <div className="p-2 rounded-full bg-white shadow-xs">
                            {typeIcon}
                          </div>

                          <div className="flex-1 space-y-1">
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <div className="flex items-center space-x-1.5">
                                <span className="font-mono text-[9px] uppercase tracking-wider text-gray-400">
                                  {typeTitle}
                                </span>
                                <span className="text-[9px] text-gray-300 font-mono">&bull;</span>
                                <span className="font-mono text-[9px] text-gray-400">
                                  ID: {notif.id}
                                </span>
                              </div>
                              <span className="font-mono text-[9px] text-gray-400">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            <h4 className="font-serif text-sm font-semibold text-luxury-dark">
                              {notif.title}
                            </h4>

                            <p className="text-xs text-gray-600 font-light leading-relaxed">
                              {notif.message}
                            </p>

                            {notif.bookingId && (
                              <div className="pt-2 flex items-center space-x-3 text-[10px] font-mono">
                                <span className="text-gray-400">Linked Reservation:</span>
                                <span className="text-gold-700 bg-white border border-gold-100 px-1.5 py-0.5 rounded">
                                  {notif.bookingId}
                                </span>
                              </div>
                            )}

                            {/* Actions under notification */}
                            <div className="pt-3 flex gap-4 text-[10px] font-mono justify-end">
                              {!notif.read && (
                                <button
                                  onClick={() => markNotificationAsRead(notif.id)}
                                  className="text-gold-600 hover:text-gold-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Mark Read</span>
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notif.id)}
                                className="text-red-500 hover:text-red-700 font-medium hover:underline cursor-pointer flex items-center gap-1"
                              >
                                <Trash className="w-3 h-3" />
                                <span>Delete Alert</span>
                              </button>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* ========================================================
            MODAL OVERLAY: RESCHEDULE SCHEDULER
            ======================================================== */}
        {rescheduleBooking && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-gold-200 max-w-sm w-full p-6 space-y-6 shadow-2xl animate-scaleIn">
              <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-serif text-lg text-luxury-dark font-semibold">Modify Appointment</h3>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">Booking ID: {rescheduleBooking.id}</p>
                </div>
              </div>

              {rescheduleSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-50 border-2 border-emerald-400 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                    <Check className="w-6 h-6 stroke-[3px]" />
                  </div>
                  <h4 className="font-serif text-base text-luxury-dark font-bold">Successfully Modified</h4>
                  <p className="text-xs text-gray-400">Your reservation schedule has been locked.</p>
                </div>
              ) : (
                <>
                  {/* Select Date */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-mono tracking-wider text-gray-400 block">Select Date</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full bg-luxury-cream border border-gray-200 focus:border-gold-300 focus:outline-none rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  {/* Select Time */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-mono tracking-wider text-gray-400 block">Select Time Slot</label>
                    <select
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full bg-luxury-cream border border-gray-200 focus:border-gold-300 focus:outline-none rounded-xl px-3 py-2 text-xs"
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

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-100 flex gap-3">
                    <button
                      onClick={() => setRescheduleBooking(null)}
                      className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-500 text-[10px] tracking-widest uppercase font-semibold rounded-full transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveReschedule}
                      className="flex-1 py-2.5 bg-luxury-dark hover:bg-gold-500 hover:text-luxury-dark text-white text-[10px] tracking-widest uppercase font-semibold rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      Confirm Change
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
