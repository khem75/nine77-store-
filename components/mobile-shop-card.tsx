'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import type { Product } from '@/types/product';
import { formatPrice } from '@/utils';

export default function MobileShopCard({
    product,
    index = 0,
    onOpen,
}: {
    product: Product;
    index?: number;
    onOpen: (product: Product) => void;
}) {
    const badge = product.newArrival ? 'NEW' : product.featured ? 'BESTSELLER' : null;

    return (
        <motion.div
            role="button"
            tabIndex={0}
            aria-label={`Open ${product.name}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            whileTap={{ scale: 0.985 }}
            onClick={() => onOpen(product)}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onOpen(product);
                }
            }}
            className="group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-white/8 bg-[#0B0B0B] shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition-transform duration-[250ms] ease-out active:-translate-y-1 md:hidden"
        >
            <div className="relative overflow-hidden bg-black/40 p-3 pb-2">
                <div className="relative h-[182px] w-full overflow-hidden rounded-[14px] bg-black/20">
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        loading="lazy"
                        sizes="48vw"
                        className="object-contain p-4 transition-transform duration-[250ms] ease-out group-active:scale-[1.03]"
                    />
                </div>

                <div className="absolute left-3 right-3 top-3 flex items-start justify-between">
                    {badge ? (
                        <span className="rounded-full border border-gold/35 bg-gold/95 px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.28em] text-black shadow-[0_8px_16px_rgba(0,0,0,0.18)]">
                            {badge}
                        </span>
                    ) : <span />}

                    <button
                        type="button"
                        aria-label="Wishlist"
                        onClick={(event) => event.stopPropagation()}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white/60 backdrop-blur-sm transition-all duration-[250ms] hover:border-gold/30 hover:text-gold"
                    >
                        <Heart size={11} />
                    </button>
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-2 px-3 pb-3 pt-2">
                <div className="min-w-0">
                    <h3 className="truncate text-[16px] font-semibold uppercase tracking-[0.06em] text-white">
                        {product.name}
                    </h3>
                    <p className="mt-1 text-[18px] font-black text-gold">
                        {formatPrice(product.price)}
                    </p>
                </div>

                <p className="text-[12px] uppercase tracking-[0.22em] text-white/45">
                    {product.sizes.join(' • ')}
                </p>
            </div>
        </motion.div>
    );
}
