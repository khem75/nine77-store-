'use client';

import { useRef, useCallback } from 'react';

export function useParallax() {
  const mouseRef = useRef({ x: 0, y: 0 });

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    
    // Scale coordinate values between -1 and 1
    mouseRef.current = {
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    };
  }, []);

  return { mouseRef, onMouseMove };
}
