'use client';

import React, { useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Truck, ShieldCheck, Lock, MessageCircle } from 'lucide-react';
import { useHero } from './hooks/useHero';
import { EASE, wordCropVariants } from './HeroAnimations';
import { trackHeroEvent } from './hooks/useAnalytics';

const TRUST_ITEMS = [
  { label: 'FREE SHIPPING', icon: Truck },
  { label: 'PREMIUM QUALITY', icon: ShieldCheck },
  { label: 'SECURE CHECKOUT', icon: Lock },
  { label: 'WHATSAPP SUPPORT', icon: MessageCircle },
] as const;

/* Magnetic CTA button wrapper */
function MagneticButton({
  href,
  children,
  accent,
  buttonType = 'gold',
}: {
  href: string;
  children: React.ReactNode;
  accent: string;
  buttonType?: 'gold' | 'white' | 'dark';
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 320, damping: 24 });
  const springY = useSpring(my, { stiffness: 320, damping: 24 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < 95) {
        mx.set(dx * 0.26);
        my.set(dy * 0.26);
      }
    },
    [mx, my]
  );

  const onMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  // Button styles based on visual identity theme
  const getButtonStyles = (): React.CSSProperties => {
    if (buttonType === 'gold') {
      return {
        background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#050505',
        boxShadow: `0 4px 16px ${accent}25`,
      };
    }
    if (buttonType === 'white') {
      return {
        background: '#ffffff',
        border: '1px solid rgba(255,255,255,0.2)',
        color: '#050505',
        boxShadow: '0 4px 16px rgba(255,255,255,0.1)',
      };
    }
    // dark
    return {
      background: 'rgba(5, 5, 5, 0.85)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: '#ffffff',
      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
    };
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{
        x: springX,
        y: springY,
        ...getButtonStyles(),
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{
        scale: 1.04,
        borderColor: buttonType === 'gold' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.25)',
      }}
      whileTap={{ scale: 0.96 }}
      onClick={() => {
        trackHeroEvent('CTA Clicked', { href });
      }}
      className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] px-7 py-3.5 rounded-full transition-all duration-300 cursor-pointer"
    >
      {children}
    </motion.a>
  );
}

