'use client';

import React, { createContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { ResolvedCampaign } from '@/types/campaign';
import { trackHeroEvent } from './hooks/useAnalytics';

interface HeroContextType {
  campaigns: ResolvedCampaign[];
  activeIndex: number;
  prevIndex: number;
  isAutoplayPaused: boolean;
  isPlaying: boolean;
  transitionDirection: 'next' | 'prev';
  locale: string;
  setActiveIndex: (index: number, source: 'autoplay' | 'swipe' | 'arrow' | 'navigator' | 'initial') => void;
  nextSlide: (source: 'autoplay' | 'swipe' | 'arrow' | 'navigator') => void;
  prevSlide: (source: 'autoplay' | 'swipe' | 'arrow' | 'navigator') => void;
  setAutoplayPaused: (paused: boolean) => void;
  triggerUserInteraction: () => void;
}

export const HeroContext = createContext<HeroContextType | null>(null);

const STATE_CACHE_KEY = 'nine77-hero-active-index';
const TIMESTAMP_CACHE_KEY = 'nine77-hero-active-timestamp';
const SESSION_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes in milliseconds
const RESUME_AUTOPLAY_DELAY = 4000; // Resume autoplay after 4 seconds of inactivity

export function HeroProvider({
  campaigns,
  children,
  locale = 'en',
}: {
  campaigns: ResolvedCampaign[];
  children: React.ReactNode;
  locale?: string;
}) {
  const [activeIndex, setActiveIndexState] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isAutoplayPaused, setAutoplayPaused] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev'>('next');
  
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger interaction pause & set 4-second resume timer
  const triggerUserInteraction = useCallback(() => {
    setAutoplayPaused(true);
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = setTimeout(() => {
      setAutoplayPaused(false);
    }, RESUME_AUTOPLAY_DELAY);
  }, []);

  // Recover state from sessionStorage if it has not expired (less than 10 min old)
  useEffect(() => {
    try {
      const cachedIndex = sessionStorage.getItem(STATE_CACHE_KEY);
      const cachedTimestamp = sessionStorage.getItem(TIMESTAMP_CACHE_KEY);

      if (cachedIndex !== null && cachedTimestamp !== null) {
        const timeElapsed = Date.now() - parseInt(cachedTimestamp, 10);
        if (timeElapsed < SESSION_EXPIRY_MS) {
          const parsedIndex = parseInt(cachedIndex, 10);
          if (parsedIndex >= 0 && parsedIndex < campaigns.length) {
            setActiveIndexState(parsedIndex);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to restore Hero state from sessionStorage:', e);
    }
  }, [campaigns.length]);

  // Cleanup interaction timer on unmount
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const setActiveIndex = useCallback(
    (index: number, source: 'autoplay' | 'swipe' | 'arrow' | 'navigator' | 'initial') => {
      if (campaigns.length === 0) return;
      
      const newIndex = (index + campaigns.length) % campaigns.length;
      if (newIndex === activeIndex) return;

      if (source !== 'autoplay') {
        triggerUserInteraction();
      }

      setPrevIndex(activeIndex);
      setTransitionDirection(newIndex > activeIndex ? 'next' : 'prev');
      setActiveIndexState(newIndex);

      // Track active state in sessionStorage with timestamps
      try {
        sessionStorage.setItem(STATE_CACHE_KEY, String(newIndex));
        sessionStorage.setItem(TIMESTAMP_CACHE_KEY, String(Date.now()));
      } catch (e) {
        // Ignored in restricted environments
      }

      // Track Analytics
      const targetCamp = campaigns[newIndex];
      trackHeroEvent('Slide Changed', {
        campaignId: targetCamp.id,
        campaignTitle: targetCamp.title,
        position: newIndex + 1,
        source,
        viewport: typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
      });
    },
    [activeIndex, campaigns, triggerUserInteraction]
  );

  const nextSlide = useCallback(
    (source: 'autoplay' | 'swipe' | 'arrow' | 'navigator') => {
      setActiveIndex(activeIndex + 1, source);
    },
    [activeIndex, setActiveIndex]
  );

  const prevSlide = useCallback(
    (source: 'autoplay' | 'swipe' | 'arrow' | 'navigator') => {
      setActiveIndex(activeIndex - 1, source);
    },
    [activeIndex, setActiveIndex]
  );

  const contextValue = useMemo(
    () => ({
      campaigns,
      activeIndex,
      prevIndex,
      isAutoplayPaused,
      isPlaying: campaigns.length > 1 && !isAutoplayPaused,
      transitionDirection,
      locale,
      setActiveIndex,
      nextSlide,
      prevSlide,
      setAutoplayPaused,
      triggerUserInteraction,
    }),
    [
      campaigns,
      activeIndex,
      prevIndex,
      isAutoplayPaused,
      transitionDirection,
      locale,
      setActiveIndex,
      nextSlide,
      prevSlide,
      triggerUserInteraction,
    ]
  );

  return <HeroContext.Provider value={contextValue}>{children}</HeroContext.Provider>;
}
