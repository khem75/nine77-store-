'use client';

import { useRef, useEffect, useLayoutEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const LOOKBOOK_ITEMS = [
    {
        id: 1,
        src: '/products/vintage-t-shirt-1.jpg',
        label: 'Vintage Collection',
        sub: 'The Classic Edit',
        category: 'Tops',
    },
    {
        id: 2,
        src: '/products/barrel-pants-1.jpg',
        label: 'Barrel Silhouette',
        sub: 'Modern Luxury',
        category: 'Pants',
    },
    {
        id: 3,
        src: '/products/linen-shirt-1.jpg',
        label: 'Linen Series',
        sub: 'Summer Editorial',
        category: 'Tops',
    },
    {
        id: 4,
        src: '/products/windcheater-1.jpg',
        label: 'Windcheater',
        sub: 'Statement Outerwear',
        category: 'Outerwear',
    },
    {
        id: 5,
        src: '/products/linen-trousers-1.jpg',
        label: 'Linen Trousers',
        sub: 'Refined Bottoms',
        category: 'Pants',
    },
    {
        id: 6,
        src: '/products/vintage-t-shirt-2.jpg',
        label: 'Campaign 002',
        sub: 'The Bold Look',
        category: 'Tops',
    },
];

export default function LookbookHorizontal() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(headerRef, { once: true, amount: 0.5 });
    // Keep refs to GSAP context + matchMedia so we can kill them on unmount
    const ctxRef = useRef<gsap.Context | null>(null);
    const mmRef = useRef<gsap.MatchMedia | null>(null);

    // ── SYNCHRONOUS cleanup via useLayoutEffect ────────────────────────────
    // useLayoutEffect's cleanup fires synchronously in React's commit phase,
    // BEFORE any DOM nodes are removed. This guarantees GSAP un-pins the
    // section and restores it to its original parent before React's
    // removeChild runs — eliminating the "not a child of this node" crash.
    useLayoutEffect(() => {
        return () => {
            // Kill every ScrollTrigger — including pinned ones — immediately.
            ScrollTrigger.getAll().forEach((t) => t.kill(true));

            if (ctxRef.current) {
                ctxRef.current.revert();
                ctxRef.current = null;
            }
            if (mmRef.current) {
                mmRef.current.revert();
                mmRef.current = null;
            }
        };
    }, []); // empty deps → cleanup only runs on unmount

    // ── GSAP setup (runs after paint, as GSAP recommends) ─────────────────
    useEffect(() => {
        const section = sectionRef.current;
        const track = trackRef.current;
        if (!section || !track) return;

        const cards = Array.from(track.querySelectorAll('.lookbook-card'));

        const mm = gsap.matchMedia();
        mmRef.current = mm;

        mm.add('(min-width: 768px)', () => {
            const totalWidth = track.scrollWidth - window.innerWidth;

            const ctx = gsap.context(() => {
                gsap.to(track, {
                    x: -totalWidth,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top top',
                        end: () => `+=${totalWidth}`,
                        pin: true,
                        scrub: 1,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                });

                // Card stagger reveal
                cards.forEach((card, i) => {
                    gsap.fromTo(
                        card,
                        { opacity: 0, y: 40, scale: 0.94 },
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.8,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: section,
                                start: `top+=${i * 80} top`,
                                toggleActions: 'play none none none',
                                scrub: false,
                            },
                        }
                    );
                });
            }, section);

            ctxRef.current = ctx;
        });

        // No cleanup here — useLayoutEffect above handles it synchronously
    }, []);

    return (
        <div ref={sectionRef} className="relative overflow-hidden border-t border-white/5 bg-background">
            {/* Section header */}
            <div ref={headerRef} className="relative z-10 px-6 py-16 text-center lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-3"
                >
                    <span className="text-[10px] uppercase tracking-[0.45em] text-gold">
                        NINE77 Lookbook
                    </span>
                    <h2 className="text-3xl font-black uppercase leading-[0.92] text-white sm:text-5xl">
                        The Edit.
                    </h2>
                    <p className="text-sm text-white/45">
                        Scroll to explore the campaign →
                    </p>
                </motion.div>
            </div>

            {/* Horizontal track */}
            <div 
                ref={trackRef} 
                className="flex gap-5 px-6 pb-16 overflow-x-auto hide-scrollbar md:flex-nowrap lg:px-8"
                style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}
            >
                {LOOKBOOK_ITEMS.map((item, i) => (
                    <motion.article
                        key={item.id}
                        className="lookbook-card group relative shrink-0 overflow-hidden rounded-[28px] border border-white/8 bg-background-2"
                        style={{
                            width: 'clamp(260px, 70vw, 320px)',
                            height: 'clamp(360px, 90vw, 480px)',
                            scrollSnapAlign: 'start',
                        }}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Image */}
                        <div className="absolute inset-0 overflow-hidden">
                            <Image
                                src={item.src}
                                alt={item.label}
                                fill
                                className="object-cover transition-all duration-700 group-hover:scale-105"
                                sizes="320px"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        </div>

                        {/* Number watermark */}
                        <div className="absolute left-5 top-5 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                            {String(i + 1).padStart(2, '0')}
                        </div>

                        {/* Category pill */}
                        <div className="absolute right-5 top-5">
                            <span className="rounded-full bg-black/60 px-3 py-1 text-[9px] uppercase tracking-[0.3em] text-white/70 backdrop-blur-sm">
                                {item.category}
                            </span>
                        </div>

                        {/* Bottom info */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                            <p className="text-[9px] uppercase tracking-[0.35em] text-gold">{item.sub}</p>
                            <h3 className="mt-1 text-xl font-black uppercase tracking-tight text-white">
                                {item.label}
                            </h3>
                            <Link
                                href="/shop"
                                className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60 opacity-0 transition-all duration-400 group-hover:opacity-100 hover:text-gold"
                            >
                                Shop Now →
                            </Link>
                        </div>
                    </motion.article>
                ))}
            </div>
        </div>
    );
}
