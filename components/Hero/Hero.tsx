'use client';

import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HeroProvider } from './HeroProvider';
import { useHero } from './hooks/useHero';
import { useAutoplay } from './hooks/useAutoplay';
import { useParallax } from './hooks/useParallax';
import { trackHeroEvent } from './hooks/useAnalytics';
import { resolveCampaign, DEFAULT_CAMPAIGNS } from './campaigns';
import HeroBackground from './HeroBackground';
import HeroSlide from './HeroSlide';
import HeroContent from './HeroContent';
import HeroControls from './HeroControls';
import HeroNavigator from './HeroNavigator';
import HeroProgress from './HeroProgress';
import type { Campaign } from '@/types/campaign';

const FEATURE_FLAGS = {
  videoEnabled: true,
  sceneEnabled: false,
  analyticsEnabled: true,
};

class HeroErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('NINE77 Hero Error Boundary caught an exception:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="relative w-full min-h-[100svh] bg-[#050505] flex flex-col justify-center px-6 md:px-16 lg:px-24">
          <div className="max-w-lg z-10">
            <span className="block text-[9px] font-black uppercase tracking-[0.55em] text-[#8B6A3E] mb-4">
              NINE77 / STORE
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight leading-none mb-6">
              BUILD DIFFERENT.
            </h1>
            <p className="text-white/40 text-sm font-light mb-8 max-w-sm leading-relaxed">
              Premium luxury streetwear crafted for the bold.
            </p>
            <a
              href="/shop"
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] px-7 py-3.5 rounded-full bg-[#8B6A3E] text-white transition-transform hover:scale-105"
            >
              SHOP COLLECTION
            </a>
          </div>
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80 pointer-events-none" />
        </section>
      );
    }
    return this.props.children;
  }
}

function HeroInner({ autoplayDuration = 6000 }: { autoplayDuration?: number }) {
  const { campaigns, activeIndex, nextSlide, prevSlide, isAutoplayPaused, setAutoplayPaused, triggerUserInteraction } = useHero();
  const { onMouseMove } = useParallax();
  const [stage, setStage] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  // Run 6000ms autoplay loop
  useAutoplay(autoplayDuration);

  // Intersection Observer to pause autoplay when Hero is out of viewport
  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setAutoplayPaused(true);
        } else {
          setAutoplayPaused(false);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [setAutoplayPaused]);

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        triggerUserInteraction();
        prevSlide('arrow');
      } else if (e.key === 'ArrowRight') {
        triggerUserInteraction();
        nextSlide('arrow');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, triggerUserInteraction]);

  // Intro stages for initial sequence
  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 50),
      setTimeout(() => setStage(2), 300),
      setTimeout(() => setStage(3), 600),
      setTimeout(() => setStage(4), 1000),
      setTimeout(() => setStage(5), 1400),
      setTimeout(() => setStage(6), 1800),
    ];

    if (FEATURE_FLAGS.analyticsEnabled && campaigns.length > 0) {
      trackHeroEvent('Hero Viewed', {
        campaignCount: campaigns.length,
        viewport: typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
      });
    }

    return () => timers.forEach(clearTimeout);
  }, [campaigns.length]);

  const activeCamp = campaigns[activeIndex];
  const accentColor = activeCamp?.theme?.accent || '#8B6A3E';

  const isSlideMounted = (index: number) => {
    const total = campaigns.length;
    if (total <= 1) return true;
    const prev = (activeIndex - 1 + total) % total;
    const next = (activeIndex + 1) % total;
    return index === activeIndex || index === prev || index === next;
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={onMouseMove}
      onMouseEnter={triggerUserInteraction}
      className="relative w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] overflow-hidden select-none"
      style={{
        backgroundColor: '#050505',
        '--theme-color-accent': accentColor,
      } as React.CSSProperties}
      aria-label="NINE77 Editorial Hero Carousel"
      role="region"
    >
      {/* Autoplay loading indicator line */}
      <HeroProgress duration={autoplayDuration} />

      {/* Atmospheric backgrounds */}
      <HeroBackground visible={stage >= 1} />

      {/* Left-side vertical indicator dot pagination & navigation */}
      <HeroNavigator stage={stage} />

      {/* Slide controller: mobile swipe tracking & desktop edge hit areas */}
      <HeroControls>
        {/* Slides rendering block with Framer Motion AnimatePresence */}
        <div className="absolute inset-0 w-full h-full z-[5]">
          <AnimatePresence mode="popLayout" initial={false}>
            {campaigns.map((c, i) => {
              if (!isSlideMounted(i)) return null;
              return (
                <HeroSlide
                  key={c.id}
                  campaign={c}
                  isActive={i === activeIndex}
                  isPreload={i === (activeIndex + 1) % campaigns.length}
                  isFirstSlide={i === 0}
                  featureFlags={FEATURE_FLAGS}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </HeroControls>

      {/* Foreground overlay content block */}
      <HeroContent stage={stage} />
    </section>
  );
}

interface HeroProps {
  initialCampaigns?: Campaign[] | null;
  locale?: string;
  autoplayDuration?: number;
}

export default function Hero({ initialCampaigns, locale = 'en', autoplayDuration = 6000 }: HeroProps) {
  const sourceCampaigns =
    initialCampaigns && initialCampaigns.length > 0 ? initialCampaigns : DEFAULT_CAMPAIGNS;

  const resolvedCampaigns = sourceCampaigns.map((c) => resolveCampaign(c, locale));

  return (
    <HeroErrorBoundary>
      <HeroProvider campaigns={resolvedCampaigns} locale={locale}>
        <HeroInner autoplayDuration={autoplayDuration} />
      </HeroProvider>
    </HeroErrorBoundary>
  );
}
