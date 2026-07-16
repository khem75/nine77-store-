'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useHero } from './hooks/useHero';
import { EASE } from './HeroAnimations';

export default function HeroNavigator({ stage }: { stage: number }) {
  const { campaigns, activeIndex, setActiveIndex } = useHero();

  if (campaigns.length <= 1) return null;

  const activeCampaign = campaigns[activeIndex];
  const accentColor = activeCampaign?.theme.accent || '#c8a84b';

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={stage >= 6 ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE }}
      className="hidden lg:flex flex-col items-center gap-3 absolute left-4 xl:left-6 top-1/2 -translate-y-1/2 z-30"
    >
      {/* Current page label */}
      <span className="text-[10px] font-mono font-bold transition-colors duration-500" style={{ color: accentColor }}>
        {String(activeIndex + 1).padStart(2, '0')}
      </span>

      {/* Connection line */}
      <div
        className="w-px h-12 transition-colors duration-500"
        style={{
          background: `linear-gradient(to bottom, ${accentColor}80, transparent)`,
        }}
      />

      {/* Clickable paging dots */}
      <div className="flex flex-col gap-2">
        {campaigns.map((c, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={c.id}
              onClick={() => setActiveIndex(i, 'navigator')}
              className="group relative flex items-center justify-center w-5 h-5 focus:outline-none"
              aria-label={`Go to slide ${i + 1}`}
            >
              {/* Animated inner dot */}
              <motion.div
                className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
                style={{
                  backgroundColor: isActive ? accentColor : 'rgba(255, 255, 255, 0.15)',
                }}
                animate={isActive ? { scale: 1.25 } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Hover ring */}
              <div
                className="absolute inset-0 rounded-full border border-transparent group-hover:border-white/10 transition-colors duration-300 scale-90"
              />
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
