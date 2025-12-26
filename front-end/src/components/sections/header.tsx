'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X, LogIn, UserPlus } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const { language, setLanguage, t, isRtl } = useLanguage();

  const navLinks = [
    { label: t('nav.home'), href: '#v', active: true },
    { label: t('nav.whatIs'), href: '#h' },
    { label: t('nav.howTo'), href: '#t' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#5B1F7D] text-white h-[80px] shadow-md font-cairo">
      <div className={`container mx-auto h-full px-4 md:px-8 flex items-center justify-between max-w-[1200px] ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className="flex-shrink-0 w-[200px] md:w-[240px] lg:w-[280px]">
          <Link href="/" className="block relative h-[35px] w-full">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b9b52292-207e-4ad8-b62f-e104f3f495a0-instapay-eg/assets/images/Asset-6_4x-1024x125-1.png"
              alt="InstaPay Logo"
              width={1024}
              height={125}
              priority
              className="object-contain h-full w-auto"
            />
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          <ul className={`flex items-center gap-6 xl:gap-8 list-none m-0 p-0 ${isRtl ? 'flex-row-reverse' : ''}`}>
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[14px] font-medium leading-[1.5] tracking-[0.2px] transition-colors hover:underline hover:decoration-2 hover:underline-offset-4 text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
          {/* Login & Signup Buttons - Desktop */}
          <div className={`hidden lg:flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 text-[14px] font-medium text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all"
            >
              <LogIn className="w-4 h-4" />
              {t('nav.login')}
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 text-[14px] font-medium bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              {t('nav.signUp')}
            </Link>
          </div>

          {/* Language Dropdown */}
          <div className="hidden lg:block relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              onBlur={() => setTimeout(() => setIsLangDropdownOpen(false), 200)}
              className="flex items-center gap-2 text-[14px] font-medium hover:text-gray-200 transition-colors focus:outline-none"
            >
              <span>{language === 'en' ? 'English' : 'العربية'}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <div
              className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-full mt-2 w-32 bg-white rounded-md shadow-lg py-1 text-gray-800 transform origin-top transition-all duration-200 ease-out ${
                isLangDropdownOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'
              }`}
            >
              <button
                onClick={() => setLanguage('en')}
                className="w-full text-left block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#5B1F7D]"
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className="w-full text-right block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#5B1F7D]"
                style={{ direction: 'rtl' }}
              >
                العربية
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white hover:text-gray-200 transition-colors focus:outline-none"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[60] transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : (isRtl ? '-translate-x-full' : 'translate-x-full')
        } lg:hidden`}
      >
        <div 
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-0 h-full w-[280px] bg-[#5B1F7D] shadow-2xl p-6 flex flex-col`}>
          <div className="flex justify-between items-center mb-8">
            <div className="w-[140px]">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b9b52292-207e-4ad8-b62f-e104f3f495a0-instapay-eg/assets/images/Asset-6_4x-1024x125-1.png"
                alt="InstaPay"
                width={1024}
                height={125}
                className="w-full h-auto object-contain"
              />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1">
            <ul className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-white hover:text-[#FF6B35] transition-colors block border-b border-white/10 pb-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Login & Signup Buttons - Mobile */}
            <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-white/10">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all"
              >
                <LogIn className="w-4 h-4" />
                {t('nav.login')}
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                {t('nav.signUp')}
              </Link>
            </div>
          </nav>

          {/* Language Selector */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-300 mb-3 uppercase tracking-wider font-semibold">{t('nav.language')}</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { setLanguage('en'); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-2 text-white hover:text-[#FF6B35] transition-colors text-left"
              >
                <span className={`w-2 h-2 rounded-full ${language === 'en' ? 'bg-[#FF6B35]' : 'bg-transparent border border-white/50'}`}></span>
                English
              </button>
              <button 
                onClick={() => { setLanguage('ar'); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-2 text-white hover:text-[#FF6B35] transition-colors text-right w-full justify-between"
                style={{ direction: 'rtl' }}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${language === 'ar' ? 'bg-[#FF6B35]' : 'bg-transparent border border-white/50'}`}></span>
                  العربية
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;