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

// Framer Motion headline word-crop animations
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

// Generic slide elements fade-in
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
