import { Category, Service, SiteReview } from './types';

export const APP_NAME = "TeachReach";

// Used as a SEED only if database is empty.
export const MOCK_SERVICES: Service[] = [
  {
    id: 's1',
    title: "Professional Logo Design & Branding Kit",
    description: "I will design a modern, minimalist logo and complete branding kit for your startup.",
    fullDescription: "Get a complete brand identity overhaul directly from me. This package includes a main logo, secondary logo, color palette, typography selection, and brand guidelines. I specialize in minimalist and modern designs that stand the test of time.",
    price: 150,
    rating: 4.9,
    reviewCount: 128,
    image: "https://picsum.photos/seed/design1/800/600",
    category: Category.DESIGN,
    deliveryTime: "3 Days",
    features: ["Main Logo", "Vector Files", "Brand Guidelines", "Social Media Kit"],
    reviews: [
      { id: 'r1', user: "Alice M.", rating: 5, comment: "Absolutely stunning work! Aqib really understood the vision.", date: "2023-10-15" },
      { id: 'r2', user: "John D.", rating: 4, comment: "Great designs, slightly delayed delivery but worth it.", date: "2023-10-12" }
    ]
  },
  {
    id: 's2',
    title: "Full Stack React & Node.js Application",
    description: "I will build a scalable, high-performance web application using React, TypeScript, and Node.js.",
    fullDescription: "Need a custom SaaS platform or an internal tool? I provide end-to-end development services. From database design with PostgreSQL to a responsive React frontend with Tailwind CSS. Includes deployment setup.",
    price: 1200,
    rating: 5.0,
    reviewCount: 45,
    image: "https://picsum.photos/seed/code2/800/600",
    category: Category.DEV,
    deliveryTime: "14 Days",
    features: ["Responsive Design", "API Integration", "Database Setup", "Source Code"],
    reviews: [
      { id: 'r3', user: "TechCorp Inc.", rating: 5, comment: "Best developer we have worked with.", date: "2023-09-20" }
    ]
  },
  {
    id: 's3',
    title: "SEO Optimized Blog Content Writing",
    description: "I will write engaging, SEO-optimized blog posts to drive traffic to your website.",
    fullDescription: "High-quality content is king. I will research your niche and write compelling articles that rank on Google. Includes keyword research, meta descriptions, and royalty-free images.",
    price: 80,
    rating: 4.8,
    reviewCount: 310,
    image: "https://picsum.photos/seed/write3/800/600",
    category: Category.WRITING,
    deliveryTime: "2 Days",
    features: ["1500 Words", "Keyword Research", "SEO Optimization", "Plagiarism Free"],
    reviews: []
  },
  {
    id: 's4',
    title: "Social Media Marketing Strategy",
    description: "I will create a comprehensive social media strategy to grow your audience.",
    fullDescription: "Stop guessing and start growing. I will audit your current accounts, identify your target audience, and create a 30-day content calendar tailored to your brand voice.",
    price: 200,
    rating: 4.7,
    reviewCount: 89,
    image: "https://picsum.photos/seed/mark4/800/600",
    category: Category.MARKETING,
    deliveryTime: "5 Days",
    features: ["Account Audit", "Content Calendar", "Hashtag Strategy", "Competitor Analysis"],
    reviews: []
  },
  {
    id: 's5',
    title: "Explainer Video Animation",
    description: "I will create a 2D animated explainer video to showcase your product.",
    fullDescription: "Engage your customers with a fun and informative animated video. I handle everything from scriptwriting (optional) to voiceover and animation.",
    price: 350,
    rating: 4.9,
    reviewCount: 56,
    image: "https://picsum.photos/seed/video5/800/600",
    category: Category.VIDEO,
    deliveryTime: "7 Days",
    features: ["60 Seconds", "Voice Over", "Background Music", "Full HD 1080p"],
    reviews: []
  },
  {
    id: 's6',
    title: "Mobile App UI/UX Design",
    description: "I will design a user-friendly and beautiful mobile app interface for iOS and Android.",
    fullDescription: "I focus on usability and aesthetics. You will receive Figma files ready for development, including all assets and a clickable prototype to test user flows.",
    price: 400,
    rating: 5.0,
    reviewCount: 22,
    image: "https://picsum.photos/seed/ui6/800/600",
    category: Category.DESIGN,
    deliveryTime: "10 Days",
    features: ["10 Screens", "Source File", "Prototype", "Interactive Mockups"],
    reviews: []
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "CEO, TechStart",
    text: "TeachReach transformed how we build. Aqib's expertise is unmatched. We built our MVP in record time.",
    avatar: "https://picsum.photos/seed/p1/100/100"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Marketing Director",
    text: "I found amazing design services here. The workflow is so smooth and Aqib is very responsive.",
    avatar: "https://picsum.photos/seed/p2/100/100"
  },
  {
    id: 3,
    name: "Jessica Ford",
    role: "Content Manager",
    text: "Professional, timely, and high quality. Exactly what I needed for my business growth.",
    avatar: "https://picsum.photos/seed/p3/100/100"
  }
];

// Start with Empty Reviews
export const MOCK_SITE_REVIEWS: SiteReview[] = [];