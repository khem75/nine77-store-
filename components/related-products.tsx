'use client';

import type { Product } from '@/types/product';
import ProductCard from '@/components/product-card';

export default function RelatedProducts({ products }: { products: Product[] }) {
    if (!products.length) return null;
    return (
        <section className="border-t border-white/5 py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-10 space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.45em] text-gold">
                        You May Also Like
                    </span>
                    <h2 className="text-2xl font-black uppercase leading-[0.92] text-white sm:text-3xl">
                        Complete the Edit.
                    </h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((product, i) => (
                        <ProductCard key={product.id} product={product} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
