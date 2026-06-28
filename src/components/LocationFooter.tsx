import React, { useState, FormEvent } from 'react';
import { useSalonStore } from '../lib/store';
import { 
  MapPin, Phone, Mail, Clock, Send, Instagram, 
  Facebook, Compass, CheckCircle2, AlertCircle 
} from 'lucide-react';

export default function LocationFooter() {
  const { contactInfo, openingHours } = useSalonStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!newsletterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      setErrorMsg('Please enter a valid luxury guest email address.');
      return;
    }

    setSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <footer id="location-and-footer-suite" className="bg-luxury-dark text-gray-300 relative overflow-hidden">
      
      {/* ========================================================
          MAP & CONTACT INFORMATION
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-gray-800">
        
        {/* Left 5 cols: Details & Opening Hours */}
        <div className="lg:col-span-5 p-8 sm:p-12 lg:p-16 space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="font-serif text-2xl tracking-widest text-white font-bold">LUXURY</span>
              <span className="text-[10px] tracking-[0.4em] text-gold-400 font-mono -mt-1 pl-0.5">SALON & SPA</span>
            </div>

            <p className="text-xs text-gray-400 font-sans font-light leading-relaxed max-w-sm">
              {contactInfo.aboutText}
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-gold-400 font-mono font-semibold">Flagship Contact</h4>
            <div className="space-y-2.5 text-xs">
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-start space-x-3 text-gray-300 hover:text-gold-400 transition-colors"
              >
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                <span>{contactInfo.address}</span>
              </a>

              <a 
                href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, '')}`} 
                className="flex items-center space-x-3 text-gray-300 hover:text-gold-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-gold-400" />
                <span>{contactInfo.phone} (Appointments)</span>
              </a>

              <a 
                href={`mailto:${contactInfo.email}`} 
                className="flex items-center space-x-3 text-gray-300 hover:text-gold-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-gold-400" />
                <span>{contactInfo.email}</span>
              </a>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4 pt-4 border-t border-gray-800">
            <h4 className="text-[10px] uppercase tracking-widest text-gold-400 font-mono font-semibold flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              Opening Hours
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs font-sans">
              {openingHours.map((oh) => (
                <div key={oh.day} className="space-y-0.5">
                  <span className="text-[10px] text-gray-400 font-medium block">{oh.day}</span>
                  <span className="text-white font-medium">{oh.hours}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 7 cols: Stylized Interactive Location Map representation */}
        <div className="lg:col-span-7 h-[400px] lg:h-auto min-h-[350px] relative bg-gray-900 overflow-hidden">
          {/* We create a gorgeously stylized vector Map representation (using real-world coordinates look) */}
          <div className="absolute inset-0 bg-gray-950 opacity-90">
            {/* Styled Map grid lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e1b18_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
            
            {/* Custom stylized roads representation */}
            <div className="absolute top-1/4 left-0 right-0 h-[2px] bg-gray-800/60 rotate-2"></div>
            <div className="absolute top-2/3 left-0 right-0 h-[3px] bg-gray-800/60 -rotate-3"></div>
            <div className="absolute left-1/3 top-0 bottom-0 w-[2px] bg-gray-800/60 rotate-12"></div>
            <div className="absolute left-2/3 top-0 bottom-0 w-[4px] bg-gray-800/60 -rotate-6"></div>

            {/* Central Pin Highlight Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              {/* Outer wave rings */}
              <div className="absolute w-16 h-16 rounded-full border border-gold-400/40 animate-ping opacity-75"></div>
              <div className="absolute w-28 h-28 rounded-full border border-gold-400/20 animate-ping opacity-40"></div>
              
              {/* Central Map Pin Icon and label */}
              <div className="relative z-10 w-12 h-12 bg-gold-500 hover:bg-gold-600 text-luxury-dark rounded-full flex items-center justify-center shadow-2xl cursor-pointer transition-transform hover:scale-110">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="mt-3 bg-luxury-dark/95 border border-gold-300/40 text-white rounded-xl px-4 py-2 text-center shadow-2xl backdrop-blur-sm">
                <span className="text-[10px] font-semibold tracking-wider font-sans block">Luxury Salon Flagship</span>
                <span className="text-[8px] font-mono tracking-widest text-gold-400 uppercase">Mayfair, NY</span>
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center bg-luxury-dark/90 border border-gray-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
            <div className="text-xs">
              <span className="font-semibold text-white block">Luxury Salon & Spa Flagship</span>
              <span className="text-[10px] text-gray-400 font-light block mt-0.5">100 Royal Crescent Parkway, NY</span>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gold-400 hover:bg-gold-500 text-luxury-dark rounded-full text-[10px] font-semibold tracking-widest uppercase transition-all"
            >
              Get Directions
            </a>
          </div>
        </div>

      </div>

      {/* ========================================================
          NEWSLETTER, LINKS & PRIVACY FOOTER
          ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Newsletter (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <h4 className="font-serif text-lg text-white font-medium">Join the Privilege Club</h4>
            <p className="text-xs text-gray-400 font-sans font-light leading-relaxed max-w-sm">
              Subscribe to receive exclusive invitations to seasonal treatment releases, private wellness hours, and member rewards.
            </p>

            {subscribed ? (
              <div className="bg-gold-400/10 border border-gold-300/30 p-4 rounded-2xl flex items-start space-x-3 max-w-sm animate-scaleIn">
                <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-white block">Welcome to the Club</span>
                  <span className="text-[10px] text-gold-300/80 font-mono block mt-0.5">INVITATION SENT TO YOUR INBOX</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2 max-w-sm">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email address..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 focus:border-gold-400 focus:outline-none rounded-xl py-3 pl-4 pr-12 text-xs tracking-wide text-white"
                  />
                  <button
                    type="submit"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 bg-gold-500 hover:bg-gold-600 text-luxury-dark rounded-lg transition-colors cursor-pointer"
                    title="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                {errorMsg && (
                  <p className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errorMsg}</span>
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Navigation Links Grid (4 cols) */}
          <div className="md:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest text-gold-400 font-mono font-semibold">Sanctuary</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#services-section" className="text-gray-400 hover:text-white transition-colors">Our Menu</a></li>
                <li><a href="#stylists-section" className="text-gray-400 hover:text-white transition-colors">The Stylists</a></li>
                <li><a href="#before-after-section" className="text-gray-400 hover:text-white transition-colors">Before & After</a></li>
                <li><a href="#offers-section" className="text-gray-400 hover:text-white transition-colors">Special Offers</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest text-gold-400 font-mono font-semibold">Legals & Care</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#location-and-footer-suite" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#location-and-footer-suite" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#location-and-footer-suite" className="text-gray-400 hover:text-white transition-colors">Hygiene Standards</a></li>
                <li><a href="#location-and-footer-suite" className="text-gray-400 hover:text-white transition-colors">Cancellation Rules</a></li>
              </ul>
            </div>
          </div>

          {/* Social connections (3 cols) */}
          <div className="md:col-span-3 space-y-4 md:text-right md:flex md:flex-col md:items-end">
            <h4 className="text-[10px] uppercase tracking-widest text-gold-400 font-mono font-semibold">Connect with us</h4>
            <div className="flex space-x-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-gray-900 border border-gray-800 hover:border-gold-400 text-gray-400 hover:text-gold-400 rounded-full transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-gray-900 border border-gray-800 hover:border-gold-400 text-gray-400 hover:text-gold-400 rounded-full transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-gray-900 border border-gray-800 hover:border-gold-400 text-gray-400 hover:text-gold-400 rounded-full transition-all"
              >
                <Compass className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[9px] text-gray-500 font-mono pt-2">
              Bespoke curation &copy; {new Date().getFullYear()} Luxury Salon & Spa Inc. All rights reserved.
            </p>
          </div>

        </div>
      </div>

    </footer>
  );
}
