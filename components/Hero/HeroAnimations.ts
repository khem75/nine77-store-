// ============================================================
// NINE77 — Master Luxury Editorial Motion Settings
// ============================================================

export const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
export const EASE_IN_OUT = [0.42, 0, 0.58, 1] as [number, number, number, number];

export const SPRING_BUTTON = {
  type: 'spring',
  stiffness: 260,
  damping: 20,
};

// Master Editorial Slide Transitions
// Enter: opacity 0->1, scale 1.12->1.05, y 10->0, duration 1.2s, easeInOut
// Exit: opacity 1->0, scale 1.05->1.08, duration 1.2s, easeInOut
export const masterSlideVariants = {
  enter: {
    opacity: 0,
    scale: 1.12,
    y: 10,
  },
  center: {
    opacity: 1,
    scale: 1.05,
    y: 0,
    transition: {
      duration: 1.2,
      ease: EASE_IN_OUT,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.08,
    transition: {
      duration: 1.2,
      ease: EASE_IN_OUT,
    },
  },
};

// Reduced motion fallback variant
export const reducedMotionSlideVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.4 } },
};

// Legacy slide variants preserved for backward compatibility
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

// 100ms Staggered Text Animations (Badge -> Heading -> Description -> Buttons -> Metadata)
export const textStaggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const badgeVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export const titleLineVariants = {
  initial: { y: '112%', opacity: 0, filter: 'blur(10px)' },
  animate: (i: number) => ({
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.0,
      delay: 0.08 + i * 0.1,
      ease: EASE,
    },
  }),
};

export const outlinedTextVariants = {
  initial: { y: '112%', opacity: 0, filter: 'blur(8px)' },
  animate: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.0, delay: 0.3, ease: EASE },
  },
};

export const descVariants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.4, ease: EASE },
  },
};

export const buttonGroupVariants = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: 0.5, ease: EASE },
  },
};

export const scrollIndicatorVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.7, delay: 0.6, ease: EASE },
  },
};

export const brandMarkVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 1.0, delay: 0.05, ease: EASE },
  },
};
