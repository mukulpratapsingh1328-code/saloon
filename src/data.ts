import { Service, ServiceCategory, Stylist, Testimonial, Promotion, InstagramPost } from './types';

export const SERVICES: Service[] = [
  // Hair Services
  {
    id: 'hair-1',
    name: 'Couture Haircut & Style',
    category: ServiceCategory.HAIR,
    duration: 60,
    price: 120,
    description: 'A personalized consultation, luxurious wash, precision cut, and signature blowout tailored to your face shape and hair texture.',
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'hair-2',
    name: 'Balayage & Hand-Painted Highlights',
    category: ServiceCategory.HAIR,
    duration: 150,
    price: 250,
    description: 'A customized, natural-looking hair color technique designed to create soft, sun-kissed dimension with seamless regrowth.',
    imageUrl: 'https://images.unsplash.com/photo-1560869713-7d0a29430f13?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'hair-3',
    name: 'Signature Blowout & Style',
    category: ServiceCategory.HAIR,
    duration: 45,
    price: 65,
    description: 'Relaxing botanical wash, scalp massage, and professional blowout of your choice, from high-volume waves to sleek and straight.',
    imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hair-4',
    name: 'Keratin Revitalizing Treatment',
    category: ServiceCategory.HAIR,
    duration: 120,
    price: 180,
    description: 'An advanced smoothing treatment that eliminates frizz, adds brilliant shine, and cuts styling time in half for up to 12 weeks.',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
  },

  // Skin & Facial
  {
    id: 'skin-1',
    name: 'Luxury Cellular Hydra-Facial',
    category: ServiceCategory.SKIN,
    duration: 75,
    price: 160,
    description: 'An advanced multi-step facial that deeply cleanses, exfoliates, and extracts impurities while infusing intense hydration and nourishing serums.',
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'skin-2',
    name: 'Gold Glow Radiance Facial',
    category: ServiceCategory.SKIN,
    duration: 60,
    price: 195,
    description: 'An ultra-luxurious facial infusing 24k gold leaf peptides to stimulate cell turnover, reduce inflammation, and leave skin incredibly radiant.',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'skin-3',
    name: 'Organic Botanical Brightening',
    category: ServiceCategory.SKIN,
    duration: 50,
    price: 130,
    description: 'A holistic skin treatment using fresh, certified organic seed extracts and cold-pressed floral oils to balance, nourish, and detoxify.',
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80'
  },

  // Body & Massage
  {
    id: 'body-1',
    name: 'Imperial Hot Stone Deep Tissue Massage',
    category: ServiceCategory.BODY,
    duration: 90,
    price: 180,
    description: 'Warm, mineral-rich basalt stones combined with deep muscle therapy to relieve tension, ease tight joints, and induce deep relaxation.',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'body-2',
    name: 'Aromatherapy Serenity Massage',
    category: ServiceCategory.BODY,
    duration: 75,
    price: 145,
    description: 'A light-to-medium pressure Swedish style massage utilizing premium custom-blended lavender, frankincense, and chamomile essential oils.',
    imageUrl: 'https://images.unsplash.com/photo-1600334189648-b0d9d3028eb2?auto=format&fit=crop&w=600&q=80'
  },

  // Grooming & Barber
  {
    id: 'groom-1',
    name: 'Royale Shave & Sculpt',
    category: ServiceCategory.GROOMING,
    duration: 45,
    price: 75,
    description: 'An ultimate traditional grooming experience: hot towel prep, pre-shave essential oils, straight-razor shave, and post-shave botanical mask.',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'groom-2',
    name: 'Elite Executive Haircut & Grooming',
    category: ServiceCategory.GROOMING,
    duration: 60,
    price: 95,
    description: 'Precision clipper and scissor cut, refreshing hair wash, conditioning scalp treatment, professional style, and subtle neck massage.',
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80',
    popular: true
  },

  // Spa Packages
  {
    id: 'spa-1',
    name: 'The Ultimate Empress Retreat',
    category: ServiceCategory.SPA,
    duration: 210,
    price: 420,
    description: 'Our most comprehensive restorative package: signature Couture Haircut & Blowout, Luxury Hydra-Facial, and 75-minute Aromatherapy Massage.',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'spa-2',
    name: 'Serene Sanctuary Half-Day Escapade',
    category: ServiceCategory.SPA,
    duration: 150,
    price: 310,
    description: 'The ultimate escape: 60-minute Radiance Gold Facial, followed by 90-minute Imperial Hot Stone Deep Tissue Massage and organic champagne pairing.',
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80'
  }
];

