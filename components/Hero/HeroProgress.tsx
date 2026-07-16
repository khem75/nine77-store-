'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useHero } from './hooks/useHero';

export default function HeroProgress({ duration = 7000 }: { duration?: number }) {
  const { activeIndex, isPlaying, campaigns } = useHero();

  if (campaigns.length <= 1) return null;

  const activeCampaign = campaigns[activeIndex];
  const accentColor = activeCampaign?.theme.accent || '#c8a84b';

  return (
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.05] z-50 pointer-events-none">
      <motion.div
        key={activeIndex + '-' + isPlaying} // Restarts animation key when index or play state shifts
        initial={{ width: '0%' }}
        animate={isPlaying ? { width: '100%' } : {}}
        transition={
          isPlaying
            ? { duration: duration / 1000, ease: 'linear' }
            : { duration: 0 }
        }
        className="h-full"
        style={{
          backgroundColor: accentColor,
          boxShadow: `0 0 8px ${accentColor}`,
        }}
      />
    </div>
  );
}
