'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

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
        <section className="py-14 md:py-24 border-b border-white/[0.08] bg-[#070707] px-6 lg:px-8">
            <div className="mx-auto max-w-[1440px]">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-10"
                >
                    <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Visual Campaign</p>
                    <h2 className="mt-1 text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl">
                        N77 Lookbook
                    </h2>
                </motion.div>

                {/* Grid of large editorial imagery */}
                <div
                    ref={containerRef}
                    className="grid gap-6 md:grid-cols-3"
                >
                    {campaigns.map((camp, idx) => (
                        <motion.div
                            key={camp.id}
                            initial={{ opacity: 0, y: 24 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="group relative flex flex-col justify-end overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#161616]"
                            style={{ height: 'max(400px, 50vh)' }}
                        >
                            {/* Imagery */}
                            <Image
                                src={camp.image}
                                alt={camp.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                loading="lazy"
                                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.06] group-hover:translate-y-[4px]"
                            />
                            {/* Linear Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                            {/* Interactive diagonal shine sweep on lookbook card hover */}
                            <motion.div
                                initial={{ x: '-100%', opacity: 0 }}
                                whileHover={{ x: '100%', opacity: [0, 1, 0] }}
                                transition={{ duration: 0.8, ease: 'easeInOut' }}
                                className="absolute inset-0 pointer-events-none z-20"
                                style={{
                                    background: 'linear-gradient(110deg, transparent 35%, rgba(212,175,55,0.08) 48%, rgba(255,255,255,0.25) 50%, rgba(212,175,55,0.08) 52%, transparent 65%)'
                                }}
                            />

                            {/* Details overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                <span className="text-[9px] uppercase tracking-[0.3em] text-gold/75">
                                    {camp.subtitle}
                                </span>
                                <h3 className="mt-1 text-2xl font-extrabold uppercase tracking-wide text-white leading-tight">
                                    {camp.title}
                                </h3>
                                <Link
                                    href="/shop"
                                    className="mt-3.5 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/50 group-hover:text-gold transition-colors duration-250"
                                >
                                    Shop Collection →
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
