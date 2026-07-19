// ============================================================
// NINE77 — Hero Motion and Transitions Settings
// ============================================================

export const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export const TRANSITION_CONFIGS = {
  duration: 0.95,
  ease: EASE,
};

// Framer Motion variant overrides for slide entrance/exits
export const slideVariants = {
  enter: (direction: 'next' | 'prev') => ({
    x: direction === 'next' ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'spring', stiffness: 220, damping: 28 },
      opacity: { duration: 0.7, ease: EASE },
    },
  },
  exit: (direction: 'next' | 'prev') => ({
    x: direction === 'next' ? '-50%' : '50%',
    opacity: 0,
    transition: {
      x: { duration: 0.75, ease: EASE },
      opacity: { duration: 0.6, ease: EASE },
    },
  }),
};

// Framer Motion headline word-crop animations (legacy, preserved)
export const wordCropVariants = {
  initial: { y: '108%', opacity: 0, filter: 'blur(6px)' },
  animate: (i: number) => ({
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.95,
      delay: 0.06 + i * 0.12,
      ease: EASE,
    },
  }),
};

// Generic slide elements fade-in (legacy, preserved)
export const elementFadeVariants = {
  initial: { opacity: 0, y: 12 },
  animate: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: EASE,
    },
  }),
};

// ──────────────────────────────────────────────────────────────
// NEW — Editorial Luxury Variants
// ──────────────────────────────────────────────────────────────

/** Large headline line reveal — clip from bottom, blur fade, staggered per line */
export const titleLineVariants = {
  initial: { y: '112%', opacity: 0, filter: 'blur(10px)' },
  animate: (i: number) => ({
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.0,
      delay: 0.08 + i * 0.14,
      ease: EASE,
    },
  }),
};

/** Outlined "NEW STANDARD" reveal — slides up from slightly below with blur */
export const outlinedTextVariants = {
  initial: { y: '112%', opacity: 0, filter: 'blur(8px)' },
  animate: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.0, delay: 0.42, ease: EASE },
  },
};

/** Section label (DROP 01 · EDITORIAL COLLECTION) fade-in */
export const labelVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: 0.04, ease: EASE },
  },
};

/** Description paragraph reveal */
export const descVariants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.58, ease: EASE },
  },
};

/** CTA button group slides up */
export const buttonGroupVariants = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: 0.72, ease: EASE },
  },
};

/** Scroll indicator, trust strip — delayed fade in after rest of content */
export const scrollIndicatorVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.7, delay: 1.1, ease: EASE },
  },
};

/** Brand mark at top of hero */
export const brandMarkVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 1.2, delay: 0.05, ease: EASE },
  },
};
