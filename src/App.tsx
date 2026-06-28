import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import BeforeAfter from './components/BeforeAfter';
import StylistsSection from './components/StylistsSection';
import OffersSection from './components/OffersSection';
import TestimonialsSection from './components/TestimonialsSection';
import InstagramFeed from './components/InstagramFeed';
import LocationFooter from './components/LocationFooter';
import BookingFlow from './components/BookingFlow';
import MyAppointments from './components/MyAppointments';
import CustomerDashboard from './components/CustomerDashboard';
import AdminPortal from './components/AdminPortal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'booking' | 'appointments' | 'customer-portal' | 'admin-portal'>('home');
  const [preSelectedServiceId, setPreSelectedServiceId] = useState<string | null>(null);
  const [preSelectedStylistId, setPreSelectedStylistId] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Callback when a user clicks "Book This Service" on a service card
  const handleSelectService = (serviceId: string) => {
    setPreSelectedServiceId(serviceId);
    setPreSelectedStylistId(null);
    setCurrentTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Callback when a user clicks "Book with Sophia" on a stylist card
  const handleSelectStylist = (stylistId: string) => {
    setPreSelectedStylistId(stylistId);
    setPreSelectedServiceId(null);
    setCurrentTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Callback when booking is successfully completed
  const handleBookingComplete = () => {
    setPreSelectedServiceId(null);
    setPreSelectedStylistId(null);
    setCurrentTab('customer-portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearPreSelections = () => {
    setPreSelectedServiceId(null);
    setPreSelectedStylistId(null);
    setCurrentTab('home');
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans flex flex-col justify-between selection:bg-gold-200 selection:text-gold-900">
      
      {/* Sticky top glass navigation */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        scrollToSection={scrollToSection} 
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentTab === 'home' && (
          <div className="animate-fadeIn">
            {/* Full-screen high-end Hero */}
            <Hero 
              setCurrentTab={setCurrentTab} 
              scrollToSection={scrollToSection} 
            />

            {/* Categorized featured Services with book actions */}
            <ServicesSection 
              onSelectService={handleSelectService} 
            />

            {/* Drag Before & After comparison slider */}
            <BeforeAfter />

            {/* Professional Stylists team directory with book triggers */}
            <StylistsSection 
              onSelectStylist={handleSelectStylist} 
            />

            {/* Special offers grid with copyable privilege codes */}
            <OffersSection 
              onBookOffer={() => {
                setPreSelectedServiceId(null);
                setPreSelectedStylistId(null);
                setCurrentTab('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />

            {/* Customer reviews carousel */}
            <TestimonialsSection />

            {/* Aesthetic Instagram feed showcase */}
            <InstagramFeed />
          </div>
        )}

        {currentTab === 'booking' && (
          <div className="animate-fadeIn pt-12">
            <BookingFlow 
              preSelectedServiceId={preSelectedServiceId}
              preSelectedStylistId={preSelectedStylistId}
              onBookingComplete={handleBookingComplete}
              clearPreSelections={handleClearPreSelections}
            />
          </div>
        )}

        {currentTab === 'appointments' && (
          <div className="animate-fadeIn pt-12">
            <MyAppointments 
              setCurrentTab={setCurrentTab} 
            />
          </div>
        )}

        {currentTab === 'customer-portal' && (
          <div className="animate-fadeIn pt-12">
            <CustomerDashboard 
              setCurrentTab={setCurrentTab}
              onBookSelected={() => {
                setPreSelectedServiceId(null);
                setPreSelectedStylistId(null);
                setCurrentTab('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {currentTab === 'admin-portal' && (
          <div className="animate-fadeIn">
            <AdminPortal />
          </div>
        )}
      </main>

      {/* Hide LocationFooter in admin-portal for high-end professional appearance */}
      {currentTab !== 'admin-portal' && <LocationFooter />}
    </div>
  );
}
