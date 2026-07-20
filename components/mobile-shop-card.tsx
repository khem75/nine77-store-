'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import type { Product } from '@/types/product';
import { formatPrice } from '@/utils';

export default function MobileShopCard({
    product,
    index = 0,
}: {
    product: Product;
    index?: number;
}) {
    const [imgSrc, setImgSrc] = useState(product.images[0] || '/luxury-streetwear-garment.png');
    const [fallback, setFallback] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full"
        >
            <Link
                href={`/product/${product.slug}`}
                className="block w-full overflow-hidden rounded-[18px] border border-[#E8E3DC] bg-card active:scale-[0.97] transition-all duration-200 shadow-card"
            >
                {/* Image (80%) */}
                <div
                    className="relative w-full aspect-[4/5] overflow-hidden bg-[#F1EEE8]"
                >
                    <Image
                        src={imgSrc}
                        alt={product.name}
                        fill
                        sizes="50vw"
                        loading="lazy"
                        onError={() => { if (!fallback) { setImgSrc('/luxury-streetwear-garment.png'); setFallback(true); } }}
                        className="object-cover object-center"
                    />

                    {/* Wishlist */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setWishlisted(!wishlisted);
                        }}
                        aria-label="Save to wishlist"
                        className="absolute top-2.5 right-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 border border-[#E8E3DC]"
                    >
                        <Heart size={12} strokeWidth={1.75} className={wishlisted ? 'fill-[#111111] text-[#111111]' : 'text-secondary'} />
                    </button>
                </div>

                {/* Info (20%) */}
                <div className="px-3.5 py-3 border-t border-[#E8E3DC] bg-card flex items-center justify-between gap-1.5">
                    <span className="truncate text-[11px] font-bold uppercase tracking-tight text-[#111111]">{product.name}</span>
                    <span className="text-[12px] font-semibold text-gold shrink-0">{formatPrice(product.price)}</span>
                </div>
            </Link>
        </motion.div>
    );
}
