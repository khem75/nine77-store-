'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import ProductCard from '@/components/product-card';
import { products } from '@/data/products';

const categories = ['All', 'Tops', 'Pants', 'Outerwear'] as const;
const sortOptions = ['Price High to Low', 'Price Low to High', 'Newest First'] as const;

// Campaign metadata for each category
const campaignData: Record<string, { title: string; description: string; image: string }> = {
    All: {
        title: 'N77 Collection',
        description: 'Complete campaign edits. Streetwear essentials shaped for quiet luxury.',
        image: '/about-image.jpg',
    },
    Tops: {
        title: 'Shirts & Tops',
        description: 'Built for confidence. Structured cuts with subtle branding details.',
        image: '/products/vintage-t-shirt-1.jpg',
    },
    Pants: {
        title: 'Pants Collection',
        description: 'Modern silhouettes. Tailored drape built for premium streetwear posture.',
        image: '/products/barrel-pants-1.jpg',
    },
    Outerwear: {
        title: 'Outerwear Drop',
        description: 'Designed for every season. Technical construction meets high visual edge.',
        image: '/products/windcheater-1.jpg',
    },
};

export default function ShopClient() {
    const [category, setCategory] = useState<(typeof categories)[number]>('All');
    const [sort, setSort] = useState<(typeof sortOptions)[number]>('Price High to Low');
    const [search, setSearch] = useState('');

    // Load category from query param on mount if present
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const cat = params.get('category');
            if (cat && categories.includes(cat as any)) {
                setCategory(cat as any);
            }
            const q = params.get('search');
            if (q) {
                setSearch(q);
            }
        }
    }, []);

    // Sync state to URL for consistency without page reload
    const updateCategory = (cat: (typeof categories)[number]) => {
        setCategory(cat);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            if (cat === 'All') {
                url.searchParams.delete('category');
            } else {
                url.searchParams.set('category', cat);
            }
            window.history.pushState({}, '', url.toString());
        }
    };

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
            return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
        });
    }, [category, sort, search]);

    const activeCampaign = campaignData[category] || campaignData.All;

    return (
        <section className="min-h-screen bg-[#070707] pb-28 md:pb-16">
            
            {/* ── 1. Campaign Hero Banner ── */}
            <div className="relative w-full h-[260px] md:h-[400px] border-b border-white/[0.08] overflow-hidden bg-[#111111]">
                <Image
                    src={activeCampaign.image}
                    alt={activeCampaign.title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/45 to-black/20" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 max-w-[1440px] mx-auto px-6 pb-6 md:pb-10 lg:px-8">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Collection Page</p>
                    <h1 className="mt-1 text-3xl font-extrabold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
                        {activeCampaign.title}
                    </h1>
                    <p className="mt-2 text-sm text-white/50 max-w-lg leading-relaxed">
                        {activeCampaign.description}
                    </p>
                </div>
            </div>

            {/* Catalog content */}
            <div className="mx-auto max-w-[1440px] px-6 lg:px-8 mt-10">
                
                {/* ── 2. Filters & Options Sticky Header Bar ── */}
                {/* top-[92px] = 32px announcement bar + 60px navbar on mobile; top-[72px] on md */}
                <div className="sticky top-[92px] md:top-[72px] z-30 mb-8 -mx-6 px-6 md:mx-0 md:px-0 border-b border-white/[0.08] bg-[#070707]/92 py-4 backdrop-blur-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {/* Category list chips */}
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 sm:pb-0" style={{ scrollSnapType: 'x mandatory' }}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => updateCategory(cat)}
                                className={`shrink-0 snap-start rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition-all duration-200 ${
                                    category === cat
                                        ? 'border-gold bg-gold text-black'
                                        : 'border-white/[0.08] bg-transparent text-white/45 hover:border-white/20 hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search & Sort actions */}
                    <div className="flex items-center gap-3 shrink-0">
                        {/* Search Input field */}
                        <div className="relative flex-1 sm:flex-initial">
                            <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-9 w-full sm:w-36 rounded-full border border-white/[0.08] bg-white/[0.04] pl-8.5 pr-3 text-[11px] text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-white/20 focus:w-48 focus:bg-white/[0.06]"
                            />
                        </div>

                        {/* Sort Trigger */}
                        <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-2">
                            <SlidersHorizontal size={12} className="text-white/35" />
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value as any)}
                                className="appearance-none bg-transparent text-[10px] uppercase tracking-[0.18em] text-white/60 outline-none cursor-pointer"
                            >
                                {sortOptions.map((opt) => (
                                    <option key={opt} value={opt} className="bg-[#111] text-white">
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* ── 3. Product Catalog Grid (Price visible) ── */}
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-24 text-center">
                        <p className="text-2xl font-bold uppercase text-white/12">No pieces found</p>
                        <p className="text-sm text-white/35">Adjust search criteria or choose another campaign</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 md:gap-4">
                        {filteredProducts.map((product, i) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={i}
                                showPrice={true} // V4 spec: prices visible in collections catalog
                            />
                        ))}
                    </div>
                )}

                {/* ── 4. Related Collections (Links to other categories) ── */}
                <div className="mt-20 border-t border-white/[0.08] pt-14">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-6">Explore More</p>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {categories
                            .filter((cat) => cat !== category && cat !== 'All')
                            .slice(0, 3)
                            .map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => updateCategory(cat)}
                                    className="group relative flex h-24 items-center justify-between rounded-[18px] border border-white/[0.08] bg-[#161616] px-6 text-left transition-all duration-200 hover:border-white/15"
                                >
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest text-white/40">Campaign</p>
                                        <span className="text-base font-bold uppercase tracking-wider text-white">
                                            {cat}
                                        </span>
                                    </div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/50 transition-all duration-200 group-hover:bg-gold group-hover:text-black">
                                        <ArrowRight size={13} strokeWidth={2} />
                                    </div>
                                </button>
                            ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
