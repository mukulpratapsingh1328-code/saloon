import { INSTAGRAM_POSTS } from '../data';
import { Instagram, Heart, MessageCircle } from 'lucide-react';

export default function InstagramFeed() {
  return (
    <section id="instagram-feed-section" className="py-24 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.35em] uppercase font-mono text-gold-500 font-semibold flex justify-center items-center gap-1.5">
            <Instagram className="w-3.5 h-3.5" />
            Social Curations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-luxury-dark mt-3 mb-6 tracking-tight">
            Follow Our Sanctuary
          </h2>
          <div className="h-0.5 w-16 bg-gold-400 mx-auto mb-6"></div>
          <p className="text-sm text-gray-500 font-sans font-light leading-relaxed">
            Peek behind the scenes of our wellness suites, seasonal botanicals, and real hand-painted balayage transformations. 
            Connect with us on social and tag <span className="font-semibold text-gold-600">#LuxSalonSpa</span>.
          </p>
        </div>

        {/* Instagrid layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <div
              key={post.id}
              className="relative aspect-square rounded-xl overflow-hidden group border border-gold-100/20 bg-gray-100 select-none cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-luxury-dark/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
                <div className="flex justify-end">
                  <Instagram className="w-4 h-4 text-gold-300" />
                </div>

                <p className="text-[10px] leading-relaxed line-clamp-4 font-light text-gray-200">
                  {post.caption}
                </p>

                <div className="flex space-x-4 border-t border-white/20 pt-2 text-[11px] font-mono font-medium">
                  <span className="flex items-center space-x-1 text-gold-300">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{post.likes}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{post.comments}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Follow Button */}
        <div className="text-center mt-12">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2.5 px-6 py-3 border border-gold-300 hover:border-luxury-dark bg-transparent hover:bg-luxury-dark hover:text-white text-gold-700 text-xs tracking-widest uppercase font-semibold rounded-full transition-all duration-300 cursor-pointer"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow @LuxurySalonSpa</span>
          </a>
        </div>

      </div>
    </section>
  );
}
