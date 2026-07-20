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

  // Precision optical sizing and height constraints for luxury editorial balance
  const getVariantStyles = () => {
    switch (variant) {
      case 'navbar':
        return {
          container: `flex flex-col items-center justify-center text-center group cursor-pointer transition-all duration-300 h-[28px] sm:h-[32px] md:h-[34px] lg:h-[38px] xl:h-[40px] my-auto select-none ${
            scrolled ? 'scale-[0.92]' : 'scale-100'
          }`,
          mainTextClass: scrolled
            ? 'text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] tracking-[0.34em]'
            : 'text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] tracking-[0.36em]',
          subtextClass: scrolled
            ? 'text-[4.5px] sm:text-[5px] md:text-[5.5px] tracking-[0.24em] mt-[1.5px] opacity-75'
            : 'text-[5px] sm:text-[5.5px] md:text-[6px] tracking-[0.26em] mt-[2px] opacity-80',
        };
      case 'footer':
        return {
          container: 'flex flex-col items-start text-left group cursor-pointer py-1 select-none',
          mainTextClass: 'text-[14px] sm:text-[16px] md:text-[18px] tracking-[0.32em]',
          subtextClass: 'text-[6px] sm:text-[7px] tracking-[0.26em] mt-1 opacity-75',
        };
      case 'drawer':
        return {
          container: 'flex flex-col items-start text-left group cursor-pointer select-none py-1',
          mainTextClass: 'text-[12px] sm:text-[13px] tracking-[0.34em]',
          subtextClass: 'text-[5.5px] sm:text-[6px] tracking-[0.24em] mt-[1.5px] opacity-75',
        };
      case 'about':
        return {
          container: 'flex flex-col items-start text-left group cursor-pointer max-w-[130px] select-none',
          mainTextClass: 'text-[12px] sm:text-[13px] md:text-[14px] tracking-[0.32em]',
          subtextClass: 'text-[6px] tracking-[0.24em] mt-[1px] opacity-75',
        };
      case 'admin':
        return {
          container: 'flex flex-col items-start text-left group cursor-pointer select-none',
          mainTextClass: 'text-[11px] font-black uppercase tracking-[0.3em]',
          subtextClass: 'text-[5.5px] tracking-[0.22em] mt-[1px] opacity-75',
        };
      default:
        return {
          container: 'flex flex-col items-center text-center group cursor-pointer select-none',
          mainTextClass: 'text-[12px] tracking-[0.4em]',
          subtextClass: 'text-[6px] tracking-[0.32em] mt-0.5',
        };
    }
  };

  const { container, mainTextClass, subtextClass } = getVariantStyles();

  const content = (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { scale: 1.015 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={`${container} ${className}`}
    >
      {/* Primary Brand Typography */}
      <span
        className={`font-black uppercase leading-none text-primary transition-colors duration-200 group-hover:text-gold ${mainTextClass}`}
      >
        N I N E{' '}
        <span className="text-gold transition-colors duration-200 group-hover:text-gold-light">
          7 7
        </span>
      </span>

      {/* Sublabel */}
      {showSublabel && (
        <span
          className={`font-bold uppercase leading-none text-secondary/80 transition-colors duration-200 group-hover:text-primary ${subtextClass}`}
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
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded-sm inline-flex items-center justify-center"
        aria-label="NINE77 — Home"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href="/"
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded-sm inline-flex items-center justify-center"
      aria-label="NINE77 — Home"
    >
      {content}
    </Link>
  );
}
