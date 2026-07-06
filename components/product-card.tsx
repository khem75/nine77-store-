'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowRight, Eye, Heart, MessageCircle, X } from 'lucide-react';
import type { Product } from '@/types/product';
import { formatPrice } from '@/utils';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

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
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState<(typeof product.sizes)[number]>(product.sizes[1] ?? product.sizes[0]);

    const orderUrl = useMemo(
        () =>
            buildWhatsAppUrl({
                productName: product.name,
                price: product.price,
                size: selectedSize,
                quantity: 1,
            }),
        [product.name, product.price, selectedSize]
    );

    useEffect(() => {
        if (!isQuickViewOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsQuickViewOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isQuickViewOpen]);

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
        <>
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
                    <div className="relative overflow-hidden bg-black/40 p-3 pb-2 md:p-0">
                        <div className="relative h-[176px] w-full overflow-hidden rounded-[14px] md:h-auto md:aspect-[4/5] md:rounded-none">
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.03] md:object-cover md:p-0 md:group-hover:scale-105 md:group-hover:opacity-0"
                                sizes="(max-width: 768px) 48vw, (max-width: 1280px) 45vw, 25vw"
                                loading="lazy"
                            />
                            {product.images[1] && (
                                <Image
                                    src={product.images[1]}
                                    alt={`${product.name} — alternate`}
                                    fill
                                    className="object-contain p-4 opacity-0 transition-all duration-700 group-hover:opacity-100 md:object-cover md:p-0"
                                    sizes="(max-width: 768px) 48vw, (max-width: 1280px) 45vw, 25vw"
                                    loading="lazy"
                                />
                            )}
                        </div>

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background-2/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        {/* Top badges */}
                        <div className="absolute left-3 top-3 right-3 flex items-start justify-between md:left-4 md:top-4 md:right-4">
                            {badge && (
                                <span className="rounded-full bg-gold px-2 py-1 text-[7px] font-bold uppercase tracking-[0.28em] text-black md:px-3 md:py-1 md:text-[9px]">
                                    {badge}
                                </span>
                            )}
                            <div className="ml-auto flex items-center gap-2">
                                <button
                                    type="button"
                                    aria-label="Wishlist"
                                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white/55 backdrop-blur-sm transition-all duration-300 hover:border-gold/30 hover:text-gold md:h-8 md:w-8"
                                >
                                    <Heart size={11} />
                                </button>
                                <span className="rounded-full bg-black/60 px-3 py-1 text-[9px] uppercase tracking-[0.25em] text-white/60 backdrop-blur-sm">
                                    {product.category}
                                </span>
                            </div>
                        </div>

                        {/* Quick view button */}
                        <div className="absolute bottom-3 left-3 right-3 hidden justify-center md:bottom-4 md:left-4 md:right-4 md:flex md:opacity-0 md:transition-opacity md:duration-500 md:group-hover:opacity-100">
                            <Link
                                href={`/product/${product.slug}`}
                                id={`product-card-view-${product.id}`}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-gold/90 px-5 text-[10px] font-bold uppercase tracking-[0.3em] text-black opacity-0 shadow-glow-sm backdrop-blur-sm transition-all duration-500 hover:bg-gold group-hover:translate-y-0 group-hover:opacity-100 md:translate-y-8"
                            >
                                <Eye size={12} />
                                Quick View
                            </Link>
                        </div>
                    </div>

                    {/* Card body */}
                    <div className="flex flex-1 flex-col gap-3 px-3 pb-3 pt-2 md:p-5">
                        <div className="flex items-start justify-between gap-2 md:gap-3">
                            <div className="min-w-0">
                                <Link
                                    href={`/product/${product.slug}`}
                                    className="block truncate text-[16px] font-semibold uppercase tracking-[0.06em] text-white transition-colors duration-300 hover:text-gold md:text-base md:font-bold"
                                >
                                    {product.name}
                                </Link>
                                <p className="mt-1 text-[12px] uppercase tracking-[0.22em] text-white/38 md:text-[10px] md:tracking-[0.25em]">
                                    {product.sizes.join(' · ')}
                                </p>
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="text-[18px] font-black text-gold md:text-base">{formatPrice(product.price)}</p>
                            </div>
                        </div>

                        {product.colors?.length ? (
                            <div className="flex items-center gap-1.5 md:gap-2">
                                {product.colors.slice(0, 4).map((color) => (
                                    <span
                                        key={color}
                                        className="h-3.5 w-3.5 rounded-full border border-white/10 shadow-[0_0_0_1px_rgba(0,0,0,0.22)] md:h-4 md:w-4"
                                        style={{ backgroundColor: color }}
                                        aria-label={color}
                                    />
                                ))}
                            </div>
                        ) : null}

                        <div className="mt-auto flex flex-col gap-2 md:hidden">
                            <button
                                type="button"
                                onClick={() => setIsQuickViewOpen(true)}
                                className="flex h-10 w-full items-center justify-center rounded-full border border-gold/45 bg-transparent text-[10px] font-semibold uppercase tracking-[0.24em] text-gold transition-all duration-[250ms] hover:bg-gold/[0.08] hover:text-white"
                            >
                                Quick View
                            </button>
                        </div>

                        {/* Bottom CTA */}
                        <Link
                            href={`/product/${product.slug}`}
                            className="group/btn mt-auto hidden items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/60 transition-all duration-300 hover:border-gold/30 hover:bg-gold/5 hover:text-gold md:flex"
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

            <AnimatePresence>
                {isQuickViewOpen ? (
                    <motion.div
                        className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 px-4 pb-4 pt-16 backdrop-blur-md md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsQuickViewOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 40, opacity: 0, scale: 0.98 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 30, opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                            onClick={(event) => event.stopPropagation()}
                            className="w-full max-w-md overflow-hidden rounded-[24px] border border-white/10 bg-[#0B0B0B] shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
                        >
                            <div className="relative h-64 bg-black/60 p-4">
                                <button
                                    type="button"
                                    aria-label="Close quick view"
                                    onClick={() => setIsQuickViewOpen(false)}
                                    className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/70 transition-colors duration-300 hover:border-gold/30 hover:text-gold"
                                >
                                    <X size={14} />
                                </button>

                                <div className="relative h-full w-full overflow-hidden rounded-[18px]">
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-4"
                                        sizes="100vw"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 px-4 pb-4 pt-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.35em] text-gold/80">Quick View</p>
                                        <h3 className="mt-2 text-xl font-bold uppercase tracking-[0.06em] text-white">
                                            {product.name}
                                        </h3>
                                    </div>
                                    <p className="text-xl font-black text-gold">{formatPrice(product.price)}</p>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">Available Sizes</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => setSelectedSize(size)}
                                                className={`h-10 min-w-10 rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${selectedSize === size
                                                    ? 'border-gold bg-gold text-black'
                                                    : 'border-white/10 bg-white/5 text-white/70 hover:border-gold/30 hover:text-gold'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {product.colors?.length ? (
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">Color Swatches</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            {product.colors.slice(0, 4).map((color) => (
                                                <span
                                                    key={color}
                                                    className="h-5 w-5 rounded-full border border-white/10"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : null}

                                <div className="flex items-center gap-2 pt-1">
                                    <a
                                        href={orderUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-gold/60 bg-transparent text-[10px] font-bold uppercase tracking-[0.28em] text-gold transition-all duration-300 hover:bg-gold hover:text-black"
                                    >
                                        <MessageCircle size={12} />
                                        Order
                                    </a>
                                    <Link
                                        href={`/product/${product.slug}`}
                                        onClick={() => setIsQuickViewOpen(false)}
                                        className="flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-[10px] font-bold uppercase tracking-[0.28em] text-white/70 transition-all duration-300 hover:border-gold/30 hover:text-gold"
                                    >
                                        Details
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </>
    );
}