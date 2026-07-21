'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const luxuryEase = [0.22, 1, 0.36, 1] as const;

const collections = [
    {
        name: 'Tops',
        subtitle: 'New Arrivals',
        image: '/products/vintage-t-shirt-1.jpg',
        href: '/shop?category=Tops',
    },
    {
        name: 'Pants',
        subtitle: 'Utility & Cargo',
        image: '/products/barrel-pants-1.jpg',
        href: '/shop?category=Pants',
    },
    {
        name: 'Outerwear',
        subtitle: 'Jackets & Hoodies',
        image: '/products/windcheater-1.jpg',
        href: '/shop?category=Outerwear',
    },
    {
        name: 'Accessories',
        subtitle: 'Distressed Caps',
        image: '/products/distressed-cap-1.jpg',
        href: '/shop?category=Accessories',
    },
];

export default function ShopByCollection() {
    return (
        <section className="py-16 md:py-24 bg-background px-5 md:px-12 lg:px-16">
            <div className="mx-auto max-w-[1440px]">
                {/* Section Header */}
                <div className="mb-10 flex items-baseline justify-between">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6, ease: luxuryEase }}
                    >
                        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-gold font-bold">
                            Shop by Collection
                        </p>
                        <h2 className="mt-1 text-2xl md:text-3xl font-black uppercase tracking-tight text-primary">
                            Collections
                        </h2>
                    </motion.div>
                    <Link
                        href="/shop"
                        className="group inline-flex items-center gap-1.5 min-h-[44px] text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-secondary hover:text-primary transition-colors"
                    >
                        View All
                        <ArrowUpRight size={13} strokeWidth={1.75} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </div>

                {/* Mobile: horizontal scroll. Desktop: 4-column grid */}
                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:pb-0">
                    {collections.map((collection, i) => (
                        <motion.div
                            key={collection.name}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.6, delay: i * 0.06, ease: luxuryEase }}
                            className="flex-shrink-0 w-[220px] md:w-full"
                        >
                            <Link href={collection.href} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 rounded-[18px]">
                                <div className="relative aspect-[3/4] overflow-hidden rounded-[18px] bg-surface border border-[#E8E3DC] img-zoom">
                                    <Image
                                        src={collection.image}
                                        alt={collection.name}
                                        fill
                                        sizes="(max-width: 768px) 220px, 25vw"
                                        className="object-cover transition-transform duration-500 ease-luxury group-hover:scale-105"
                                    />
                                    {/* Bottom gradient overlay */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/65 to-transparent" />

                                    {/* Text overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                                        <p className="text-[15px] md:text-[17px] font-black uppercase tracking-tight text-white">
                                            {collection.name}
                                        </p>
                                        <p className="text-[10px] md:text-[11px] text-white/65 uppercase tracking-[0.15em] font-medium mt-0.5">
                                            {collection.subtitle}
                                        </p>
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
