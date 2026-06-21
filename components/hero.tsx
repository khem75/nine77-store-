'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const heroMotion = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
};

export default function Hero() {
    return (
        <section className="relative overflow-hidden px-6 pb-24 pt-12 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={heroMotion}
                    transition={{ duration: 0.9 }}
                    className="space-y-8 xl:pr-12"
                >
                    <div className="max-w-xl space-y-4">
                        <span className="inline-flex rounded-full bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.45em] text-gold">
                            Premium Streetwear
                        </span>

                        <h1 className="text-5xl font-black uppercase leading-[0.95] text-white sm:text-6xl xl:text-7xl">
                            BUILT DIFFERENT.
                            <br />
                            MADE TO <span className="text-gold">STAND OUT.</span>
                        </h1>

                        <p className="max-w-xl text-base leading-8 text-white/75 sm:text-lg">
                            Premium streetwear for the bold. Comfort. Quality. Statement.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-gold-dark"
                        >
                            Shop Collection
                        </Link>

                        <Link
                            href="#arrivals"
                            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:border-gold hover:text-gold"
                        >
                            View Arrivals
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div className="relative h-[600px] overflow-hidden rounded-[40px] border border-white/10 bg-black shadow-[0_0_80px_rgba(212,175,55,0.12)]">
                        <Image
                            src="/hero-image.jpg"
                            alt="NINE77 Premium Streetwear"
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}