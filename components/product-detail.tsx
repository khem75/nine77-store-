'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, MessageCircle, Share2, Ruler } from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { formatPrice } from '@/utils';
import type { Product } from '@/types/product';
import type { AdminProduct } from '@/types/admin';
import RelatedProducts from '@/components/related-products';
import RecentlyViewed, { trackRecentlyViewed } from '@/components/recently-viewed-products';

interface ProductDetailProps {
    product: Product | AdminProduct;
    relatedProducts: Array<Product | AdminProduct>;
}

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState<string>(() => product.sizes[0] || 'M');
    const [currentImage, setCurrentImage] = useState(0);
    const [addedToOrder, setAddedToOrder] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'fit'>('details');

    const [galleryImages, setGalleryImages] = useState(() => 
        product.images.map(img => img || '/luxury-streetwear-garment.png')
    );

    const [isZoomed, setIsZoomed] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        trackRecentlyViewed(product);
    }, [product]);

    const orderUrl = useMemo(
        () => buildWhatsAppUrl({ productName: product.name, price: product.price, size, quantity }),
        [product.name, product.price, size, quantity]
    );

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
        if (!el || isZoomed) return;
        const index = Math.round(el.scrollLeft / el.clientWidth);
        if (index !== currentImage && index >= 0 && index < galleryImages.length) {
            setCurrentImage(index);
        }
    };

    const handleShare = async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: `NINE77 — ${product.name}`,
                    url: window.location.href,
                });
            } catch (e) {}
        } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(window.location.href);
            } catch (e) {}
        }
    };

    const handleOrder = () => {
        setAddedToOrder(true);
        setTimeout(() => setAddedToOrder(false), 2000);
    };

    return (
        <>
            <section className="relative min-h-screen bg-background pt-[96px] pb-6 md:pt-[120px] md:pb-16 px-4 md:px-6 lg:px-8">
                <div className="relative mx-auto max-w-[1440px]">
                    {/* Back link */}
                    <Link
                        href="/shop"
                        className="mb-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-secondary transition-colors duration-200 hover:text-primary"
                    >
                        <ArrowLeft size={12} strokeWidth={1.5} />
                        Back to Shop
                    </Link>

                    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-start">
                        
                        {/* ── Left side: Product Image Gallery ── */}
                        <div className="space-y-4">
                            {/* Main Display container */}
                            <div className="group relative overflow-hidden rounded-[18px] border border-border bg-white aspect-[4/5] md:aspect-auto">
                                <div
                                    ref={scrollRef}
                                    onScroll={handleScroll}
                                    className="relative flex w-full snap-x snap-mandatory overflow-x-auto hide-scrollbar select-none scroll-smooth h-[340px] md:h-[480px] lg:h-[540px]"
                                >
                                    {galleryImages.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="relative w-full h-full flex-shrink-0 snap-start flex items-center justify-center p-4"
                                        >
                                            <Image
                                                src={img}
                                                alt={`${product.name} ${idx + 1}`}
                                                fill
                                                priority={idx === 0}
                                                className="object-contain object-center"
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                                onError={() => {
                                                    const copy = [...galleryImages];
                                                    copy[idx] = '/luxury-streetwear-garment.png';
                                                    setGalleryImages(copy);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Arrow controls */}
                                {galleryImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => scrollToImage(Math.max(0, currentImage - 1))}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-primary border border-border opacity-70 hover:opacity-100 transition-opacity z-30 shadow-sm"
                                            aria-label="Previous"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button
                                            onClick={() => scrollToImage(Math.min(galleryImages.length - 1, currentImage + 1))}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-primary border border-border opacity-70 hover:opacity-100 transition-opacity z-30 shadow-sm"
                                            aria-label="Next"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </>
                                )}

                                {/* Slider Page Indicator dot/numbers */}
                                {galleryImages.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-border bg-white/80 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] font-medium text-secondary backdrop-blur-sm z-30 shadow-sm">
                                        {currentImage + 1} / {galleryImages.length}
                                    </div>
                                )}
                            </div>

                            {/* Slider thumbnails underneath */}
                            {galleryImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                                    {galleryImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => scrollToImage(idx)}
                                            className={`relative shrink-0 w-[54px] h-[54px] overflow-hidden rounded-[8px] border transition-all duration-200 ${
                                                currentImage === idx
                                                    ? 'border-gold bg-white'
                                                    : 'border-border opacity-50 hover:opacity-100 bg-white'
                                            }`}
                                        >
                                            <Image
                                                src={img}
                                                alt="thumbnail"
                                                fill
                                                className="object-contain p-1"
                                                sizes="60px"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ── Right side: Product Information Details ── */}
                        <div className="space-y-4">
                            {/* Product Header */}
                            <div className="rounded-[18px] border border-border bg-white p-6 space-y-4 shadow-luxury">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <span className="text-[9px] uppercase tracking-[0.35em] text-gold font-bold">
                                            {product.category}
                                        </span>
                                        <h1 className="mt-1.5 text-2xl font-black uppercase tracking-tight text-primary sm:text-3xl">
                                            {product.name}
                                        </h1>
                                    </div>
                                    <button
                                        onClick={handleShare}
                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-secondary hover:text-primary"
                                        aria-label="Share"
                                    >
                                        <Share2 size={13} strokeWidth={1.5} />
                                    </button>
                                </div>

                                <p className="text-[13px] leading-relaxed text-secondary font-light">
                                    {product.description}
                                </p>

                                <div className="border-t border-border pt-4">
                                    <span className="text-[9px] uppercase tracking-[0.25em] text-muted">Price</span>
                                    <p className="text-2xl font-semibold text-gold mt-0.5">
                                        {formatPrice(product.price)}
                                    </p>
                                </div>
                            </div>

                            {/* Size selector & WhatsApp Order */}
                            <div className="rounded-[18px] border border-border bg-white p-6 space-y-6 shadow-luxury">
                                {/* Size block */}
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] uppercase tracking-[0.3em] text-secondary">Select Size</span>
                                        <span className="text-[9px] uppercase tracking-wider text-gold flex items-center gap-1 font-semibold">
                                            <Ruler size={10} /> Sizing Chart
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        {product.sizes.map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setSize(s as any)}
                                                className={`h-11 w-11 rounded-[8px] border text-[13px] font-bold uppercase transition-all duration-200 ${
                                                    size === s
                                                        ? 'border-gold bg-gold text-white'
                                                        : 'border-border bg-background text-secondary hover:text-primary'
                                                }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity block */}
                                <div className="space-y-2.5">
                                    <span className="text-[10px] uppercase tracking-[0.3em] text-secondary block">Select Quantity</span>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center rounded-[8px] border border-border bg-background p-1">
                                            <button
                                                type="button"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="flex h-9 w-9 items-center justify-center text-secondary hover:text-primary transition-colors"
                                                aria-label="Decrease quantity"
                                            >
                                                -
                                            </button>
                                            <span className="w-10 text-center text-sm font-semibold select-none text-primary">
                                                {quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="flex h-9 w-9 items-center justify-center text-secondary hover:text-primary transition-colors"
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Specifications Tabs */}
                                <div className="space-y-3">
                                    <div className="flex border-b border-border text-xs font-semibold uppercase tracking-wider">
                                        <button
                                            onClick={() => setActiveTab('details')}
                                            className={`pb-2 pr-4 transition-colors ${activeTab === 'details' ? 'text-primary border-b border-gold' : 'text-secondary/50'}`}
                                        >
                                            Fabric Details
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('fit')}
                                            className={`pb-2 px-4 transition-colors ${activeTab === 'fit' ? 'text-primary border-b border-gold' : 'text-secondary/50'}`}
                                        >
                                            Fit Guide
                                        </button>
                                    </div>
                                    <div className="text-[12px] leading-relaxed text-secondary font-light min-h-[40px]">
                                        {activeTab === 'details' ? (
                                            <p>100% luxury pre-shrunk cotton weight weave, crafted for visual longevity and comfort drape. Meticulous stitch trims.</p>
                                        ) : (
                                            <p>Relaxed oversized fit silhouettes. We suggest ordering your true standard size for the intended modern fashion drape.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Order Action */}
                                <a
                                    href={orderUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={handleOrder}
                                    className="flex w-full h-[50px] items-center justify-center gap-3 rounded-full bg-gold text-[12px] font-bold uppercase tracking-[0.25em] text-white transition-all hover:bg-gold-light shadow-[0_4px_18px_rgba(183,134,74,0.22)]"
                                >
                                    {addedToOrder ? (
                                        <>
                                            <Check size={14} strokeWidth={2.5} />
                                            Redirecting to WhatsApp...
                                        </>
                                    ) : (
                                        <>
                                            <MessageCircle size={14} strokeWidth={2.5} />
                                            Order via WhatsApp
                                        </>
                                    )}
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky mobile checkout button — above the floating bottom nav */}
            <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 border-t border-border px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] md:hidden backdrop-blur-md shadow-luxury-lg">
                <a
                    href={orderUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={handleOrder}
                    className="flex w-full h-12 items-center justify-center gap-2 rounded-full bg-gold text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-[0_4px_20px_rgba(183,134,74,0.25)] transition-all hover:bg-gold-light active:scale-[0.98]"
                    aria-label={`Order ${product.name} via WhatsApp`}
                >
                    <MessageCircle size={14} strokeWidth={2.5} aria-hidden="true" />
                    Order Now — {formatPrice(product.price)}
                </a>
            </div>

            <RelatedProducts products={relatedProducts} />
            <RecentlyViewed currentProductId={product.id} />
        </>
    );
}