'use client';

import { useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { SlidersHorizontal, Search } from 'lucide-react';
import ProductCard from '@/components/product-card';
import { products } from '@/data/products';

const categories = ['All', 'Tops', 'Pants', 'Outerwear'] as const;
const sortOptions = ['Price High to Low', 'Price Low to High', 'Newest First'] as const;

export default function ShopPage() {
    const [category, setCategory] = useState<(typeof categories)[number]>('All');
    const [sort, setSort] = useState<(typeof sortOptions)[number]>('Price High to Low');
    const [search, setSearch] = useState('');
    const headerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(headerRef, { once: true, amount: 0.5 });

    const filteredProducts = useMemo(() => {
        let base = category === 'All' ? products : products.filter((p) => p.category === category);
        if (search.trim()) {
            const q = search.toLowerCase();
            base = base.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q)
            );
        }
        return [...base].sort((a, b) => {
            if (sort === 'Price High to Low') return b.price - a.price;
            if (sort === 'Price Low to High') return a.price - b.price;
            return b.newArrival ? 1 : -1;
        });
    }, [category, sort, search]);

    return (
        <section className="min-h-screen py-20">
            {/* Ambient glow */}
            <div className="pointer-events-none fixed left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/4 blur-[130px]" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    ref={headerRef}
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-12 space-y-3"
                >
                    <span className="text-[10px] uppercase tracking-[0.45em] text-gold">
                        NINE77 Store
                    </span>
                    <h1 className="text-4xl font-black uppercase leading-[0.92] text-white sm:text-5xl lg:text-6xl">
                        Premium
                        <br />
                        <span className="bg-text-gold bg-clip-text text-transparent">
                            Catalog.
                        </span>
                    </h1>
                    <p className="max-w-sm text-sm text-white/50">
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'} available
                    </p>
                </motion.div>

                {/* Filter bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    {/* Category pills */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] transition-all duration-300 ${
                                    category === cat
                                        ? 'border-gold bg-gold text-black shadow-glow-sm'
                                        : 'border-white/10 bg-white/5 text-white/60 hover:border-gold/30 hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Sort + search */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-9 w-32 rounded-full border border-white/10 bg-white/5 pl-8 pr-3 text-[11px] uppercase tracking-wider text-white placeholder-white/25 outline-none transition-all duration-300 focus:border-gold/30 focus:w-44 focus:bg-gold/5"
                            />
                        </div>

                        {/* Sort dropdown */}
                        <div className="relative flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                            <SlidersHorizontal size={13} className="text-white/40" />
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value as typeof sort)}
                                className="appearance-none bg-transparent text-[10px] uppercase tracking-[0.2em] text-white/70 outline-none"
                            >
                                {sortOptions.map((opt) => (
                                    <option key={opt} value={opt} className="bg-zinc-950 text-white">
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Product grid */}
                {filteredProducts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-4 py-20 text-center"
                    >
                        <p className="text-2xl font-black uppercase text-white/20">No results</p>
                        <p className="text-sm text-white/40">Try adjusting your filters</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key={`${category}-${sort}-${search}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
                    >
                        {filteredProducts.map((product, i) => (
                            <ProductCard key={product.id} product={product} index={i} />
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}