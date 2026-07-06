'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ChevronRight, Filter, Menu, Search, ShoppingBag, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/product-card';
import MobileShopCard from '@/components/mobile-shop-card';
import MobileProductSheet from '@/components/mobile-product-sheet';
import { products } from '@/data/products';

const categories = ['All', 'Tops', 'Pants', 'Outerwear'] as const;
const sortOptions = ['Price High to Low', 'Price Low to High', 'Newest First'] as const;
const orderUrl = 'https://wa.me/9779810605409?text=Hello%20NINE77%2C%20I%20would%20like%20to%20place%20an%20order.';

export default function ShopPage() {
    const [category, setCategory] = useState<(typeof categories)[number]>('All');
    const [sort, setSort] = useState<(typeof sortOptions)[number]>('Price High to Low');
    const [search, setSearch] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobilePanel, setMobilePanel] = useState<'filter' | 'sort' | null>(null);
    const [activeProduct, setActiveProduct] = useState<(typeof products)[number] | null>(null);
    const mobileHeaderRef = useRef<HTMLDivElement>(null);
    const desktopHeaderRef = useRef<HTMLDivElement>(null);
    const mobileHeaderInView = useInView(mobileHeaderRef, { once: true, amount: 0.35 });
    const desktopHeaderInView = useInView(desktopHeaderRef, { once: true, amount: 0.5 });

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

    useEffect(() => {
        if (!mobileMenuOpen && !mobilePanel && !activeProduct) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMobileMenuOpen(false);
                setMobilePanel(null);
                setActiveProduct(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [mobileMenuOpen, mobilePanel, activeProduct]);

    const currentLabel = category === 'All' ? 'Shop' : category;

    return (
        <section className="min-h-screen overflow-x-clip py-0 md:py-20">
            {/* Ambient glow */}
            <div className="pointer-events-none fixed left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/4 blur-[130px]" />

            {/* Mobile shop shell */}
            <div className="relative md:hidden">
                <header className="sticky top-0 z-40 border-b border-white/8 bg-[#080808]/88 backdrop-blur-2xl">
                    <div className="flex h-16 items-center justify-between px-4">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/85 transition-colors duration-300 hover:border-gold/30 hover:text-gold"
                            aria-label="Open menu"
                        >
                            <Menu size={18} />
                        </button>

                        <Link
                            href="/"
                            className="absolute left-1/2 -translate-x-1/2 text-[17px] font-black uppercase tracking-[0.38em] text-white"
                        >
                            NINE<span className="text-gold">77</span>
                        </Link>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => document.getElementById('mobile-shop-search')?.focus()}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors duration-300 hover:border-gold/30 hover:text-gold"
                                aria-label="Search"
                            >
                                <Search size={17} />
                            </button>

                            <Link
                                href={orderUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors duration-300 hover:border-gold/30 hover:text-gold"
                                aria-label="Cart"
                            >
                                <ShoppingBag size={17} />
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="px-4 pb-24 pt-4">
                    <motion.div
                        ref={mobileHeaderRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={mobileHeaderInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-4"
                    >
                        <p className="text-[10px] uppercase tracking-[0.38em] text-white/32">
                            Home <span className="mx-1 text-white/18">&gt;</span> Shop <span className="mx-1 text-white/18">&gt;</span> {currentLabel}
                        </p>

                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-black uppercase leading-[0.92] text-white">
                                    {currentLabel}
                                </h1>
                                <p className="mt-2 text-sm text-white/45">
                                    {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setMobilePanel('filter')}
                                    className="inline-flex h-10 items-center gap-2 rounded-full border border-gold/35 bg-transparent px-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold transition-all duration-300 hover:bg-gold/8"
                                >
                                    <Filter size={13} />
                                    Filter
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMobilePanel('sort')}
                                    className="inline-flex h-10 items-center gap-2 rounded-full border border-gold/35 bg-transparent px-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold transition-all duration-300 hover:bg-gold/8"
                                >
                                    <SlidersHorizontal size={13} />
                                    Sort
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
                            <input
                                id="mobile-shop-search"
                                type="text"
                                placeholder="Search products"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                className="h-11 w-full rounded-full border border-white/8 bg-white/5 pl-10 pr-4 text-[12px] uppercase tracking-[0.2em] text-white placeholder:text-white/28 outline-none transition-colors duration-300 focus:border-gold/30 focus:bg-gold/5"
                            />
                        </div>
                    </motion.div>

                    <div className="mt-5">
                        {filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 py-20 text-center">
                                <p className="text-xl font-black uppercase tracking-[0.08em] text-white/18">No results</p>
                                <p className="text-sm text-white/40">Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {filteredProducts.map((product, index) => (
                                    <MobileShopCard
                                        key={product.id}
                                        product={product}
                                        index={index}
                                        onOpen={(selectedProduct) => setActiveProduct(selectedProduct)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Desktop catalog stays unchanged */}
            <div className="relative mx-auto hidden max-w-7xl px-4 md:block md:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    ref={desktopHeaderRef}
                    initial={{ opacity: 0, y: 40 }}
                    animate={desktopHeaderInView ? { opacity: 1, y: 0 } : {}}
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
                    animate={desktopHeaderInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    {/* Category pills */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] transition-all duration-300 ${category === cat
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
                        className="grid grid-cols-2 gap-x-3 gap-y-5 md:gap-5 xl:grid-cols-4"
                    >
                        {filteredProducts.map((product, i) => (
                            <ProductCard key={product.id} product={product} index={i} />
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Mobile drawer */}
            <AnimatePresence>
                {mobileMenuOpen ? (
                    <motion.div className="fixed inset-0 z-[90] md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <button
                            type="button"
                            aria-label="Close menu"
                            className="absolute inset-0 bg-black/72 backdrop-blur-md"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        <motion.div
                            initial={{ x: -24, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -24, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                            className="relative h-full w-[84%] max-w-sm border-r border-white/10 bg-[#090909] px-5 py-6 shadow-[24px_0_80px_rgba(0,0,0,0.45)]"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] uppercase tracking-[0.35em] text-gold/85">Menu</span>
                                <button
                                    type="button"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70"
                                    aria-label="Close menu"
                                >
                                    <X size={15} />
                                </button>
                            </div>

                            <div className="mt-8 space-y-3">
                                {[
                                    { label: 'Home', href: '/' },
                                    { label: 'Shop', href: '/shop' },
                                    { label: 'About', href: '/about' },
                                    { label: 'FAQ', href: '/faq' },
                                ].map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between rounded-[18px] border border-white/8 bg-white/5 px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75"
                                    >
                                        {item.label}
                                        <ChevronRight size={15} className="text-gold/60" />
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-8 rounded-[24px] border border-gold/15 bg-gold/5 p-4">
                                <p className="text-[10px] uppercase tracking-[0.35em] text-gold/75">Fast Order</p>
                                <p className="mt-3 text-sm leading-6 text-white/60">
                                    Tap the cart icon or order button to start a premium WhatsApp checkout.
                                </p>
                                <Link
                                    href={orderUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 inline-flex h-11 items-center justify-center rounded-full border border-gold/35 px-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold"
                                >
                                    Order Now
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <AnimatePresence>
                {mobilePanel ? (
                    <motion.div className="fixed inset-0 z-[85] md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <button
                            type="button"
                            aria-label="Close panel"
                            className="absolute inset-0 bg-black/65 backdrop-blur-md"
                            onClick={() => setMobilePanel(null)}
                        />

                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
                            className="absolute inset-x-0 bottom-0 rounded-t-[28px] border-t border-white/10 bg-[#090909] px-4 pb-[calc(20px+env(safe-area-inset-bottom))] pt-3 shadow-[0_-24px_80px_rgba(0,0,0,0.6)]"
                        >
                            <div className="mx-auto h-1.5 w-14 rounded-full bg-white/18" />

                            <div className="mt-4 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.35em] text-gold/75">
                                        {mobilePanel === 'filter' ? 'Filter' : 'Sort'}
                                    </p>
                                    <h3 className="mt-2 text-lg font-semibold uppercase tracking-[0.05em] text-white">
                                        {mobilePanel === 'filter' ? 'Browse Categories' : 'Choose Order'}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setMobilePanel(null)}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70"
                                >
                                    <X size={15} />
                                </button>
                            </div>

                            <div className="mt-4 grid gap-2">
                                {mobilePanel === 'filter'
                                    ? categories.map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => {
                                                setCategory(cat);
                                                setMobilePanel(null);
                                            }}
                                            className={`rounded-[18px] border px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.24em] transition-all duration-300 ${category === cat
                                                ? 'border-gold bg-gold text-black'
                                                : 'border-white/8 bg-white/5 text-white/70'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))
                                    : sortOptions.map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => {
                                                setSort(option);
                                                setMobilePanel(null);
                                            }}
                                            className={`rounded-[18px] border px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.24em] transition-all duration-300 ${sort === option
                                                ? 'border-gold bg-gold text-black'
                                                : 'border-white/8 bg-white/5 text-white/70'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                            </div>
                        </motion.div>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <MobileProductSheet product={activeProduct} open={Boolean(activeProduct)} onClose={() => setActiveProduct(null)} />
        </section>
    );
}
