import { useState, useEffect } from 'react';
import { Appointment } from '../types';
import { TIME_SLOTS } from '../data';
import { 
  Calendar, Clock, User, Trash2, AlertCircle, ShoppingBag, 
  MapPin, Phone, HelpCircle, Check, X, ArrowLeftRight 
} from 'lucide-react';

interface MyAppointmentsProps {
  setCurrentTab: (tab: 'home' | 'booking' | 'appointments') => void;
}

export default function MyAppointments({ setCurrentTab }: MyAppointmentsProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editingBooking, setEditingBooking] = useState<Appointment | null>(null);

  // Rescheduling states
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleTime, setRescheduleTime] = useState<string>('');
  const [availableDays, setAvailableDays] = useState<{ dateStr: string; dayName: string; dayNum: number }[]>([]);

  // Load appointments from LocalStorage
  const loadAppointments = () => {
    try {
      const stored = localStorage.getItem('luxury_salon_bookings');
      if (stored) {
        setAppointments(JSON.parse(stored));
      } else {
        // Seed an initial dummy appointment if empty to show how it looks!
        const d = new Date();
        d.setDate(d.getDate() + 3); // 3 days in future
        const dateStr = d.toISOString().split('T')[0];
        
        const seedBooking: Appointment = {
          id: 'LS-821940',
          serviceId: 'hair-1',
          serviceName: 'Couture Haircut & Style',
          stylistId: 'stylist-1',
          stylistName: 'Sophia Chen',
          stylistImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80',
          date: dateStr,
          time: '11:00 AM',
          customerName: 'Guest Client',
          customerEmail: 'guest@example.com',
          customerPhone: '+1 (555) 123-4567',
          notes: 'Prefer medium water wash. Complimentary warm tea selection.',
          status: 'upcoming',
          totalPrice: 128, // inclusive of mock tax
          duration: 60,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('luxury_salon_bookings', JSON.stringify([seedBooking]));
        setAppointments([seedBooking]);
      }
    } catch (e) {
      console.error('Failed to read local appointments', e);
    }
  };

  useEffect(() => {
    loadAppointments();

    // Generate 10 days for reschedule picker
    const days = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 1; i <= 10; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        dateStr: d.toISOString().split('T')[0],
        dayName: weekdays[d.getDay()],
        dayNum: d.getDate()
      });
    }
    setAvailableDays(days);
  }, []);

  // Cancel Appointment Logic
  const handleCancelBooking = (id: string) => {
    const isConfirmed = window.confirm('Are you sure you would like to cancel this luxury appointment?');
    if (!isConfirmed) return;

    try {
      const updated = appointments.map((b) => {
        if (b.id === id) {
          return { ...b, status: 'cancelled' as const };
        }
        return b;
      });
      localStorage.setItem('luxury_salon_bookings', JSON.stringify(updated));
      setAppointments(updated);
    } catch (e) {
      console.error(e);
    }
  };

  // Reschedule Confirmation Logic
  const handleSaveReschedule = () => {
    if (!editingBooking || !rescheduleDate || !rescheduleTime) return;

    try {
      const updated = appointments.map((b) => {
        if (b.id === editingBooking.id) {
          return { 
            ...b, 
            date: rescheduleDate, 
            time: rescheduleTime,
            notes: (b.notes || '') + ` (Rescheduled to ${rescheduleDate} at ${rescheduleTime})`
          };
        }
        return b;
      });
      localStorage.setItem('luxury_salon_bookings', JSON.stringify(updated));
      setAppointments(updated);
      setEditingBooking(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div id="appointments-portal-container" className="py-24 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.35em] uppercase font-mono text-gold-500 font-semibold">
            Customer Reservation Suite
          </span>
          <h2 className="font-serif text-3xl text-luxury-dark mt-2 tracking-tight">
            My Appointments
          </h2>
          <p className="text-xs text-gray-500 font-sans font-light mt-1 max-w-md mx-auto">
            View, schedule-edit, or cancel your secured luxury therapy sessions. Stored locally on this browser session.
          </p>
        </div>

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <div className="text-center py-16 bg-luxury-cream border border-gold-100/30 rounded-3xl p-8 max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-gold-500 mx-auto mb-4" />
            <h3 className="font-serif text-lg text-luxury-dark font-medium">No Reservations Found</h3>
            <p className="text-xs text-gray-500 font-light mt-2 mb-6">
              You currently have no active appointments booked on this device.
            </p>
            <button
              onClick={() => setCurrentTab('booking')}
              className="px-6 py-3 bg-luxury-dark text-white rounded-full text-[10px] tracking-widest uppercase font-semibold hover:bg-gold-500 hover:text-luxury-dark transition-all cursor-pointer"
            >
              Book Your First Treatment
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {appointments.map((booking) => {
              const isUpcoming = booking.status === 'upcoming';
              const isCancelled = booking.status === 'cancelled';
              
              return (
                <div
                  key={booking.id}
                  className={`bg-luxury-cream border rounded-3xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md flex flex-col md:flex-row justify-between ${
                    isCancelled ? 'border-gray-200 opacity-65' : 'border-gold-100'
                  }`}
                >
                  
                  {/* Left Column: Ticket Detail Summary */}
                  <div className="p-6 sm:p-8 flex-1 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gold-100/30">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-semibold text-gray-500">
                          ID: {booking.id}
                        </span>
                        <span className="text-[9px] text-gray-400 font-mono">
                          Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider font-semibold ${
                        isCancelled 
                          ? 'bg-gray-100 text-gray-500' 
                          : 'bg-gold-100 text-gold-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Treatment Info */}
                      <div className="space-y-1.5">
                        <span className="text-[8px] uppercase tracking-wider text-gray-400 font-mono">Therapy / Treatment</span>
                        <h3 className="font-serif text-base font-semibold text-luxury-dark leading-snug">
                          {booking.serviceName}
                        </h3>
                        <div className="flex items-center space-x-3 text-xs text-gray-500 font-mono">
                          <span className="flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1 text-gold-400" />
                            {booking.duration} mins
                          </span>
                        </div>
                      </div>

                      {/* Stylist Assigned */}
                      <div className="flex items-center space-x-3">
                        {booking.stylistImage && (
                          <img
                            src={booking.stylistImage}
                            alt={booking.stylistName}
                            className="w-10 h-10 rounded-full object-cover border border-gold-200"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div>
                          <span className="text-[8px] uppercase tracking-wider text-gray-400 font-mono block">Therapist</span>
                          <span className="text-xs font-medium text-gray-700">{booking.stylistName}</span>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="space-y-1">
                        <span className="text-[8px] uppercase tracking-wider text-gray-400 font-mono block">Reservation Schedule</span>
                        <div className="flex items-center space-x-1.5 text-xs font-medium text-luxury-dark">
                          <Calendar className="w-4 h-4 text-gold-500" />
                          <span>{booking.date}</span>
                          <span className="text-gray-300">|</span>
                          <Clock className="w-4 h-4 text-gold-500" />
                          <span>{booking.time}</span>
                        </div>
                      </div>

                      {/* Price billed */}
                      <div className="space-y-1">
                        <span className="text-[8px] uppercase tracking-wider text-gray-400 font-mono block">Luxury Cost (tax incl.)</span>
                        <span className="font-serif text-lg font-bold text-gold-600">${booking.totalPrice}.00</span>
                      </div>

                    </div>

                    {/* Customer Notes */}
                    {booking.notes && (
                      <div className="pt-3 border-t border-gold-100/20 text-xs text-gray-500 font-light italic">
                        " {booking.notes} "
                      </div>
                    )}
                  </div>

                  {/* Right Column: Dynamic Action controls or Barcode representation */}
                  <div className="p-6 bg-white border-t md:border-t-0 md:border-l border-gold-100/40 min-w-[180px] flex flex-col justify-between items-center text-center">
                    
                    {/* Barcode representation */}
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-28 flex space-x-[1.5px] items-stretch opacity-60">
                        {[1,2,1,3,1,2,1,4,1,2,3,2,1,2,1,3].map((width, idx) => (
                          <div 
                            key={idx} 
                            className="bg-luxury-dark rounded-xs" 
                            style={{ width: `${width * 1.5}px` }}
                          ></div>
                        ))}
                      </div>
                      <span className="text-[8px] font-mono text-gray-400 tracking-wider mt-1.5 uppercase">ID: {booking.id}</span>
                    </div>

                    {/* Action buttons */}
                    {isUpcoming ? (
                      <div className="w-full space-y-2 mt-4 md:mt-0">
                        {/* Reschedule */}
                        <button
                          onClick={() => {
                            setEditingBooking(booking);
                            setRescheduleDate(booking.date);
                            setRescheduleTime(booking.time);
                          }}
                          className="w-full py-2 bg-white hover:bg-gold-50 border border-gold-200 text-[10px] tracking-widest uppercase font-semibold text-gold-700 rounded-full transition-all flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                          <span>Reschedule</span>
                        </button>
                        
                        {/* Cancel */}
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="w-full py-2 bg-white hover:bg-red-50 border border-red-100 text-[10px] tracking-widest uppercase font-semibold text-red-500 rounded-full transition-all flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Cancel Booking</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-[10px] font-mono text-gray-400 font-semibold tracking-wider mt-4">
                        {isCancelled ? 'TRANSACTION VOIDED' : 'VISIT ACCOMPLISHED'}
                      </div>
                    )}

                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================
            MODAL OVERLAY: RESCHEDULE SCHEDULER
            ======================================================== */}
        {editingBooking && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-gold-200 max-w-md w-full p-6 space-y-6 shadow-2xl animate-scaleIn">
              
              <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-serif text-lg text-luxury-dark font-semibold">Reschedule Session</h3>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">Booking ID: {editingBooking.id}</p>
                </div>
                <button 
                  onClick={() => setEditingBooking(null)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Date selection list */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Select New Date</label>
                <div className="flex space-x-1.5 overflow-x-auto pb-1">
                  {availableDays.map((day) => {
                    const isSel = rescheduleDate === day.dateStr;
                    return (
                      <div
                        key={day.dateStr}
                        onClick={() => setRescheduleDate(day.dateStr)}
                        className={`py-2 px-3 border text-center rounded-xl min-w-[54px] cursor-pointer transition-all ${
                          isSel
                            ? 'border-gold-500 bg-gold-50 text-gold-700 font-semibold'
                            : 'border-gray-100 bg-luxury-cream text-gray-600 hover:border-gold-200'
                        }`}
                      >
                        <span className="text-[8px] font-mono uppercase block">{day.dayName}</span>
                        <span className="text-xs font-serif font-semibold">{day.dayNum}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time slot list */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Select New Arrival Time</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {TIME_SLOTS.slice(0, 9).map((slot) => {
                    const isSel = rescheduleTime === slot.time;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => setRescheduleTime(slot.time)}
                        className={`py-2 px-1 text-center font-mono text-[10px] border rounded-xl transition-all cursor-pointer ${
                          isSel
                            ? 'border-gold-500 bg-gold-500 text-white font-semibold'
                            : 'border-gray-100 bg-luxury-cream text-gray-600 hover:border-gold-200'
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => setEditingBooking(null)}
                  className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-500 text-[10px] tracking-widest uppercase font-semibold rounded-full transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveReschedule}
                  className="flex-1 py-2.5 bg-luxury-dark hover:bg-gold-500 hover:text-luxury-dark text-white text-[10px] tracking-widest uppercase font-semibold rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  Confirm Slot
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
