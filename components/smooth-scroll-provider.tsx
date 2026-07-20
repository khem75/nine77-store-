'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScrollProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const lenisRef = useRef<Lenis | null>(null);
    // Track whether this is the very first mount (hydration phase)
    const isFirstMount = useRef(true);

    useEffect(() => {
        let updateLenis: ((time: number) => void) | null = null;

        // ── Cleanup any running instance ──────────────────────
        if (lenisRef.current) {
            lenisRef.current.destroy();
            lenisRef.current = null;
            delete (window as any).__lenis;
        }

        // Only scroll to top on subsequent navigations, not the initial mount.
        // Calling scrollTo during hydration causes the removeChild DOM error.
        if (!isFirstMount.current) {
            window.scrollTo(0, 0);
        }

        // Defer Lenis init so React fully commits the DOM before we touch it.
        const timer = setTimeout(() => {
            isFirstMount.current = false;
            // Respect prefers-reduced-motion user setting
            const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) return;

            try {
                const lenis = new Lenis({
                    duration: 1.2,
                    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smoothWheel: true,
                    wheelMultiplier: 0.9,
                    touchMultiplier: 1.5,
                    infinite: false,
                });

                // Sync GSAP ScrollTrigger with Lenis scroll updates
                lenis.on('scroll', ScrollTrigger.update);

                // Drive Lenis via GSAP ticker for smoother synchronization
                updateLenis = (time: number) => {
                    lenis.raf(time * 1000);
                };
                gsap.ticker.add(updateLenis);
                gsap.ticker.lagSmoothing(0);

                lenisRef.current = lenis;
                // Expose globally for GSAP ScrollTrigger sync
                (window as any).__lenis = lenis;
            } catch (e) {
                // Smooth scroll is a progressive enhancement — fail silently
                console.warn('[Lenis] init failed:', e);
            }
        }, 0);

        return () => {
            clearTimeout(timer);
            if (updateLenis) {
                gsap.ticker.remove(updateLenis);
            }
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
                delete (window as any).__lenis;
            }
        };
        // Re-run on every route change so Lenis resets cleanly
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return <>{children}</>;
}
