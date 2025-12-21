'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banks = [
  { name: 'National Bank of Egypt', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b9b52292-207e-4ad8-b62f-e104f3f495a0-instapay-eg/assets/images/111-1-150x150-18.jpg' },
  { name: 'QNB Alahli', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b9b52292-207e-4ad8-b62f-e104f3f495a0-instapay-eg/assets/images/qnb-alahli-logo-800x450-1-150x150-13.jpeg' },
  { name: 'Alex Bank', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b9b52292-207e-4ad8-b62f-e104f3f495a0-instapay-eg/assets/images/new-ending-frame-logos_02-1-150x150-14.jpg' },
  { name: 'Banque Misr', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b9b52292-207e-4ad8-b62f-e104f3f495a0-instapay-eg/assets/images/new-ending-frame-logos_05-150x150-12.jpg' },
  { name: 'SAIB Bank', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b9b52292-207e-4ad8-b62f-e104f3f495a0-instapay-eg/assets/images/saib-bank-1-150x150-16.png' },
  { name: 'ADIB', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b9b52292-207e-4ad8-b62f-e104f3f495a0-instapay-eg/assets/images/adib-6.jpg' },
  { name: 'City Bank', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b9b52292-207e-4ad8-b62f-e104f3f495a0-instapay-eg/assets/images/city-bank-7.jpg' },
  { name: 'AI Bank', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b9b52292-207e-4ad8-b62f-e104f3f495a0-instapay-eg/assets/images/ai-bank-8.jpg' },
  { name: 'Bank 9', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b9b52292-207e-4ad8-b62f-e104f3f495a0-instapay-eg/assets/images/new-ending-frame-logos_09-150x150-9.jpg' },
  { name: 'Bank 10', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b9b52292-207e-4ad8-b62f-e104f3f495a0-instapay-eg/assets/images/new-ending-frame-logos_08-150x150-10.jpg' },
  { name: 'Bank 11', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b9b52292-207e-4ad8-b62f-e104f3f495a0-instapay-eg/assets/images/new-ending-frame-logos_06-150x150-11.jpg' }
];

export function EnabledBanks() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(5);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(3);
      else setItemsPerView(5);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = banks.length - itemsPerView;

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
  }, [maxIndex, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev <= 0 ? maxIndex : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  }, [maxIndex, isTransitioning]);

  return (
    <section className="relative w-full bg-[#6B2D9C] pt-28 pb-24 overflow-hidden">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" className="relative block w-[calc(118%+1.3px)] h-[80px] md:h-[120px] left-1/2 -translate-x-1/2">
          <path d="M500,97L0,0V-1H1000V0L500,97Z" className="fill-[#FF6B35]"></path>
        </svg>
      </div>

      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-12 font-cairo tracking-tight">
          Enabled Banks
        </h2>

        <div className="relative group max-w-[1200px] mx-auto">
          <button onClick={prevSlide} className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-30 p-2 text-white/70 hover:text-white transition-colors cursor-pointer hidden md:block" aria-label="Previous slide">
            <ChevronLeft size={48} strokeWidth={1.5} />
          </button>

          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentSlide * (100 / itemsPerView)}%)` }}>
              {banks.map((bank, index) => (
                <div key={index} className="flex-shrink-0 px-3 md:px-4" style={{ width: `${100 / itemsPerView}%` }}>
                  <div className="bg-white rounded-xl aspect-square flex items-center justify-center p-6 shadow-lg transform transition-transform hover:scale-105 duration-300">
                    <div className="relative w-full h-full">
                       <Image src={bank.logo} alt={bank.name} fill className="object-contain" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

           <button onClick={nextSlide} className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-30 p-2 text-white/70 hover:text-white transition-colors cursor-pointer hidden md:block" aria-label="Next slide">
            <ChevronRight size={48} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex justify-center items-center gap-2 mt-12">
          {Array.from({ length: banks.length }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
