'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const ProductShowcaseScene = dynamic(
    () => import('@/components/product-showcase-scene').then((m) => m.ProductShowcaseScene),
    { ssr: false }
);

export default function ProductShowcase3D() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const canvasY = useTransform(scrollYProgress, [0, 1], [60, -60]);
    const textX = useTransform(scrollYProgress, [0, 1], [-40, 40]);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-background to-background-2 py-20 md:py-32"
        >
            {/* Ambient glow */}
            <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-[100px]" />

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                    {/* Left: text content */}
                    <motion.div
                        style={{ x: textX }}
                        initial={{ opacity: 0, x: -60 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <span className="inline-block text-[10px] uppercase tracking-[0.45em] text-gold">
                                Crafted Differently
                            </span>
                            <h2 className="text-4xl font-black uppercase leading-[0.92] tracking-tight text-white sm:text-5xl lg:text-6xl">
                                Wear the
                                <br />
                                <span className="text-gold-gradient">Statement.</span>
                            </h2>
                            <p className="max-w-sm text-sm leading-relaxed text-white/55">
                                Each NINE77 piece is engineered with precision — premium materials,
                                refined silhouettes, and minimalist branding built for the
                                streets and beyond.
                            </p>
                        </div>

                        {/* Feature points */}
                        <div className="space-y-4">
                            {[
                                { label: 'Premium Materials', desc: 'Selected fabrics for superior comfort and durability' },
                                { label: 'Precision Fit', desc: 'Engineered silhouettes for every body type' },
                                { label: 'Minimal Identity', desc: 'Understated branding that speaks volumes' },
                            ].map(({ label, desc }, i) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                    className="flex items-start gap-4"
                                >
                                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white">
                                            {label}
                                        </p>
                                        <p className="mt-0.5 text-xs text-white/45">{desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <Link
                            href="/shop"
                            className="group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold transition-all duration-300 hover:gap-5"
                        >
                            Explore Full Collection
                            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </motion.div>

                    {/* Right: 3D canvas */}
                    <motion.div
                        style={{ y: canvasY }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative"
                    >
                        {/* Canvas container */}
                        <div className="relative mx-auto aspect-square max-w-[400px] overflow-hidden rounded-[40px] border border-white/8 bg-background-2 shadow-cinematic lg:max-w-none">
                            <ProductShowcaseScene />

                            {/* Scan line effect */}
                            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[40px]">
                                <div className="animate-scan h-[30%] w-full bg-gradient-to-b from-transparent via-gold/4 to-transparent" />
                            </div>

                            {/* Corner accents */}
                            <div className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-gold/40 rounded-tl-lg" />
                            <div className="pointer-events-none absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-gold/40 rounded-tr-lg" />
                            <div className="pointer-events-none absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-gold/40 rounded-bl-lg" />
                            <div className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-gold/40 rounded-br-lg" />
                        </div>

                        {/* Floating label */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="absolute -bottom-4 -right-2 glass-gold rounded-2xl px-4 py-3 sm:-right-4"
                        >
                            <p className="text-[8px] uppercase tracking-[0.35em] text-white/60">Interactive 3D</p>
                            <p className="mt-0.5 text-sm font-bold text-gold">Drag to Explore</p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
