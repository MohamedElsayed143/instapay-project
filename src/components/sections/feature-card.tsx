'use client';

import React from 'react';
import Link from 'next/link';

interface FeatureCardProps {
  /**
   * The headline text of the card
   */
  title: string;
  
  /**
   * Optional description text displayed below the headline
   */
  description?: string;
  
  /**
   * Layout variant of the card styling
   * @default 'orange'
   */
  variant?: 'orange' | 'purple';
  
  /**
   * Size variation for padding and text sizing
   * @default 'large'
   */
  size?: 'large' | 'small';
  
  /**
   * URL for the call-to-action button
   */
  href?: string;
  
  /**
   * Text for the call-to-action button
   * @default 'Learn More'
   */
  buttonText?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Reusable feature card component with designated specific themes (Orange/Purple).
 * Supports large layout (What is InstaPay section) and smaller layout variations.
 */
export default function FeatureCard({
  title,
  description,
  variant = 'orange',
  size = 'large',
  href = '#',
  buttonText = 'Learn More',
  className = '',
}: FeatureCardProps) {
  // Styles based on HLD and Computed Styles
  // Card Radius: 12px (var(--radius-lg))
  // Button Radius: 20px - 24px (rounded-full)
  // Font: Cairo (inherited from body)

  const isOrange = variant === 'orange';

  // Background configurations
  // Orange Card: Uses #D97E54 (Card Orange) with opacity as per HLD/Screenshots
  // Purple Card: Uses #6B2D9C (Primary Purple) with opacity
  const baseClasses = "relative flex flex-col items-start h-full rounded-[12px] shadow-lg backdrop-blur-sm transition-all duration-300 border border-white/5 overflow-hidden group";
  
  const variantClasses = isOrange
    ? "bg-[#D97E54]/90 hover:bg-[#D97E54]/95" 
    : "bg-[#6B2D9C]/85 hover:bg-[#6B2D9C]/90";

  // Button Styling
  // Orange Card -> Purple Button (#6B2D9C) for contrast (as seen in 'Transaction Limits' card)
  // Purple Card -> Orange Button (#FF6B35) for contrast (as seen in 'What is IPA' card)
  // This maintains pixel-perfect fidelity to the 'What is InstaPay?' section pattern.
  const buttonBaseClasses = "inline-flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md no-underline";
  
  const buttonVariantClasses = isOrange
    ? "bg-[#6B2D9C] text-white hover:bg-[#5B1F7D]" // Purple button on Orange card
    : "bg-[#FF6B35] text-white hover:bg-[#FF8C42]"; // Orange button on Purple card

  // Sizing
  const sizeClasses = size === 'large' 
    ? "p-8 gap-6" 
    : "p-6 gap-4"; // Slightly tighter for 'features grid' / small cards

  const titleSizeClasses = size === 'large'
    ? "text-[24px] leading-[1.3] font-semibold tracking-normal"
    : "text-[18px] leading-[1.4] font-semibold";

  const buttonSizeClasses = "px-7 py-2.5 min-w-[120px]";

  return (
    <div className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}>
      {/* Content Wrapper */}
      <div className="flex flex-col gap-3 w-full flex-grow">
        <h3 className={`text-white font-cairo ${titleSizeClasses}`}>
          {title}
        </h3>
        
        {description && (
          <p className="text-[#F5F5F5] text-sm font-normal leading-[1.6] opacity-90 font-cairo">
            {description}
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-2">
        <Link 
          href={href} 
          className={`${buttonBaseClasses} ${buttonVariantClasses} ${buttonSizeClasses}`}
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}