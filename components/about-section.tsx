'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Logo from './logo';

export default function AboutSection() {
    return (
        <section className="border-t border-border bg-background px-5 py-20 lg:px-16 md:py-28">
            <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Brand Logo in About Section — Ultra-subtle compact luxury mark */}
                    <div className="mb-4 inline-block">
                        <Logo variant="about" />
                    </div>

                    <p className="text-[10px] uppercase tracking-[0.35em] text-gold font-bold">
                        About NINE77
                    </p>

                    <h2 className="mt-3 text-[clamp(2rem,4vw,3.5rem)] font-black uppercase tracking-tight text-primary leading-[0.95]">
                        A brand defined by luxury streetwear identity.
                    </h2>

                    <p className="mt-6 max-w-xl text-[clamp(0.95rem,2vw,1.1rem)] leading-[1.8] text-secondary font-light">
                        NINE77 was created for those who demand quiet luxury with visual attitude.
                        Each garment balances understated sophistication with high-fashion proportions.
                    </p>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
                                Quiet Luxury
                            </p>

                            <p className="mt-2 text-[12px] leading-relaxed text-secondary font-light">
                                Museum-grade finishes tailored for modern everyday wear.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
                                Editorial Edge
                            </p>

                            <p className="mt-2 text-[12px] leading-relaxed text-secondary font-light">
                                Architectural silhouettes inspired by international runway culture.
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-surface shadow-card">
                        <Image
                            src="/about-image.jpg"
                            alt="About NINE77"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}