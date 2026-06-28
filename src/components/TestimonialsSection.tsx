import { useState } from 'react';
import { TESTIMONIALS } from '../data';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[activeIndex];

  return (
    <section id="testimonials-section" className="py-24 bg-luxury-cream border-b border-gold-100/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Decorative Quote mark */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gold-400/10 rounded-full border border-gold-300/20 text-gold-500">
            <Quote className="w-8 h-8 fill-current" />
          </div>
        </div>

        {/* Carousel slide representation */}
        <div className="relative text-center space-y-8 max-w-3xl mx-auto">
          
          {/* Rating stars */}
          <div className="flex justify-center space-x-1">
            {[...Array(current.rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-gold-500 fill-current" />
            ))}
          </div>

          {/* Testimonial Statement */}
          <blockquote className="font-serif text-lg sm:text-2xl text-luxury-dark italic leading-relaxed tracking-wide">
            "{current.comment}"
          </blockquote>

          {/* Client profile */}
          <div className="flex flex-col items-center space-y-2">
            {current.imageUrl && (
              <img
                src={current.imageUrl}
                alt={current.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-gold-300"
                referrerPolicy="no-referrer"
              />
            )}
            <h4 className="font-serif text-base text-luxury-dark font-semibold">
              {current.name}
            </h4>
            <span className="text-[10px] tracking-widest uppercase font-mono text-gold-600">
              {current.role}
            </span>
          </div>

          {/* Arrow controls */}
          <div className="flex justify-center items-center space-x-6 pt-4">
            <button
              onClick={handlePrev}
              className="p-2 border border-gold-200/50 hover:border-gold-400 bg-white hover:bg-gold-50 text-gold-600 rounded-full shadow-sm transition-all cursor-pointer"
              title="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Slide indicators dot list */}
            <div className="flex space-x-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    activeIndex === idx ? 'bg-gold-500 w-6' : 'bg-gold-200/50 hover:bg-gold-300'
                  }`}
                  title={`Go to slide ${idx + 1}`}
                ></button>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 border border-gold-200/50 hover:border-gold-400 bg-white hover:bg-gold-50 text-gold-600 rounded-full shadow-sm transition-all cursor-pointer"
              title="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
