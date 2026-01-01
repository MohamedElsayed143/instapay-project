import React from 'react';
import Image from 'next/image';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Download and register",
      description: "Download the app from your mobile store. During registration, ensure you use the same mobile number registered with your bank.",
      image: "https://instapay.eg/assets/images/steps/step1.png",
      alt: "Registration Step 1"
    },
    {
      id: 2,
      title: "Add your bank account",
      description: "Select your bank, and enter your card details and PIN. Your account will automatically appear once validated.",
      image: "https://instapay.eg/assets/images/steps/step2.png",
      alt: "Registration Step 2"
    },
    {
      id: 3,
      title: "Create your IPA",
      description: "Set your unique Instant Payment Address (IPA) and PIN to start sending and receiving money instantly.",
      image: "https://instapay.eg/assets/images/steps/step3.png",
      alt: "Registration Step 3"
    }
  ];

  return (
    <section className="bg-white py-20 px-6 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#1A1A1A] mb-4">
            How to use InstaPay
          </h2>
          <div className="w-16 h-1.5 bg-[#009639] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className="relative mb-10 w-full flex justify-center">
                {/* Mockup Container */}
                <div className="relative w-[280px] h-[580px] z-10">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    width={280}
                    height={580}
                    className="object-contain drop-shadow-2xl"
                    priority={step.id === 1}
                  />
                </div>
                
                {/* Decorative background circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#F4F4F4] rounded-full -z-0"></div>
              </div>

              <div className="relative flex flex-col items-center text-center">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 bg-[#009639] text-white rounded-full text-xl font-bold shadow-lg">
                  {step.id}
                </div>
                <div className="pt-8">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#666666] text-base leading-relaxed max-w-[320px]">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-16 text-center">
          <button className="bg-[#009639] hover:bg-[#007a2e] text-white px-10 py-4 rounded-xl font-bold text-lg transition-colors duration-300">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;