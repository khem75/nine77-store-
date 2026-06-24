'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Eye, ArrowRight } from 'lucide-react';
import type { Product } from '@/types/product';
import { formatPrice } from '@/utils';

interface Tilt {
    x: number;
    y: number;
    glareX: number;
    glareY: number;
}

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true, amount: 0.2 });
    const [tilt, setTilt] = useState<Tilt>({ x: 0, y: 0, glareX: 50, glareY: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const tiltX = ((y - centerY) / centerY) * -10;
        const tiltY = ((x - centerX) / centerX) * 10;
        setTilt({
            x: tiltX,
            y: tiltY,
            glareX: (x / rect.width) * 100,
            glareY: (y / rect.height) * 100,
        });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
        setIsHovered(false);
    };

    const badge = product.newArrival ? 'NEW' : product.featured ? 'BESTSELLER' : null;

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
            }}
        >
            <motion.article
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                style={{
                    transform: isHovered
                        ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
                        : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
                    transition: isHovered
                        ? 'transform 0.1s ease'
                        : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="group relative overflow-hidden rounded-[28px] border border-white/8 bg-background-2 shadow-card"
            >
                {/* Glare effect */}
                {isHovered && (
                    <div
                        className="pointer-events-none absolute inset-0 z-20 rounded-[28px] opacity-30"
                        style={{
                            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.15), transparent 60%)`,
                        }}
                    />
                )}

                {/* Image area */}
                <div className="relative overflow-hidden bg-black/40">
                    <div className="relative aspect-[4/5] w-full">
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-0"
                            sizes="(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 25vw"
                        />
                        {product.images[1] && (
                            <Image
                                src={product.images[1]}
                                alt={`${product.name} — alternate`}
                                fill
                                className="object-cover opacity-0 transition-all duration-700 group-hover:opacity-100"
                                sizes="(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 25vw"
                            />
                        )}
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background-2/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Top badges */}
                    <div className="absolute left-4 top-4 right-4 flex items-start justify-between">
                        {badge && (
                            <span className="rounded-full bg-gold px-3 py-1 text-[9px] font-bold uppercase tracking-[0.3em] text-black">
                                {badge}
                            </span>
                        )}
                        <div className="ml-auto">
                            <span className="rounded-full bg-black/60 px-3 py-1 text-[9px] uppercase tracking-[0.25em] text-white/60 backdrop-blur-sm">
                                {product.category}
                            </span>
                        </div>
                    </div>

                    {/* Quick view button */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                        <Link
                            href={`/product/${product.slug}`}
                            id={`product-card-view-${product.id}`}
                            className="inline-flex translate-y-8 items-center gap-2 rounded-full bg-gold/90 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.3em] text-black opacity-0 shadow-glow-sm backdrop-blur-sm transition-all duration-500 hover:bg-gold group-hover:translate-y-0 group-hover:opacity-100"
                        >
                            <Eye size={12} />
                            Quick View
                        </Link>
                    </div>
                </div>

                {/* Card body */}
                <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <Link
                                href={`/product/${product.slug}`}
                                className="block truncate text-base font-bold uppercase tracking-[0.06em] text-white transition-colors duration-300 hover:text-gold"
                            >
                                {product.name}
                            </Link>
                            <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/35">
                                {product.sizes.join(' · ')}
                            </p>
                        </div>
                        <div className="shrink-0 text-right">
                            <p className="text-base font-black text-gold">{formatPrice(product.price)}</p>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <Link
                        href={`/product/${product.slug}`}
                        className="group/btn mt-4 flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/60 transition-all duration-300 hover:border-gold/30 hover:bg-gold/5 hover:text-gold"
                    >
                        <span>Order Now</span>
                        <ArrowRight
                            size={13}
                            className="transition-transform duration-300 group-hover/btn:translate-x-1"
                        />
                    </Link>
                </div>
            </motion.article>
        </motion.div>
    );
}