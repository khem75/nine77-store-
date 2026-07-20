'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useHero } from './hooks/useHero';
import { EASE } from './HeroAnimations';

export default function HeroNavigator({ stage }: { stage: number }) {
  const { campaigns, activeIndex, setActiveIndex, triggerUserInteraction } = useHero();

  if (campaigns.length <= 1) return null;

  const activeCampaign = campaigns[activeIndex];
  const accentColor = activeCampaign?.theme.accent || '#8B6A3E';

  const handleSelectSlide = (index: number) => {
    triggerUserInteraction();
    setActiveIndex(index, 'navigator');
  };

  return (
    <>
      {/* ── Desktop Right Vertical Navigator ── */}
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
          className="font-mono text-[11px] font-bold mb-3"
          style={{ color: accentColor }}
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
                className="group relative flex items-center justify-center w-8 h-6 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded cursor-pointer"
                aria-label={`Go to campaign ${i + 1}`}
                aria-current={isActive ? 'true' : undefined}
              >
                <motion.span
                  animate={{
                    opacity: isActive ? 1 : 0.22,
                    scale: isActive ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="font-mono text-[10px] font-bold transition-colors duration-400 group-hover:opacity-60"
                  style={{ color: isActive ? accentColor : '#ffffff' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </motion.span>

                {isActive && (
                  <motion.div
                    layoutId="nav-active-dot"
                    className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: accentColor }}
                    transition={{ duration: 0.4, ease: EASE }}
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
          style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)' }}
          aria-hidden="true"
        />

        {/* Total count */}
        <span
          className="font-mono text-[9px] mt-1"
          style={{ color: 'rgba(255,255,255,0.22)' }}
          aria-hidden="true"
        >
          {String(campaigns.length).padStart(2, '0')}
        </span>
      </motion.div>

      {/* ── Mobile Editorial Navigation Dots (Bottom Center) ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={stage >= 5 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, ease: EASE }}
        className="flex lg:hidden items-center gap-2.5 absolute bottom-7 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10"
        role="navigation"
        aria-label="Mobile slide navigation dots"
      >
        {campaigns.map((c, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={c.id}
              onClick={() => handleSelectSlide(i)}
              className="relative focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 p-1 cursor-pointer"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={isActive ? 'true' : undefined}
            >
              <motion.div
                animate={{
                  width: isActive ? 20 : 6,
                  backgroundColor: isActive ? accentColor : 'rgba(255,255,255,0.25)',
                }}
                transition={{ duration: 0.4, ease: EASE }}
                className="h-1.5 rounded-full"
              />
            </button>
          );
        })}
      </motion.div>
    </>
  );
}
