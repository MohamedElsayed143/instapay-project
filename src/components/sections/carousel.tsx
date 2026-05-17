export default function CarouselSection() {
  return (
    <section className="bg-[#6B2D9C] py-20 overflow-hidden font-cairo text-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-[36px] font-bold text-center mb-12 tracking-tight">
          How To ?
        </h2>
        
        <Carousel 
          autoPlay={true}
          autoPlayInterval={5000}
          loop={true}
          className="w-full"
        >
          {HOW_TO_ITEMS.map((item, index) => (
            <HowToCard key={index} item={item} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}

// --- Data ---

const HOW_TO_ITEMS = [
  {
    title_ar: "عن طريق\nعنوان الدفع اللحظي",
    title_en: "Sending Money\nto an IPA (Instant Payment Address)",
  },
  {
    title_ar: "عن طريق\nمحفظته الالكترونية",
    title_en: "Sending Money\nto a Digital Wallet",
  },
  {
    title_ar: "التحويل عن طريق\nالحساب البنكي",
    title_en: "Sending Money\nto a Bank Account",
  },
  {
    title_ar: "التحويل لبطاقة بنكية",
    title_en: "Transfer to any bank card",
  },
  {
    title_ar: "طلب دفع",
    title_en: "Request Money From other InstaPay users",
  },
  {
    title_ar: "كشف الحساب",
    title_en: "Check Balance",
  },
  {
    title_ar: "مختصر كشف الحساب",
    title_en: "Check Mini Statement",
  },
  {
    title_ar: "إضافة حسابات بنكية",
    title_en: "Add Multiple Bank accounts",
  },
  {
    title_ar: "عن طريق\nرقم الهاتف المحمول",
    title_en: "Sending Money\nthrough Mobile Number Only",
  },
];

// --- Components ---

interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loop?: boolean;
  className?: string;
}

function Carousel({ 
  children, 
  autoPlay = false, 
  autoPlayInterval = 5000, 
  loop = false,
  className = "" 
}: CarouselProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [itemsPerView, setItemsPerView] = React.useState(1);

  // Update items per view on resize
  React.useEffect(() => {
    const updateLayout = () => {
      if (!scrollContainerRef.current) return;
      const width = window.innerWidth;
      if (width >= 1024) setItemsPerView(3);
      else if (width >= 640) setItemsPerView(2);
      else setItemsPerView(1);
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  const totalSlides = React.Children.count(children);
  const maxIndex = Math.ceil(totalSlides / itemsPerView) - 1; 

  // Instead of maxIndex for dots, we want 1 dot per scroll group or 1 dot per item? 
  // Design usually shows simpler dots. Let's do 1 dot per item but clamped to view.
  // Actually, standard is 1 dot per "page" of items or just 1 dot per item for small carousels.
  // Given the screenshot has many items, likely pagination is per group or per item. 
  // Let's stick to activeIndex tracking the *first* visible item.

  const scrollTo = React.useCallback((index: number) => {
    if (!scrollContainerRef.current) return;
    
    // Clamp index
    let targetIndex = index;
    if (loop) {
      if (index < 0) targetIndex = totalSlides - itemsPerView;
      if (index > totalSlides - itemsPerView) targetIndex = 0;
    } else {
      targetIndex = Math.max(0, Math.min(index, totalSlides - itemsPerView));
    }

    const container = scrollContainerRef.current;
    const itemWidth = container.clientWidth / itemsPerView;
    const scrollPos = targetIndex * itemWidth;

    container.scrollTo({
      left: scrollPos,
      behavior: 'smooth'
    });
    setActiveIndex(targetIndex);
  }, [totalSlides, itemsPerView, loop]);

  // Scroll Handler to update active dot on manual scroll
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const itemWidth = container.clientWidth / itemsPerView;
    // Calculate index based on scroll position
    const newIndex = Math.round(container.scrollLeft / itemWidth);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  // Autoplay functionality
  React.useEffect(() => {
    if (!autoPlay || isPaused) return;

    const interval = setInterval(() => {
        // Find next valid index
        let nextIndex = activeIndex + 1;
        
        // If we reach the end valid start point
        if (nextIndex > totalSlides - itemsPerView) {
            nextIndex = 0;
        }

        scrollTo(nextIndex);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, isPaused, activeIndex, totalSlides, itemsPerView, scrollTo, autoPlayInterval]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) { // Only enable if user is interacting/hovering likely
        if (e.key === 'ArrowLeft') scrollTo(activeIndex - 1);
        if (e.key === 'ArrowRight') scrollTo(activeIndex + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, scrollTo, isPaused]);

  // Calculate dots: If we have many items, usually we show a limited number of dots or one per item.
  // Seeing the screenshot, there are 4 dots for ~9 items. This implies "pages".
  // Let's try to map dots to "groups" of itemsVisible.
  const numberOfDots = Math.ceil(totalSlides / itemsPerView);
  // Actually, standard Swiper with "slidesPerView: 3" often has 1 dot per 'snap point'. 
  // If we snap to every item, we have many dots.
  // The Enabled banks screenshot shows many dots. The How To screenshot shows 4 dots for 3 items visible.
  // This implies pages. We will use pages logic for dots.
  const currentPage = Math.floor(activeIndex / itemsPerView);

  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      role="region"
      aria-label="Content Carousel"
    >
      {/* Scroll Container */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 -mx-4 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {React.Children.map(children, (child, index) => (
          <div 
            className="flex-none w-full sm:w-1/2 lg:w-1/3 px-3 snap-start"
            style={{ flexBasis: itemsPerView === 1 ? '100%' : itemsPerView === 2 ? '50%' : '33.333%' }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={() => scrollTo(activeIndex - 1)}
        className="absolute left-0 top-1/2 -translate-y-[60%] -translate-x-2 md:-translate-x-12 z-10 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors duration-300 focus:outline-none"
        aria-label="Previous slide"
      >
        <ChevronIcon direction="left" className="w-12 h-12" />
      </button>

      <button 
        onClick={() => scrollTo(activeIndex + 1)}
        className="absolute right-0 top-1/2 -translate-y-[60%] translate-x-2 md:translate-x-12 z-10 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors duration-300 focus:outline-none"
        aria-label="Next slide"
      >
        <ChevronIcon direction="right" className="w-12 h-12" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2">
        {Array.from({ length: totalSlides - itemsPerView + 1 }).map((_, idx) => (
          (idx % 1 === 0) && ( // Show all dots or filter if too many? Let's show all available snap points.
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              activeIndex === idx 
                ? 'bg-white scale-125' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={activeIndex === idx}
          />
          )
        ))}
      </div>
    </div>
  );
}

function HowToCard({ item }: { item: typeof HOW_TO_ITEMS[0] }) {
  return (
    <div className="bg-[rgba(107,45,156,0.4)] rounded-[12px] overflow-hidden h-full flex flex-col group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      {/* Video Placeholder Section */}
      <div className="relative h-[240px] w-full bg-gradient-to-br from-[#8E44AD] to-[#6B2D9C] flex items-center justify-center overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 0 L100 100 L0 100 Z" fill="white" />
          </svg>
        </div>
        
        {/* Play Icon / Overlay */}
        <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center text-white p-6 text-center z-10">
            {/* Arabic Title Overlay in Video */}
            <h3 className="text-[18px] font-bold leading-tight mb-2 dir-rtl">
                {item.title_ar}
            </h3>
            
            {/* Play Button */}
            <div className="mt-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play className="w-5 h-5 fill-white text-white ml-1" />
            </div>

            {/* Video Controls Decor */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/40 flex items-center px-4 justify-between text-[10px] font-mono">
                <div className="flex gap-2 items-center">
                    <Play className="w-3 h-3 fill-white" />
                    <span>0:00</span>
                </div>
                <div className="flex gap-2 opacity-70">
                    <div className="w-16 h-1 bg-white/30 rounded-full overflow-hidden">
                        <div className="w-1/3 h-full bg-[#FF6B35]"></div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Mobile Phone Mockup Element (Abstract) */}
        <div className="absolute right-4 bottom-8 w-16 h-24 border-2 border-white/20 rounded-[4px] transform rotate-12 bg-white/5 backdrop-blur-[2px]"></div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col items-center justify-between flex-grow text-center">
        <h4 className="text-white text-[15px] font-semibold leading-relaxed mb-6 whitespace-pre-line">
          {item.title_en}
        </h4>
        
        <button className="bg-[#FF6B35] hover:bg-[#FF8C42] text-white text-[14px] font-semibold py-2.5 px-8 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-300 hover:scale-105 active:scale-95">
          Learn More
        </button>
      </div>
    </div>
  );
}

function ChevronIcon({ direction, className }: { direction: 'left' | 'right', className?: string }) {
  return direction === 'left' ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}