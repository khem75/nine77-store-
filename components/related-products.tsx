'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ImagePlaceholder from '@/components/image-placeholder';
import type { Product } from '@/types/product';
import { formatPrice } from '@/utils';

export default function RelatedProducts({ products }: { products: Product[] }) {
    return (
        <section className="border-t border-white/10 px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-gold">Related items</p>
                        <h2 className="mt-4 text-4xl font-black uppercase tracking-[0.04em] text-white sm:text-5xl">Complete the luxury edit.</h2>
                    </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((product, index) => (
                        <motion.article
                            key={product.id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.55, delay: index * 0.08 }}
                            className="rounded-[32px] border border-white/10 bg-white/5 p-4"
                        >
                            <div className="overflow-hidden rounded-[28px] bg-black/50">
                                <ImagePlaceholder />
                            </div>
                            <div className="mt-5 space-y-2">
                                <Link href={`/product/${product.slug}`} className="block text-lg font-semibold uppercase tracking-[0.08em] text-white hover:text-gold">
                                    {product.name}
                                </Link>
                                <p className="text-sm text-white/70">{formatPrice(product.price)}</p>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
