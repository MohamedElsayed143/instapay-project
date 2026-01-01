import React from 'react';
import Image from 'next/image';

const banks = [
  { name: 'National Bank of Egypt', logo: 'https://instapay.eg/assets/images/banks/nbe.png' },
  { name: 'Banque Misr', logo: 'https://instapay.eg/assets/images/banks/banque-misr.png' },
  { name: 'CIB', logo: 'https://instapay.eg/assets/images/banks/cib.png' },
  { name: 'QNB', logo: 'https://instapay.eg/assets/images/banks/qnb.png' },
  { name: 'Alex Bank', logo: 'https://instapay.eg/assets/images/banks/nbe.png' }, // Fallback to provided assets if missing
  { name: 'HSBC', logo: 'https://instapay.eg/assets/images/banks/banque-misr.png' },
  { name: 'AAIB', logo: 'https://instapay.eg/assets/images/banks/cib.png' },
  { name: 'Banque du Caire', logo: 'https://instapay.eg/assets/images/banks/qnb.png' },
];

const BanksSlider = () => {
  return (
    <section className="py-[80px] md:py-[100px] bg-white overflow-hidden">
      <div className="container mx-auto px-6 mb-12 text-center">
        <h2 className="text-[32px] md:text-[36px] font-semibold text-[#1A1A1A] mb-4 leading-[1.3]">
          Participating Banks
        </h2>
        <p className="text-[18px] text-[#666666] max-w-[700px] mx-auto leading-[1.6]">
          InstaPay is currently supported by all major Egyptian banks, with more being added regularly to ensure seamless transfers across the nation.
        </p>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee whitespace-nowrap py-4">
          {[...banks, ...banks].map((bank, index) => (
            <div
              key={`${bank.name}-${index}`}
              className="flex items-center justify-center min-w-[160px] md:min-w-[220px] h-[100px] mx-4 md:mx-8 px-6 bg-white border border-[#E5E5E5] rounded-[16px] transition-all duration-300 hover:shadow-md grayscale hover:grayscale-0 opacity-70 hover:opacity-100"
            >
              <div className="relative w-full h-full">
                <Image
                  src={bank.logo}
                  alt={bank.name}
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 768px) 120px, 180px"
                  className="p-2"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Duplicate for seamless loop */}
        <div className="absolute top-0 flex animate-marquee2 whitespace-nowrap py-4" aria-hidden="true">
          {[...banks, ...banks].map((bank, index) => (
            <div
              key={`${bank.name}-clone-${index}`}
              className="flex items-center justify-center min-w-[160px] md:min-w-[220px] h-[100px] mx-4 md:mx-8 px-6 bg-white border border-[#E5E5E5] rounded-[16px] transition-all duration-300 hover:shadow-md grayscale hover:grayscale-0 opacity-70 hover:opacity-100"
            >
              <div className="relative w-full h-full">
                <Image
                  src={bank.logo}
                  alt={bank.name}
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 768px) 120px, 180px"
                  className="p-2"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee2 {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee2 {
          animation: marquee2 40s linear infinite;
        }
        .group:hover .animate-marquee,
        .group:hover .animate-marquee2 {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default BanksSlider;