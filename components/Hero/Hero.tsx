'use client';

import React, { useEffect, useState } from 'react';
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
import type { Campaign, ResolvedCampaign } from '@/types/campaign';

// Visual feature flags to toggle advanced assets or debugging modes
const FEATURE_FLAGS = {
  videoEnabled: true,
  sceneEnabled: false, // 3D dial logo disabled by default in first release
  analyticsEnabled: true,
};

/* React Class Error Boundary to prevent failures in Three.js or media loops from breaking the homepage */
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
      // Graceful branding recovery layout
      return (
        <section className="relative w-full min-h-[100svh] bg-[#050505] flex flex-col justify-center px-6 md:px-16 lg:px-24">
          <div className="max-w-lg z-10">
            <span className="block text-[9px] font-black uppercase tracking-[0.55em] text-[#c8a84b] mb-4">
              NINE77 / STORE
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight leading-none mb-6">
              BUILD DIFFERENT.
            </h1>
            <p className="text-white/40 text-sm font-light mb-8 max-w-sm leading-relaxed">
              Premium streetwear engineered for those who refuse to blend in. Fusing architectural geometry with museum-grade craftsmanship.
            </p>
            <a
              href="/shop"
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] px-7 py-3.5 rounded-full bg-[#c8a84b] text-[#050505] transition-transform hover:scale-105"
            >
              SHOP COLLECTION
            </a>
          </div>
          {/* Faux vignette layer */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80 pointer-events-none" />
        </section>
      );
    }
    return this.props.children;
  }
}

function HeroInner({ autoplayDuration = 7000 }: { autoplayDuration?: number }) {
  const { campaigns, activeIndex, isAutoplayPaused, setAutoplayPaused } = useHero();
  const { mouseRef, onMouseMove } = useParallax();
  const [stage, setStage] = useState(0);

  // Run autoplay loop
  useAutoplay(autoplayDuration);

  // intro stage timer triggers for text slide reveal sequences
  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 50),
      setTimeout(() => setStage(2), 300),
      setTimeout(() => setStage(3), 600),
      setTimeout(() => setStage(4), 1000),
      setTimeout(() => setStage(5), 1400),
      setTimeout(() => setStage(6), 1800),
    ];

    // Analytics: track initial hero render
    if (FEATURE_FLAGS.analyticsEnabled && campaigns.length > 0) {
      trackHeroEvent('Hero Viewed', {
        campaignCount: campaigns.length,
        viewport: typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
      });
    }

    return () => timers.forEach(clearTimeout);
  }, [campaigns.length]);

  const activeCamp = campaigns[activeIndex];
  const accentColor = activeCamp?.theme?.accent || '#c8a84b';

  // Intelligent loading bounds: only mount active, previous, and next slides
  const isSlideMounted = (index: number) => {
    const total = campaigns.length;
    if (total <= 1) return true;
    const prev = (activeIndex - 1 + total) % total;
    const next = (activeIndex + 1) % total;
    return index === activeIndex || index === prev || index === next;
  };

  return (
    <section
      onMouseMove={onMouseMove}
      onMouseEnter={() => setAutoplayPaused(true)}
      onMouseLeave={() => setAutoplayPaused(false)}
      className="relative w-full min-h-[100svh] overflow-hidden"
      style={{
        backgroundColor: '#050505',
        '--theme-color-accent': accentColor,
      } as React.CSSProperties}
      aria-label="NINE77 Hero campaigns"
    >
      {/* Autoplay loading indicator line */}
      <HeroProgress duration={autoplayDuration} />

      {/* Atmospheric backgrounds */}
      <HeroBackground visible={stage >= 1} />

      {/* Left-side vertical indicator dot pagination */}
      <HeroNavigator stage={stage} />

      {/* Slide controller: mobile swipe tracking & desktop edge cursors */}
      <HeroControls>
        {/* Slides rendering block */}
        <div className="absolute inset-0 w-full h-full z-[5]">
          {campaigns.map((c, i) => {
            if (!isSlideMounted(i)) return null;
            return (
              <HeroSlide
                key={c.id}
                campaign={c}
                isActive={i === activeIndex}
                isPreload={i === (activeIndex + 1) % campaigns.length}
                featureFlags={FEATURE_FLAGS}
              />
            );
          })}
        </div>
      </HeroControls>

      {/* Foreground overlay content block (captures titles, CTA coordinates, trust strip) */}
      <HeroContent stage={stage} />
    </section>
  );
}

interface HeroProps {
  initialCampaigns?: Campaign[] | null;
  locale?: string;
  autoplayDuration?: number;
}

export default function Hero({ initialCampaigns, locale = 'en', autoplayDuration = 7000 }: HeroProps) {
  // Resolve campaigns with defaults fallback if empty or fetch error occurs
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
