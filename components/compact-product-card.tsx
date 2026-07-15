'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Product } from '@/types/product';
import type { AdminProduct } from '@/types/admin';
import { formatPrice, slugify } from '@/utils';

export default function CompactProductCard({
    product,
    index = 0,
}: {
    product: Product | AdminProduct;
    index?: number;
}) {
    const [imgSrc, setImgSrc] = useState(product.images[0] || '/luxury-streetwear-garment.png');
    const [fallback, setFallback] = useState(false);

    const slug = 'slug' in product ? product.slug : slugify(product.name);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-[148px]"
        >
            <Link
                href={`/product/${slug}`}
                className="block w-full overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#161616] transition-transform duration-300 hover:-translate-y-1 active:scale-[0.97]"
            >
                <div className="relative w-full overflow-hidden bg-[#111111]" style={{ paddingBottom: '120%' }}>
                    <Image
                        src={imgSrc}
                        alt={product.name}
                        fill
                        sizes="150px"
                        loading="lazy"
                        onError={() => { if (!fallback) { setImgSrc('/luxury-streetwear-garment.png'); setFallback(true); } }}
                        className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                </div>

                <div className="px-3 py-2.5 border-t border-white/[0.06] bg-[#161616] flex flex-col justify-center">
                    <span className="truncate text-[11px] font-medium leading-tight text-white">{product.name}</span>
                    <span className="mt-0.5 text-[12px] font-semibold text-gold">{formatPrice(product.price)}</span>
                </div>
            </Link>
        </motion.div>
    );
}
