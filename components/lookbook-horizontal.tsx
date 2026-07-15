'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const campaigns = [
    {
        id: 1,
        title: 'Campaign 01',
        subtitle: 'The Tailored Street',
        image: '/products/barrel-pants-2.jpg',
    },
    {
        id: 2,
        title: 'Campaign 02',
        subtitle: 'Everyday Confidence',
        image: '/products/vintage-t-shirt-2.jpg',
    },
    {
        id: 3,
        title: 'Campaign 03',
        subtitle: 'Summer Light Edit',
        image: '/products/linen-shirt-2.jpg',
    },
];

export default function LookbookHorizontal() {
    const containerRef = useRef<HTMLDivElement>(null);
    const inView = useInView(containerRef, { once: true, amount: 0.1 });

    return (
        <section className="dark-section py-16 md:py-24 border-y border-white/[0.06] px-5 md:px-12 lg:px-16">
            <div className="mx-auto max-w-[1440px]">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.85, ease: luxuryEase }}
                    className="mb-10 flex items-baseline justify-between"
                >
                    <div>
                        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-gold font-bold">
                            Visual Campaign
                        </p>
                        <h2 className="mt-1 text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                            SS25 Lookbook
                        </h2>
                    </div>
                    <Link
                        href="/shop"
                        className="group inline-flex items-center gap-2 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-gold transition-all hover:gap-3"
                    >
                        Explore Lookbook
                        <ArrowRight size={13} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </motion.div>

                {/* Grid of editorial imagery */}
                <div
                    ref={containerRef}
                    className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5"
                >
                    {campaigns.map((campaign, i) => (
                        <motion.div
                            key={campaign.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.9, delay: i * 0.12, ease: luxuryEase }}
                            className="group relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-2xl bg-dark-card img-zoom"
                        >
                            <Image
                                src={campaign.image}
                                alt={campaign.subtitle}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                loading="lazy"
                                className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                            {/* Content overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                                <p className="text-[9px] uppercase tracking-[0.3em] text-gold/80 font-semibold">
                                    {campaign.title}
                                </p>
                                <p className="text-lg md:text-xl font-bold text-white mt-1">
                                    {campaign.subtitle}
                                </p>
                            </div>

                            {/* Play button hint */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="w-12 h-12 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                    <Play size={18} className="text-white ml-0.5" fill="white" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
