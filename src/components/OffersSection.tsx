import { useSalonStore } from '../lib/store';
import { Tag, Sparkle, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface OffersSectionProps {
  onBookOffer: () => void;
}

export default function OffersSection({ onBookOffer }: OffersSectionProps) {
  const { promotions } = useSalonStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section id="offers-section" className="py-24 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.35em] uppercase font-mono text-gold-500 font-semibold flex justify-center items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            Seasonal Indulgences
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-luxury-dark mt-3 mb-6 tracking-tight">
            Current Offers & Promotions
          </h2>
          <div className="h-0.5 w-16 bg-gold-400 mx-auto mb-6"></div>
          <p className="text-sm text-gray-500 font-sans font-light leading-relaxed">
            Avail yourself of our certified privilege programs. Copy the code and apply it directly 
            during the final step of our Online Booking Wizard.
          </p>
        </div>

        {/* Offers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="bg-luxury-cream border-2 border-gold-100/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm transition-transform hover:scale-[1.01] hover:shadow-md relative overflow-hidden"
            >
              {/* Corner decorative light element */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-400/5 rounded-full blur-xl"></div>

              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-start gap-4">
                  <span className="text-xs font-mono font-semibold text-gold-600 bg-gold-100/60 px-3 py-1 rounded-full">
                    {promo.discount}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    Expires: {promo.expiry}
                  </span>
                </div>

                <h3 className="font-serif text-xl text-luxury-dark font-medium leading-snug">
                  {promo.title}
                </h3>
                
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  {promo.description}
                </p>
              </div>

              {/* Coupon Action code box */}
              <div className="flex items-center gap-3 pt-4 border-t border-gold-100/30">
                <div className="flex-1 bg-white border border-gold-200/40 rounded-xl px-4 py-3 flex justify-between items-center font-mono text-xs text-luxury-dark">
                  <span>Code: <strong className="text-gold-700 tracking-wider text-sm font-semibold">{promo.code}</strong></span>
                  <button
                    onClick={() => handleCopyCode(promo.code)}
                    className="p-1.5 rounded-lg hover:bg-gold-50 text-gold-600 transition-colors"
                    title="Copy promo code"
                  >
                    {copiedCode === promo.code ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <button
                  onClick={onBookOffer}
                  className="px-5 py-3 bg-luxury-dark text-white text-[10px] tracking-widest uppercase font-semibold rounded-xl hover:bg-gold-500 hover:text-luxury-dark transition-all cursor-pointer"
                >
                  Book Now
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
