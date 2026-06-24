'use client';

import { useEffect, useState } from 'react';
import Lenis from 'lenis';

export default function SmoothScrollProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // Wait until React has fully hydrated before initializing Lenis.
    // This prevents the "removeChild" hydration mismatch error.
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        let lenis: Lenis | null = null;

        // Defer Lenis init by one tick so React finishes committing the DOM first
        const timer = setTimeout(() => {
            try {
                lenis = new Lenis({
                    duration: 1.4,
                    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smoothWheel: true,
                    wheelMultiplier: 0.8,
                    touchMultiplier: 1.5,
                    infinite: false,
                });

                let rafId: number;
                function raf(time: number) {
                    lenis!.raf(time);
                    rafId = requestAnimationFrame(raf);
                }
                rafId = requestAnimationFrame(raf);

                // Expose lenis globally for GSAP ScrollTrigger sync
                (window as any).__lenis = lenis;

                // Cleanup stored in closure
                (lenis as any).__cleanup = () => {
                    cancelAnimationFrame(rafId);
                };
            } catch (e) {
                // Silently fail — smooth scroll is a progressive enhancement
                console.warn('[Lenis] init failed:', e);
            }
        }, 0);

        return () => {
            clearTimeout(timer);
            if (lenis) {
                const cleanup = (lenis as any).__cleanup;
                if (cleanup) cleanup();
                lenis.destroy();
                delete (window as any).__lenis;
            }
        };
    }, [mounted]);

    return <>{children}</>;
}
