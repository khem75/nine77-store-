'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  AnimatePresence,
} from 'framer-motion';
import { ArrowUpRight, Truck, ShieldCheck, Lock, MessageCircle } from 'lucide-react';
import { useHero } from './hooks/useHero';
import { trackHeroEvent } from './hooks/useAnalytics';
import {
  EASE,
  SPRING_BUTTON,
  titleLineVariants,
  outlinedTextVariants,
  badgeVariants,
  descVariants,
  buttonGroupVariants,
  scrollIndicatorVariants,
  brandMarkVariants,
} from './HeroAnimations';

/* ─── Trust strip items ──────────────────────────────────── */
const TRUST_ITEMS = [
  { label: 'FREE SHIPPING', icon: Truck },
  { label: 'PREMIUM QUALITY', icon: ShieldCheck },
  { label: 'SECURE CHECKOUT', icon: Lock },
  { label: 'WHATSAPP SUPPORT', icon: MessageCircle },
] as const;

/* ─── Social proof badges ────────────────────────────────── */
const SOCIAL_PROOF = [
  '25+ Limited Drops',
  'Premium Cotton',
  'Fast Shipping',
  'Everyday Luxury',
] as const;

/* ─── Magnetic Spring CTA button (stiffness: 260, damping: 20) ─── */
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
  const springX = useSpring(mx, { stiffness: 260, damping: 20 });
  const springY = useSpring(my, { stiffness: 260, damping: 20 });

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    if (Math.hypot(dx, dy) < 100) {
      mx.set(dx * 0.25);
      my.set(dy * 0.25);
    }
  }, [mx, my]);

  const onMouseLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  const getStyle = (): React.CSSProperties => {
    if (buttonType === 'gold') {
      return {
        background: `linear-gradient(135deg, #8B6A3E 0%, #A5804F 50%, #8B6A3E 100%)`,
        backgroundSize: '200% 100%',
        border: '1px solid rgba(255,255,255,0.12)',
        color: '#FFFFFF',
        boxShadow: '0 4px 20px rgba(139,106,62,0.28), inset 0 1px 0 rgba(255,255,255,0.15)',
      };
    }
    if (buttonType === 'white') {
      return {
        background: '#FFFFFF',
        border: '1px solid rgba(255,255,255,0.2)',
        color: '#111111',
        boxShadow: '0 4px 16px rgba(255,255,255,0.12)',
      };
    }
    return {
      background: 'rgba(5,5,5,0.85)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: '#FFFFFF',
    };
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY, ...getStyle() }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{
        scale: 1.03,
        y: -2,
        boxShadow:
          buttonType === 'gold'
            ? '0 8px 32px rgba(139,106,62,0.42), inset 0 1px 0 rgba(255,255,255,0.18)'
            : '0 8px 24px rgba(255,255,255,0.14)',
      }}
      whileTap={{ scale: 0.97 }}
      transition={SPRING_BUTTON}
      onClick={() => trackHeroEvent('CTA Clicked', { href })}
      className="inline-flex w-full sm:w-auto min-h-[44px] justify-center items-center gap-2.5 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.22em] px-6 sm:px-7 py-3.5 rounded-[12px] transition-all duration-200 cursor-pointer whitespace-nowrap"
    >
      {children}
    </motion.a>
  );
}

/* ─── Glass secondary button ─────────────────────────────── */
function GlassButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      whileHover={{
        scale: 1.03,
        y: -2,
        backgroundColor: 'rgba(255,255,255,0.10)',
        borderColor: 'rgba(255,255,255,0.22)',
      }}
      whileTap={{ scale: 0.97 }}
      transition={SPRING_BUTTON}
      className="inline-flex w-full sm:w-auto min-h-[44px] justify-center items-center gap-2.5 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.22em] px-6 sm:px-7 py-3.5 rounded-[12px] text-white/70 hover:text-white transition-colors duration-200 cursor-pointer whitespace-nowrap"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.10)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {children}
    </motion.a>
  );
}

