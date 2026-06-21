'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/product-card';
import { products } from '@/data/products';

const categories = ['All', 'Tops', 'Pants', 'Outerwear'] as const;
const sortOptions = ['Price High to Low', 'Price Low to High'] as const;

export default function ShopPage() {
    const [category, setCategory] =
        useState<(typeof categories)[number]>('All');

    const [sort, setSort] =
        useState<(typeof sortOptions)[number]>('Price High to Low');

    const filteredProducts = useMemo(() => {
        const baseProducts =
            category === 'All'
                ? products
                : products.filter((item) => item.category === category);

        return [...baseProducts].sort((a, b) =>
            sort === 'Price High to Low'
                ? b.price - a.price
                : a.price - b.price
        );
    }, [category, sort]);

    return (
        <section className="px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-gold">
                            Shop
                        </p>

                        <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.04em] text-white sm:text-5xl">
                            Premium Luxury Catalog
                        </h1>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block rounded-[24px] border border-white/10 bg-white/5 p-4">
                            <span className="text-xs uppercase tracking-[0.35em] text-white/70">
                                Category
                            </span>

                            <select
                                value={category}
                                onChange={(event) =>
                                    setCategory(
                                        event.target.value as (typeof categories)[number]
                                    )
                                }
                                className="mt-3 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none"
                            >
                                {categories.map((item) => (
                                    <option
                                        key={item}
                                        value={item}
                                        className="bg-zinc-950 text-white"
                                    >
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="block rounded-[24px] border border-white/10 bg-white/5 p-4">
                            <span className="text-xs uppercase tracking-[0.35em] text-white/70">
                                Sort By
                            </span>

                            <select
                                value={sort}
                                onChange={(event) =>
                                    setSort(
                                        event.target.value as (typeof sortOptions)[number]
                                    )
                                }
                                className="mt-3 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none"
                            >
                                {sortOptions.map((option) => (
                                    <option
                                        key={option}
                                        value={option}
                                        className="bg-zinc-950 text-white"
                                    >
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
                >
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}