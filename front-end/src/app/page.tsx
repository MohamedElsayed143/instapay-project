'use client';

import { Header } from '@/components/sections/header';
import { HeroSlider } from '@/components/sections/hero-slider';
import { WhatIsInstaPay } from '@/components/sections/what-is-instapay';
import { HowTo } from '@/components/sections/how-to';
import { GetStarted } from '@/components/sections/get-started';
import { EnabledBanks } from '@/components/sections/enabled-banks';
import { Footer } from '@/components/sections/footer';

export default function Home() {
  return (
    <div className="min-h-screen font-cairo">
      <Header />
      <main className="pt-[80px]">
        <HeroSlider />
        <WhatIsInstaPay />
        <HowTo />
        <GetStarted />
        <EnabledBanks />
      </main>
      <Footer />
    </div>
  );
}