export default function HeroContent({ stage }: { stage: number }) {
  const { campaigns, activeIndex } = useHero();
  const activeCampaign = campaigns[activeIndex];

  if (!activeCampaign) return null;

  const headline = activeCampaign.title;
  const subtitle = activeCampaign.subtitle;
  const tagline = activeCampaign.tagline;

  const headlineLines = headline.split(/\n/).filter(Boolean);
  const accentColor = activeCampaign.theme.accent;
  const textTheme = activeCampaign.theme.text;
  const buttonStyle = activeCampaign.theme.button;

  // SEO rules check: First campaign slide (index 0) outputs semantic h1 & h2 structures
  const isFirstSlide = activeIndex === 0;

  return (
    <div className="relative z-[20] flex flex-col min-h-[100svh] px-5 pt-24 pb-6 md:px-10 lg:px-14 xl:px-20 select-none">
      <div className="flex-1 flex flex-col lg:flex-row lg:items-center">
        {/* LEFT Column: Typography overlays */}
        <div className="lg:w-[42%] xl:w-[40%] flex-shrink-0 pt-4 md:pt-8 lg:pt-0 lg:pr-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCampaign.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {/* Brand tag line / tagline */}
              <div className="flex items-center gap-3 mb-7 md:mb-8">
                <div className="relative overflow-hidden">
                  <span className="block text-[9px] font-black uppercase tracking-[0.55em] text-white/70">
                    {tagline}
                  </span>
                </div>
                <div
                  className="h-px w-9"
                  style={{
                    background: `linear-gradient(90deg, ${accentColor}80, transparent)`,
                  }}
                />
                <span className="text-[8px] uppercase tracking-[0.3em] text-white/20">
                  Since 2026
                </span>
              </div>

              {/* Headline */}
              <div className="overflow-hidden" style={{ lineHeight: 0.86 }}>
                {headlineLines.map((line, i) => (
                  <div key={i} className="overflow-hidden mb-1" style={{ lineHeight: 0.86 }}>
                    <motion.div
                      custom={i}
                      variants={wordCropVariants}
                      initial="initial"
                      animate="animate"
                    >
                      {isFirstSlide ? (
                        i === 0 ? (
                          <h1
                            className="font-black uppercase text-white leading-[0.86]"
                            style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.2rem)', letterSpacing: '-0.025em' }}
                          >
                            {line}
                          </h1>
                        ) : (
                          <h2
                            className="font-black uppercase text-white leading-[0.86]"
                            style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.2rem)', letterSpacing: '-0.025em' }}
                          >
                            {line}
                          </h2>
                        )
                      ) : (
                        <h2
                          className="font-black uppercase text-white leading-[0.86]"
                          style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.2rem)', letterSpacing: '-0.025em' }}
                        >
                          {line}
                        </h2>
                      )}
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* Accent Line */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.85, delay: 0.55, ease: EASE }}
                style={{ originX: 0 }}
                className="mt-4 h-[1.5px] w-14"
              >
                <div
                  className="w-full h-full"
                  style={{
                    background: `linear-gradient(90deg, ${accentColor}, transparent)`,
                  }}
                />
              </motion.div>

              {/* Subtitle / Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.52, ease: EASE }}
                className="mt-6 mb-9 text-[13px] md:text-[14px] leading-relaxed max-w-[360px]"
                style={{
                  color: textTheme === 'light' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.3)',
                  fontWeight: 300,
                }}
              >
                {subtitle}
              </motion.p>

              {/* Call to Actions */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.65, ease: EASE }}
                className="flex flex-wrap gap-3"
              >
                <MagneticButton href={activeCampaign.ctaLink} accent={accentColor} buttonType={buttonStyle}>
                  {activeCampaign.cta}
                  <ArrowUpRight size={12} strokeWidth={2.5} />
                </MagneticButton>

                {activeCampaign.secondaryCta && (
                  <Link
                    href={activeCampaign.ctaLink}
                    className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] px-7 py-3.5 rounded-full bg-white/5 border border-white/8 backdrop-blur-md text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                    onClick={() => {
                      trackHeroEvent('Secondary CTA Clicked', { link: activeCampaign.ctaLink });
                    }}
                  >
                    {activeCampaign.secondaryCta}
                    <ArrowUpRight size={12} strokeWidth={2.5} />
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Center column spacer */}
        <div className="hidden lg:flex lg:flex-1" aria-hidden="true" />

        {/* Right column placeholder for future additions / styling cards */}
        <div className="hidden lg:block lg:w-[25%] xl:w-[23%]" />
      </div>

      {/* BOTTOM ROW: Scroll indicators & Trust badges */}
      <motion.div
        className="flex items-center justify-between gap-6 pt-6 w-full"
        initial={{ opacity: 0 }}
        animate={stage >= 6 ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {/* Scroll Indicator */}
        <div className="flex items-center gap-2.5">
          <motion.div
            className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }}
            onClick={() => {
              const el = document.getElementById('new-drop');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <ChevronDown size={12} style={{ color: 'rgba(255,255,255,0.22)' }} />
          </motion.div>
          <span className="text-[8px] uppercase tracking-[0.35em]" style={{ color: 'rgba(255,255,255,0.18)' }}>
            SCROLL
          </span>
        </div>

        {/* Truststrip panel */}
        <div className="flex items-center gap-5 md:gap-6 overflow-x-auto hide-scrollbar bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 md:px-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] mx-auto lg:mx-0">
          {TRUST_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-2 flex-shrink-0">
                <Icon size={10} style={{ color: accentColor }} />
                <span
                  className="text-[8px] md:text-[9px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: 'rgba(255,255,255,0.48)' }}
                >
                  {item.label}
                </span>
                {idx < TRUST_ITEMS.length - 1 && (
                  <div className="hidden md:block w-[1px] h-3 bg-white/10 ml-3 md:ml-4" />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
