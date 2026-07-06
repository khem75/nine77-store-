'use client';

import type { Product } from '@/types/product';
import ProductCard from '@/components/product-card';

export default function RelatedProducts({ products }: { products: Product[] }) {
    if (!products.length) return null;
    return (
        <section className="border-t border-white/5 py-10">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
                <div className="mb-6 space-y-1">
                    <span className="text-[10px] uppercase tracking-[0.45em] text-gold">
                        You May Also Like
                    </span>
                    <h2 className="text-xl font-black uppercase leading-[0.92] text-white">
                        Complete the Edit.
                    </h2>
                </div>
                
                {/* Horizontal slider */}
                <div 
                    className="flex gap-4 overflow-x-auto hide-scrollbar pb-4" 
                    style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}
                >
                    {products.map((product, i) => (
                        <div 
                            key={product.id} 
                            className="w-[180px] shrink-0" 
                            style={{ scrollSnapAlign: 'start' }}
                        >
                            <ProductCard product={product} index={i} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
