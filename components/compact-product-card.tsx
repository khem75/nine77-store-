'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '@/types/product';
import { formatPrice } from '@/utils';

export default function CompactProductCard({
    product,
    index = 0,
}: {
    product: Product;
    index?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="w-[150px] h-[230px]"
        >
            <Link
                href={`/product/${product.slug}`}
                className="group relative flex h-[230px] w-[150px] flex-col overflow-hidden rounded-[14px] border border-white/6 bg-[#0E0E0E] shadow-[0_8px_20px_rgba(0,0,0,0.15)] block"
            >
                {/* Image area (70-75% of height) */}
                <div className="relative h-[160px] w-full overflow-hidden bg-black/30 p-2 shrink-0">
                    <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-black/20">
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            loading="lazy"
                            sizes="150px"
                            className="object-cover object-center transition-transform duration-[250ms] ease-out group-active:scale-[1.03]"
                        />
                    </div>
                </div>

                {/* Info area (remaining height) */}
                <div className="flex flex-1 flex-col justify-center px-2 py-1 min-h-[70px]">
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
