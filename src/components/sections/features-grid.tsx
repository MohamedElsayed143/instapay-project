export default function FeaturesGrid() {
  return <HowToSection />;
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Types ---

interface FeatureItem {
  id: number;
  title: string;
  subtitle: string;
}

// --- Data ---

const FEATURES: FeatureItem[] = [
  { id: 1, title: "Sending Money", subtitle: "to an IPA (Instant Payment Address)" },
  { id: 2, title: "Sending Money", subtitle: "to a Digital Wallet" },
  { id: 3, title: "Sending Money", subtitle: "to a Bank Account" },
  { id: 4, title: "Sending Money", subtitle: "Transfer to any bank card" },
  { id: 5, title: "Request Money", subtitle: "From other Instapay users" },
  { id: 6, title: "Check Balance", subtitle: "Check Balance" },
  { id: 7, title: "Check Mini Statement", subtitle: "Check Mini Statement" },
  { id: 8, title: "Add Multiple Bank accounts", subtitle: "Add Multiple Bank accounts" },
  { id: 9, title: "Sending Money", subtitle: "through Mobile Number Only" },
];

// --- Components ---

function HowToSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // Responsive breakpoints handler
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(FEATURES.length / itemsPerPage);

  const nextPage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // Determine which items to show
  // We want to slice the FEATURES array based on currentIndex and itemsPerPage
  // e.g. index 0, 3 items => 0, 1, 2
  // index 1, 3 items => 3, 4, 5
  // If we reach the end and there aren't enough items to fill a page, we just show what's left
  // OR standard carousel behavior where pages might have flexible items.
  // Given "navigation between card sets", strict pagination is best.
  
  const currentItems = FEATURES.slice(
    currentIndex * itemsPerPage,
    (currentIndex * itemsPerPage) + itemsPerPage
  );


  return (
    <section className="relative w-full bg-[#6B2D9C] font-cairo pb-20 text-white overflow-hidden">
      {/* Wave Divider */}
      <div className="absolute top-0 left-0 w-full h-[80px] sm:h-[120px] lg:h-[160px] z-10 pointer-events-none translate-y-[-1px]">
         <div className="w-full h-full relative">
            {/* 
              Recreating the specific V-shape/Diagonal divider from screenshots.
              The divider seems to be an orange shape overlaying the top, pointing down.
            */}
            <svg 
              viewBox="0 0 1440 320" 
              className="absolute top-0 left-0 w-full h-full"
              preserveAspectRatio="none"
              fill="#FF6B35"
            >
               <path d="M0,0 L1440,0 L720,320 L0,0 Z" />
            </svg>
           {/* We need another layer to ensure the transition from previous section (if any) looks smoother, 
             but based on prompt "Add orange diagonal wave dividers above section", a simple down-pointing triangle/wave works best.
             However, checking the screenshot 3, it's a massive orange chevron.
             The SVG above creates a V shape.
           */}
         </div>
      </div>

      <div className="container mx-auto px-4 pt-32 sm:pt-40 lg:pt-52">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-[36px] font-bold leading-tight mb-4 drop-shadow-sm">
            How To ?
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-[1200px] mx-auto group">
          
          {/* Controls - PC (Arrows) */}
          <button 
            onClick={prevPage}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-20 
                     bg-transparent hover:bg-white/10 text-white/50 hover:text-white 
                     p-2 rounded-full transition-all duration-300 hidden md:block"
            aria-label="Previous slide"
          >
            <ChevronLeft size={48} strokeWidth={1.5} />
          </button>
          
          <button 
            onClick={nextPage}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-20 
                     bg-transparent hover:bg-white/10 text-white/50 hover:text-white 
                     p-2 rounded-full transition-all duration-300 hidden md:block"
            aria-label="Next slide"
          >
            <ChevronRight size={48} strokeWidth={1.5} />
          </button>

          {/* Cards Grid/Flex */}
          <div className="flex justify-center items-stretch gap-6 md:gap-8 min-h-[400px]">
            {currentItems.map((item) => (
              <FeatureCard key={item.id} item={item} />
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center gap-3 mt-12">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === idx 
                    ? 'bg-white scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide set ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ item }: { item: FeatureItem }) {
  return (
    <div className="flex flex-col w-full max-w-[340px] md:max-w-[300px] lg:max-w-[320px] rounded-xl overflow-hidden bg-[#6B2D9C]/40 backdrop-blur-sm group hover:-translate-y-2 transition-transform duration-300 ease-out shadow-lg shadow-black/10">
      {/* Video Thumbnail Placeholder */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-[#5a2588] to-[#461b6b] flex items-center justify-center overflow-hidden">
        {/* Placeholder gradient overlay to simulate video thumbnail feel */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        
        {/* Simulated Play Button UI from screenshot */}
        <div className="z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 cursor-pointer group-hover:scale-110 transition-transform">
          <Play size={20} className="ml-1 fill-white text-white" />
        </div>
        
        {/* Bottom controls overlay simulation */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/40 flex items-center px-3 gap-2">
            <div className="text-[10px] text-white/90">0:00</div>
            <div className="h-1 flex-1 bg-white/20 rounded-full mx-2 overflow-hidden">
              <div className="h-full w-0 bg-[#FF6B35]" />
            </div>
            <div className="w-3 h-3 border border-white/80 rounded-[1px]" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col items-center text-center p-6 flex-1 bg-[#6B2D9C] bg-opacity-40">
        <h3 className="text-white text-[18px] font-semibold mb-2">
          {item.title}
        </h3>
        <p className="text-white/80 text-[14px] leading-snug mb-6 min-h-[2.5em] line-clamp-2">
          {item.subtitle}
        </p>
        
        <div className="mt-auto">
          <button className="bg-[#FF6B35] hover:bg-[#FF8C42] text-white text-[14px] font-semibold px-8 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}