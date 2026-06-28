import { useState, useEffect } from 'react';
import { Menu, X, Calendar, User, Compass, Award, Percent, Instagram, MapPin } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'booking' | 'appointments' | 'customer-portal' | 'admin-portal';
  setCurrentTab: (tab: 'home' | 'booking' | 'appointments' | 'customer-portal' | 'admin-portal') => void;
  scrollToSection: (sectionId: string) => void;
}

export default function Navbar({ currentTab, setCurrentTab, scrollToSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        isScrolled === false && setIsScrolled(true);
      } else {
        isScrolled === true && setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  const navItems = [
    { name: 'Home', action: () => { setCurrentTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); setIsOpen(false); } },
    { name: 'Services', action: () => { setCurrentTab('home'); setTimeout(() => scrollToSection('services-section'), 100); setIsOpen(false); } },
    { name: 'Before & After', action: () => { setCurrentTab('home'); setTimeout(() => scrollToSection('before-after-section'), 100); setIsOpen(false); } },
    { name: 'Our Stylists', action: () => { setCurrentTab('home'); setTimeout(() => scrollToSection('stylists-section'), 100); setIsOpen(false); } },
    { name: 'Special Offers', action: () => { setCurrentTab('home'); setTimeout(() => scrollToSection('offers-section'), 100); setIsOpen(false); } },
  ];

  return (
    <nav
      id="main-navigation-bar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || currentTab !== 'home'
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gold-100/40 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-10">
          {/* Logo Brand */}
          <div 
            id="brand-logo-container"
            className="flex flex-col cursor-pointer select-none"
            onClick={() => { setCurrentTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <span className="font-serif text-xl sm:text-2xl tracking-widest text-luxury-dark font-semibold">
              LUXURY
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.4em] text-gold-500 font-mono -mt-1 pl-0.5">
              SALON & SPA
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div id="desktop-nav-links" className="hidden lg:flex space-x-8 items-center">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={item.action}
                className="text-xs tracking-widest uppercase text-gray-600 hover:text-gold-500 font-sans font-medium transition-colors duration-200 cursor-pointer"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Action CTAs */}
          <div id="desktop-actions" className="hidden sm:flex space-x-4 items-center">
            {/* Admin Area Button */}
            <button
              onClick={() => { setCurrentTab('admin-portal'); }}
              className={`flex items-center space-x-1 px-3 py-2 border rounded-full text-[10px] tracking-wider uppercase font-semibold transition-all cursor-pointer ${
                currentTab === 'admin-portal'
                  ? 'border-gold-500 bg-gold-50 text-gold-600'
                  : 'border-slate-200 hover:border-gold-300 hover:bg-slate-50 text-slate-600'
              }`}
              title="Business Admin Login"
            >
              <span>Admin Access</span>
            </button>

            <button
              id="view-my-appointments-btn"
              onClick={() => { setCurrentTab('customer-portal'); }}
              className={`flex items-center space-x-1.5 px-3 py-2 border rounded-full text-xs tracking-wider uppercase font-medium transition-all cursor-pointer ${
                currentTab === 'customer-portal'
                  ? 'border-gold-500 bg-gold-50 text-gold-600 font-semibold shadow-xs'
                  : 'border-gray-200 hover:border-gold-300 hover:bg-luxury-cream text-gray-700'
              }`}
            >
              <User className="w-3.5 h-3.5 text-gold-500" />
              <span>Member Suite</span>
            </button>

            <button
              id="nav-book-now-btn"
              onClick={() => { setCurrentTab('booking'); }}
              className={`px-5 py-2.5 rounded-full text-xs tracking-widest uppercase font-medium transition-all shadow-sm cursor-pointer ${
                currentTab === 'booking'
                  ? 'bg-gold-500 text-white hover:bg-gold-600'
                  : 'bg-luxury-dark text-white hover:bg-gold-500 hover:shadow-md'
              }`}
            >
              Book Appointment
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div id="mobile-menu-trigger-container" className="lg:hidden flex items-center space-x-3">
            <button
              id="mobile-bookings-btn"
              onClick={() => { setCurrentTab('customer-portal'); }}
              className={`p-2 rounded-full border ${
                currentTab === 'customer-portal' ? 'border-gold-500 text-gold-500 bg-gold-50' : 'border-gray-200 text-gray-600'
              }`}
              title="Member Suite"
            >
              <User className="w-4 h-4" />
            </button>
            <button
              id="mobile-menu-hamburger"
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded-md text-gray-700 hover:text-gold-500 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div 
          id="mobile-nav-drawer" 
          className="lg:hidden bg-white/95 backdrop-blur-md border-b border-gold-100 shadow-lg absolute top-full left-0 w-full py-4 px-6 animate-fadeIn font-sans"
        >
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={item.action}
                className="text-left text-xs tracking-widest uppercase text-gray-600 hover:text-gold-500 py-2 border-b border-gray-50 font-sans font-medium"
              >
                {item.name}
              </button>
            ))}
            <div className="pt-2 flex flex-col sm:hidden space-y-3">
              <button
                onClick={() => { setCurrentTab('customer-portal'); setIsOpen(false); }}
                className="flex items-center justify-center space-x-2 w-full py-2.5 border border-gray-200 rounded-full text-xs tracking-widest uppercase text-gray-700 font-medium"
              >
                <User className="w-4 h-4 text-gold-500" />
                <span>Member Suite</span>
              </button>
              <button
                onClick={() => { setCurrentTab('admin-portal'); setIsOpen(false); }}
                className="flex items-center justify-center space-x-2 w-full py-2.5 border border-gray-200 rounded-full text-xs tracking-widest uppercase text-gray-700 font-medium"
              >
                <span>Admin Access</span>
              </button>
              <button
                onClick={() => { setCurrentTab('booking'); setIsOpen(false); }}
                className="w-full py-3 bg-luxury-dark text-white rounded-full text-xs tracking-widest uppercase font-medium hover:bg-gold-500 text-center"
              >
                Book Appointment
              </button>
            </div>
            <div className="hidden sm:block pt-2">
              <button
                onClick={() => { setCurrentTab('admin-portal'); setIsOpen(false); }}
                className="w-full py-2.5 border border-slate-200 text-slate-700 rounded-full text-xs tracking-widest uppercase font-medium hover:bg-slate-50 text-center mb-2"
              >
                Admin Access
              </button>
              <button
                onClick={() => { setCurrentTab('booking'); setIsOpen(false); }}
                className="w-full py-3 bg-luxury-dark text-white rounded-full text-xs tracking-widest uppercase font-medium hover:bg-gold-500 text-center"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
