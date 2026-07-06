'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, MessageCircle, Share2 } from 'lucide-react';
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
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    // Gallery UX States
    const [isZoomed, setIsZoomed] = useState(false);
    const [showControls, setShowControls] = useState(true);

    const detailRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const thumbnailRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(detailRef, { once: true, amount: 0.2 });

    // Drag-to-Scroll state for Desktop Mouse dragging
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const [galleryImages, setGalleryImages] = useState(() => 
        product.images.map(img => img || '/luxury-streetwear-garment.png')
    );

    const handleGalleryImageError = (index: number) => {
        setGalleryImages(prev => {
            if (prev[index] !== '/luxury-streetwear-garment.png') {
                const copy = [...prev];
                copy[index] = '/luxury-streetwear-garment.png';
                return copy;
            }
            return prev;
        });
    };

    useEffect(() => {
        trackRecentlyViewed(product);
    }, [product]);

    const orderUrl = useMemo(
        () => buildWhatsAppUrl({ productName: product.name, price: product.price, size, quantity }),
        [product.name, product.price, size, quantity]
    );

    // Navigation and Scrolling actions
    const scrollToImage = (index: number) => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollTo({
            left: index * el.clientWidth,
            behavior: 'smooth'
        });
        setCurrentImage(index);
    };

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el || isZoomed || isDragging.current) return;
        const index = Math.round(el.scrollLeft / el.clientWidth);
        if (index !== currentImage && index >= 0 && index < galleryImages.length) {
            setCurrentImage(index);
        }
    };

    // Auto-scroll active thumbnail into center view
    useEffect(() => {
        const thumbContainer = thumbnailRef.current;
        if (!thumbContainer) return;
        const activeThumb = thumbContainer.children[currentImage] as HTMLElement;
        if (activeThumb) {
            activeThumb.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, [currentImage]);

    // Keyboard Arrow Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isZoomed) return;
            if (e.key === 'ArrowRight') {
                scrollToImage(Math.min(galleryImages.length - 1, currentImage + 1));
            } else if (e.key === 'ArrowLeft') {
                scrollToImage(Math.max(0, currentImage - 1));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentImage, galleryImages.length, isZoomed]);

    // Mouse Drag to Scroll handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        const el = scrollRef.current;
        if (!el || isZoomed) return;
        isDragging.current = true;
        startX.current = e.pageX - el.offsetLeft;
        scrollLeft.current = el.scrollLeft;
    };

    const handleMouseLeave = () => {
        isDragging.current = false;
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        isDragging.current = false;
        const el = scrollRef.current;
        if (!el) return;
        const walk = e.pageX - el.offsetLeft - startX.current;
        const targetIndex = Math.round((scrollLeft.current - walk) / el.clientWidth);
        scrollToImage(Math.max(0, Math.min(galleryImages.length - 1, targetIndex)));
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const el = scrollRef.current;
        if (!el) return;
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startX.current) * 1.5;
        el.scrollLeft = scrollLeft.current - walk;
    };

    const handleSingleTap = () => {
        setShowControls(prev => !prev);
    };

    const handleDoubleTap = () => {
        setIsZoomed(prev => !prev);
    };

    const handleShare = async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: `NINE77 — ${product.name}`,
                    url: window.location.href,
                });
            } catch (e) {
                // Ignore user abort or share errors
            }
        } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(window.location.href);
            } catch (e) {
                // fallback
            }
        }
    };

    const handleOrder = () => {
        setAddedToOrder(true);
        setTimeout(() => setAddedToOrder(false), 2000);
    };

    return (
        <>
            <section className="relative min-h-screen py-2.5 md:py-20">
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
                        className="grid gap-4 lg:gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start"
                    >
                        {/* ── Gallery ── */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-4"
                        >
                            {/* Main image scroll snapping viewport */}
                            <div className="group relative overflow-hidden rounded-[24px] border border-white/8 bg-[#090909] shadow-cinematic">
                                <div
                                    ref={scrollRef}
                                    onScroll={handleScroll}
                                    onMouseDown={handleMouseDown}
                                    onMouseLeave={handleMouseLeave}
                                    onMouseUp={handleMouseUp}
                                    onMouseMove={handleMouseMove}
                                    className={`relative flex w-full snap-x snap-mandatory overflow-x-auto hide-scrollbar select-none ${
                                        isZoomed ? 'overflow-x-hidden touch-none' : 'scroll-smooth'
                                    }`}
                                    style={{
                                        height: 'clamp(340px, 65vw, 460px)',
                                        scrollbarWidth: 'none',
                                    }}
                                >
                                    {galleryImages.map((img, idx) => {
                                        const isPreload = idx === currentImage || idx === currentImage - 1 || idx === currentImage + 1;
                                        return (
                                            <div
                                                key={idx}
                                                className="relative w-full h-full flex-shrink-0 snap-start flex items-center justify-center p-3"
                                                onClick={handleSingleTap}
                                                onDoubleClick={handleDoubleTap}
                                            >
                                                <motion.div
                                                    drag={isZoomed && idx === currentImage}
                                                    dragConstraints={{ left: -150, right: 150, top: -150, bottom: 150 }}
                                                    dragElastic={0.1}
                                                    animate={{ scale: isZoomed && idx === currentImage ? 2.2 : 1 }}
                                                    transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                                                    className="relative w-full h-full"
                                                >
                                                    <Image
                                                        src={img}
                                                        alt={`${product.name} ${idx + 1}`}
                                                        fill
                                                        priority={isPreload}
                                                        loading={isPreload ? undefined : 'lazy'}
                                                        className="object-contain object-center select-none"
                                                        sizes="(max-width: 1024px) 100vw, 55vw"
                                                        onError={() => handleGalleryImageError(idx)}
                                                    />
                                                </motion.div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Arrow controls - always visible on mobile at 80% opacity, hover-only on desktop */}
                                {galleryImages.length > 1 && showControls && (
                                    <>
                                        <button
                                            onClick={() => scrollToImage(Math.max(0, currentImage - 1))}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white border border-white/10 backdrop-blur-md opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-all duration-[220ms] hover:bg-gold hover:text-black hover:scale-105 active:scale-95 z-30"
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button
                                            onClick={() => scrollToImage(Math.min(galleryImages.length - 1, currentImage + 1))}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white border border-white/10 backdrop-blur-md opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-all duration-[220ms] hover:bg-gold hover:text-black hover:scale-105 active:scale-95 z-30"
                                            aria-label="Next image"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </>
                                )}

                                {/* Counter Pill - bottom center glass counter */}
                                {showControls && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/60 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-bold text-white/90 backdrop-blur-md shadow-glow-sm pointer-events-none z-30">
                                        {currentImage + 1} / {galleryImages.length}
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail strip (Horizontal slider underneath) */}
                            <div 
                                ref={thumbnailRef}
                                className="flex gap-2 overflow-x-auto hide-scrollbar pb-1" 
                                style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
                            >
                                {galleryImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => scrollToImage(idx)}
                                        className={`relative shrink-0 w-[60px] h-[60px] overflow-hidden rounded-[12px] border transition-all duration-[220ms] ease-out ${
                                            currentImage === idx
                                                ? 'border-gold shadow-glow-sm scale-[1.05]'
                                                : 'border-white/8 opacity-60 hover:opacity-100 hover:scale-[1.02]'
                                        }`}
                                        style={{ scrollSnapAlign: 'start' }}
                                    >
                                        <div className="relative w-full h-full bg-[#090909]">
                                            <Image
                                                src={img}
                                                alt={`${product.name} ${idx + 1}`}
                                                fill
                                                className="object-contain p-1"
                                                sizes="80px"
                                                onError={() => handleGalleryImageError(idx)}
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
                            className="space-y-2.5 md:space-y-3"
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

                                <div className="mt-2">
                                    <p className={`text-xs leading-snug text-white/55 transition-all duration-300 ${!isDescriptionExpanded ? 'line-clamp-2' : ''}`}>
                                        {product.description}
                                    </p>
                                    {product.description && product.description.length > 60 && (
                                        <button
                                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                            className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gold hover:text-gold-light"
                                        >
                                            {isDescriptionExpanded ? 'Read Less' : 'Read More'}
                                        </button>
                                    )}
                                </div>

                                <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-2 md:mt-3 md:pt-3">
                                    <div>
                                        <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">Price</span>
                                        <p className="mt-0.5 text-[32px] md:text-2xl font-black text-gold leading-none">
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
                            <div className="rounded-[20px] border border-white/8 bg-surface p-4 space-y-3.5 md:p-8 md:space-y-6">
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
                                                className={`relative h-[44px] w-[44px] rounded-[10px] border text-[15px] font-bold uppercase tracking-wider transition-all duration-300 ${
                                                    size === s
                                                        ? 'border-gold bg-gold text-black shadow-glow-sm'
                                                        : 'border-white/10 bg-white/5 text-white/70 hover:border-gold/30 hover:text-gold'
                                                }`}
                                            >
                                                {size === s && (
                                                    <motion.span
                                                        layoutId="size-selected"
                                                        className="absolute inset-0 rounded-[10px] bg-gold"
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
                                    <div className="inline-flex h-[40px] w-[150px] items-center justify-between rounded-[10px] border border-white/10 bg-black/50 p-0.5">
                                        <button
                                            onClick={() => setQuantity((p) => Math.max(1, p - 1))}
                                            className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] text-lg font-bold text-white/60 transition-colors hover:text-gold hover:bg-white/5 shrink-0"
                                        >
                                            −
                                        </button>
                                        <span className="flex-1 text-center text-sm font-black text-white">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity((p) => p + 1)}
                                            className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] text-lg font-bold text-white/60 transition-colors hover:text-gold hover:bg-white/5 shrink-0"
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
                                    className="flex w-full h-[50px] items-center justify-center gap-3 rounded-[14px] bg-gold text-[15px] font-bold uppercase tracking-[0.2em] text-black shadow-glow transition-all duration-500 hover:shadow-glow-lg"
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

                                <p className="text-center text-[8px] uppercase tracking-[0.25em] text-white/25 mt-2 md:mt-3">
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