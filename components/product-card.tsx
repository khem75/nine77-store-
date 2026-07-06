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

    const [imgSrc, setImgSrc] = useState(product.images[0] || '/luxury-streetwear-garment.png');
    const [fallbackActive, setFallbackActive] = useState(false);

    const handleImageError = () => {
        if (!fallbackActive) {
            setImgSrc('/luxury-streetwear-garment.png');
            setFallbackActive(true);
        }
    };

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
            className="w-full max-w-none aspect-[4/5] md:aspect-auto md:h-full"
        >
            <Link href={`/product/${product.slug}`} className="block w-full max-w-none h-full">
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
                    className="group relative flex w-full max-w-none flex-col overflow-hidden rounded-[18px] border border-white/8 bg-[#0B0B0B] shadow-[0_10px_30px_rgba(0,0,0,0.18)] p-4 md:p-0 md:rounded-[28px] md:bg-background-2 md:shadow-card aspect-[4/5] md:aspect-auto justify-between h-full"
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
                    <div className="relative w-full h-[75%] overflow-hidden rounded-[12px] bg-[#090909] shrink-0 md:h-auto md:aspect-[4/5] md:rounded-none md:p-0 md:bg-[#090909]">
                        {/* Mobile image aspect ratio & fallback. Desktop image hover swap */}
                        <div className="relative w-full h-full md:absolute md:inset-0">
                            <Image
                                src={imgSrc}
                                alt={product.name}
                                width={400}
                                height={500}
                                loading="lazy"
                                onError={handleImageError}
                                className="transition-transform duration-700 group-hover:scale-[1.03] md:group-hover:scale-105 md:group-hover:opacity-0 md:absolute md:inset-0 md:w-full md:h-full md:object-contain"
                                style={{
                                    aspectRatio: '4 / 5',
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'contain',
                                    overflow: 'hidden',
                                    borderRadius: 'inherit'
                                }}
                            />
                            {product.images[1] && (
                                <div className="hidden md:block absolute inset-0">
                                    <Image
                                        src={product.images[1]}
                                        alt={`${product.name} — alternate`}
                                        fill
                                        className="object-contain object-center opacity-0 transition-all duration-700 group-hover:opacity-100"
                                        sizes="(max-width: 768px) 48vw, (max-width: 1280px) 45vw, 25vw"
                                        loading="lazy"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Top badges (desktop only) */}
                        <div className="hidden md:flex absolute left-4 top-4 right-4 items-start justify-between z-10">
                            {badge && (
                                <span className="rounded-full bg-gold px-3 py-1 text-[9px] font-bold uppercase tracking-[0.28em] text-black">
                                    {badge}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Card body (Contains Name and Price only, takes remaining 25% on mobile) */}
                    <div className="flex h-[25%] flex-col justify-center min-h-0 pt-1 md:h-auto md:flex-1 md:gap-3 md:px-5 md:pb-5 md:pt-4">
                        <div className="flex items-center justify-between gap-2 md:gap-3 min-w-0">
                            <div className="min-w-0 flex-1">
                                <span className="block truncate text-[14px] font-semibold uppercase tracking-[0.06em] text-white transition-colors duration-300 group-hover:text-gold md:text-base md:font-bold">
                                    {product.name}
                                </span>
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="text-[16px] font-black text-gold md:text-base">{formatPrice(product.price)}</p>
                            </div>
                        </div>
                    </div>
                </motion.article>
            </Link>
        </motion.div>
    );
}