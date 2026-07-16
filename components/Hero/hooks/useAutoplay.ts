'use client';

import { useEffect, useRef } from 'react';
import { useHero } from './useHero';

export function useAutoplay(duration = 7000) {
  const { isPlaying, activeIndex, nextSlide } = useHero();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Set up the recurring interval
    timerRef.current = setInterval(() => {
      nextSlide('autoplay');
    }, duration);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, activeIndex, nextSlide, duration]);
}
