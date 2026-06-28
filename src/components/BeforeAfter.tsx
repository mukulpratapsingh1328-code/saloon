import { useState, useRef, useEffect } from 'react';
import { useSalonStore } from '../lib/store';
import { Sparkles, Eye, Scissors, Sparkle } from 'lucide-react';

export default function BeforeAfter() {
  const { beforeAfter } = useSalonStore();
  const [activeId, setActiveId] = useState('');
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (beforeAfter?.items?.length > 0 && !activeId) {
      setActiveId(beforeAfter.items[0].id);
    }
  }, [beforeAfter, activeId]);

  if (!beforeAfter || !beforeAfter.items || beforeAfter.items.length === 0) {
    return null;
  }

  const currentActiveId = activeId || beforeAfter.items[0].id;
  const activeItem = beforeAfter.items.find(item => item.id === currentActiveId) || beforeAfter.items[0];

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <section id="before-after-section" className="py-24 bg-luxury-cream border-t border-b border-gold-100/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.35em] uppercase font-mono text-gold-500 font-semibold flex justify-center items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Visual Splendor
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-luxury-dark mt-3 mb-6 tracking-tight">
            Aesthetic Transformations
          </h2>
          <div className="h-0.5 w-16 bg-gold-400 mx-auto mb-6"></div>
          <p className="text-sm text-gray-500 font-sans font-light leading-relaxed">
            {beforeAfter.subtitle} Hover and slide the gold bar on the image to view the stunning before and after states.
          </p>
        </div>

        {/* Gallery Selector Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          {beforeAfter.items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveId(item.id);
                setSliderPosition(50); // reset position
              }}
              className={`px-6 py-3 border rounded-full text-xs tracking-widest uppercase font-medium transition-all cursor-pointer ${
                activeId === item.id
                  ? 'border-gold-500 bg-white text-gold-600 shadow-md font-semibold'
                  : 'border-gray-200 bg-transparent text-gray-500 hover:border-gold-200 hover:text-luxury-dark hover:bg-white/40'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Comparison Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Details Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest text-gold-600 uppercase bg-gold-100/55 px-3 py-1 rounded-md inline-block">
                Artisan: {activeItem.stylist}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-luxury-dark tracking-tight leading-snug">
                {activeItem.title}
              </h3>
            </div>
            
            <p className="text-sm text-gray-600 font-sans font-light leading-relaxed">
              {activeItem.description}
            </p>

            <div className="p-5 border-l-2 border-gold-400 bg-white/60 rounded-r-xl space-y-3">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-400 block">Features of therapy:</span>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-center space-x-2">
                  <Sparkle className="w-3 h-3 text-gold-400 fill-current" />
                  <span>Personalized profile analysis beforehand</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Sparkle className="w-3 h-3 text-gold-400 fill-current" />
                  <span>Premium plant-derived botanical products</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Sparkle className="w-3 h-3 text-gold-400 fill-current" />
                  <span>Long-lasting visual luster and volume</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Interactive Slider Box */}
          <div className="lg:col-span-8 flex justify-center">
            <div 
              ref={containerRef}
              className="relative w-full max-w-[640px] aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden border border-gold-200/50 shadow-2xl select-none cursor-ew-resize bg-gray-200"
              onMouseDown={(e) => {
                isDragging.current = true;
                handleMove(e.clientX);
              }}
              onTouchStart={(e) => {
                isDragging.current = true;
                handleMove(e.touches[0].clientX);
              }}
            >
              {/* After Image (Background) */}
              <img
                src={activeItem.afterUrl}
                alt="After transformation"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-4 right-4 bg-luxury-dark/70 text-white text-[10px] tracking-widest uppercase font-mono px-3 py-1 rounded backdrop-blur-sm pointer-events-none">
                After
              </span>

              {/* Before Image (Overlayed and clipped) */}
              <div 
                className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
                style={{ width: `${sliderPosition}%` }}
              >
                {/* We maintain full width of the image inside the clipped div */}
                <div className="absolute inset-y-0 left-0 w-[640px] h-full" style={{ width: containerRef.current?.getBoundingClientRect().width }}>
                  <img
                    src={activeItem.beforeUrl}
                    alt="Before transformation"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ width: '100%', height: '100%' }}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <span className="absolute bottom-4 left-4 bg-white/80 text-luxury-dark text-[10px] tracking-widest uppercase font-mono px-3 py-1 rounded backdrop-blur-sm pointer-events-none">
                Before
              </span>

              {/* Draggable Divider Handle */}
              <div 
                className="absolute inset-y-0 w-1 bg-gradient-to-b from-gold-300 via-gold-400 to-gold-300 pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                {/* Horizontal Drag Button Handle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white hover:bg-gold-50 text-gold-600 rounded-full shadow-lg border border-gold-300 flex items-center justify-center transition-transform hover:scale-110 pointer-events-auto cursor-ew-resize">
                  <div className="flex space-x-0.5">
                    <span className="text-sm font-semibold">&larr;</span>
                    <span className="text-sm font-semibold">&rarr;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
