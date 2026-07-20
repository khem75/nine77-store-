'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

interface LogoProps {
  variant?: 'navbar' | 'footer' | 'about' | 'drawer' | 'admin';
  scrolled?: boolean;
  showSublabel?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Logo({
  variant = 'navbar',
  scrolled = false,
  showSublabel = true,
  className = '',
  onClick,
}: LogoProps) {
  const shouldReduceMotion = useReducedMotion();

  // Ultra-refined luxury editorial logo dimensions — minimal, understated, high-fashion proportions
  const getVariantStyles = () => {
    switch (variant) {
      case 'navbar':
        return {
          container: `flex flex-col items-center justify-center text-center group cursor-pointer transition-all duration-300 ${
            scrolled ? 'py-0.5' : 'py-1'
          }`,
          mainTextClass: scrolled
            ? 'text-[7.5px] sm:text-[8px] md:text-[8.5px] tracking-[0.28em]'
            : 'text-[8.5px] sm:text-[9px] md:text-[9.5px] tracking-[0.32em]',
          subtextClass: scrolled
            ? 'text-[4.5px] sm:text-[5px] tracking-[0.2em] mt-[1px] opacity-70'
            : 'text-[5px] sm:text-[5.5px] tracking-[0.22em] mt-[1px] opacity-75',
        };
      case 'footer':
        return {
          container: 'flex flex-col items-start text-left group cursor-pointer py-0.5',
          mainTextClass: 'text-[13px] sm:text-[15px] md:text-[16px] tracking-[0.28em]',
          subtextClass: 'text-[6px] sm:text-[6.5px] tracking-[0.22em] mt-0.5 opacity-75',
        };
      case 'drawer':
        return {
          container: 'flex flex-col items-start text-left group cursor-pointer',
          mainTextClass: 'text-[9.5px] sm:text-[10px] tracking-[0.32em]',
          subtextClass: 'text-[5.5px] tracking-[0.22em] mt-[1px] opacity-75',
        };
      case 'about':
        return {
          container: 'flex flex-col items-start text-left group cursor-pointer max-w-[120px]',
          mainTextClass: 'text-[9.5px] sm:text-[10px] md:text-[11px] tracking-[0.3em]',
          subtextClass: 'text-[5.5px] sm:text-[6px] tracking-[0.2em] mt-[1px] opacity-75',
        };
      case 'admin':
        return {
          container: 'flex flex-col items-start text-left group cursor-pointer',
          mainTextClass: 'text-[9px] font-black uppercase tracking-[0.28em]',
          subtextClass: 'text-[5.5px] tracking-[0.2em] mt-[1px] opacity-75',
        };
      default:
        return {
          container: 'flex flex-col items-center text-center group cursor-pointer',
          mainTextClass: 'text-[10px] tracking-[0.5em]',
          subtextClass: 'text-[6px] tracking-[0.38em] mt-0.5',
        };
    }
  };

  const { container, mainTextClass, subtextClass } = getVariantStyles();

  const content = (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { scale: 1.015 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`${container} ${className}`}
    >
      {/* Primary Brand Typography */}
      <span
        className={`font-black uppercase leading-none text-primary transition-all duration-300 group-hover:text-gold ${mainTextClass}`}
      >
        N I N E{' '}
        <span className="text-gold transition-colors duration-300 group-hover:text-gold-light">
          7 7
        </span>
      </span>

      {/* Sublabel */}
      {showSublabel && (
        <span
          className={`font-bold uppercase leading-none text-secondary/70 transition-colors duration-300 group-hover:text-primary select-none ${subtextClass}`}
        >
          PREMIUM STREETWEAR
        </span>
      )}
    </motion.div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded-sm"
        aria-label="NINE77 — Home"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href="/"
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded-sm inline-block"
      aria-label="NINE77 — Home"
    >
      {content}
    </Link>
  );
}
