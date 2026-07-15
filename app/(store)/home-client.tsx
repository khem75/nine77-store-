'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import Hero from '@/components/hero';
import TrustStrip from '@/components/trust-strip';
import ShopByCollection from '@/components/shop-by-collection';
import ShopTheLook from '@/components/shop-the-look';
import LookbookHorizontal from '@/components/lookbook-horizontal';
import ProductCard from '@/components/product-card';
import WhatsappButton from '@/components/whatsapp-button';
import { products as staticProducts } from '@/data/products';
import type { AdminProduct } from '@/types/admin';

interface HomeClientProps {
    initialProducts: AdminProduct[];
}

export default function HomeClient({ initialProducts }: HomeClientProps) {
    const brandRef = useRef<HTMLDivElement>(null);
    const brandInView = useInView(brandRef, { once: true, amount: 0.3 });

    const storyRef = useRef<HTMLDivElement>(null);
    const storyInView = useInView(storyRef, { once: true, amount: 0.2 });

    const newsletterRef = useRef<HTMLDivElement>(null);
    const newsletterInView = useInView(newsletterRef, { once: true, amount: 0.35 });

    // Retrieve newest arrivals (either from live database or static fallback)
    const newArrivals = initialProducts.length > 0
        ? initialProducts.slice(0, 6)
        : staticProducts.filter((p) => p.newArrival).slice(0, 6);

    return (
        <>
            {/* 1. Immersive Hero Art Installation */}
            <Hero />
            <TrustStrip />

            {/* 2. Shop by Collection (Homepage Focus: Campaigns) */}
            <ShopByCollection />

            {/* 3. Luxury Brand Statement (Editorial Quote Section) */}
            <section ref={brandRef} className="py-24 md:py-36 bg-[#070707] border-b border-white/[0.08] px-6 lg:px-12 flex items-center justify-center">
                <div className="mx-auto max-w-4xl text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={brandInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-6"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.45em] text-gold">
                            Our Philosophy
                        </span>
                        <h2 className="text-[clamp(2.2rem,6.5vw,5.5rem)] font-black uppercase leading-[0.95] tracking-tight text-white select-none">
                            BUILD
                            <br />
                            <span className="text-gold">DIFFERENT</span>
                            <span className="text-white">.</span>
                        </h2>
                        {/* Horizontal thin dividers */}
                        <div className="w-16 h-[1px] bg-white/20 mx-auto my-6" />
                        <p className="text-lg md:text-2xl font-light text-white/55 leading-relaxed max-w-2xl mx-auto tracking-wide">
                            "Luxury streetwear engineered for those who refuse to blend in. Fusing architectural geometry with museum-grade craftsmanship."
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 4. New Drop (Horizontal scroll of 6 newest items; image & name only) */}
            <section id="new-drop" className="py-20 md:py-32 border-b border-white/[0.08] bg-[#070707] px-6 lg:px-12">
                <div className="mx-auto max-w-[1440px]">
                    <div className="mb-12 flex items-baseline justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.45em] text-gold font-black">
                                Latest Drops
                            </p>
                            <h2 className="mt-2 text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
                                New Drop
                            </h2>
                        </div>
                        <Link
                            href="/shop"
                            className="group inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/55 hover:text-white transition-colors"
                        >
                            View All
                            <ArrowUpRight size={13} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </div>

                    {/* Scroll Container */}
                    <div
                        className="flex gap-6 overflow-x-auto hide-scrollbar pb-6"
                        style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}
                    >
                        {newArrivals.map((product, idx) => (
                            <div
                                key={product.id}
                                className="w-[240px] shrink-0 snap-start md:w-[280px]"
                                style={{ scrollSnapAlign: 'start' }}
                            >
                                <ProductCard
                                    product={product}
                                    index={idx}
                                    showPrice={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Shop The Look Outfit Editorials */}
            <ShopTheLook />

            {/* 6. Lookbook horizontal Parallax */}
            <LookbookHorizontal />

            {/* 7. Brand Story Editorial */}
            <section className="py-20 md:py-32 border-b border-white/[0.08] bg-[#070707] px-6 lg:px-12">
                <div className="mx-auto max-w-[1440px]">
                    <div ref={storyRef} className="grid gap-12 md:grid-cols-2 md:gap-20 items-center">
                        {/* Story visual representation */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={storyInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                            className="relative aspect-[4/5] overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#111]"
                        >
                            <Image
                                src="/about-image.jpg"
                                alt="NINE77 Story Campaign"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                loading="lazy"
                                className="object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </motion.div>

                        {/* Content text */}
                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            animate={storyInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-6"
                        >
                            <p className="text-[10px] uppercase tracking-[0.45em] text-gold font-black">Brand Story</p>
                            <h2 className="text-3xl font-extrabold uppercase tracking-tight text-white sm:text-5xl leading-[0.95] select-none">
                                Built Different.<br />For the Bold.
                            </h2>
                            <p className="text-[14px] leading-relaxed text-white/50 font-light max-w-md">
                                NINE77 fuses curated luxury material selectives with contemporary streetwear proportions. Each piece balances quiet sophistication with bold visual attitude, built to speak without shouting.
                            </p>
                            <p className="text-[14px] leading-relaxed text-white/50 font-light max-w-md">
                                We obsess over structural fit, fabric weights, and visual longevity, ensuring every garment feels like a hand-curated art piece.
                            </p>
                            <div className="pt-2">
                                <Link
                                    href="/about"
                                    className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-gold transition-all duration-300 hover:gap-3"
                                >
                                    Read Full Story
                                    <ArrowRight size={13} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 8. Newsletter Signup */}
            <section className="py-20 md:py-28 border-b border-white/[0.08] bg-[#070707] px-6 lg:px-12">
                <div ref={newsletterRef} className="mx-auto max-w-xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={newsletterInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-5"
                    >
                        <p className="text-[10px] uppercase tracking-[0.45em] text-gold font-black">Join the Club</p>
                        <h2 className="text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl select-none">
                            Newsletter
                        </h2>
                        <p className="text-sm text-white/50 leading-relaxed font-light">
                            Subscribe to receive early drop notifications, release campaigns, and members-only restocks.
                        </p>

                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="mt-8 flex flex-col gap-3 sm:flex-row items-center w-full"
                        >
                            <input
                                type="email"
                                placeholder="Your email address"
                                aria-label="Email address"
                                className="h-12 w-full rounded-full border border-white/[0.1] bg-white/[0.02] px-5 text-[12px] text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-all font-light"
                            />
                            <button
                                type="submit"
                                className="h-12 w-full sm:w-auto rounded-full bg-gold px-8 text-[11px] font-black uppercase tracking-[0.25em] text-black transition-all hover:bg-gold-light active:scale-95 shrink-0 shadow-[0_4px_15px_rgba(212,175,55,0.25)]"
                            >
                                Subscribe
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Floating WhatsApp trigger */}
            <WhatsappButton />
        </>
    );
}
