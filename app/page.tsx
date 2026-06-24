'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Shield, Zap, Truck } from 'lucide-react';

import Hero from '@/components/hero';
import ProductCard from '@/components/product-card';
import ProductShowcase3D from '@/components/product-showcase-3d';
import LookbookHorizontal from '@/components/lookbook-horizontal';
import WhatsappButton from '@/components/whatsapp-button';
import { products } from '@/data/products';

const featuredProducts = products.filter((p) => p.newArrival || p.featured).slice(0, 4);
const bestSellers = products.filter((p) => p.featured).slice(0, 4);

/* ── Reusable section heading ───────────────────────────── */
function SectionHeader({
    eyebrow,
    title,
    desc,
}: {
    eyebrow: string;
    title: React.ReactNode;
    desc?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.5 });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 space-y-3"
        >
            <span className="text-[10px] uppercase tracking-[0.45em] text-gold">{eyebrow}</span>
            <h2 className="text-3xl font-black uppercase leading-[0.92] text-white sm:text-4xl lg:text-5xl">
                {title}
            </h2>
            {desc && (
                <p className="max-w-md text-sm text-white/50">{desc}</p>
            )}
        </motion.div>
    );
}

/* ── Why NINE77 section ─────────────────────────────────── */
function WhySection() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.2 });

    const pillars = [
        {
            icon: Star,
            label: 'Premium Quality',
            desc: 'Handpicked fabrics, rigorous quality checks, and meticulous finishing on every piece.',
        },
        {
            icon: Shield,
            label: 'Authentic Brand',
            desc: 'Genuine NINE77 with unique identifiers. No knockoffs, no compromises.',
        },
        {
            icon: Zap,
            label: 'Instant Order',
            desc: 'Select your size, generate your order message, and send it on WhatsApp in seconds.',
        },
        {
            icon: Truck,
            label: 'Fast Delivery',
            desc: 'Reliable nationwide delivery with secure packaging for every order.',
        },
    ];

    return (
        <section className="relative overflow-hidden border-t border-white/5 py-20 md:py-32">
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
            <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 -translate-y-1/2 translate-x-1/2 rounded-full bg-gold/6 blur-[100px]" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <SectionHeader
                    eyebrow="Why NINE77"
                    title={<>The <span className="text-gold-gradient">Difference</span>.</>}
                    desc="Every element of NINE77 is engineered to exceed expectations."
                />

                <div ref={ref} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {pillars.map(({ icon: Icon, label, desc }, i) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 50 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="group rounded-[24px] border border-white/8 bg-surface p-6 transition-all duration-500 hover:border-gold/20 hover:bg-gold/5"
                        >
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold transition-all duration-500 group-hover:bg-gold/20">
                                <Icon size={22} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-white">
                                {label}
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-white/50">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ── About teaser section ───────────────────────────────── */
function AboutTeaser() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <section className="relative overflow-hidden border-t border-white/5 py-20 md:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div ref={ref} className="grid items-center gap-12 lg:grid-cols-2">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.93 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative overflow-hidden rounded-[36px] border border-white/8 bg-background-2 shadow-cinematic"
                    >
                        <div className="relative aspect-[4/3]">
                            <Image
                                src="/about-image.jpg"
                                alt="NINE77 — Our Story"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>
                        {/* Floating stat */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="absolute bottom-5 right-5 glass-gold rounded-2xl p-4"
                        >
                            <p className="text-2xl font-black text-gold">2026</p>
                            <p className="text-[9px] uppercase tracking-[0.3em] text-white/60">Founded</p>
                        </motion.div>
                    </motion.div>

                    {/* Text */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-6"
                    >
                        <span className="text-[10px] uppercase tracking-[0.45em] text-gold">Our Story</span>
                        <h2 className="text-3xl font-black uppercase leading-[0.92] text-white sm:text-4xl">
                            Redefining
                            <br />
                            <span className="text-gold-gradient">Streetwear.</span>
                        </h2>
                        <div className="space-y-4 text-sm leading-relaxed text-white/55">
                            <p>
                                NINE77 was born from a passion for premium streetwear that
                                speaks without shouting. Every piece is a statement — crafted
                                for those who understand that true luxury is in the details.
                            </p>
                            <p>
                                From the stitching to the silhouette, we obsess over
                                quality so you can wear confidence effortlessly.
                            </p>
                        </div>
                        <Link
                            href="/about"
                            className="group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold transition-all duration-300 hover:gap-5"
                        >
                            Our Full Story
                            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

/* ── WhatsApp CTA section ───────────────────────────────── */
function WhatsAppCTA() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.4 });

    return (
        <section className="relative overflow-hidden border-t border-white/5 py-20">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(212,175,55,0.08),transparent)]" />

            <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 40 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                >
                    <span className="text-[10px] uppercase tracking-[0.45em] text-gold">Order Process</span>
                    <h2 className="text-3xl font-black uppercase leading-[0.92] text-white sm:text-5xl">
                        Order in
                        <br />
                        <span className="text-gold-gradient">60 seconds.</span>
                    </h2>
                    <p className="mx-auto max-w-sm text-sm text-white/50">
                        Select your product and size. We auto-generate your order message.
                        Hit send on WhatsApp. It's that simple.
                    </p>

                    {/* Steps */}
                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                        {['Pick a product', 'Choose your size', 'Send on WhatsApp'].map(
                            (step, i) => (
                                <div key={step} className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-gold/5 text-[10px] font-black text-gold">
                                        {i + 1}
                                    </div>
                                    <span className="text-xs uppercase tracking-[0.2em] text-white/60">{step}</span>
                                    {i < 2 && (
                                        <ArrowRight size={12} className="hidden text-white/20 sm:block" />
                                    )}
                                </div>
                            )
                        )}
                    </div>

                    <motion.a
                        href="https://wa.me/9779810605409?text=Hello%20NINE77%2C%20I%20would%20like%20to%20shop!"
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="inline-flex items-center gap-3 rounded-full bg-gold px-10 py-5 text-sm font-bold uppercase tracking-[0.3em] text-black shadow-glow transition-all duration-500 hover:shadow-glow-lg"
                    >
                        Start Shopping
                        <ArrowRight size={16} />
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}

/* ── Main page ──────────────────────────────────────────── */
export default function HomePage() {
    return (
        <>
            {/* 1. Immersive fullscreen hero */}
            <Hero />

            {/* 2. New Arrivals product grid */}
            <section
                id="arrivals"
                className="relative border-t border-white/5 py-20 md:py-32"
            >
                <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-96 -translate-x-1/2 rounded-full bg-gold/5 blur-[120px]" />
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="New Arrivals"
                        title={<>Latest <span className="text-gold-gradient">Drops.</span></>}
                        desc="Fresh from the studio — premium pieces engineered for those who refuse to blend in."
                    />
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {featuredProducts.map((product, i) => (
                            <ProductCard key={product.id} product={product} index={i} />
                        ))}
                    </div>
                    <div className="mt-10 text-center">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-sm transition-all duration-300 hover:border-gold/30 hover:bg-gold/5 hover:text-gold"
                        >
                            View All Products
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3. Interactive 3D product showcase */}
            <ProductShowcase3D />

            {/* 4. Horizontal lookbook scroll */}
            <LookbookHorizontal />

            {/* 5. Best sellers grid */}
            <section className="relative border-t border-white/5 py-20 md:py-32">
                <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 -translate-y-1/2 translate-x-1/4 rounded-full bg-gold/5 blur-[100px]" />
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="Best Sellers"
                        title={<>The <span className="text-gold-gradient">Essentials.</span></>}
                        desc="Our most-loved pieces, worn by those who define the standard."
                    />
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {bestSellers.map((product, i) => (
                            <ProductCard key={product.id} product={product} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Why NINE77 features */}
            <WhySection />

            {/* 7. About teaser */}
            <AboutTeaser />

            {/* 8. WhatsApp CTA */}
            <WhatsAppCTA />

            {/* Floating WhatsApp button (desktop) */}
            <WhatsappButton />
        </>
    );
}
