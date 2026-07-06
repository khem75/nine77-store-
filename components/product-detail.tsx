'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageCircle, ArrowLeft, Check, Share2 } from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { formatPrice } from '@/utils';
import type { Product } from '@/types/product';
import RelatedProducts from '@/components/related-products';
import RecentlyViewed, { trackRecentlyViewed } from '@/components/recently-viewed-products';

interface ProductDetailProps {
    product: Product;
    relatedProducts: Product[];
}

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');
    const [currentImage, setCurrentImage] = useState(0);
    const [addedToOrder, setAddedToOrder] = useState(false);
    const detailRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(detailRef, { once: true, amount: 0.2 });

    useEffect(() => {
        trackRecentlyViewed(product);
    }, [product]);

    const orderUrl = useMemo(
        () => buildWhatsAppUrl({ productName: product.name, price: product.price, size, quantity }),
        [product.name, product.price, size, quantity]
    );

    const nextImage = () =>
        setCurrentImage((p) => (p === product.images.length - 1 ? 0 : p + 1));
    const prevImage = () =>
        setCurrentImage((p) => (p === 0 ? product.images.length - 1 : p - 1));

    const handleOrder = () => {
        setAddedToOrder(true);
        setTimeout(() => setAddedToOrder(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: `NINE77 — ${product.name}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <>
            <section className="relative min-h-screen py-4 md:py-20">
                {/* Ambient glow */}
                <div className="pointer-events-none fixed right-1/4 top-1/3 h-80 w-80 -translate-y-1/2 translate-x-1/2 rounded-full bg-gold/5 blur-[120px]" />

                <div className="relative mx-auto max-w-7xl px-4 lg:px-8" style={{ overflowX: 'hidden' }}>
                    {/* Back link */}
                    <Link
                        href="/shop"
                        className="mb-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40 transition-colors duration-300 hover:text-gold"
                    >
                        <ArrowLeft size={13} />
                        Back to Shop
                    </Link>

                    <div
                        ref={detailRef}
                        className="grid gap-6 lg:gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start"
                    >
                        {/* ── Gallery ── */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-4"
                        >
                            {/* Main image */}
                            <div className="group relative overflow-hidden rounded-[32px] border border-white/8 bg-background-2 shadow-cinematic">
                                <div className="relative h-[320px] md:h-auto md:aspect-[4/5] w-full">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentImage}
                                            initial={{ opacity: 0, scale: 1.04 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.97 }}
                                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                            className="absolute inset-0"
                                        >
                                            <Image
                                                src={product.images[currentImage]}
                                                alt={product.name}
                                                fill
                                                priority
                                                className="object-cover"
                                                sizes="(max-width: 1024px) 100vw, 55vw"
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Nav arrows */}
                                {product.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition-all duration-300 hover:bg-gold hover:text-black"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition-all duration-300 hover:bg-gold hover:text-black"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </>
                                )}

                                {/* Image counter */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-1.5 text-[9px] uppercase tracking-[0.3em] text-white/80 backdrop-blur-sm">
                                    {currentImage + 1} / {product.images.length}
                                </div>
                            </div>

                            {/* Thumbnail strip (Horizontal slider underneath) */}
                            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1" style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}>
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImage(idx)}
                                        className={`relative shrink-0 w-[68px] h-[85px] overflow-hidden rounded-2xl border transition-all duration-300 ${
                                            currentImage === idx
                                                ? 'border-gold shadow-glow-sm scale-105'
                                                : 'border-white/8 opacity-60 hover:opacity-100'
                                        }`}
                                        style={{ scrollSnapAlign: 'start' }}
                                    >
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={img}
                                                alt={`${product.name} ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* ── Product info ── */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-3"
                        >
                            {/* Identity */}
                            <div className="rounded-[20px] border border-white/8 bg-surface p-4 md:p-8">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <span className="text-[9px] uppercase tracking-[0.35em] text-gold">
                                            {product.category}
                                        </span>
                                        <h1 className="mt-1.5 text-2xl font-black uppercase leading-[0.92] tracking-tight text-white sm:text-4xl">
                                            {product.name}
                                        </h1>
                                    </div>
                                    <button
                                        onClick={handleShare}
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:border-gold/30 hover:text-gold"
                                        aria-label="Share"
                                    >
                                        <Share2 size={13} />
                                    </button>
                                </div>

                                <p className="mt-2 text-xs leading-relaxed text-white/55">
                                    {product.description}
                                </p>

                                <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                                    <div>
                                        <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">Price</span>
                                        <p className="mt-0.5 text-2xl font-black text-gold">
                                            {formatPrice(product.price)}
                                        </p>
                                    </div>
                                    {product.newArrival && (
                                        <span className="rounded-full bg-gold px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.25em] text-black">
                                            New Arrival
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Order options */}
                            <div className="rounded-[20px] border border-white/8 bg-surface p-4 space-y-3 md:p-8 md:space-y-6">
                                {/* Size */}
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-[10px] uppercase tracking-[0.35em] text-white/50">
                                            Select Size
                                        </span>
                                        <span className="text-[9px] uppercase tracking-wider text-gold">
                                            S — M — L — XL
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map((s) => (
                                            <motion.button
                                                key={s}
                                                whileTap={{ scale: 0.92 }}
                                                onClick={() => setSize(s as any)}
                                                className={`relative h-[48px] w-[48px] rounded-[12px] border text-base font-bold uppercase tracking-wider transition-all duration-300 ${
                                                    size === s
                                                        ? 'border-gold bg-gold text-black shadow-glow-sm'
                                                        : 'border-white/10 bg-white/5 text-white/70 hover:border-gold/30 hover:text-gold'
                                                }`}
                                            >
                                                {size === s && (
                                                    <motion.span
                                                        layoutId="size-selected"
                                                        className="absolute inset-0 rounded-[12px] bg-gold"
                                                        style={{ zIndex: -1 }}
                                                    />
                                                )}
                                                {s}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div>
                                    <span className="mb-2 block text-[10px] uppercase tracking-[0.35em] text-white/50">
                                        Quantity
                                    </span>
                                    <div className="inline-flex h-11 max-w-[180px] items-center rounded-2xl border border-white/10 bg-black/50">
                                        <button
                                            onClick={() => setQuantity((p) => Math.max(1, p - 1))}
                                            className="flex h-10 w-10 items-center justify-center text-lg font-bold text-white/60 transition-colors hover:text-gold"
                                        >
                                            −
                                        </button>
                                        <span className="flex-1 text-center text-base font-black text-white">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity((p) => p + 1)}
                                            className="flex h-10 w-10 items-center justify-center text-lg font-bold text-white/60 transition-colors hover:text-gold"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Order total */}
                                <div className="flex items-center justify-between rounded-2xl border border-gold/10 bg-gold/5 px-5 py-3">
                                    <span className="text-xs uppercase tracking-[0.2em] text-white/50">
                                        Total
                                    </span>
                                    <span className="text-xl font-black text-gold">
                                        {formatPrice(product.price * quantity)}
                                    </span>
                                </div>

                                {/* WhatsApp CTA */}
                                <motion.a
                                    href={orderUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={handleOrder}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    id={`whatsapp-order-${product.id}`}
                                    className="flex w-full h-[54px] items-center justify-center gap-3 rounded-[16px] bg-gold text-sm font-bold uppercase tracking-[0.25em] text-black shadow-glow transition-all duration-500 hover:shadow-glow-lg"
                                >
                                    <AnimatePresence mode="wait">
                                        {addedToOrder ? (
                                            <motion.span
                                                key="check"
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center gap-2"
                                            >
                                                <Check size={18} />
                                                Opening WhatsApp...
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key="order"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="flex items-center gap-3"
                                            >
                                                <MessageCircle size={18} strokeWidth={2.5} />
                                                Order via WhatsApp
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.a>

                                <p className="text-center text-[9px] uppercase tracking-[0.3em] text-white/25">
                                    Secure · Fast · Easy · No cart required
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <RelatedProducts products={relatedProducts} />
            <RecentlyViewed currentProductId={product.id} />
        </>
    );
}