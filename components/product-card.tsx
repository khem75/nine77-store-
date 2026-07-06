'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
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
            className="h-full"
        >
            <Link href={`/product/${product.slug}`} className="block h-full">
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
                    className="group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-white/8 bg-[#0B0B0B] shadow-[0_10px_30px_rgba(0,0,0,0.18)] md:rounded-[28px] md:bg-background-2 md:shadow-card"
                >
                    {/* Glare effect */}
                    {isHovered && (
                        <div
                            className="pointer-events-none absolute inset-0 z-20 rounded-[18px] opacity-30 md:rounded-[28px]"
                            style={{
                                background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.15), transparent 60%)`,
                            }}
                        />
                    )}

                    {/* Image area */}
                    <div className="relative overflow-hidden bg-black/40 p-0 md:p-0">
                        {/* Mobile image height reduced to 132px (25% height reduction). Aspect ratio maintained, no cropping */}
                        <div className="relative h-[132px] w-full overflow-hidden rounded-[14px] md:h-auto md:aspect-[4/5] md:rounded-none">
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03] md:group-hover:scale-105 md:group-hover:opacity-0"
                                sizes="(max-width: 768px) 48vw, (max-width: 1280px) 45vw, 25vw"
                                loading="lazy"
                            />
                            {product.images[1] && (
                                <Image
                                    src={product.images[1]}
                                    alt={`${product.name} — alternate`}
                                    fill
                                    className="object-cover object-center opacity-0 transition-all duration-700 group-hover:opacity-100"
                                    sizes="(max-width: 768px) 48vw, (max-width: 1280px) 45vw, 25vw"
                                    loading="lazy"
                                />
                            )}
                        </div>

                        {/* Top badges */}
                        <div className="absolute left-3 top-3 right-3 flex items-start justify-between md:left-4 md:top-4 md:right-4">
                            {badge && (
                                <span className="rounded-full bg-gold px-2 py-1 text-[7px] font-bold uppercase tracking-[0.28em] text-black md:px-3 md:py-1 md:text-[9px]">
                                    {badge}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Card body (Contains Name and Price only) */}
                    <div className="flex flex-1 flex-col gap-3 px-3 pb-3 pt-2 md:p-5">
                        <div className="flex items-start justify-between gap-2 md:gap-3">
                            <div className="min-w-0">
                                <span className="block truncate text-[16px] font-semibold uppercase tracking-[0.06em] text-white transition-colors duration-300 group-hover:text-gold md:text-base md:font-bold">
                                    {product.name}
                                </span>
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="text-[18px] font-black text-gold md:text-base">{formatPrice(product.price)}</p>
                            </div>
                        </div>
                    </div>
                </motion.article>
            </Link>
        </motion.div>
    );
}