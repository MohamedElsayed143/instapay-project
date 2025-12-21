"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ASSETS = {
  googlePlay:
    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b9b52292-207e-4ad8-b62f-e104f3f495a0-instapay-eg/assets/images/google-play-badge-e1639002919423-2.png",
  appStore:
    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b9b52292-207e-4ad8-b62f-e104f3f495a0-instapay-eg/assets/images/Download_on_the_App_Store_Badge_US-UK_RGB_blk_0929-3.png",
};

const SLIDES = [
  {
    id: 1,
    title: "Send money to anyone, anywhere, at any time!",
    description:
      "You can send money from your bank account or Meeza Prepaid card instantly 24/7 to any Bank Accounts, Digital Wallets and any Card.",
    // تأكد أن مسار الصورة صحيح ويعمل
    image: "/sliderimg/img1.png",
  },
  {
    id: 2,
    title: "Self-onboarding.",
    description: "No need to sign any papers, just onboard yourself digitally.",
    image: "/sliderimg/img2.png",
  },
  {
    id: 3,
    title: "More than just payments.",
    description: "Experience a seamless way to manage your finances on the go.",
    image: "/sliderimg/img3.png",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayDuration = 5000;

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(handleNext, autoplayDuration);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  return (
    <section
      className="relative w-full h-[600px] md:h-[700px] bg-[#1A1A1A] overflow-hidden group select-none font-cairo"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      id="v"
    >
      {/* 1. BACKGROUND LAYER - DYNAMIC IMAGES */}
      <div className="absolute inset-0 w-full h-full z-0">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover object-center"
              priority={index === 0} // Load first image immediately
            />
            {/* Dark Overlay for readability */}
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          </div>
        ))}
      </div>

      {/* 2. CONTENT LAYER */}
      <div className="relative z-10 w-full h-full container mx-auto px-4 md:px-12 flex flex-col justify-center">
        <div className="relative w-full md:w-2/3 lg:w-[55%] h-full flex items-center">
          <div className="w-full">
            {SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute top-1/2 -translate-y-1/2 w-full transition-all duration-700 ease-in-out ${
                  index === currentSlide
                    ? "opacity-100 translate-x-0 visible"
                    : "opacity-0 -translate-x-8 invisible"
                }`}
              >
                <div
                  className={`space-y-6 transform transition-all duration-700 delay-300 ${
                    index === currentSlide
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  <h1 className="text-3xl md:text-[40px] lg:text-[54px] font-bold text-white leading-[1.2] tracking-tight drop-shadow-md">
                    {slide.title}
                  </h1>

                  <p className="text-[#F5F5F5] text-sm md:text-lg leading-[1.6] max-w-xl drop-shadow-sm">
                    {slide.description}
                  </p>

                  {/* NOTE: Removed the foreground Image block here as per request */}

                  <div className="flex flex-wrap items-center gap-3 pt-4">
                    <a
                      href="https://play.google.com/store/apps/details?id=com.egyptianbanks.instapay"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-90 transition-opacity hover:scale-105 duration-200"
                    >
                      <Image
                        src={ASSETS.googlePlay}
                        alt="Get it on Google Play"
                        width={140}
                        height={42}
                        className="h-[40px] w-auto md:h-[48px]"
                      />
                    </a>
                    <a
                      href="https://apps.apple.com/eg/app/instapay-egypt/id1592108795"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-90 transition-opacity hover:scale-105 duration-200"
                    >
                      <Image
                        src={ASSETS.appStore}
                        alt="Download on the App Store"
                        width={125}
                        height={42}
                        className="h-[40px] w-auto md:h-[48px]"
                      />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM CURVE SVG */}
      <div
        className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20 pointer-events-none"
        style={{ transform: "translateY(1px)" }}
      >
        <div className="relative w-full h-[60px] md:h-[100px]">
          <svg
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
            className="w-full h-full fill-[#FF6B35]"
            width="100%"
            height="100px"
          >
            <path d="M500.2,94.7L0,0v100h1000V0L500.2,94.7z" opacity="1"></path>
          </svg>
        </div>
      </div>

      {/* 4. NAVIGATION CONTROLS */}
      <div className="absolute bottom-[80px] md:bottom-[120px] w-full z-30">
        <div className="container mx-auto px-4 relative h-10 flex items-center justify-center md:items-end">
          {/* Dots */}
          <div className="flex items-center gap-3">
            {SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full shadow-md ${
                  idx === currentSlide
                    ? "w-4 h-4 bg-[#FF6B35] scale-110"
                    : "w-2.5 h-2.5 bg-white/70 hover:bg-white"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Desktop Arrows */}
          <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 w-[90px] justify-between left-1/2 -translate-x-1/2 mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-white/40 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#FF6B35] hover:border-[#FF6B35] transition-all focus:outline-none"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-white/40 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#FF6B35] hover:border-[#FF6B35] transition-all focus:outline-none"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Arrows */}
      <div className="md:hidden absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 z-30 pointer-events-none">
        <button
          onClick={handlePrev}
          className="pointer-events-auto w-10 h-10 flex items-center justify-center text-white/80 hover:text-white bg-black/10 rounded-full backdrop-blur-sm"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={handleNext}
          className="pointer-events-auto w-10 h-10 flex items-center justify-center text-white/80 hover:text-white bg-black/10 rounded-full backdrop-blur-sm"
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </section>
  );
}
