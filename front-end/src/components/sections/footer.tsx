'use client';

import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export function Footer() {
  const { t, isRtl } = useLanguage();

  return (
    <footer className="w-full bg-[#4A1F5D] py-10 font-cairo">
      <div className={`container mx-auto px-4 flex flex-col items-center ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-center justify-center gap-6 mb-5 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <Link href="#" className="text-xs text-[#F5F5F5] hover:text-white hover:underline transition-all duration-200">
            {isRtl ? 'حقوق النشر' : 'Copyrights'}
          </Link>
          <Link href="#" className="text-xs text-[#F5F5F5] hover:text-white hover:underline transition-all duration-200">
            {isRtl ? 'الشروط والأحكام' : 'Terms and Conditions'}
          </Link>
        </div>

        <p className="text-xs text-[#999999] mb-6 font-normal text-center">
          {t('footer.rights')}
        </p>

        <div className={`flex items-center justify-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <SocialLink href="#" label="Facebook">
            <Facebook size={14} strokeWidth={2} />
          </SocialLink>
          <SocialLink href="#" label="YouTube">
            <Youtube size={14} strokeWidth={2} />
          </SocialLink>
          <SocialLink href="#" label="Instagram">
            <Instagram size={14} strokeWidth={2} />
          </SocialLink>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, children, label }: { href: string; children: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-white text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#4A1F5D] hover:border-white"
    >
      {children}
    </Link>
  );
}
