'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Truck, Shield, Lock, MessageCircle, ChevronDown, Plus } from 'lucide-react';
import type { HomepageSettings, AdminProduct } from '@/types/admin';
import { slugify } from '@/utils';

const HeroScene = dynamic(() => import('./hero-scene'), { ssr: false });

/* ─── Product Card Data ──────────────────────────────────── */
const heroProducts = [
    {
        tag: 'NEW DROP',
        name: 'Oversized Hoodie',
        price: 'Rs. 2,990',
        image: '/products/windcheater-1.jpg',
        href: '/shop',
    },
    {
        tag: 'BEST SELLER',
        name: 'Signature Tee',
        price: 'Rs. 1,890',
        image: '/products/vintage-t-shirt-1.jpg',
        href: '/shop',
    },
    {
        tag: 'LIMITED EDITION',
        name: 'Utility Cargo',
        price: 'Rs. 2,890',
        image: '/products/barrel-pants-1.jpg',
        href: '/shop',
    },
];

/* ─── Feature Strip Items ────────────────────────────────── */
const features = [
    { icon: Truck, label: 'FREE SHIPPING', detail: 'On all orders above Rs. 3999' },
    { icon: Shield, label: 'PREMIUM QUALITY', detail: 'Finest fabric. Built to last.' },
    { icon: Lock, label: 'SECURE PAYMENTS', detail: '100% safe & protected' },
    { icon: MessageCircle, label: 'WHATSAPP ORDER', detail: 'Easy order on WhatsApp' },
];

/* ─── Stagger Configs ────────────────────────────────────── */
const luxuryEase = [0.16, 1, 0.3, 1] as const;

interface HeroProps {
    settings: HomepageSettings | null;
    products?: AdminProduct[];
}

