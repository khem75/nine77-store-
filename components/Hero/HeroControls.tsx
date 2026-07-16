'use client';

import React, { useRef, useState } from 'react';
import { useHero } from './hooks/useHero';
import { motion } from 'framer-motion';

export default function HeroControls({ children }: { children: React.ReactNode }) {
  const { nextSlide, prevSlide, campaigns, setAutoplayPaused } = useHero();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Drag end callback using Framer Motion drag gestures
  const handleDragEnd = (event: any, info: any) => {
    setAutoplayPaused(false);
    
    const swipeThreshold = 50;
    const diff = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(diff) < swipeThreshold && Math.abs(velocity) < 300) return;

    if (diff < 0 || velocity < -300) {
      nextSlide('swipe');
    } else {
      prevSlide('swipe');
    }
  };

  // Cursor edge tracking for premium floating arrow experience on desktop
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;
    
    setMousePos({ x: relativeX, y: relativeY });

    const widthThreshold = rect.width * 0.12; // Active zone: outer 12% edges
    if (relativeX < widthThreshold) {
      setHoverSide('left');
    } else if (relativeX > rect.width - widthThreshold) {
      setHoverSide('right');
    } else {
      setHoverSide(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverSide(null);
  };

  const handleEdgeClick = () => {
    if (hoverSide === 'left') {
      prevSlide('arrow');
    } else if (hoverSide === 'right') {
      nextSlide('arrow');
    }
  };

  if (campaigns.length <= 1) {
    return <div className="absolute inset-0 w-full h-full">{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleEdgeClick}
      className={`absolute inset-0 w-full h-full overflow-hidden select-none ${
        hoverSide ? 'cursor-none' : ''
      }`}
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        onDragStart={() => setAutoplayPaused(true)}
        onDragEnd={handleDragEnd}
        className="w-full h-full relative cursor-grab active:cursor-grabbing"
      >
        {children}
      </motion.div>

      {/* Premium floating indicators mapping to pointer coordinates (desktop only) */}
      {hoverSide && (
        <div
          className="hidden md:flex pointer-events-none fixed z-[99] w-12 h-12 rounded-full border border-white/20 bg-black/60 backdrop-blur-md items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        >
          {hoverSide === 'left' ? (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
}
