'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useHero } from './hooks/useHero';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function HeroNavigator({ stage }: { stage: number }) {
  const { campaigns, activeIndex, setActiveIndex, triggerUserInteraction } = useHero();

  if (campaigns.length <= 1) return null;

  const activeCampaign = campaigns[activeIndex];
  const accentColor = activeCampaign?.theme.accent || '#8A6A44';

  const handleSelectSlide = (index: number) => {
    triggerUserInteraction();
    setActiveIndex(index, 'navigator');
  };

  return (
    <>
      {/* ── Desktop Right Vertical Editorial Navigator ── */}
      <motion.div
        initial={{ opacity: 0, x: 14 }}
        animate={stage >= 5 ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.75, ease: EASE }}
        className="hidden lg:flex flex-col items-center gap-0 absolute right-6 xl:right-8 top-1/2 -translate-y-1/2 z-30"
        role="navigation"
        aria-label="Campaign section navigation"
      >
        {/* Current slide number */}
        <motion.span
          key={activeIndex}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="font-mono text-[11px] font-bold mb-3 tracking-widest text-[#8A6A44]"
          aria-live="polite"
          aria-label={`Slide ${activeIndex + 1} of ${campaigns.length}`}
        >
          {String(activeIndex + 1).padStart(2, '0')}
        </motion.span>

        {/* Top connecting line */}
        <div
          className="w-px h-10 mb-3"
          style={{ background: `linear-gradient(to bottom, ${accentColor}90, transparent)` }}
          aria-hidden="true"
        />

        {/* Slide number buttons */}
        <div className="flex flex-col gap-3">
          {campaigns.map((c, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={c.id}
                onClick={() => handleSelectSlide(i)}
                className="group relative flex items-center justify-center w-8 h-6 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold/50 rounded cursor-pointer"
                aria-label={`Go to campaign ${i + 1}`}
                aria-current={isActive ? 'true' : undefined}
              >
                <motion.span
                  animate={{
                    opacity: isActive ? 1 : 0.3,
                    scale: isActive ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="font-mono text-[10px] font-bold transition-colors duration-200 group-hover:opacity-75"
                  style={{ color: isActive ? accentColor : '#ffffff' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </motion.span>

                {isActive && (
                  <motion.div
                    layoutId="nav-active-dot"
                    className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-gold shadow-[0_0_8px_rgba(138,106,68,0.6)]"
                    transition={{ type: 'spring', stiffness: 140, damping: 20, mass: 0.8 }}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom connecting line */}
        <div
          className="w-px h-8 mt-3"
          style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.12), transparent)' }}
          aria-hidden="true"
        />

        {/* Total count */}
        <span
          className="font-mono text-[9px] mt-1 text-white/30 tracking-widest"
          aria-hidden="true"
        >
          {String(campaigns.length).padStart(2, '0')}
        </span>
      </motion.div>

      {/* ── Mobile Sleek Editorial Glass Pill Navigator (Bottom Center) ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={stage >= 5 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: EASE }}
        className="flex lg:hidden items-center gap-3 absolute bottom-8 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-full bg-black/35 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        role="navigation"
        aria-label="Mobile slide navigation"
      >
        {/* Monospace slide counter */}
        <div className="flex items-center gap-1 font-mono text-[9px] font-bold tracking-wider text-white/80 select-none">
          <motion.span
            key={activeIndex}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-gold"
          >
            {String(activeIndex + 1).padStart(2, '0')}
          </motion.span>
          <span className="text-white/25 font-light">/</span>
          <span className="text-white/40">{String(campaigns.length).padStart(2, '0')}</span>
        </div>

        {/* Hairline divider */}
        <div className="w-px h-3 bg-white/15" aria-hidden="true" />

        {/* Segmented indicator dashes */}
        <div className="flex items-center gap-2">
          {campaigns.map((c, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={c.id}
                onClick={() => handleSelectSlide(i)}
                className="relative flex items-center justify-center min-w-[24px] min-h-[24px] focus:outline-none focus-visible:ring-1 focus-visible:ring-gold/50 cursor-pointer"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={isActive ? 'true' : undefined}
              >
                <motion.div
                  animate={{
                    width: isActive ? 20 : 6,
                    backgroundColor: isActive ? accentColor : 'rgba(255,255,255,0.25)',
                    boxShadow: isActive ? `0 0 10px ${accentColor}80` : '0 0 0px transparent',
                  }}
                  transition={{ type: 'spring', stiffness: 140, damping: 20, mass: 0.8 }}
                  className="h-[2.5px] rounded-full"
                />
              </button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
