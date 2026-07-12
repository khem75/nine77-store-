'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const looks = [
    {
        name: 'City Minimal',
        description: 'Vintage T-Shirt + Linen Trousers',
        image: '/products/vintage-t-shirt-1.jpg',
        href: '/shop?search=vintage',
    },
    {
        name: 'Weekend Uniform',
        description: 'Linen Shirt + Linen Trousers',
        image: '/products/linen-shirt-1.jpg',
        href: '/shop?search=Linen',
    },
    {
        name: 'Night Shift',
        description: 'Windcheater + AMD Pants',
        image: '/products/windcheater-1.jpg',
        href: '/shop?category=Outerwear',
    },
    {
        name: 'Utility Black',
        description: 'Henley + Barrel Pants',
        image: '/products/barrel-pants-1.jpg',
        href: '/shop?search=barrel',
    },
];

export default function ShopTheLook() {
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
                        Outfit Inspiration
                    </p>
                    <h2 className="mt-2 text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
                        Shop The Look
                    </h2>
                </motion.div>

                {/* Editorial Looks Grid */}
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {looks.map((look, idx) => (
                        <motion.div
                            key={look.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.75, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full"
                        >
                            <Link
                                href={look.href}
                                className="group relative block h-[420px] md:h-[480px] overflow-hidden rounded-[24px] border border-white/[0.06] bg-[#111111]"
                            >
                                {/* Lookbook Campaign Image */}
                                <Image
                                    src={look.image}
                                    alt={look.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    loading="lazy"
                                    className="object-cover object-top transition-transform duration-750 ease-luxury group-hover:scale-[1.06] group-hover:translate-y-[4px] opacity-80"
                                />
                                
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

                                {/* Interactive diagonal shine sweep on outfit card hover */}
                                <motion.div
                                    initial={{ x: '-100%', opacity: 0 }}
                                    whileHover={{ x: '100%', opacity: [0, 1, 0] }}
                                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                                    className="absolute inset-0 pointer-events-none z-20"
                                    style={{
                                        background: 'linear-gradient(110deg, transparent 35%, rgba(212,175,55,0.08) 48%, rgba(255,255,255,0.25) 50%, rgba(212,175,55,0.08) 52%, transparent 65%)'
                                    }}
                                />

                                {/* Text content and link overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold uppercase tracking-wider text-white leading-tight">
                                            {look.name}
                                        </h3>
                                        <p className="mt-1.5 text-xs text-white/50 font-light tracking-wide italic">
                                            {look.description}
                                        </p>
                                    </div>
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/70 transition-all duration-300 group-hover:scale-105 group-hover:bg-gold group-hover:text-black">
                                        <ArrowUpRight size={14} strokeWidth={2} />
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
