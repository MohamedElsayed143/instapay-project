import React from 'react';
import Image from 'next/image';

const CTABanner = () => {
  return (
    <section className="relative w-full py-[60px] md:py-[80px] lg:py-[100px] px-6">
      <div className="container mx-auto max-w-[1200px]">
        {/* Banner Container */}
        <div 
          className="relative w-full rounded-[24px] overflow-hidden bg-[#009639] flex flex-col items-center justify-center text-center px-6 py-12 md:py-20 lg:py-24"
          style={{
            backgroundImage: `url('https://instapay.eg/assets/images/cta-bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Overlay to ensure legibility and match high-contrast design */}
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 max-w-[800px] flex flex-col items-center">
            <h2 className="text-white text-[32px] md:text-[42px] lg:text-[48px] font-bold leading-[1.2] mb-6 tracking-tight">
              Ready to experience instant banking?
            </h2>
            
            <p className="text-white/90 text-[16px] md:text-[18px] lg:text-[20px] font-normal leading-[1.6] mb-10 max-w-[600px]">
              Join millions of users and start making instant, secure transfers today with InstaPay.
            </p>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                <Image 
                  src="https://instapay.eg/assets/images/buttons/app-store-white.svg"
                  alt="Download on the App Store"
                  width={160}
                  height={48}
                  className="h-[48px] w-auto"
                />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                <Image 
                  src="https://instapay.eg/assets/images/buttons/google-play-white.svg"
                  alt="Get it on Google Play"
                  width={180}
                  height={48}
                  className="h-[48px] w-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;