export const STYLISTS: Stylist[] = [
  {
    id: 'stylist-1',
    name: 'Sophia Chen',
    role: 'Creative Director & Master Hair Artist',
    rating: 4.95,
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=500&q=80',
    bio: 'With over 12 years of experience in London and New York salons, Sophia specializes in high-fashion couture cuts, bespoke balayage, and revolutionary color corrections.',
    specialties: ['Balayage & Color', 'Couture Cuts', 'Tape-In Extensions']
  },
  {
    id: 'stylist-2',
    name: 'Elena Rostova',
    role: 'Lead Medical Esthetician',
    rating: 4.98,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=500&q=80',
    bio: 'Elena holds advanced degrees in clinical cosmetology. She focuses on custom dermal analysis, luxury cellular regeneration facials, and anti-aging treatments.',
    specialties: ['Hydra-Facials', 'Cellular Anti-Aging', 'Peel Exfoliations']
  },
  {
    id: 'stylist-3',
    name: 'Marcus Vance',
    role: 'Grooming Director & Master Barber',
    rating: 4.92,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=500&q=80',
    bio: 'Marcus has sculpted for film and runways. He brings unmatched precision to traditional straight-razor shaves, modern beard sculpting, and executive haircuts.',
    specialties: ['Straight-Razor Shaves', 'Precision Fades', 'Beard Artistry']
  },
  {
    id: 'stylist-4',
    name: 'Julianne Roux',
    role: 'Senior Holistic Therapist',
    rating: 4.97,
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&h=500&q=80',
    bio: 'Julianne trained in traditional bodywork in Bali and Thailand. She curates restorative experiences blending hot stone therapy, acupressure, and custom oil mixtures.',
    specialties: ['Hot Stone Deep Tissue', 'Aromatherapy', 'Swedish Restorative']
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Genevieve Montgomery',
    role: 'Loyal Client Since 2023',
    rating: 5,
    comment: 'The Empress Retreat was hands down the best self-care investment I have ever made. Sophia\'s color hand-painting is divine, and Julianne has literal magic in her hands. The champagne and soft ambient music made me feel like royalty.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 't-2',
    name: 'Maximilian Sterling',
    role: 'Vanguard Member',
    rating: 5,
    comment: 'I visit Marcus every two weeks for the Royale Shave and Grooming. The execution is flawless, and the attention to detail is exceptional. The hot towels are infused with real essential oils. True luxury.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 't-3',
    name: 'Clarissa Vanderbilt',
    role: 'Art Director',
    rating: 5,
    comment: 'My skin has never looked this radiant. Elena\'s Gold Glow Radiance Facial took years off my complexion. She explained my skin profile with incredible scientific precision. I highly recommend this gorgeous space!',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80'
  }
];

