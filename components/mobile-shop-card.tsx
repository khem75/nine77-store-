'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
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
    const [fallbackActive, setFallbackActive] = useState(false);

    const handleImageError = () => {
        if (!fallbackActive) {
            setImgSrc('/luxury-streetwear-garment.png');
            setFallbackActive(true);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            whileTap={{ scale: 0.985 }}
            className="w-full max-w-none aspect-[4/5]"
        >
            <Link
                href={`/product/${product.slug}`}
                className="group relative flex aspect-[4/5] w-full max-w-none flex-col justify-between overflow-hidden rounded-[18px] border border-white/8 bg-[#0B0B0B] shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition-transform duration-[250ms] ease-out active:-translate-y-1 block p-4"
            >
                {/* Image area takes 75% height */}
                <div className="relative h-[75%] w-full overflow-hidden rounded-[12px] bg-[#090909] shrink-0">
                    <Image
                        src={imgSrc}
                        alt={product.name}
                        width={400}
                        height={500}
                        loading="lazy"
                        onError={handleImageError}
                        className="transition-transform duration-[250ms] ease-out group-active:scale-[1.03] block w-full h-auto aspect-[4/5] object-contain overflow-hidden rounded-[inherit]"
                    />
                </div>

                {/* Content area occupies 25% height */}
                <div className="flex h-[25%] flex-col justify-center min-h-0 pt-1">
                    <div className="min-w-0">
                        <h3 className="truncate text-[13px] font-semibold uppercase tracking-[0.06em] text-white">
                            {product.name}
                        </h3>
                        <p className="mt-0.5 text-[15px] font-black text-gold">
                            {formatPrice(product.price)}
                        </p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
