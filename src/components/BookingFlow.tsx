import { useState, useEffect } from 'react';
import { TIME_SLOTS } from '../data';
import { useSalonStore } from '../lib/store';
import { Service, Stylist, Appointment } from '../types';
import { 
  Check, ChevronRight, ChevronLeft, Calendar, Clock, User, Sparkles, 
  Tag, Phone, Mail, FileText, CheckCircle2, RefreshCw, Sparkle 
} from 'lucide-react';

interface BookingFlowProps {
  preSelectedServiceId?: string | null;
  preSelectedStylistId?: string | null;
  onBookingComplete: () => void;
  clearPreSelections: () => void;
}

export default function BookingFlow({ 
  preSelectedServiceId, 
  preSelectedStylistId, 
  onBookingComplete,
  clearPreSelections 
}: BookingFlowProps) {
  const { services, stylists, promotions } = useSalonStore();
  const SERVICES = services;
  const STYLISTS = stylists;
  const PROMOTIONS = promotions;
  
  // Current active step
  const [step, setStep] = useState<number>(1);

  // Booking selections
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [isAnyStylist, setIsAnyStylist] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(''); // e.g. "10:00 AM"

  // Guest Details
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestNotes, setGuestNotes] = useState<string>('');

  // Promo Code
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number; description: string } | null>(null);
  const [promoError, setPromoError] = useState<string>('');

  // Generated Booking Success
  const [successBooking, setSuccessBooking] = useState<Appointment | null>(null);

  // Generate calendar days (Next 14 days starting today)
  const [availableDays, setAvailableDays] = useState<{ dateStr: string; dayName: string; dayNum: number; monthName: string }[]>([]);

  useEffect(() => {
    const days = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        dateStr,
        dayName: weekdays[d.getDay()],
        dayNum: d.getDate(),
        monthName: months[d.getMonth()]
      });
    }
    setAvailableDays(days);
    
    // Default to first day
    if (days.length > 0) {
      setSelectedDate(days[0].dateStr);
    }
  }, []);

  // Handle pre-selections
  useEffect(() => {
    if (preSelectedServiceId) {
      const s = SERVICES.find(item => item.id === preSelectedServiceId);
      if (s) {
        setSelectedService(s);
        setStep(2); // advance to stylist select
      }
    }
  }, [preSelectedServiceId]);

  useEffect(() => {
    if (preSelectedStylistId) {
      const st = STYLISTS.find(item => item.id === preSelectedStylistId);
      if (st) {
        setSelectedStylist(st);
        setIsAnyStylist(false);
        // If service is also set, jump directly to step 3 (schedule)
        if (selectedService || preSelectedServiceId) {
          setStep(3);
        } else {
          setStep(1); // pick service first
        }
      }
    }
  }, [preSelectedStylistId]);

  // Pricing Calculations
  const basePrice = selectedService ? selectedService.price : 0;
  const discountAmount = appliedPromo ? Math.round(basePrice * (appliedPromo.discountPercent / 100)) : 0;
  const serviceTax = Math.round((basePrice - discountAmount) * 0.08); // 8% luxury service tax
  const finalPrice = basePrice - discountAmount + serviceTax;

  // Apply Promo Logic
  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'FIRST15') {
      setAppliedPromo({
        code: 'FIRST15',
        discountPercent: 15,
        description: '15% Off Your First Booking'
      });
      setPromoCodeInput('');
    } else if (code === 'MIDWEEK') {
      setAppliedPromo({
        code: 'MIDWEEK',
        discountPercent: 0, // 0 discount but has complimentary gift
        description: 'Complimentary Botanical Gift Set'
      });
      setPromoCodeInput('');
    } else {
      setPromoError('Invalid coupon code. Try "FIRST15" for 15% off.');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  // Step Validation checks
  const isStepValid = () => {
    switch (step) {
      case 1:
        return selectedService !== null;
      case 2:
        return selectedStylist !== null || isAnyStylist;
      case 3:
        return selectedDate !== '' && selectedTimeSlot !== '';
      case 4:
        return guestName.trim().length >= 2 && 
               /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail) && 
               guestPhone.trim().length >= 7;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (isStepValid()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      clearPreSelections();
    }
  };

  // Submit and Save Booking
  const handleConfirmBooking = () => {
    if (!selectedService) return;

    const bookingId = 'LS-' + Math.floor(100000 + Math.random() * 900000);
    const chosenStylistName = isAnyStylist ? 'Any Available Stylist' : (selectedStylist?.name || 'Staff Artist');
    const chosenStylistImage = isAnyStylist 
      ? 'https://images.unsplash.com/photo-1521590832167-7bcbfea63334?auto=format&fit=crop&w=150&h=150&q=80' 
      : (selectedStylist?.imageUrl || '');

    const newBooking: Appointment = {
      id: bookingId,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      stylistId: isAnyStylist ? 'any' : (selectedStylist?.id || 'staff'),
      stylistName: chosenStylistName,
      stylistImage: chosenStylistImage,
      date: selectedDate,
      time: selectedTimeSlot,
      customerName: guestName,
      customerEmail: guestEmail,
      customerPhone: guestPhone,
      notes: guestNotes + (appliedPromo?.code === 'MIDWEEK' ? ' [Complimentary Botanical Gift Set Applied]' : ''),
      status: 'upcoming',
      totalPrice: finalPrice,
      duration: selectedService.duration,
      createdAt: new Date().toISOString()
    };

    // Save to LocalStorage
    try {
      const existing = localStorage.getItem('luxury_salon_bookings');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newBooking);
      localStorage.setItem('luxury_salon_bookings', JSON.stringify(list));

      // Create & Save Notification
      const existingNotifs = localStorage.getItem('luxury_salon_notifications_v1');
      const listNotifs = existingNotifs ? JSON.parse(existingNotifs) : [];
      const newNotif = {
        id: 'NT-' + Math.floor(100000 + Math.random() * 900000),
        customerEmail: guestEmail,
        title: 'Booking Confirmed: ' + selectedService.name,
        message: `Your reservation is locked in for ${selectedDate} at ${selectedTimeSlot} with ${chosenStylistName}. We look forward to welcoming you.`,
        type: 'booking_confirmation',
        createdAt: new Date().toISOString(),
        read: false,
        bookingId: bookingId
      };
      listNotifs.unshift(newNotif);
      localStorage.setItem('luxury_salon_notifications_v1', JSON.stringify(listNotifs));
      window.dispatchEvent(new Event('luxury_salon_store_update'));
    } catch (e) {
      console.error('Failed to write local appointment or notification data', e);
    }

    setSuccessBooking(newBooking);
    setStep(6); // Success Step
  };

  // Render Steps Checklist Indicator
  const stepsMeta = [
    { title: 'Service' },
    { title: 'Stylist' },
    { title: 'Schedule' },
    { title: 'Info' },
    { title: 'Review' }
  ];

  return (
    <div id="booking-flow-container" className="py-24 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Header */}
        {step <= 5 && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <span className="text-[10px] tracking-[0.4em] uppercase font-mono text-gold-500 font-semibold">
                Online Reservation
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-luxury-dark mt-2 tracking-tight">
                Secure Your Therapy Session
              </h2>
            </div>

            {/* Steps visual bar */}
            <div className="flex items-center justify-between max-w-lg mx-auto relative px-2">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
              {stepsMeta.map((s, index) => {
                const sNum = index + 1;
                const isCompleted = step > sNum;
                const isActive = step === sNum;
                return (
                  <div key={s.title} className="flex flex-col items-center relative z-10">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-gold-500 text-white' 
                          : isActive 
                            ? 'bg-luxury-dark text-white ring-4 ring-gold-100' 
                            : 'bg-white border-2 border-gray-200 text-gray-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : sNum}
                    </div>
                    <span className={`text-[9px] uppercase tracking-wider font-medium mt-1.5 ${
                      isActive ? 'text-gold-600 font-semibold' : 'text-gray-400'
                    }`}>
                      {s.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 1: SELECT SERVICE
            ======================================================== */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="font-serif text-xl text-luxury-dark text-center font-medium mb-4">
              Select Your Intended Treatment
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SERVICES.map((srv) => (
                <div
                  key={srv.id}
                  onClick={() => setSelectedService(srv)}
                  className={`p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex justify-between items-start ${
                    selectedService?.id === srv.id
                      ? 'border-gold-500 bg-gold-50/30'
                      : 'border-gray-100 hover:border-gold-200 bg-luxury-cream/55'
                  }`}
                >
                  <div className="space-y-2 pr-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] font-mono tracking-widest text-gold-600 uppercase bg-gold-100/60 px-2 py-0.5 rounded">
                        {srv.category}
                      </span>
                      {srv.popular && (
                        <span className="text-[9px] font-mono text-gold-500 flex items-center">
                          ★ Popular
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-base text-luxury-dark font-medium leading-snug">
                      {srv.name}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {srv.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs font-mono text-gray-400">
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-gold-400" />
                        {srv.duration} mins
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col justify-between h-full items-end">
                    <span className="font-serif text-lg font-semibold text-luxury-dark">${srv.price}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedService?.id === srv.id ? 'border-gold-500 bg-gold-500 text-white' : 'border-gray-300'
                    }`}>
                      {selectedService?.id === srv.id && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 2: SELECT STYLIST
            ======================================================== */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="font-serif text-xl text-luxury-dark text-center font-medium mb-4">
              Select Your Preferred Master Artist
            </h3>

            {/* Any Stylist Option */}
            <div
              onClick={() => {
                setIsAnyStylist(true);
                setSelectedStylist(null);
              }}
              className={`p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-center justify-between ${
                isAnyStylist
                  ? 'border-gold-500 bg-gold-50/30'
                  : 'border-gray-100 hover:border-gold-200 bg-luxury-cream/55'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center text-gold-600">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif text-base text-luxury-dark font-medium">Any Available Stylist</h4>
                  <p className="text-xs text-gray-500">Perfect if you are flexible or booking a quick session with any certified professional.</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                isAnyStylist ? 'border-gold-500 bg-gold-500 text-white' : 'border-gray-300'
              }`}>
                {isAnyStylist && <Check className="w-3.5 h-3.5" />}
              </div>
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-xs font-mono uppercase tracking-widest text-gray-400 bg-white px-2">Or select a therapist</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            {/* Master Stylists List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STYLISTS.map((sty) => (
                <div
                  key={sty.id}
                  onClick={() => {
                    setSelectedStylist(sty);
                    setIsAnyStylist(false);
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex space-x-4 items-center ${
                    selectedStylist?.id === sty.id
                      ? 'border-gold-500 bg-gold-50/30'
                      : 'border-gray-100 hover:border-gold-200 bg-luxury-cream/55'
                  }`}
                >
                  <img
                    src={sty.imageUrl}
                    alt={sty.name}
                    className="w-16 h-20 object-cover rounded-xl object-top"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] tracking-wider uppercase font-mono text-gold-600 block">
                      {sty.role}
                    </span>
                    <h4 className="font-serif text-sm text-luxury-dark font-semibold truncate">
                      {sty.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-snug">
                      {sty.bio}
                    </p>
                    <div className="flex items-center text-[10px] font-mono text-gold-600 mt-1">
                      ★ {sty.rating}
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    selectedStylist?.id === sty.id ? 'border-gold-500 bg-gold-500 text-white' : 'border-gray-300'
                  }`}>
                    {selectedStylist?.id === sty.id && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 3: SELECT DATE & TIME
            ======================================================== */}
        {step === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <h3 className="font-serif text-xl text-luxury-dark text-center font-medium mb-4">
              Choose Appointment Date & Time
            </h3>

            {/* Custom Horizontal Date Picker Slider */}
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-gray-400 block mb-3">
                Select Date
              </label>
              <div className="flex space-x-2 overflow-x-auto pb-3 scrollbar-none snap-x">
                {availableDays.map((day) => {
                  const isSelected = selectedDate === day.dateStr;
                  return (
                    <div
                      key={day.dateStr}
                      onClick={() => setSelectedDate(day.dateStr)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border min-w-[70px] cursor-pointer snap-start transition-all duration-200 ${
                        isSelected
                          ? 'border-gold-400 bg-gold-50 text-gold-800 font-semibold scale-105 shadow-sm'
                          : 'border-gray-100 bg-luxury-cream text-gray-600 hover:border-gold-200 hover:bg-white'
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">
                        {day.dayName}
                      </span>
                      <span className="font-serif text-lg my-1">
                        {day.dayNum}
                      </span>
                      <span className="text-[9px] uppercase tracking-widest font-mono">
                        {day.monthName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selection categorized by Morning / Afternoon / Evening */}
            <div className="space-y-6">
              <label className="text-xs font-mono uppercase tracking-widest text-gray-400 block">
                Select Time Slot
              </label>

              {/* Morning (before 12 PM) */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-600 block mb-2.5">Morning Slots</span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.filter(s => s.period === 'morning').map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`py-2 px-3 border text-xs tracking-wider font-mono rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? 'border-gold-500 bg-gold-500 text-white font-semibold'
                            : 'border-gray-100 bg-luxury-cream text-gray-600 hover:border-gold-200 hover:bg-white'
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Afternoon (12 PM - 5 PM) */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-600 block mb-2.5">Afternoon Slots</span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.filter(s => s.period === 'afternoon').map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`py-2 px-3 border text-xs tracking-wider font-mono rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? 'border-gold-500 bg-gold-500 text-white font-semibold'
                            : 'border-gray-100 bg-luxury-cream text-gray-600 hover:border-gold-200 hover:bg-white'
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Evening (after 5 PM) */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-600 block mb-2.5">Evening Slots</span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.filter(s => s.period === 'evening').map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`py-2 px-3 border text-xs tracking-wider font-mono rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? 'border-gold-500 bg-gold-500 text-white font-semibold'
                            : 'border-gray-100 bg-luxury-cream text-gray-600 hover:border-gold-200 hover:bg-white'
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 4: GUEST DETAILS & NOTES
            ======================================================== */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="font-serif text-xl text-luxury-dark text-center font-medium mb-4">
              Enter Your Personal Contact Details
            </h3>

            <div className="bg-luxury-cream rounded-2xl p-6 sm:p-8 border border-gold-100/30 space-y-5">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1 text-gold-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lady Genevieve"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-white border border-gray-200 focus:border-gold-400 focus:outline-none rounded-xl py-3 px-4 text-xs tracking-wide"
                />
              </div>

              {/* Grid: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-1 text-gold-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. genevieve@montevall.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full bg-white border border-gray-200 focus:border-gold-400 focus:outline-none rounded-xl py-3 px-4 text-xs tracking-wide"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-1 text-gold-400" />
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 (555) 302-8899"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full bg-white border border-gray-200 focus:border-gold-400 focus:outline-none rounded-xl py-3 px-4 text-xs tracking-wide"
                  />
                </div>
              </div>

              {/* Custom Preferences Notes */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1 text-gold-400" />
                  Special Instructions / Preferences (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Please state any product allergies, pressure preferences, or champagne choices..."
                  value={guestNotes}
                  onChange={(e) => setGuestNotes(e.target.value)}
                  className="w-full bg-white border border-gray-200 focus:border-gold-400 focus:outline-none rounded-xl py-3 px-4 text-xs tracking-wide resize-none"
                />
              </div>

              <p className="text-[10px] text-gray-400 leading-snug">
                * Note: Your details are encrypted. We will send a confirmation and reminder SMS 
                to your mobile 24 hours prior to the session.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 5: REVIEW & VERIFY SUMMARY
            ======================================================== */}
        {step === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="font-serif text-xl text-luxury-dark text-center font-medium mb-4">
              Review & Finalize Appointment Reservation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Left Column: Summary Card */}
              <div className="md:col-span-7 bg-luxury-cream border border-gold-200/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-md">
                <h4 className="font-serif text-base tracking-tight text-luxury-dark pb-2 border-b border-gold-100">
                  Appointment Overview
                </h4>

                {/* Service row */}
                {selectedService && (
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[8px] tracking-wider uppercase font-mono text-gold-600">Selected Treatment</span>
                      <p className="font-serif text-sm text-luxury-dark font-medium mt-0.5">{selectedService.name}</p>
                      <span className="text-xs text-gray-400 font-mono">{selectedService.duration} mins</span>
                    </div>
                    <span className="font-serif text-sm font-semibold text-luxury-dark">${selectedService.price}</span>
                  </div>
                )}

                {/* Stylist row */}
                <div className="flex justify-between items-center py-3 border-t border-b border-gold-100/40">
                  <div>
                    <span className="text-[8px] tracking-wider uppercase font-mono text-gold-600 block">Assigned Therapist</span>
                    <span className="font-sans text-xs text-gray-700 font-medium">
                      {isAnyStylist ? 'Any Available Professional Staff' : selectedStylist?.name}
                    </span>
                  </div>
                  {!isAnyStylist && selectedStylist && (
                    <img
                      src={selectedStylist.imageUrl}
                      alt={selectedStylist.name}
                      className="w-10 h-10 object-cover rounded-full border border-gold-200"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>

                {/* Date and Time row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[8px] tracking-wider uppercase font-mono text-gold-600">Session Date</span>
                    <p className="text-xs text-gray-700 font-medium mt-0.5">{selectedDate}</p>
                  </div>
                  <div>
                    <span className="text-[8px] tracking-wider uppercase font-mono text-gold-600">Arrival Time</span>
                    <p className="text-xs text-gray-700 font-medium mt-0.5">{selectedTimeSlot}</p>
                  </div>
                </div>

                {/* Guest Contact confirmation */}
                <div className="pt-3 border-t border-gold-100/30">
                  <span className="text-[8px] tracking-wider uppercase font-mono text-gold-600 block">Reserved For</span>
                  <p className="text-xs text-gray-700 font-medium mt-0.5">{guestName}</p>
                  <p className="text-[11px] text-gray-400">{guestEmail} &bull; {guestPhone}</p>
                </div>
              </div>

              {/* Right Column: Billing & Promo */}
              <div className="md:col-span-5 space-y-6 flex flex-col justify-between">
                
                {/* Coupon Code Block */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center space-x-1.5 text-gold-600 text-xs font-mono uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Apply Privilege Coupon</span>
                  </div>

                  {appliedPromo ? (
                    <div className="bg-gold-50 border border-gold-200 p-3 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="text-xs font-semibold text-gold-800 font-mono">{appliedPromo.code}</span>
                        <p className="text-[10px] text-gold-600 leading-snug">{appliedPromo.description}</p>
                      </div>
                      <button 
                        onClick={handleRemovePromo}
                        className="text-xs text-red-500 font-mono hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="e.g. FIRST15"
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value)}
                          className="flex-1 bg-luxury-cream border border-gray-200 focus:border-gold-300 focus:outline-none rounded-xl px-3 py-2 text-xs font-mono uppercase"
                        />
                        <button
                          onClick={handleApplyPromo}
                          className="px-4 py-2 bg-luxury-dark text-white text-[10px] font-sans tracking-wider uppercase font-medium rounded-xl hover:bg-gold-500 hover:text-luxury-dark transition-all cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && <p className="text-[10px] text-red-500 font-mono">{promoError}</p>}
                      <p className="text-[9px] text-gray-400 leading-tight">
                        Try "FIRST15" for a 15% discount. Coupon codes cannot be combined.
                      </p>
                    </div>
                  )}
                </div>

                {/* Total Billing Details */}
                <div className="bg-luxury-cream border border-gold-100/30 rounded-2xl p-6 space-y-3">
                  <div className="flex justify-between text-xs text-gray-600 font-mono">
                    <span>Base Fare:</span>
                    <span>${basePrice}.00</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-xs text-emerald-600 font-mono">
                      <span>Privilege Discount ({appliedPromo?.discountPercent}%):</span>
                      <span>-${discountAmount}.00</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-gray-600 font-mono">
                    <span>Service Tax (8%):</span>
                    <span>+${serviceTax}.00</span>
                  </div>

                  <div className="border-t border-gold-200 pt-3 flex justify-between items-end">
                    <span className="font-serif text-sm font-semibold text-luxury-dark uppercase tracking-wider">Total Due:</span>
                    <span className="font-serif text-2xl font-bold text-gold-600">${finalPrice}.00</span>
                  </div>
                  <span className="text-[9px] text-gray-400 font-mono text-right block mt-1">Payment is processed post-session in-spa</span>
                </div>

                {/* Confirmation Action */}
                <button
                  onClick={handleConfirmBooking}
                  className="w-full py-4 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-luxury-dark font-sans font-bold text-xs tracking-widest uppercase rounded-full shadow-lg transition-all hover:scale-[1.01] flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-luxury-dark" />
                  <span>Confirm Reservation</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================
            STEP 6: SUCCESS CONFIRMATION
            ======================================================== */}
        {step === 6 && successBooking && (
          <div className="animate-scaleIn max-w-lg mx-auto bg-luxury-cream border-2 border-gold-300 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-center relative overflow-hidden">
            {/* Top gold banner decoration */}
            <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300"></div>

            <div className="space-y-3">
              <div className="w-16 h-16 bg-gold-400/10 border-2 border-gold-400 text-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Check className="w-8 h-8 stroke-[3px]" />
              </div>
              <span className="text-[9px] tracking-[0.4em] uppercase font-mono text-gold-600 font-bold block">
                Appointment Secured
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-luxury-dark font-semibold">
                Your Sanctuary Awaits
              </h3>
              <p className="text-xs text-gray-500 font-sans font-light max-w-sm mx-auto">
                A luxury suite has been prepared and locked for you. We look forward to providing a highly restorative session.
              </p>
            </div>

            {/* Custom receipt voucher box */}
            <div className="bg-white border border-gold-100 rounded-2xl p-5 text-left space-y-4 shadow-sm font-sans">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-[9px] font-mono text-gray-400 uppercase">Reservation ID:</span>
                <span className="text-xs font-semibold text-luxury-dark font-mono bg-gold-50 border border-gold-100 px-2 py-0.5 rounded">
                  {successBooking.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-gray-400 font-mono">Treatment</span>
                  <p className="font-semibold text-luxury-dark truncate">{successBooking.serviceName}</p>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-gray-400 font-mono">Artist / Stylist</span>
                  <p className="font-semibold text-luxury-dark truncate">{successBooking.stylistName}</p>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-gray-400 font-mono">Date</span>
                  <p className="font-semibold text-luxury-dark">{successBooking.date}</p>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-gray-400 font-mono">Time</span>
                  <p className="font-semibold text-luxury-dark">{successBooking.time}</p>
                </div>
              </div>

              {/* Barcode representation */}
              <div className="pt-4 border-t border-dashed border-gray-200 flex flex-col items-center">
                <div className="h-10 w-full flex space-x-[2px] items-stretch justify-center opacity-85">
                  {[2,1,3,2,1,4,2,1,3,1,2,3,1,2,4,1,2,3,2,1,3].map((width, idx) => (
                    <div 
                      key={idx} 
                      className={`bg-luxury-dark rounded-sm`} 
                      style={{ width: `${width * 1.5}px` }}
                    ></div>
                  ))}
                </div>
                <span className="text-[8px] font-mono tracking-widest text-gray-400 uppercase mt-2">SCAN BARCODE AT ARRIVAL</span>
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  onBookingComplete(); // goes to App.tsx callback, e.g. switch active tab to 'appointments'
                }}
                className="flex-1 py-3 bg-luxury-dark text-white text-[10px] tracking-widest uppercase font-semibold rounded-full hover:bg-gold-500 hover:text-luxury-dark transition-all cursor-pointer"
              >
                Go To My Bookings
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setSelectedService(null);
                  setSelectedStylist(null);
                  setIsAnyStylist(false);
                  setAppliedPromo(null);
                  setSuccessBooking(null);
                  setGuestNotes('');
                  clearPreSelections();
                }}
                className="flex-1 py-3 bg-white hover:bg-luxury-cream border border-gold-200 text-gray-700 text-[10px] tracking-widest uppercase font-semibold rounded-full transition-all cursor-pointer"
              >
                Book Another Service
              </button>
            </div>
          </div>
        )}

        {/* Step Buttons (Back & Next footer) */}
        {step <= 5 && (
          <div className="mt-12 pt-6 border-t border-gray-100 flex justify-between">
            <button
              onClick={handleBack}
              className="flex items-center space-x-1 py-2 px-4 border border-gray-200 rounded-full text-xs text-gray-500 hover:border-gold-300 hover:text-luxury-dark transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{step === 1 ? 'Cancel' : 'Back'}</span>
            </button>

            {step < 5 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`flex items-center space-x-1 py-2.5 px-6 rounded-full text-xs font-semibold tracking-wider transition-all uppercase cursor-pointer ${
                  isStepValid()
                    ? 'bg-luxury-dark text-white hover:bg-gold-500 hover:text-luxury-dark'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
}
