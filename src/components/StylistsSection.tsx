import { useSalonStore } from '../lib/store';
import { Star, ShieldCheck, Mail, CalendarDays } from 'lucide-react';

interface StylistsSectionProps {
  onSelectStylist: (stylistId: string) => void;
}

export default function StylistsSection({ onSelectStylist }: StylistsSectionProps) {
  const { stylists } = useSalonStore();
  return (
    <section id="stylists-section" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.35em] uppercase font-mono text-gold-500 font-semibold">
            The Master Artists
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-luxury-dark mt-3 mb-6 tracking-tight">
            Meet Our Popular Stylists
          </h2>
          <div className="h-0.5 w-16 bg-gold-400 mx-auto mb-6"></div>
          <p className="text-sm text-gray-500 font-sans font-light leading-relaxed">
            Our team comprises award-winning, international specialists who are passionately devoted to 
            revisiting classic styles and pioneering avant-garde beauty aesthetics.
          </p>
        </div>

        {/* Stylists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stylists.map((stylist) => (
            <div
              key={stylist.id}
              className="group bg-luxury-cream rounded-2xl overflow-hidden border border-gold-100/30 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Image Panel with ratings */}
                <div className="relative h-80 overflow-hidden bg-gray-100">
                  <img
                    src={stylist.imageUrl}
                    alt={stylist.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/70 via-transparent to-transparent opacity-70"></div>
                  
                  {/* Rating Label overlay */}
                  <div className="absolute bottom-4 left-4 flex items-center bg-white/90 backdrop-blur-sm py-1 px-2.5 rounded-full shadow-sm text-xs text-luxury-dark font-medium font-mono">
                    <Star className="w-3.5 h-3.5 text-gold-500 fill-current mr-1" />
                    <span>{stylist.rating}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6">
                  <span className="text-[9px] tracking-widest uppercase font-mono text-gold-600 font-semibold block mb-1">
                    {stylist.role}
                  </span>
                  <h3 className="font-serif text-lg text-luxury-dark font-semibold mb-3">
                    {stylist.name}
                  </h3>
                  
                  <p className="text-xs text-gray-500 font-light leading-relaxed mb-4 min-h-[60px]">
                    {stylist.bio}
                  </p>

                  {/* Specialties tag block */}
                  <div className="space-y-1.5 pt-3 border-t border-gold-100/40">
                    <span className="text-[9px] uppercase tracking-[0.1em] text-gray-400 font-mono block">Specializes in:</span>
                    <div className="flex flex-wrap gap-1">
                      {stylist.specialties.map((spec) => (
                        <span
                          key={spec}
                          className="bg-white border border-gold-200/40 text-[9px] font-sans font-medium text-gray-600 px-2 py-0.5 rounded"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => onSelectStylist(stylist.id)}
                  className="w-full py-3 bg-luxury-dark hover:bg-gold-500 text-white hover:text-luxury-dark rounded-full text-[10px] tracking-widest uppercase font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md cursor-pointer"
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Book With {stylist.name.split(' ')[0]}</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* trust endorsement ribbon */}
        <div className="mt-16 bg-luxury-cream border border-gold-100/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-full border border-gold-200 shadow-sm text-gold-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base text-luxury-dark font-medium">Fully Licensed & Certified Hygiene Standards</h4>
              <p className="text-xs text-gray-500 font-light mt-0.5">We maintain sterile, hospital-grade equipment and organic air-purification across all therapy suites.</p>
            </div>
          </div>
          <div className="flex -space-x-2">
            <div className="text-xs text-gold-700 bg-gold-100/60 font-medium px-4 py-2 rounded-full border border-gold-200/40">
              Awarded Best Spa Experience 2025
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
