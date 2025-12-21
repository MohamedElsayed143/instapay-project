'use client';

import React from 'react';

export function WhatIsInstaPay() {
  return (
    <section 
      id="h" 
      className="relative w-full bg-[#6B2D9C] pt-32 pb-24 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-20">
        <svg 
          className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0 L600,120 L1200,0 V0 H0Z" 
            className="fill-[#FF6B35]"
          ></path>
        </svg>
      </div>

      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-3xl pointer-events-none z-0"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-start">
          <div className="w-full lg:w-4/5 pt-8">
            <div className="mb-12 max-w-3xl">
              <h2 className="text-4xl md:text-[40px] font-bold text-white mb-6 font-cairo leading-tight">
                What is InstaPay?
              </h2>
              <p className="text-[#F5F5F5] text-sm md:text-base font-cairo leading-relaxed max-w-2xl opacity-90">
                InstaPay is an app that allows direct access to all your bank accounts and transfer instantly using your mobile device 24/7.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <InfoCard title="Transaction Limits and Fees" />
              <InfoCard title="What Is IPA?" />
              <InfoCard title="How to receive money on your mobile number?" />
              <InfoCard title="What is the transaction status handling?" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ title }: { title: string }) {
  return (
    <div className="bg-[#D97E54]/90 backdrop-blur-sm rounded-xl p-6 md:p-8 flex flex-col justify-between h-[280px] md:h-[260px] shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-transform duration-300 hover:-translate-y-1 group">
      <h3 className="text-white font-bold text-lg md:text-xl leading-snug font-cairo">
        {title}
      </h3>
      
      <div className="mt-4">
        <button 
          className="bg-[#6B2D9C] hover:bg-[#5B1F7D] text-white text-[13px] font-semibold py-2.5 px-6 rounded-full transition-all duration-300 shadow-sm"
          type="button"
        >
          Learn More
        </button>
      </div>
    </div>
  );
}
