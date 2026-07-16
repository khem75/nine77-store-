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
import { products as staticProducts } from '@/data/products';
import type { AdminProduct, HomepageSettings } from '@/types/admin';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

interface HomeClientProps {
    initialProducts: AdminProduct[];
    initialSettings: HomepageSettings | null;
    initialCampaigns?: Campaign[];
}

export default function HomeClient({ initialProducts, initialSettings, initialCampaigns }: HomeClientProps) {
    const brandRef = useRef<HTMLDivElement>(null);
    const brandInView = useInView(brandRef, { once: true, amount: 0.3 });

    const storyRef = useRef<HTMLDivElement>(null);
    const storyInView = useInView(storyRef, { once: true, amount: 0.2 });

    const newsletterRef = useRef<HTMLDivElement>(null);
    const newsletterInView = useInView(newsletterRef, { once: true, amount: 0.35 });

    const newArrivals = initialProducts.length > 0
        ? initialProducts.slice(0, 6)
        : staticProducts.filter((p) => p.newArrival).slice(0, 6);

    return (
        <>
            {/* ═══ 1. HERO — Dark ambient, cinematic ═══ */}
            <Hero initialCampaigns={initialCampaigns} />

            {/* ═══ 2. NIGHTFALL COLLECTION — Dark editorial banner ═══ */}
            <section className="relative dark-section border-b border-white/[0.06] overflow-hidden">
                <div className="relative min-h-[50vh] md:min-h-[55vh] flex items-end">
                    {/* Background imagery */}
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

                    <div className="relative z-10 px-5 pb-10 md:px-12 md:pb-14 lg:px-16 max-w-[1440px] mx-auto w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease: luxuryEase }}
                        >
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.35em] text-gold">
                                New Drop
                            </span>
                            <h2 className="text-[clamp(2rem,6vw,4rem)] font-black uppercase leading-[0.95] tracking-tight text-white mt-2 select-none">
                                NIGHTFALL<br />COLLECTION
                            </h2>
                            <p className="text-[12px] md:text-[13px] text-white/45 font-light mt-3 max-w-sm">
                                A new chapter in streetwear. Minimal. Bold. Timeless.
                            </p>
                            <Link
                                href="/shop"
                                className="group inline-flex items-center gap-2 mt-5 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-gold transition-all hover:gap-3"
                            >
                                Discover Collection
                                <ArrowRight size={13} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══ 3. SHOP BY COLLECTIONS — Light ivory ═══ */}
            <ShopByCollection />

            {/* ═══ 4. FEATURED PRODUCTS — Light ivory ═══ */}
            <section id="new-drop" className="py-16 md:py-24 bg-background px-5 md:px-12 lg:px-16">
                <div className="mx-auto max-w-[1440px]">
                    <div className="mb-10 flex items-baseline justify-between">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: luxuryEase }}
                        >
                            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-gold font-bold">
                                Featured Products
                            </p>
                            <h2 className="mt-1 text-2xl md:text-3xl font-black uppercase tracking-tight text-primary">
                                New Arrivals
                            </h2>
                        </motion.div>
                        <Link
                            href="/shop"
                            className="group inline-flex items-center gap-1.5 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-secondary hover:text-primary transition-colors"
                        >
                            View All Products
                            <ArrowUpRight size={13} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-5">
                        {newArrivals.map((product, idx) => (
                            <ProductCard key={product.id} product={product} index={idx} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ 5. LOOKBOOK — Dark editorial ═══ */}
            <LookbookHorizontal />

            {/* ═══ 6. BRAND STORY + STATS — Light ivory ═══ */}
            <section className="py-16 md:py-28 bg-background px-5 md:px-12 lg:px-16">
                <div className="mx-auto max-w-[1440px]">
                    <div ref={storyRef} className="grid gap-10 md:grid-cols-2 md:gap-16 items-center">
                        {/* Story image */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={storyInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.85, ease: luxuryEase }}
                            className="relative aspect-[4/5] overflow-hidden rounded-2xl md:rounded-3xl border border-border bg-surface img-zoom"
                        >
                            <Image
                                src="/about-image.jpg"
                                alt="NINE77 Story Campaign"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                loading="lazy"
                                className="object-cover"
                            />
                        </motion.div>

                        {/* Story text */}
                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            animate={storyInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.85, delay: 0.15, ease: luxuryEase }}
                            className="space-y-5"
                        >
                            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-gold font-bold">Our Story</p>
                            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-primary leading-[0.95] select-none">
                                Built Different.<br />Worn by Few.
                            </h2>
                            <p className="text-[13px] md:text-[14px] leading-relaxed text-secondary font-light max-w-md">
                                NINE77 fuses curated luxury material with contemporary streetwear proportions. Each piece balances quiet sophistication with bold visual attitude.
                            </p>
                            <div className="pt-2">
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
                <div className="mt-16 md:mt-24">
                    <Stats products={initialProducts} />
                </div>
            </section>

            {/* ═══ 7. NEWSLETTER — Dark CTA section ═══ */}
            <section className="dark-section py-16 md:py-24 border-t border-white/[0.06] px-5 md:px-12 lg:px-16">
                <div ref={newsletterRef} className="mx-auto max-w-xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={newsletterInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, ease: luxuryEase }}
                        className="space-y-5"
                    >
                        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-gold font-bold">
                            Join the Club
                        </p>
                        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white select-none">
                            Get 10% Off Your First Order
                        </h2>
                        <p className="text-[13px] text-white/45 leading-relaxed font-light">
                            Be the first to know about new drops, exclusive offers and more.
                        </p>

                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="mt-8 flex flex-col gap-3 sm:flex-row items-center w-full"
                        >
                            <input
                                type="email"
                                placeholder="Enter your email"
                                aria-label="Email address"
                                className="h-12 w-full rounded-none border border-white/[0.12] bg-white/[0.03] px-5 text-[12px] text-white placeholder:text-white/30 outline-none focus:border-gold/40 transition-all font-light"
                            />
                            <button
                                type="submit"
                                className="h-12 w-full sm:w-auto bg-gold px-8 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-gold-light active:scale-95 shrink-0"
                            >
                                Subscribe
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Floating WhatsApp */}
            <WhatsappButton />
        </>
    );
}
