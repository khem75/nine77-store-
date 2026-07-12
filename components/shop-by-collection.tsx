'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const collections = [
    {
        name: 'Pants',
        description: 'Modern silhouettes.',
        image: '/products/barrel-pants-1.jpg',
        href: '/shop?category=Pants',
        size: 'md:col-span-3 h-[380px] md:h-[450px]',
    },
    {
        name: 'Shirts',
        description: 'Built for confidence.',
        image: '/products/vintage-t-shirt-1.jpg',
        href: '/shop?category=Tops',
        size: 'md:col-span-2 h-[380px] md:h-[450px]',
    },
    {
        name: 'Linen',
        description: 'Natural luxury.',
        image: '/products/linen-shirt-1.jpg',
        href: '/shop?search=Linen',
        size: 'md:col-span-2 h-[380px] md:h-[480px]',
    },
    {
        name: 'Outerwear',
        description: 'Layer up.',
        image: '/products/windcheater-1.jpg',
        href: '/shop?category=Outerwear',
        size: 'md:col-span-3 h-[380px] md:h-[480px]',
    },
    {
        name: 'Accessories',
        description: 'Complete the fit.',
        image: '/products/henley-1.jpg',
        href: '/shop',
        size: 'md:col-span-5 h-[340px] md:h-[400px]',
    },
];

export default function ShopByCollection() {
    return (
        <section className="py-20 md:py-32 border-b border-white/[0.08] bg-[#070707] px-6 lg:px-12">
            <div className="mx-auto max-w-[1440px]">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-14 text-center md:text-left"
                >
                    <p className="text-[10px] uppercase tracking-[0.45em] text-gold font-black">
                        Shop by Collection
                    </p>
                    <h2 className="mt-2 text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
                        Curated Campaigns
                    </h2>
                </motion.div>

                {/* Editorial Grid Layout */}
                <div className="grid gap-6 grid-cols-1 md:grid-cols-5">
                    {collections.map((col, idx) => (
                        <motion.div
                            key={col.name}
                            initial={{ opacity: 0, y: 35 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 0.75, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                            className={`${col.size} w-full`}
                        >
                            <Link
                                href={col.href}
                                className="group relative flex h-full w-full flex-col justify-end overflow-hidden rounded-[24px] border border-white/[0.06] bg-[#111] transition-all duration-500 ease-luxury hover:border-white/15"
                            >
                                {/* Portrait/Cover Image */}
                                <Image
                                    src={col.image}
                                    alt={col.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    loading="lazy"
                                    className="object-cover object-top transition-transform duration-700 ease-luxury group-hover:scale-[1.06] group-hover:translate-y-[4px] opacity-80 group-hover:opacity-90"
                                />

                                {/* Luxury bottom gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent transition-opacity duration-500 group-hover:opacity-95" />

                                {/* Interactive diagonal shine sweep on card hover */}
                                <motion.div
                                    initial={{ x: '-100%', opacity: 0 }}
                                    whileHover={{ x: '100%', opacity: [0, 1, 0] }}
                                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                                    className="absolute inset-0 pointer-events-none z-20"
                                    style={{
                                        background: 'linear-gradient(110deg, transparent 35%, rgba(212,175,55,0.08) 48%, rgba(255,255,255,0.25) 50%, rgba(212,175,55,0.08) 52%, transparent 65%)'
                                    }}
                                />

                                {/* Card Text Content */}
                                <div className="relative z-10 p-6 md:p-8 flex flex-col items-start gap-1">
                                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-wide text-white leading-none">
                                        {col.name}
                                    </h3>
                                    <p className="text-xs md:text-sm text-white/55 font-light tracking-wide max-w-[280px]">
                                        {col.description}
                                    </p>
                                    
                                    {/* Action link */}
                                    <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-gold transition-all duration-300 group-hover:text-white group-hover:gap-2.5">
                                        Explore <ArrowRight size={11} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-[4px]" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
