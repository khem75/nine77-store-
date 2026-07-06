'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/types/product';
import ProductCard from '@/components/product-card';

const STORAGE_KEY = 'nine77_recently_viewed_products';

export function trackRecentlyViewed(product: Product) {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const list: Product[] = stored ? JSON.parse(stored) : [];
        const filtered = list.filter((p) => p.id !== product.id);
        const updated = [product, ...filtered].slice(0, 10);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
        // fail silently
    }
}

export default function RecentlyViewed({ currentProductId }: { currentProductId: string }) {
    const [items, setItems] = useState<Product[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const list: Product[] = JSON.parse(stored);
                // Exclude current product from the recently viewed list
                setItems(list.filter((p) => p.id !== currentProductId));
            }
        } catch (e) {
            // fail silently
        }
    }, [currentProductId]);

    if (items.length === 0) return null;

    return (
        <section className="border-t border-white/5 py-10">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
                <div className="mb-6 space-y-1">
                    <span className="text-[10px] uppercase tracking-[0.45em] text-gold">
                        Recently Viewed
                    </span>
                    <h2 className="text-xl font-black uppercase leading-[0.92] text-white">
                        Your History.
                    </h2>
                </div>
                
                {/* Horizontal slider */}
                <div 
                    className="flex gap-4 overflow-x-auto hide-scrollbar pb-4" 
                    style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}
                >
                    {items.map((product, i) => (
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