export default function Hero({ settings, products = [] }: HeroProps) {
    const heroRef = useRef<HTMLElement>(null);
    const [threeReady, setThreeReady] = useState(false);
    const [introStage, setIntroStage] = useState(0);
    const mouseRef = useRef({ x: 0, y: 0 });
    const scrollProgressRef = useRef(0);

    // Dynamic values from admin settings
    const heroImage = settings?.hero_image || null;
    const buttonText = settings?.hero_button || 'SHOP NEW DROP';
    const buttonLink = settings?.hero_button_link || '/shop';
    const heroTitle = settings?.hero_title || 'OWN THE STREET.';
    const heroSubtitle = settings?.hero_subtitle || 'Premium streetwear engineered for those who refuse to blend in.';
    const titleWords = heroTitle.split(' ');

    // Build dynamic featured products list
    const featuredList = (settings?.featured_products || [])
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is AdminProduct => !!p)
        .slice(0, 3);

    const displayProducts = featuredList.length > 0
        ? featuredList.map((p) => ({
            tag: p.featured ? 'FEATURED' : 'NEW DROP',
            name: p.name,
            price: `Rs. ${p.price.toLocaleString()}`,
            image: p.images[0] || '/luxury-streetwear-garment.png',
            href: `/product/${slugify(p.name)}`,
          }))
        : heroProducts;

    // Skip 3D loading if hero image is set
    useEffect(() => {
        if (heroImage) setThreeReady(true);
    }, [heroImage]);

    // Staggered intro sequence
    useEffect(() => {
        const timers = [
            setTimeout(() => setIntroStage(1), 300),   // bg
            setTimeout(() => setIntroStage(2), 800),   // headline
            setTimeout(() => setIntroStage(3), 1400),  // monolith
            setTimeout(() => setIntroStage(4), 2000),  // cards
            setTimeout(() => setIntroStage(5), 2500),  // buttons
            setTimeout(() => setIntroStage(6), 3000),  // feature strip
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    // Mouse parallax tracking (desktop only)
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        mouseRef.current = {
            x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
            y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
        };
    }, []);

    // Scroll-based hero scale
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <motion.section
            ref={heroRef}
            onMouseMove={handleMouseMove}
            style={{ scale: heroScale }}
            className="relative w-full min-h-[100svh] bg-hero-dark overflow-hidden"
        >
            {/* ── Film Grain Overlay ── */}
            <div className="grain absolute inset-0 z-50 pointer-events-none" />

            {/* ── Background Ambient ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={introStage >= 1 ? { opacity: 1 } : {}}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
            >
                {/* Warm radial spotlight */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(183,134,74,0.06)_0%,transparent_70%)]" />
                {/* Bottom fade to next section */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-hero-dark to-transparent z-10" />
            </motion.div>

            {/* ── 3D Scene / Hero Image Background ── */}
            <div className="absolute inset-0 z-0">
                {heroImage ? (
                    <div className="relative w-full h-full">
                        <Image
                            src={heroImage}
                            alt="NINE77 Hero"
                            fill
                            priority
                            className="object-cover opacity-40"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-hero-dark via-hero-dark/60 to-hero-dark/40" />
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={introStage >= 3 ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1.4, ease: luxuryEase }}
                        className="absolute inset-0"
                    >
                        <HeroScene
                            scrollProgressRef={scrollProgressRef}
                            onLoaded={() => setThreeReady(true)}
                        />
                    </motion.div>
                )}
            </div>

            {/* ── Main Content Grid (mobile-first: stacked → desktop: 3 columns) ── */}
            <div className="relative z-20 flex flex-col justify-between min-h-[100svh] px-5 pt-24 pb-6 md:px-10 lg:px-16 xl:px-20">

                {/* ── Top Section: Content Grid ── */}
                <div className="flex-1 flex flex-col lg:flex-row lg:items-center lg:gap-8 xl:gap-12">

                    {/* ═══ LEFT COLUMN — Editorial Typography ═══ */}
                    <div className="flex-shrink-0 lg:w-[42%] xl:w-[38%] pt-4 md:pt-8 lg:pt-0">

                        {/* Since Label */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={introStage >= 2 ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8, ease: luxuryEase }}
                            className="flex items-center gap-3 mb-6 md:mb-8"
                        >
                            <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">
                                Since 2025
                            </span>
                            <div className="h-[1px] w-8 md:w-12 bg-gold/40" />
                        </motion.div>

                        {/* Main Headline — Word by Word Reveal */}
                        <div className="space-y-0 mb-6 md:mb-8">
                            {titleWords.map((word, i) => (
                                <div key={word + i} className="overflow-hidden w-max max-w-full pr-4">
                                    <motion.h1
                                        initial={{ y: '110%' }}
                                        animate={introStage >= 2 ? { y: 0 } : {}}
                                        transition={{
                                            duration: 1.2,
                                            delay: i * 0.12,
                                            ease: luxuryEase,
                                        }}
                                        className="text-[clamp(3.5rem,10vw,8.5rem)] md:text-[clamp(4.5rem,7vw,6.5rem)] lg:text-[clamp(4.2rem,6vw,6rem)] xl:text-[6.8rem] font-black uppercase leading-[0.85] tracking-[-0.03em] text-white select-none"
                                    >
                                        {word}
                                    </motion.h1>
                                </div>
                            ))}
                        </div>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={introStage >= 2 ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 1.0, delay: 0.5, ease: luxuryEase }}
                            className="text-[13px] md:text-[15px] leading-relaxed text-white/45 font-light max-w-[420px] mb-8 md:mb-10"
                        >
                            {heroSubtitle}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={introStage >= 5 ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, ease: luxuryEase }}
                            className="flex items-center gap-3 mb-10 lg:mb-0"
                        >
                            {/* Primary CTA */}
                            <Link
                                href={buttonLink}
                                className="group relative inline-flex items-center gap-2.5 bg-white text-[#111] px-6 py-3 md:px-7 md:py-3.5 rounded-none text-[10px] md:text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300 hover:bg-gold hover:text-white"
                            >
                                {buttonText}
                                <ArrowUpRight size={13} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>

                            {/* Secondary CTA */}
                            <Link
                                href="#new-drop"
                                className="group inline-flex items-center gap-2.5 border border-white/20 text-white px-6 py-3 md:px-7 md:py-3.5 rounded-none text-[10px] md:text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300 hover:border-white/50 hover:bg-white/5"
                            >
                                EXPLORE
                                <ArrowUpRight size={13} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* ═══ CENTER COLUMN — 3D Monolith (hidden on mobile, shown on lg+) ═══ */}
                    <div className="hidden lg:flex lg:w-[40%] xl:w-[44%] items-center justify-center relative">
                        {/* This space is occupied by the absolute-positioned 3D scene */}
                    </div>

                    {/* ═══ RIGHT COLUMN — Floating Product Cards ═══ */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={introStage >= 4 ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 1.0, ease: luxuryEase }}
                        className="flex-shrink-0 lg:w-[30%] xl:w-[28%]"
                    >
                        {/* Mobile: horizontal scroll strip. Desktop: vertical stack */}
                        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 lg:flex-col lg:gap-4 lg:overflow-visible lg:pb-0">
                            {displayProducts.map((product, i) => (
                                <Link
                                    key={product.name + i}
                                    href={product.href}
                                    className={`
                                        group flex-shrink-0 w-[260px] lg:w-full
                                        glass-card-dark rounded-2xl p-3 md:p-3.5
                                        flex items-center gap-3.5
                                        transition-all duration-500 ease-luxury
                                        hover:bg-white/10 hover:shadow-glow-sm hover:-translate-y-1
                                        ${i === 0 ? 'animate-float-card-1' : i === 1 ? 'animate-float-card-2' : 'animate-float-card-3'}
                                    `}
                                    style={{ animationDelay: `${i * 0.3}s` }}
                                >
                                    {/* Product Thumbnail */}
                                    <div className="relative w-16 h-16 md:w-[72px] md:h-[72px] rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            sizes="72px"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-gold">
                                            {product.tag}
                                        </span>
                                        <p className="text-[13px] md:text-[14px] font-bold text-white truncate mt-0.5">
                                            {product.name}
                                        </p>
                                        <p className="text-[12px] text-white/50 mt-0.5">
                                            {product.price}
                                        </p>
                                    </div>

                                    {/* Action Button */}
                                    <div className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:border-gold group-hover:bg-gold/10">
                                        <Plus size={14} className="text-white/50 group-hover:text-gold transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Card Numbering (desktop) */}
                        <div className="hidden lg:flex flex-col gap-[52px] absolute right-4 top-1/2 -translate-y-1/2 items-end">
                            {displayProducts.map((_, i) => (
                                <span key={i} className="text-[11px] font-light tracking-[0.15em] text-white/25">
                                    {`0${i + 1}`}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ── Bottom Area: Feature Strip + Scroll Indicator ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={introStage >= 6 ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: luxuryEase }}
                    className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
                >
                    {/* Scroll Indicator (mobile: hidden, desktop: bottom-left) */}
                    <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
                        <div className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center">
                            <ChevronDown size={16} className="text-white/40 animate-scroll-bounce" />
                        </div>
                        <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/30">
                            Scroll
                        </span>
                    </div>

                    {/* Feature Strip */}
                    <div className="w-full lg:w-auto">
                        <div className="glass-card-dark rounded-2xl px-4 py-3.5 md:px-6 md:py-4">
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
                                {features.map(({ icon: Icon, label, detail }) => (
                                    <div key={label} className="flex items-center gap-2.5 group">
                                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:border-gold/30 group-hover:bg-gold/5">
                                            <Icon size={14} strokeWidth={1.5} className="text-white/40 transition-colors group-hover:text-gold" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.12em] text-white/80 truncate">
                                                {label}
                                            </p>
                                            <p className="text-[9px] md:text-[10px] text-white/35 truncate hidden md:block">
                                                {detail}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ── Preloader ── */}
            <AnimatePresence>
                {!threeReady && (
                    <motion.div
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="fixed inset-0 z-[999] bg-hero-dark flex items-center justify-center pointer-events-none"
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-gold rounded-full animate-ping" />
                            <p className="text-[9px] uppercase tracking-[0.5em] text-white/30">Entering NINE77</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}
