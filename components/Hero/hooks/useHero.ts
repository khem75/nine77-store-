'use client';

import { useContext } from 'react';
import { HeroContext } from '../HeroProvider';

export function useHero() {
  const context = useContext(HeroContext);
  if (!context) {
    throw new Error('useHero must be used within a HeroProvider');
  }
  return context;
}
