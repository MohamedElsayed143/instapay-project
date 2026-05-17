import React from "react";

/**
 * Props for the WaveDivider component
 * @property {'top' | 'bottom'} position - Whether the divider is at the top or bottom of the section
 * @property {'triangle'} variant - The shape of the divider (currently focused on triangle/wave style)
 * @property {boolean} invert - Whether to use the negative (cut-out) version of the shape
 * @property {string} color - The fill color of the SVG (CSS class)
 * @property {string} height - Height class for the SVG container (responsive)
 * @property {string} className - Additional CSS classes
 */
interface WaveDividerProps {
  position?: "top" | "bottom";
  variant?: "triangle";
  invert?: boolean;
  color?: string;
  height?: string;
  className?: string;
}

/**
 * WaveDivider Component
 * 
 * Implements the pixel-perfect diagonal wave/triangle dividers found in the InstaPay design.
 * These are typically used to create orange (#FF6B35) separation bands between sections.
 * 
 * @example
 * // Standard bottom divider pointing down (V shape overlap)
 * <WaveDivider position="bottom" invert />
 * 
 * @example
 * // Top divider pointing down (V shape overlap from top)
 * <WaveDivider position="top" invert />
 */
export default function WaveDivider({
  position = "bottom",
  variant = "triangle",
  invert = false,
  color = "fill-[#FF6B35]",
  height = "h-[60px] md:h-[100px]",
  className = "",
}: WaveDividerProps) {
  // Determine rotation/positioning classes
  const isTop = position === "top";
  
  // Elementor-compatible SVG Paths (ViewBox 0 0 1200 120)
  
  // Standard Triangle (Mountain / Pyramid pointing UP)
  // Usage: Creates a solid triangle resting on the bottom line.
  const trianglePath = "M1200,120L600,0L0,120H1200Z";
  
  // Negative Triangle (Box with V cut out from Top)
  // Usage: Fills the entire box except for a V-shape pointing down from the top.
  // When placed at bottom of a section, it visually creates a V-shaped extension of the content above.
  const triangleNegativePath = "M0,0V120H1200V0L600,120L0,0Z";

  // Select path based on invert prop
  const path = invert ? triangleNegativePath : trianglePath;

  return (
    <div
      className={`absolute left-0 w-full overflow-hidden leading-[0] z-10 ${
        isTop ? "top-0 rotate-180" : "bottom-0"
      } ${className}`}
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <svg
        className={`relative block w-[calc(100%+1.3px)] ${height} ${color}`}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={path} />
      </svg>
    </div>
  );
}