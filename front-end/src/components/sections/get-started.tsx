'use client';

import React from 'react';

export function GetStarted() {
  return (
    <section className="relative w-full overflow-hidden bg-[#1A1A1A] text-white pt-32 pb-24 lg:pt-48 lg:pb-32" id="g">
      <div className="absolute top-0 left-0 right-0 z-10 w-full h-[80px] md:h-[120px] lg:h-[160px] pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-[#FF6B35]">
          <path d="M0,0 L500,100 L1000,0 V0 H0 Z" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-[1240px] relative z-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          <div className="w-full lg:w-1/2 flex flex-col items-start space-y-6">
            <h2 className="text-[36px] md:text-[48px] font-bold leading-[1.2] tracking-[-0.3px] font-cairo text-white">
              Get Started
            </h2>
            
            <p className="text-[#F5F5F5] text-[14px] md:text-[16px] leading-[1.6] tracking-[0.3px] font-cairo max-w-[500px]">
              Download the app, connect your accounts and start transferring instantly 24/7.
            </p>

            <div className="flex flex-row flex-wrap gap-4 mt-4">
              <a 
                href="https://play.google.com/store/apps/details?id=com.egyptianbanks.instapay"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105 active:scale-95 duration-200"
              >
                <img 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b9b52292-207e-4ad8-b62f-e104f3f495a0-instapay-eg/assets/images/google-play-badge-e1639002919423-2.png" 
                  alt="Get it on Google Play" 
                  width="135"
                  height="40"
                  className="h-[40px] md:h-[48px] w-auto object-contain"
                />
              </a>
              <a 
                href="https://apps.apple.com/eg/app/instapay-egypt/id1592108795"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105 active:scale-95 duration-200"
              >
                <img 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b9b52292-207e-4ad8-b62f-e104f3f495a0-instapay-eg/assets/images/Download_on_the_App_Store_Badge_US-UK_RGB_blk_0929-3.png" 
                  alt="Download on the App Store" 
                  width="120"
                  height="40"
                  className="h-[40px] md:h-[48px] w-auto object-contain"
                />
              </a>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
            <div className="relative w-[280px] md:w-[320px] lg:w-[380px] aspect-[9/18] transform rotate-[-5deg] lg:translate-y-8 lg:translate-x-8">
               <div className="absolute inset-0 bg-neutral-900 rounded-[3rem] shadow-2xl border-8 border-neutral-800 overflow-hidden">
                  <div className="w-full h-full bg-[#2a2a2a] flex items-center justify-center relative">
                     <div className="text-center p-6 opacity-50">
                        <div className="w-16 h-16 rounded-full bg-white/10 mx-auto mb-4 animate-pulse"></div>
                        <div className="h-4 w-32 bg-white/10 rounded mx-auto mb-2"></div>
                        <div className="h-4 w-24 bg-white/10 rounded mx-auto"></div>
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
