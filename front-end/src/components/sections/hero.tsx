import React from 'react';
import Image from 'next/image';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-white pt-20 lg:pt-32 pb-16 lg:pb-0">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none z-0">
        <Image
          src="https://instapay.eg/assets/images/hero/hero-bg-shapes.svg"
          alt=""
          fill
          className="object-right-top object-contain opacity-50 lg:opacity-100"
          priority
        />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Content Column */}
          <div className="w-full lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            <h1 className="text-[40px] md:text-[56px] lg:text-[64px] leading-[1.1] font-bold text-[#1A1A1A] mb-6">
              Simplified. <br className="hidden lg:block" />
              Fast. Secure.
            </h1>
            <p className="text-[#666666] text-lg lg:text-xl max-w-lg mb-10 mx-auto lg:mx-0 leading-relaxed font-normal">
              Egypt's first national payment service provider. Send and receive money instantly from any bank in Egypt, 24/7.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105 active:scale-95"
              >
                <div className="relative w-[180px] h-[54px]">
                  <Image
                    src="https://instapay.eg/assets/images/buttons/app-store.svg"
                    alt="Download on the App Store"
                    fill
                    className="object-contain"
                  />
                </div>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105 active:scale-95"
              >
                <div className="relative w-[180px] h-[54px]">
                  <Image
                    src="https://instapay.eg/assets/images/buttons/google-play.svg"
                    alt="Get it on Google Play"
                    fill
                    className="object-contain"
                  />
                </div>
              </a>
            </div>

            {/* Subtext info */}
            <p className="mt-8 text-sm text-[#999999] font-medium uppercase tracking-wider">
              Licensed by the Central Bank of Egypt
            </p>
          </div>

          {/* Right Mockup Column */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[320px] md:max-w-[420px] lg:max-w-[500px]">
              {/* Optional Gradient Glow for Depth */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#00963915] to-transparent rounded-full blur-3xl -z-10" />
              
              <Image
                src="https://instapay.eg/assets/images/hero/mobile-mockup.png"
                alt="InstaPay App Interface"
                width={600}
                height={800}
                className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] relative z-20"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom transition gradient for seamless section blending */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

export default HeroSection;