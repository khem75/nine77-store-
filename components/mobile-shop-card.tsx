'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '@/types/product';
import { formatPrice } from '@/utils';

export default function MobileShopCard({
    product,
    index = 0,
}: {
    product: Product;
    index?: number;
}) {
    const badge = product.newArrival ? 'NEW' : product.featured ? 'BESTSELLER' : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            whileTap={{ scale: 0.985 }}
            className="h-[275px]"
        >
            <Link
                href={`/product/${product.slug}`}
                className="group relative flex h-[275px] flex-col overflow-hidden rounded-[18px] border border-white/8 bg-[#0B0B0B] shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition-transform duration-[250ms] ease-out active:-translate-y-1 block"
            >
                <div className="relative overflow-hidden bg-black/40 p-3 pb-1.5 h-[200px] shrink-0">
                    {/* Image height set to fill the 75% height card area. object-fit: cover, center crop, aspect-ratio preserved */}
                    <div className="relative h-full w-full overflow-hidden rounded-[14px] bg-black/20">
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            loading="lazy"
                            sizes="48vw"
                            className="object-cover object-center transition-transform duration-[250ms] ease-out group-active:scale-[1.03]"
                        />
                    </div>

                    <div className="absolute left-3 right-3 top-3 flex items-start justify-between">
                        {badge && (
                            <span className="rounded-full border border-gold/35 bg-gold/95 px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.28em] text-black shadow-[0_8px_16px_rgba(0,0,0,0.18)]">
                                {badge}
                            </span>
                        )}
                    </div>
                </div>

                {/* Card body (Name and Price only, occupies remaining 25% height) */}
                <div className="flex flex-1 flex-col justify-center px-3 py-1.5 min-h-[75px]">
                    <div className="min-w-0">
                        <h3 className="truncate text-[14px] font-semibold uppercase tracking-[0.06em] text-white">
                            {product.name}
                        </h3>
                        <p className="mt-0.5 text-[16px] font-black text-gold">
                            {formatPrice(product.price)}
                        </p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
