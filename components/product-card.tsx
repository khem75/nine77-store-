'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import ImagePlaceholder from '@/components/image-placeholder';
import type { Product } from '@/types/product';
import { formatPrice } from '@/utils';

export default function ProductCard({ product }: { product: Product }) {
    return (
        <motion.article
            whileHover={{ y: -6 }}
            className="group overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-4 transition"
        >
            <div className="relative overflow-hidden rounded-[28px] bg-black/50">
                <ImagePlaceholder />
                <div className="absolute inset-0 flex items-end justify-between p-4">
                    <span className="rounded-full bg-black/70 px-3 py-1 text-xs uppercase tracking-[0.32em] text-white/80">
                        {product.newArrival ? 'NEW' : product.featured ? 'BEST SELLER' : 'PRODUCT'}
                    </span>
                    <Link
                        href={`/product/${product.slug}`}
                        className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs uppercase tracking-[0.3em] text-black opacity-0 transition group-hover:opacity-100"
                    >
                        <Eye size={14} />
                        Quick View
                    </Link>
                </div>
            </div>
            <div className="mt-5 space-y-2">
                <Link href={`/product/${product.slug}`} className="block text-lg font-semibold uppercase tracking-[0.08em] text-white transition hover:text-gold">
                    {product.name}
                </Link>
                <p className="text-sm text-white/70">{formatPrice(product.price)}</p>
            </div>
        </motion.article>
    );
}
