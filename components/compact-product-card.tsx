'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Product } from '@/types/product';
import { formatPrice } from '@/utils';

export default function CompactProductCard({
    product,
    index = 0,
}: {
    product: Product;
    index?: number;
}) {
    const [imgSrc, setImgSrc] = useState(product.images[0] || '/luxury-streetwear-garment.png');
    const [fallbackActive, setFallbackActive] = useState(false);

    const handleImageError = () => {
        if (!fallbackActive) {
            setImgSrc('/luxury-streetwear-garment.png');
            setFallbackActive(true);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="w-[150px] h-[250px]"
        >
            <Link
                href={`/product/${product.slug}`}
                className="group relative flex h-[250px] w-[150px] flex-col justify-between overflow-hidden rounded-[14px] border border-white/6 bg-[#0E0E0E] shadow-[0_8px_20px_rgba(0,0,0,0.15)] block p-3"
            >
                {/* Image area (75% of height) */}
                <div className="relative h-[75%] w-full overflow-hidden rounded-[10px] bg-[#090909] shrink-0">
                    <Image
                        src={imgSrc}
                        alt={product.name}
                        width={150}
                        height={187}
                        loading="lazy"
                        onError={handleImageError}
                        className="transition-transform duration-[250ms] ease-out group-active:scale-[1.03] block w-full h-auto aspect-[4/5] object-contain overflow-hidden rounded-[inherit]"
                    />
                </div>

                {/* Info area (25% of height) */}
                <div className="flex h-[25%] flex-col justify-center min-h-0 pt-1">
                    <h4 className="truncate text-[12px] font-semibold uppercase tracking-[0.04em] text-white/90">
                        {product.name}
                    </h4>
                    <p className="mt-0.5 text-[14px] font-black text-gold">
                        {formatPrice(product.price)}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}
