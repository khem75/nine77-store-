'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, MessageCircle, X } from 'lucide-react';
import type { Product } from '@/types/product';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { formatPrice } from '@/utils';

const productCopy = {
    fabric: 'Premium heavyweight cotton with a structured hand feel and luxury finish.',
    care: 'Cold wash inside out. Do not tumble dry. Hang dry in shade. Cool iron only.',
    delivery: 'Estimated delivery: 3-7 business days depending on location.',
    shipping: 'Fast dispatch from our local warehouse with tracking provided after order confirmation.',
    returns: 'Returns accepted for damaged or incorrect items within 7 days of delivery.',
};

export default function MobileProductSheet({
    product,
    open,
    onClose,
}: {
    product: Product | null;
    open: boolean;
    onClose: () => void;
}) {
    const [currentImage, setCurrentImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');
    const [selectedColor, setSelectedColor] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const hasMultipleImages = (product?.images.length ?? 0) > 1;
    const orderUrl = useMemo(() => {
        if (!product) return '#';

        return buildWhatsAppUrl({
            productName: product.name,
            price: product.price,
            size: selectedSize,
            quantity,
        });
    }, [product, quantity, selectedSize]);

    useEffect(() => {
        if (!open) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onClose]);

    useEffect(() => {
        if (!open || !product) return;
        setCurrentImage(0);
        setSelectedSize(product.sizes[1] ?? product.sizes[0]);
        setSelectedColor(0);
        setQuantity(1);
        setIsSubmitting(false);
    }, [open, product]);

    if (!product) return null;

    const handleOrder = () => {
        setIsSubmitting(true);
        window.setTimeout(() => setIsSubmitting(false), 1800);
    };

    const colors = product.colors?.length ? product.colors : ['#F4F0E8', '#1B1B1B', '#D4AF37'];

    const nextImage = () => setCurrentImage((index) => (index === product.images.length - 1 ? 0 : index + 1));
    const prevImage = () => setCurrentImage((index) => (index === 0 ? product.images.length - 1 : index - 1));

    const goToImage = (index: number) => setCurrentImage(index);

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        const touch = event.touches[0];
        event.currentTarget.dataset.startX = String(touch.clientX);
    };

    const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        const startX = Number(event.currentTarget.dataset.startX || 0);
        const endX = event.changedTouches[0]?.clientX ?? 0;
        const delta = endX - startX;

        if (Math.abs(delta) > 40) {
            if (delta < 0 && hasMultipleImages) nextImage();
            if (delta > 0 && hasMultipleImages) prevImage();
        }
    };

    return (
        <AnimatePresence>
            {open ? (
                <motion.div
                    className="fixed inset-0 z-[80] md:hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.button
                        type="button"
                        aria-label="Close product sheet"
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.9 }}
                        className="absolute inset-x-0 bottom-0 max-h-[92svh] overflow-hidden rounded-t-[28px] border-t border-white/10 bg-[#090909] shadow-[0_-24px_80px_rgba(0,0,0,0.65)]"
                    >
                        <div className="mx-auto h-1.5 w-14 rounded-full bg-white/18" />

                        <div className="flex items-center justify-between px-4 pb-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors duration-300 hover:border-gold/30 hover:text-gold"
                                aria-label="Close"
                            >
                                <X size={14} />
                            </button>
                            <span className="text-[10px] uppercase tracking-[0.35em] text-white/35">Quick View</span>
                            <span className="h-9 w-9" />
                        </div>

                        <div className="max-h-[calc(92svh-1.5rem)] overflow-y-auto px-4 pb-[calc(24px+env(safe-area-inset-bottom))]">
                            <div className="overflow-hidden rounded-[24px] border border-white/8 bg-[#0B0B0B]">
                                <div
                                    className="relative h-[320px] bg-black/60"
                                    onTouchStart={handleTouchStart}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentImage}
                                            initial={{ opacity: 0, scale: 1.03 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                                            className="absolute inset-0"
                                        >
                                            <Image
                                                src={product.images[currentImage]}
                                                alt={product.name}
                                                fill
                                                priority={false}
                                                loading="lazy"
                                                sizes="100vw"
                                                className="object-contain p-5"
                                            />
                                        </motion.div>
                                    </AnimatePresence>

                                    <div className="absolute inset-x-0 bottom-4 flex items-center justify-between px-4">
                                        <button
                                            type="button"
                                            onClick={prevImage}
                                            disabled={!hasMultipleImages}
                                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white/70 backdrop-blur-sm transition-all duration-300 disabled:opacity-40"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <div className="rounded-full border border-white/10 bg-black/55 px-3 py-1 text-[9px] uppercase tracking-[0.3em] text-white/65 backdrop-blur-sm">
                                            {currentImage + 1} / {product.images.length}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={nextImage}
                                            disabled={!hasMultipleImages}
                                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white/70 backdrop-blur-sm transition-all duration-300 disabled:opacity-40"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-2 border-t border-white/8 bg-black/30 p-3">
                                    {product.images.slice(0, 4).map((image, index) => (
                                        <button
                                            key={image}
                                            type="button"
                                            onClick={() => goToImage(index)}
                                            className={`relative overflow-hidden rounded-[14px] border transition-all duration-300 ${currentImage === index ? 'border-gold shadow-[0_0_0_1px_rgba(212,175,55,0.3)]' : 'border-white/8 opacity-65'}`}
                                        >
                                            <div className="relative aspect-[4/5]">
                                                <Image
                                                    src={image}
                                                    alt={`${product.name} ${index + 1}`}
                                                    fill
                                                    loading="lazy"
                                                    sizes="20vw"
                                                    className="object-contain p-2"
                                                />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 py-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.35em] text-gold/80">NINE77</p>
                                        <h2 className="mt-2 text-[22px] font-semibold uppercase leading-[0.95] tracking-[0.05em] text-white">
                                            {product.name}
                                        </h2>
                                    </div>
                                    <p className="text-[18px] font-black text-gold">{formatPrice(product.price)}</p>
                                </div>

                                <p className="text-[13px] leading-6 text-white/62">{product.description}</p>

                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">Available Sizes</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => setSelectedSize(size)}
                                                className={`h-10 rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${selectedSize === size ? 'border-gold bg-gold text-black' : 'border-white/10 bg-white/5 text-white/70 hover:border-gold/30 hover:text-gold'}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">Color Selection</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {colors.map((color, index) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setSelectedColor(index)}
                                                className={`flex h-8 items-center gap-2 rounded-full border px-3 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${selectedColor === index ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 bg-white/5 text-white/65 hover:border-gold/30 hover:text-white'}`}
                                            >
                                                <span className="h-3 w-3 rounded-full border border-white/10" style={{ backgroundColor: color }} />
                                                {index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Accent'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">Quantity</p>
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">Fabric & Care</p>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5">
                                            <button
                                                type="button"
                                                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                                                className="flex h-10 w-10 items-center justify-center text-lg text-white/60 transition-colors duration-300 hover:text-gold"
                                            >
                                                −
                                            </button>
                                            <span className="w-10 text-center text-sm font-semibold text-white">{quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => setQuantity((value) => value + 1)}
                                                className="flex h-10 w-10 items-center justify-center text-lg text-white/60 transition-colors duration-300 hover:text-gold"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="text-right text-[10px] uppercase tracking-[0.18em] text-white/45">
                                            <p>{productCopy.fabric}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-2 rounded-[20px] border border-white/8 bg-white/4 p-4 text-[12px] leading-6 text-white/68">
                                    <p>{productCopy.care}</p>
                                    <p>{productCopy.delivery}</p>
                                    <p>{productCopy.shipping}</p>
                                    <p>{productCopy.returns}</p>
                                </div>

                                <div className="grid gap-3 pt-1">
                                    <a
                                        href={orderUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={handleOrder}
                                        className="flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-5 text-[11px] font-bold uppercase tracking-[0.3em] text-black transition-all duration-300 hover:bg-gold-light"
                                    >
                                        <AnimatePresence mode="wait" initial={false}>
                                            {isSubmitting ? (
                                                <motion.span
                                                    key="ordering"
                                                    initial={{ opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -6 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Check size={16} />
                                                    Opening WhatsApp
                                                </motion.span>
                                            ) : (
                                                <motion.span
                                                    key="order"
                                                    initial={{ opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -6 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <MessageCircle size={16} />
                                                    Order on WhatsApp
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </a>

                                    <Link
                                        href={`/product/${product.slug}`}
                                        onClick={onClose}
                                        className="flex h-12 items-center justify-center rounded-full border border-white/10 bg-transparent text-[11px] font-bold uppercase tracking-[0.3em] text-white/80 transition-all duration-300 hover:border-gold/30 hover:text-gold"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}
