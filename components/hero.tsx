'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Zap } from 'lucide-react';

// Lazy-load the 3D canvas — never runs on the server
const HeroScene = dynamic(
    () => import('@/components/hero-scene').then((m) => m.HeroScene),
    { ssr: false }
);

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
};

export default function Hero() {
    const heroRef = useRef<HTMLElement>(null);
    const isInView = useInView(heroRef, { margin: '0px 0px -100px 0px' });

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });

    const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, -80]), {
        stiffness: 80,
        damping: 30,
    });

    const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const scale3d = useTransform(scrollYProgress, [0, 0.8], [1, 1.15]);
    const textY = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
        <section
            ref={heroRef}
            className="relative flex min-h-[100svh] w-full flex-col overflow-hidden"
        >
            {/* ── 3D Canvas fullscreen background (unmounts off-screen to save GPU resources) ── */}
            <motion.div
                style={{ scale: scale3d, opacity }}
                className="absolute inset-0 z-0"
            >
                {isInView && <HeroScene />}
            </motion.div>


            {/* ── Gradient vignette overlays ── */}
            <div className="pointer-events-none absolute inset-0 z-10">
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-background via-background/60 to-transparent" />
                {/* Top fade */}
                <div className="absolute left-0 right-0 top-0 h-[20%] bg-gradient-to-b from-background/50 to-transparent" />
                {/* Side vignettes */}
                <div className="absolute bottom-0 left-0 top-0 w-[20%] bg-gradient-to-r from-background/40 to-transparent" />
                <div className="absolute bottom-0 right-0 top-0 w-[20%] bg-gradient-to-l from-background/40 to-transparent" />
                {/* Gold tint glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(212,175,55,0.06),transparent)]" />
            </div>

            {/* ── Hero content ── */}
            <motion.div
                style={{ y: textY }}
                className="relative z-20 flex flex-1 flex-col items-center justify-end px-6 pb-28 text-center sm:justify-center sm:pb-16"
            >
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center gap-6"
                >
                    {/* Label */}
                    <motion.div variants={itemVariants}>
                        <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 text-[10px] uppercase tracking-[0.45em] text-gold backdrop-blur-sm">
                            <Zap size={10} className="fill-gold text-gold" />
                            Premium Streetwear · Est. MMXXVI
                        </span>
                    </motion.div>

                    {/* Main heading */}
                    <motion.div variants={itemVariants} className="max-w-[380px] sm:max-w-2xl">
                        <h1 className="text-[clamp(3rem,14vw,7rem)] font-black uppercase leading-[0.9] tracking-[-0.02em] text-white">
                            BUILT
                            <br />
                            <span className="text-gold-gradient">DIFFERENT</span>
                            <span className="text-white">.</span>
                        </h1>
                    </motion.div>

                    {/* Sub copy */}
                    <motion.p
                        variants={itemVariants}
                        className="max-w-xs text-sm font-light leading-relaxed tracking-wide text-white/60 sm:max-w-md sm:text-base"
                    >
                        Luxury streetwear engineered for those who refuse to blend in.
                        Comfort. Craft. Statement.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col items-center gap-3 sm:flex-row"
                    >
                        <Link
                            href="/shop"
                            id="hero-shop-cta"
                            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gold px-8 py-4 text-xs font-bold uppercase tracking-[0.3em] text-black shadow-glow transition-all duration-500 hover:shadow-glow-lg active:scale-95"
                        >
                            <span className="relative z-10">Shop Collection</span>
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-gold-light to-gold transition-transform duration-500 group-hover:translate-x-0" />
                        </Link>

                        <Link
                            href="#arrivals"
                            id="hero-arrivals-cta"
                            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white backdrop-blur-sm transition-all duration-300 hover:border-gold/40 hover:bg-gold/5 hover:text-gold active:scale-95"
                        >
                            New Arrivals
                        </Link>
                    </motion.div>

                    {/* Stats row */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-4 flex items-center gap-6 sm:gap-10"
                    >
                        {[
                            { value: '10+', label: 'Products' },
                            { value: '100%', label: 'Premium' },
                            { value: '5★', label: 'Rated' },
                        ].map(({ value, label }) => (
                            <div key={label} className="flex flex-col items-center gap-0.5">
                                <span className="text-xl font-black text-gold sm:text-2xl">
                                    {value}
                                </span>
                                <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* ── Scroll indicator ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
                style={{ opacity }}
                className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[8px] uppercase tracking-[0.4em] text-white/30">
                        Scroll
                    </span>
                    <div className="relative h-10 w-px overflow-hidden bg-white/10">
                        <motion.div
                            animate={{ y: ['-100%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
                            className="absolute inset-x-0 h-5 bg-gradient-to-b from-transparent via-gold to-transparent"
                        />
                    </div>
                </div>
            </motion.div>

            {/* ── NINE77 side text (decorative) ── */}
            <div className="pointer-events-none absolute bottom-1/2 right-6 z-20 translate-y-1/2 select-none sm:right-8">
                <span className="block origin-center -rotate-90 text-[8px] uppercase tracking-[0.6em] text-white/15">
                    NINE77 · MMXXVI
                </span>
            </div>
        </section>
    );
}