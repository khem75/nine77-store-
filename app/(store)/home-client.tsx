'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import Hero from '@/components/Hero';
import type { Campaign } from '@/types/campaign';
import ShopByCollection from '@/components/shop-by-collection';
import LookbookHorizontal from '@/components/lookbook-horizontal';
import ProductCard from '@/components/product-card';
import WhatsappButton from '@/components/whatsapp-button';
import Stats from '@/components/stats';
import WhatsAppCommunity from '@/components/whatsapp-community';
import { products as staticProducts } from '@/data/products';
import type { AdminProduct, HomepageSettings } from '@/types/admin';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

// Reveal once section variant: opacity 0->1, y 40->0, duration 0.8s
const sectionRevealVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: luxuryEase },
  },
};

interface HomeClientProps {
    initialProducts: AdminProduct[];
    initialSettings: HomepageSettings | null;
    initialCampaigns?: Campaign[];
}

export default function HomeClient({ initialProducts, initialSettings, initialCampaigns }: HomeClientProps) {
    const storyRef = useRef<HTMLDivElement>(null);
    const storyInView = useInView(storyRef, { once: true, amount: 0.2 });

    const newArrivals = initialProducts.length > 0
        ? initialProducts.slice(0, 6)
        : staticProducts.filter((p) => p.newArrival).slice(0, 6);

    return (
        <>
            {/* ═══ 1. HERO — Editorial Carousel (6000ms Autoplay, Touch Swipe, Mouse Drag, Intersection Observer) ═══ */}
            <Hero initialCampaigns={initialCampaigns} />

            {/* ═══ 2. NIGHTFALL COLLECTION — Dark editorial banner ═══ */}
            <section className="relative dark-section border-b border-white/[0.06] overflow-hidden">
                <div className="relative min-h-[50vh] md:min-h-[60vh] flex items-end">
                    <div className="absolute inset-0">
                        <Image
                            src="/products/windcheater-1.jpg"
                            alt="Nightfall Collection"
                            fill
                            className="object-cover opacity-40"
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A08] via-[#0C0A08]/60 to-transparent" />
                    </div>

                    <div className="relative z-10 px-5 md:px-8 lg:px-16 pb-12 md:pb-16 max-w-[1440px] mx-auto w-full">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={sectionRevealVariant}
                        >
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.35em] text-gold">
                                New Drop
                            </span>
                            <h2 className="text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-[0.95] tracking-tight text-white mt-2 select-none">
                                NIGHTFALL<br />COLLECTION
                            </h2>
                            <p className="text-[clamp(0.95rem,2vw,1.1rem)] text-white/50 font-light mt-3 max-w-sm leading-[1.8]">
                                A new chapter in luxury streetwear. Minimal. Bold. Timeless.
                            </p>
                            <Link
                                href="/shop"
                                className="group inline-flex items-center gap-2 mt-6 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-gold transition-all hover:gap-3"
                            >
                                Discover Collection
                                <ArrowRight size={13} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══ 3. SHOP BY COLLECTIONS — Light Ivory ═══ */}
            <ShopByCollection />

            {/* ═══ 4. FEATURED PRODUCTS — Light Ivory (#F5F3EF) ═══ */}
            <section id="new-drop" className="py-24 md:py-36 bg-background px-5 md:px-8 lg:px-16">
                <div className="mx-auto max-w-[1440px]">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={sectionRevealVariant}
                        className="mb-12 flex items-baseline justify-between"
                    >
                        <div>
                            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-gold font-bold">
                                Featured Products
                            </p>
                            <h2 className="mt-1 text-[clamp(2rem,5vw,4rem)] font-black uppercase tracking-tight text-primary leading-[0.95]">
                                New Arrivals
                            </h2>
                        </div>
                        <Link
                            href="/shop"
                            className="group inline-flex items-center gap-1.5 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-secondary hover:text-primary transition-colors"
                        >
                            View All Products
                            <ArrowUpRight size={13} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-5">
                        {newArrivals.map((product, idx) => (
                            <ProductCard key={product.id} product={product} index={idx} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ 5. LOOKBOOK — Dark Editorial ═══ */}
            <LookbookHorizontal />

            {/* ═══ 6. BRAND STORY + STATS — Light Ivory (#F5F3EF) ═══ */}
            <section className="py-14 md:py-20 bg-background px-5 md:px-8 lg:px-16">
                <div className="mx-auto max-w-[1440px]">
                    <div ref={storyRef} className="grid gap-6 md:grid-cols-2 md:gap-10 items-center">
                        {/* Story image — Compact, sleek luxury proportion */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            variants={sectionRevealVariant}
                            className="relative w-full max-w-[280px] md:max-w-[320px] aspect-[4/5] overflow-hidden rounded-2xl md:rounded-3xl border border-border bg-surface img-zoom mx-auto md:mx-0 shadow-card"
                        >
                            <Image
                                src="/about-image.jpg"
                                alt="NINE77 Story Campaign"
                                fill
                                sizes="(max-width: 768px) 280px, 320px"
                                loading="lazy"
                                className="object-cover"
                            />
                        </motion.div>

                        {/* Story text — Tightened spacing */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            variants={sectionRevealVariant}
                            className="space-y-3 md:space-y-4"
                        >
                            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-gold font-bold">Our Story</p>
                            <h2 className="text-[clamp(1.8rem,4vw,3.2rem)] font-black uppercase tracking-tight text-primary leading-[0.95] select-none">
                                Built Different.<br />Worn by Few.
                            </h2>
                            <p className="text-[clamp(0.9rem,1.5vw,1rem)] leading-[1.6] text-secondary font-light max-w-md">
                                NINE77 fuses curated luxury material with contemporary streetwear proportions. Each piece balances quiet sophistication with bold visual attitude.
                            </p>
                            <div className="pt-1">
                                <Link
                                    href="/about"
                                    className="group inline-flex items-center gap-2 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-gold transition-all duration-300 hover:gap-3"
                                >
                                    More About Us
                                    <ArrowRight size={13} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Stats row */}
                <div className="mt-10 md:mt-14">
                    <Stats products={initialProducts} />
                </div>
            </section>

            {/* ═══ 7. WHATSAPP COMMUNITY ═══ */}
            <WhatsAppCommunity />

            {/* Floating WhatsApp CTA */}
            <WhatsappButton />
        </>
    );
}
