'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export default function SmoothScrollProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const lenisRef = useRef<Lenis | null>(null);
    const rafIdRef = useRef<number | null>(null);
    // Track whether this is the very first mount (hydration phase)
    const isFirstMount = useRef(true);

    useEffect(() => {
        // ── Cleanup any running instance ──────────────────────
        if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
        }
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
        // On first mount this also acts as the hydration guard.
        const timer = setTimeout(() => {
            isFirstMount.current = false;
            try {
                const lenis = new Lenis({
                    duration: 1.4,
                    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smoothWheel: true,
                    wheelMultiplier: 0.8,
                    touchMultiplier: 1.5,
                    infinite: false,
                });

                function raf(time: number) {
                    lenis.raf(time);
                    rafIdRef.current = requestAnimationFrame(raf);
                }
                rafIdRef.current = requestAnimationFrame(raf);

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
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
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
