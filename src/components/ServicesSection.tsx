import { useState } from 'react';
import { Service, ServiceCategory } from '../types';
import { useSalonStore } from '../lib/store';
import { Clock, DollarSign, Star, ChevronRight } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (serviceId: string) => void;
}

export default function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const { services } = useSalonStore();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'All'>('All');

  const categories = ['All', ...Object.values(ServiceCategory)];

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(service => service.category === selectedCategory);

  return (
    <section id="services-section" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.35em] uppercase font-mono text-gold-500 font-semibold">
            Our Menu of Services
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-luxury-dark mt-3 mb-6 tracking-tight">
            Indulge in Masterful Treatments
          </h2>
          <div className="h-0.5 w-16 bg-gold-400 mx-auto mb-6"></div>
          <p className="text-sm text-gray-500 font-sans font-light leading-relaxed">
            Every service is an bespoke experience, tailored specifically to your individual profile. 
            We utilize only organic, biodynamic, and non-toxic botanical formulations.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as any)}
              className={`px-5 py-2.5 rounded-full text-[11px] tracking-widest uppercase font-medium transition-all duration-300 cursor-pointer ${
                selectedCategory === category
                  ? 'bg-luxury-dark text-white shadow-md'
                  : 'bg-luxury-cream text-gray-600 hover:bg-gold-100 hover:text-luxury-dark border border-transparent'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-luxury-cream rounded-2xl overflow-hidden border border-gold-100/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
            >
              {/* Image Container with Hover zoom and badge */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                
                {/* Popularity / Accent Badge */}
                {service.popular && (
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-gold-400 to-gold-500 text-luxury-dark font-mono text-[9px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>Popular</span>
                  </span>
                )}
                
                {/* Category small badge */}
                <span className="absolute bottom-4 left-4 text-[9px] tracking-widest uppercase font-mono text-white bg-luxury-dark/60 backdrop-blur-sm px-2.5 py-1 rounded-md">
                  {service.category}
                </span>
              </div>

              {/* Service Details */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <h3 className="font-serif text-lg text-luxury-dark font-medium leading-snug group-hover:text-gold-600 transition-colors">
                      {service.name}
                    </h3>
                    <div className="flex items-center text-gold-600 font-serif font-semibold text-lg whitespace-nowrap pl-2">
                      <span className="text-sm font-sans font-light mr-0.5">$</span>
                      {service.price}
                    </div>
                  </div>

                  {/* Metadata line */}
                  <div className="flex items-center space-x-4 mb-4 text-xs text-gray-400 font-mono">
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 text-gold-400 mr-1.5" />
                      {service.duration} mins
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 font-light leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Booking Button inside card */}
                <button
                  onClick={() => onSelectService(service.id)}
                  className="w-full py-3 bg-white hover:bg-luxury-dark hover:text-white border border-gold-200 hover:border-luxury-dark text-gray-800 rounded-full text-[10px] tracking-widest uppercase font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md cursor-pointer"
                >
                  <span>Book This Service</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