/* ─── Main HeroContent component ─────────────────────────── */
export default function HeroContent({ stage }: { stage: number }) {
  const { campaigns, activeIndex } = useHero();
  const shouldReduceMotion = useReducedMotion();
  const activeCampaign = campaigns[activeIndex];

  // ── Mouse parallax for headline ──────────────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const parallaxX = useSpring(mouseX, { stiffness: 55, damping: 22 });
  const parallaxY = useSpring(mouseY, { stiffness: 55, damping: 22 });

  useEffect(() => {
    if (shouldReduceMotion) return;
    const handle = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set(((e.clientX - cx) / cx) * 5);
      mouseY.set(((e.clientY - cy) / cy) * 5);
    };
    window.addEventListener('mousemove', handle, { passive: true });
    return () => window.removeEventListener('mousemove', handle);
  }, [mouseX, mouseY, shouldReduceMotion]);

  if (!activeCampaign) return null;

  const headline     = activeCampaign.title;
  const subtitle     = activeCampaign.subtitle;
  const tagline      = activeCampaign.tagline;
  const accentColor  = activeCampaign.theme.accent;
  const buttonStyle  = activeCampaign.theme.button;
  const isFirstSlide = activeIndex === 0;

  // Split headline into lines using \n
  const headlineLines = headline.split(/\n/).filter(Boolean);

  const scrollToNext = () => {
    const el = document.getElementById('new-drop');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="relative z-[20] flex flex-col h-full min-h-[100dvh] max-h-[100dvh] overflow-hidden select-none"
      role="main"
    >
      {/* ─── CONTENT WRAPPER ──────────────────────────── */}
      <div className="flex flex-1 flex-col px-5 md:px-10 lg:px-16 xl:px-24">

        {/* Navbar spacer */}
        <div className="h-20 md:h-[88px] lg:h-[96px] flex-shrink-0" />

        {/* ── BRAND MARK — centered, subtle ──────────── */}
        <motion.div
          variants={brandMarkVariants}
          initial="initial"
          animate="animate"
          className="flex justify-center items-center mb-8 lg:mb-12"
          aria-hidden="true"
        >
          <div className="flex items-center gap-3">
            <div
              className="h-px w-8"
              style={{ background: `linear-gradient(to right, transparent, rgba(255,255,255,0.18))` }}
            />
            <span
              className="text-[9px] font-black uppercase tracking-[0.6em]"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              NINE77
            </span>
            <span
              className="text-[8px] font-bold"
              style={{ color: accentColor, opacity: 0.65 }}
            >
              ◆
            </span>
            <span
              className="text-[9px] font-light uppercase tracking-[0.45em]"
              style={{ color: 'rgba(255,255,255,0.22)' }}
            >
              PREMIUM STREETWEAR
            </span>
            <div
              className="h-px w-8"
              style={{ background: `linear-gradient(to left, transparent, rgba(255,255,255,0.18))` }}
            />
          </div>
        </motion.div>

        {/* ── EDITORIAL CONTENT — 100ms staggered ───────────── */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCampaign.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <motion.div
                style={{
                  x: shouldReduceMotion ? 0 : parallaxX,
                  y: shouldReduceMotion ? 0 : parallaxY,
                }}
              >

                {/* 1. Badge / Section label */}
                <motion.div
                  variants={badgeVariants}
                  initial="initial"
                  animate="animate"
                  className="flex items-center gap-4 mb-6 md:mb-8"
                >
                  <span
                    className="text-[9px] font-black uppercase tracking-[0.48em]"
                    style={{ color: accentColor }}
                  >
                    {tagline}
                  </span>
                  <motion.div
                    className="h-px"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 36, opacity: 1 }}
                    transition={{ duration: 0.85, delay: 0.2, ease: EASE }}
                    style={{
                      background: `linear-gradient(to right, ${accentColor}, transparent)`,
                    }}
                  />
                </motion.div>

                {/* 2. Main Heading — clamp(3rem, 8vw, 8rem) */}
                <div className="overflow-visible mb-1" aria-label={`${headlineLines.join(' ')} — New Standard`}>
                  {headlineLines.map((line, i) => (
                    <div
                      key={i}
                      className="overflow-hidden"
                      style={{ lineHeight: 0.95 }}
                    >
                      <motion.div
                        custom={i}
                        variants={titleLineVariants}
                        initial="initial"
                        animate="animate"
                      >
                        {isFirstSlide && i === 0 ? (
                          <h1
                            className="font-black uppercase text-white tracking-tight"
                            style={{
                              fontSize: 'clamp(3rem, 8vw, 8rem)',
                              letterSpacing: '-0.02em',
                              lineHeight: 0.95,
                            }}
                          >
                            {line}
                          </h1>
                        ) : (
                          <p
                            className="font-black uppercase text-white tracking-tight"
                            style={{
                              fontSize: 'clamp(3rem, 8vw, 8rem)',
                              letterSpacing: '-0.02em',
                              lineHeight: 0.95,
                            }}
                          >
                            {line}
                          </p>
                        )}
                      </motion.div>
                    </div>
                  ))}

                  {/* Outlined headline */}
                  <div className="overflow-hidden mt-1" style={{ lineHeight: 0.95 }}>
                    <motion.div
                      variants={outlinedTextVariants}
                      initial="initial"
                      animate="animate"
                    >
                      <p
                        className="font-black uppercase"
                        style={{
                          fontSize: 'clamp(3rem, 8vw, 8rem)',
                          letterSpacing: '-0.02em',
                          lineHeight: 0.95,
                          WebkitTextStroke: `1.5px ${accentColor}`,
                          color: 'transparent',
                        }}
                        aria-hidden="true"
                      >
                        NEW STANDARD
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Accent line */}
                <motion.div
                  className="mt-6"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.85, delay: 0.35, ease: EASE }}
                  style={{ transformOrigin: 'left center' }}
                >
                  <div
                    className="h-[1.5px] w-14"
                    style={{ background: `linear-gradient(to right, ${accentColor}, transparent)` }}
                  />
                </motion.div>

                {/* 3. Description — clamp(.95rem, 2vw, 1.1rem) with line-height 1.8 */}
                <motion.p
                  variants={descVariants}
                  initial="initial"
                  animate="animate"
                  className="mt-6 font-light"
                  style={{
                    fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                    lineHeight: 1.8,
                    color: 'rgba(255,255,255,0.50)',
                    maxWidth: '440px',
                  }}
                >
                  {subtitle}
                </motion.p>

                {/* 4. Spring Buttons */}
                <motion.div
                  variants={buttonGroupVariants}
                  initial="initial"
                  animate="animate"
                  className="mt-6 md:mt-8 flex flex-wrap gap-3 z-10"
                >
                  <MagneticButton
                    href={activeCampaign.ctaLink}
                    accent={accentColor}
                    buttonType={buttonStyle}
                  >
                    {activeCampaign.cta}
                    <ArrowUpRight size={13} strokeWidth={2.5} />
                  </MagneticButton>

                  {activeCampaign.secondaryCta && (
                    <GlassButton href="/shop">
                      {activeCampaign.secondaryCta}
                      <ArrowUpRight size={13} strokeWidth={2.5} />
                    </GlassButton>
                  )}
                </motion.div>

                {/* 5. Trust Strip — Inline to avoid CTA button overlap */}
                <motion.div
                  variants={scrollIndicatorVariants}
                  initial="initial"
                  animate={stage >= 6 ? 'animate' : 'initial'}
                  className="mt-6 flex flex-wrap items-center"
                >
                  <div
                    className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-5 rounded-full px-4 py-2"
                    style={{
                      background: 'rgba(0,0,0,0.45)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    }}
                  >
                    {TRUST_ITEMS.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="flex items-center gap-2 flex-shrink-0">
                          <Icon
                            size={10}
                            style={{ color: activeCampaign?.theme.accent || '#8B6A3E' }}
                            aria-hidden="true"
                          />
                          <span
                            className="text-[8px] font-semibold uppercase tracking-[0.2em]"
                            style={{ color: 'rgba(255,255,255,0.55)' }}
                          >
                            {item.label}
                          </span>
                          {idx < TRUST_ITEMS.length - 1 && (
                            <div
                              className="hidden sm:block w-px h-3 ml-2 md:ml-3"
                              style={{ background: 'rgba(255,255,255,0.12)' }}
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* 6. Bottom Metadata */}
                <motion.div
                  className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
                >
                  {SOCIAL_PROOF.map((item, i) => (
                    <div key={item} className="flex items-center gap-2">
                      {i > 0 && (
                        <span
                          className="text-[7px]"
                          style={{ color: accentColor, opacity: 0.45 }}
                          aria-hidden="true"
                        >
                          ◆
                        </span>
                      )}
                      <span
                        className="text-[9px] font-bold uppercase tracking-[0.22em]"
                        style={{ color: 'rgba(255,255,255,0.30)' }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom spacer */}
        <div className="h-12 md:h-16 flex-shrink-0" />
      </div>

      {/* ─── SCROLL INDICATOR ────────────────────────── */}
      <motion.div
        variants={scrollIndicatorVariants}
        initial="initial"
        animate={stage >= 6 ? 'animate' : 'initial'}
        className="absolute bottom-8 right-6 lg:right-8 hidden md:flex flex-col items-center gap-3 cursor-pointer group"
        onClick={scrollToNext}
        role="button"
        aria-label="Scroll to next section"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && scrollToNext()}
      >
        <span
          className="text-[8px] font-bold uppercase"
          style={{
            color: 'rgba(255,255,255,0.22)',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            letterSpacing: '0.42em',
            transition: 'color 0.3s ease',
          }}
        >
          SCROLL TO DISCOVER
        </span>

        <div
          className="relative flex items-start justify-center overflow-hidden rounded-full transition-all duration-300 group-hover:border-white/35"
          style={{
            width: '22px',
            height: '36px',
            border: '1.5px solid rgba(255,255,255,0.22)',
            paddingTop: '6px',
          }}
        >
          <motion.div
            className="rounded-full"
            style={{
              width: '2px',
              height: '8px',
              background: `linear-gradient(to bottom, ${activeCampaign?.theme.accent || '#8B6A3E'}, transparent)`,
            }}
            animate={{ y: [0, 14, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div
          className="w-px h-6"
          style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)' }}
          aria-hidden="true"
        />
      </motion.div>
    </div>
  );
}
