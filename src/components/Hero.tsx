import { ArrowRight, Calendar, Sparkles } from 'lucide-react';

interface HeroProps {
  setCurrentTab: (tab: 'home' | 'booking' | 'appointments') => void;
  scrollToSection: (sectionId: string) => void;
}

export default function Hero({ setCurrentTab, scrollToSection }: HeroProps) {
  return (
    <div id="salon-hero-section" className="relative h-screen min-h-[600px] w-full flex items-center overflow-hidden bg-luxury-dark">
      {/* Background Image Overlay with fine golden hue */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80"
          alt="Luxury Salon Interior"
          className="w-full h-full object-cover object-center opacity-45 scale-105 animate-subtle-zoom"
          referrerPolicy="no-referrer"
        />
        {/* Subtle radial and linear dark gradients for premium text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-dark via-luxury-dark/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark via-transparent to-transparent opacity-60"></div>
      </div>

      {/* Decorative Golden Ambient Lights */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gold-400/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-10 w-72 h-72 rounded-full bg-gold-300/5 blur-[100px] pointer-events-none"></div>

      {/* Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Tagline */}
          <div className="inline-flex items-center space-x-2 bg-gold-400/10 border border-gold-300/30 px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-gold-300" />
            <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-gold-200">
              A Sensory Sanctuary of Restorative Beauty
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.08] mb-6">
            Look Your Best, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-300 to-gold-100 font-light italic">
              Every Day.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base text-gray-300 font-sans font-light tracking-wide leading-relaxed max-w-xl mb-10">
            Immerse yourself in bespoke hair styling, medical-grade skin cellular treatments, 
            and deep-tissue massage therapies. Hand-crafted by master artisans using premium 
            botanical formulas in a beautiful, minimalist space.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              id="hero-book-now-btn"
              onClick={() => setCurrentTab('booking')}
              className="flex items-center justify-center space-x-2.5 bg-gradient-to-r from-gold-300 to-gold-400 hover:from-gold-400 hover:to-gold-500 text-luxury-dark font-sans font-semibold text-xs tracking-widest uppercase px-8 py-4 rounded-full shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            <button
              id="hero-explore-services-btn"
              onClick={() => scrollToSection('services-section')}
              className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/15 text-white font-sans font-medium text-xs tracking-widest uppercase px-8 py-4 rounded-full border border-white/20 hover:border-white/40 transition-all cursor-pointer"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-3.5 h-3.5 text-gold-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Decorative scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer pointer-events-none" onClick={() => scrollToSection('services-section')}>
        <span className="text-[9px] uppercase tracking-[0.4em] text-gray-400 mb-2 font-mono">
          Scroll to explore
        </span>
        <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center p-1.5">
          <div className="w-1 h-1.5 bg-gold-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
