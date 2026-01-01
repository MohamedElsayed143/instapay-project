import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, Globe } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        scrolled ? 'border-b border-border shadow-sm' : 'border-b border-transparent'
      }`}
    >
      <div className="container mx-auto px-6 h-[80px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="block">
            <Image
              src="https://instapay.eg/assets/images/logo.svg"
              alt="InstaPay Logo"
              width={140}
              height={40}
              priority
              className="h-auto w-auto"
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          <ul className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-brand-noir font-medium text-[16px] hover:text-brand-green transition-colors duration-300"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="h-6 w-px bg-border mx-2"></div>

          {/* Language Toggle */}
          <button className="flex items-center space-x-2 text-brand-noir hover:text-brand-green transition-colors duration-300">
            <div className="flex items-center gap-1.5 group">
               <Image 
                src="https://instapay.eg/assets/images/icons/globe.svg" 
                alt="Globe" 
                width={18} 
                height={18} 
                className="opacity-80 group-hover:opacity-100"
              />
              <span className="font-medium text-[16px]">العربية</span>
            </div>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <button className="flex items-center space-x-1 text-brand-noir">
            <span className="font-medium text-[14px]">العربية</span>
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-brand-noir focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[-1] md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-[80px] left-0 right-0 bg-white border-t border-border transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ zIndex: 40 }}
      >
        <ul className="flex flex-col p-6 space-y-6 bg-white">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-brand-noir font-medium text-[18px] hover:text-brand-green transition-colors"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;