export const PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    title: 'First-Time Indulgence',
    description: 'Receive 15% off any individual Hair, Skin, or Body treatment on your first booking with us.',
    code: 'FIRST15',
    discount: '15% Off',
    expiry: 'Dec 31, 2026'
  },
  {
    id: 'promo-2',
    title: 'Midweek Midday Escapes',
    description: 'Book any luxury spa package on Tuesday, Wednesday, or Thursday between 10 AM and 2 PM to receive a complimentary luxury botanical gift set.',
    code: 'MIDWEEK',
    discount: 'Complimentary Gift Set',
    expiry: 'Nov 30, 2026'
  }
];

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'ig-1',
    imageUrl: 'https://images.unsplash.com/photo-1605497746445-97d1b0a9eeae?auto=format&fit=crop&w=400&h=400&q=80',
    likes: 412,
    comments: 24,
    caption: 'Serenity bottled. Our organic serums are cold-pressed and botanical-infused to deliver immediate radiance. ✨ #LuxSalonSpa #OrganicSkincare'
  },
  {
    id: 'ig-2',
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&h=400&q=80',
    likes: 589,
    comments: 31,
    caption: 'Quiet your mind, restore your skin. Elevate your weekly routine with a curated Cellular Hydra-Facial. 💆‍♀️ #SkinHealth #LuxuryFacial'
  },
  {
    id: 'ig-3',
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=400&h=400&q=80',
    likes: 312,
    comments: 18,
    caption: 'Details matter. From your selection of bespoke essential oils to our champagne pairing, we tailor every moment. #AestheticSpaces'
  },
  {
    id: 'ig-4',
    imageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=400&h=400&q=80',
    likes: 476,
    comments: 12,
    caption: 'A sensory sanctuary. Melt away deep muscle tension with our Signature Hot Stone Deep Tissue massage therapy. #WellnessLiving'
  },
  {
    id: 'ig-5',
    imageUrl: 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?auto=format&fit=crop&w=400&h=400&q=80',
    likes: 681,
    comments: 42,
    caption: 'Crafted with precision. Meet Sophia Chen, our Creative Director, behind today’s stunning custom balayage transformation. #HairArtistry'
  },
  {
    id: 'ig-6',
    imageUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=400&h=400&q=80',
    likes: 523,
    comments: 29,
    caption: 'Elevated aesthetics for everyday luxury. Book your weekend glow-up session via link in bio. 🕊️ #WeekendVibe #LuxurySpa'
  }
];

export const TIME_SLOTS = [
  { id: 't1', time: '09:00 AM', period: 'morning' },
  { id: 't2', time: '10:00 AM', period: 'morning' },
  { id: 't3', time: '11:00 AM', period: 'morning' },
  { id: 't4', time: '12:00 PM', period: 'afternoon' },
  { id: 't5', time: '01:00 PM', period: 'afternoon' },
  { id: 't6', time: '02:00 PM', period: 'afternoon' },
  { id: 't7', time: '03:00 PM', period: 'afternoon' },
  { id: 't8', time: '04:00 PM', period: 'afternoon' },
  { id: 't9', time: '05:00 PM', period: 'evening' },
  { id: 't10', time: '06:00 PM', period: 'evening' },
  { id: 't11', time: '07:00 PM', period: 'evening' }
];

export const OPENING_HOURS = [
  { day: 'Monday - Friday', hours: '9:00 AM - 8:00 PM' },
  { day: 'Saturday', hours: '9:00 AM - 6:00 PM' },
  { day: 'Sunday', hours: '10:00 AM - 5:00 PM' }
];

export const BEFORE_AFTER_GALLERY = {
  title: "Aesthetic Transformations",
  subtitle: "Real results from our precision hair color, styling, and organic cellular skin rejuvenation therapies.",
  items: [
    {
      id: "ba-1",
      title: "Bespoke Balayage Transformation",
      stylist: "Sophia Chen",
      beforeUrl: "https://images.unsplash.com/photo-1508243694910-6bc04534ef0a?auto=format&fit=crop&w=600&h=600&q=80",
      afterUrl: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=600&h=600&q=80",
      description: "Custom warm brassy correction to multi-dimensional ash blonde balayage with organic gloss treatment."
    },
    {
      id: "ba-2",
      title: "Gold Radiance Rejuvenation Therapy",
      stylist: "Elena Rostova",
      beforeUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&h=600&q=80",
      afterUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&h=600&q=80",
      description: "Dermal cell revitalization facial, deeply nourishing and correcting texture irregularities for an instant organic glow."
    }
  ]
};
