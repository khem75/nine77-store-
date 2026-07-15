'use client';

import type { Product } from '@/types/product';
import type { AdminProduct } from '@/types/admin';
import CompactProductCard from '@/components/compact-product-card';

export default function RelatedProducts({ products }: { products: Array<Product | AdminProduct> }) {
    if (!products.length) return null;
    return (
        <section className="border-t border-white/5 py-8">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
                <div className="mb-5 space-y-1">
                    <span className="text-[10px] uppercase tracking-[0.45em] text-gold">
                        You May Also Like
                    </span>
                    <h2 className="text-xl font-black uppercase leading-[0.92] text-white">
                        Complete the Edit.
                    </h2>
                </div>
                
                {/* Horizontal slider using CompactProductCard */}
                <div 
                    className="flex gap-3 overflow-x-auto hide-scrollbar pb-3" 
                    style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}
                >
                    {products.map((product, i) => (
                        <div 
                            key={product.id} 
                            className="shrink-0" 
                            style={{ scrollSnapAlign: 'start' }}
                        >
                            <CompactProductCard product={product} index={i} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
