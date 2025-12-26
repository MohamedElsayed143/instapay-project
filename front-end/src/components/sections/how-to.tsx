'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export function HowTo() {
  const { t, isRtl } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);

  const carouselItems = useMemo(() => [
    { id: 1, category: t('howTo.category.send'), title: t('howTo.item1'), video: "https://www.instapay.eg/wp-content/uploads/2022/03/videoplayback-8.mp4" },
    { id: 2, category: t('howTo.category.send'), title: t('howTo.item2'), video: "https://www.instapay.eg/wp-content/uploads/2022/03/videoplayback-7.mp4" },
    { id: 3, category: t('howTo.category.send'), title: t('howTo.item3'), video: "https://www.instapay.eg/wp-content/uploads/2022/03/videoplayback-6.mp4" },
    { id: 4, category: t('howTo.category.send'), title: t('howTo.item4'), video: "https://www.instapay.eg/wp-content/uploads/2022/03/videoplayback-5.mp4" },
    { id: 5, category: t('howTo.category.request'), title: t('howTo.item5'), video: "https://www.instapay.eg/wp-content/uploads/2022/03/videoplayback.mp4" },
    { id: 6, category: t('howTo.category.balance'), title: t('howTo.item6'), video: "https://www.instapay.eg/wp-content/uploads/2022/03/videoplayback-10.mp4" },
    { id: 7, category: t('howTo.category.statement'), title: t('howTo.item7'), video: "https://www.instapay.eg/wp-content/uploads/2022/03/videoplayback-4.mp4" },
    { id: 8, category: t('howTo.category.addBank'), title: t('howTo.item8'), video: "https://www.instapay.eg/wp-content/uploads/2022/03/videoplayback-3.mp4" },
    { id: 9, category: t('howTo.category.send'), title: t('howTo.item9'), video: "https://www.instapay.eg/wp-content/uploads/2022/03/videoplayback-2.mp4" },
  ], [t]);

  const totalSlides = carouselItems.length;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSlidesToShow(1);
      else if (window.innerWidth < 1024) setSlidesToShow(2);
      else setSlidesToShow(3);
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => prev >= totalSlides - slidesToShow ? 0 : prev + 1);
  const prevSlide = () => setCurrentSlide((prev) => prev === 0 ? totalSlides - slidesToShow : prev - 1);
  const goToSlide = (index: number) => setCurrentSlide(Math.min(index, totalSlides - slidesToShow));

  const translateValue = -(currentSlide * (100 / slidesToShow));

  return (
    <section id="t" className="relative bg-[#6B2D9C] pt-24 pb-32 md:pt-40 md:pb-48 font-cairo">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
        <svg className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[100px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 L1200,0 L600,120 L0,0 Z" fill="#FF6B35" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-16 tracking-tight">
          {t('howTo.title')}
        </h2>

        <div className="relative group max-w-7xl mx-auto">
          <div className="overflow-hidden">
             <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(${isRtl ? -translateValue : translateValue}%)` }}
             >
               {carouselItems.map((item) => (
                 <div key={item.id} className="flex-shrink-0 px-4" style={{ width: `${100 / slidesToShow}%` }}>
                   <Card item={item} />
                 </div>
               ))}
             </div>
          </div>

          <button onClick={isRtl ? nextSlide : prevSlide} className={`absolute ${isRtl ? 'right-0 translate-x-4 md:translate-x-12' : 'left-0 -translate-x-4 md:-translate-x-12'} top-[35%] -translate-y-1/2 text-white/50 hover:text-white transition-colors focus:outline-none`} aria-label="Previous slide">
            {isRtl ? <ChevronRight size={48} strokeWidth={1.5} /> : <ChevronLeft size={48} strokeWidth={1.5} />}
          </button>
          
          <button onClick={isRtl ? prevSlide : nextSlide} className={`absolute ${isRtl ? 'left-0 -translate-x-4 md:-translate-x-12' : 'right-0 translate-x-4 md:translate-x-12'} top-[35%] -translate-y-1/2 text-white/50 hover:text-white transition-colors focus:outline-none`} aria-label="Next slide">
            {isRtl ? <ChevronLeft size={48} strokeWidth={1.5} /> : <ChevronRight size={48} strokeWidth={1.5} />}
          </button>

          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalSlides - slidesToShow + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentSlide === idx ? 'bg-white' : 'bg-white/30 hover:bg-white/50'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none translate-y-[99%]">
        <svg className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[100px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 L1200,0 L600,120 L0,0 Z" fill="#FF6B35" />
        </svg>
      </div>
    </section>
  );
}

function Card({ item }: { item: any }) {
  const { t, isRtl } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`flex flex-col items-center group/card ${isRtl ? 'text-right' : 'text-center'}`}>
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg mb-6 bg-black/20">
        <video
          ref={videoRef}
          src={item.video}
          className="w-full h-full object-cover"
          playsInline
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
        
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer transition-opacity group-hover/card:bg-black/40" onClick={togglePlay}>
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 transition-transform transform group-hover/card:scale-110">
              <Play className="w-5 h-5 md:w-8 md:h-8 text-white fill-white ml-1" />
            </div>
          </div>
        )}
      </div>

      <div className={`text-center px-4 md:px-6 ${isRtl ? 'text-right' : 'text-center'}`}>
        <h3 className="text-white font-semibold text-lg md:text-xl mb-1 leading-snug">{item.category}</h3>
        <p className="text-white/90 text-sm md:text-base font-normal mb-5 leading-relaxed min-h-[3rem]">{item.title}</p>
        <button className="bg-[#FF6B35] hover:bg-[#ff8c42] text-white text-sm font-semibold py-2.5 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
          {t('whatIs.learnMore')}
        </button>
      </div>
    </div>
  );
}
