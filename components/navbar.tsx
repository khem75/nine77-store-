'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion, useScroll } from 'framer-motion';
import { Menu, X, Search, Instagram, MessageCircle, ArrowUpRight } from 'lucide-react';
import Logo from './logo';
import { products as staticProducts } from '@/data/products';
import { slugify } from '@/utils';
import type { AdminProduct } from '@/types/admin';

/* ─── Constants ─────────────────────────────────────── */
const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
];

const WHATSAPP = 'https://wa.me/9779810605409?text=Hello%20NINE77%2C%20I%20have%20an%20inquiry.';
const INSTAGRAM = 'https://www.instagram.com/nine.77___/';

/* ─── Drawer 400ms Slide & 50ms Stagger Config ───────────────────── */
const drawerVariants = {
    closed: { x: '-100%' },
    open: {
        x: 0,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
        x: '-100%',
        transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
};

const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.25 } },
};

const linkStagger = {
    open: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.06 + i * 0.05, // 50ms stagger per item
        },
    }),
    closed: { opacity: 0, x: -20 },
};

const cardStagger = {
    open: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 220,
            damping: 22,
            delay: 0.32 + i * 0.07,
        },
    }),
    closed: { opacity: 0, y: 16 },
};

/* ─── Component ──────────────────────────────────────── */
export default function Navbar({ products = [] }: { products?: AdminProduct[] }) {
    const pathname = usePathname();
    const router = useRouter();
    const reduceMotion = useReducedMotion();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [mounted, setMounted] = useState(true);
    const [logoMounted, setLogoMounted] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const lastY = useRef(0);
    const searchRef = useRef<HTMLInputElement>(null);

    const { scrollYProgress: pageScrollProgress } = useScroll();

    const featuredProducts = (products.length > 0 ? products : staticProducts)
        .filter((p) => p.featured)
        .slice(0, 3);

    /* Scroll hide/show & background transition */
    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            const delta = y - lastY.current;
            if (y < 60) {
                setHidden(false);
            } else if (delta > 8) {
                setHidden(true);
                setDrawerOpen(false);
            } else if (delta < -6) {
                setHidden(false);
            }
            setScrolled(y > 30);
            lastY.current = y;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    /* Lock body scroll when drawer is open */
    useEffect(() => {
        if (drawerOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => searchRef.current?.focus(), 380);
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [drawerOpen]);

    /* Close drawer on route change */
    useEffect(() => {
        setDrawerOpen(false);
    }, [pathname]);

    /* Keyboard: Escape closes drawer */
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setDrawerOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const closeDrawer = useCallback(() => setDrawerOpen(false), []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            closeDrawer();
            router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // Styling logic for transparent adaptive header
    const isHome = pathname === '/';
    const isDarkHeader = isHome && !scrolled;

    const textClass = isDarkHeader ? 'text-white' : 'text-primary';
    const textMutedClass = isDarkHeader ? 'text-white/45' : 'text-secondary';
    const borderClass = isDarkHeader ? 'border-white/[0.08]' : 'border-border';
    const bgClass = isDarkHeader ? 'bg-white/[0.02]' : 'bg-black/[0.02]';
    const hoverBgClass = isDarkHeader ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]';
    const hoverBorderClass = isDarkHeader ? 'hover:border-white/20' : 'hover:border-primary/20';

    return (
        <>
            {/* ── Top Navbar ─────────────────────────────────── */}
            <motion.header
                initial={{ y: -90, opacity: 0 }}
                animate={{
                    y: hidden ? -90 : (mounted ? 0 : -90),
                    opacity: hidden ? 0 : (mounted ? 1 : 0),
                    top: scrolled ? "0px" : "32px"
                }}
                transition={reduceMotion ? { duration: 0 } : {
                    y: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                    top: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.4 },
                }}
                className={`fixed inset-x-0 z-40 transition-all duration-500 ${
                    scrolled
                        ? 'bg-white/80 border-b border-border shadow-luxury backdrop-blur-xl'
                        : 'bg-transparent border-b border-transparent'
                }`}
                role="banner"
            >
                <div className={`mx-auto flex max-w-[1440px] items-center justify-between px-5 lg:px-12 transition-all duration-500 ${
                    scrolled ? 'h-[54px] md:h-[64px]' : 'h-[64px] md:h-[76px]'
                }`}>

                    {/* Left: Hamburger (mobile) / menu icon (desktop) */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className={`group flex h-10 w-10 items-center justify-center rounded-full border ${borderClass} ${bgClass} ${textClass} transition-all duration-300 ${hoverBorderClass} ${hoverBgClass} hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60`}
                            aria-label="Open navigation menu"
                            aria-expanded={drawerOpen}
                            aria-controls="nav-drawer"
                        >
                            <Menu size={16} strokeWidth={1.4} />
                        </button>

                        {/* Desktop nav links */}
                        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
                            {navLinks.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        data-cursor="magnetic"
                                        className={`relative px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] transition-colors duration-300 rounded-sm group ${
                                            isActive 
                                                ? (isDarkHeader ? 'text-white' : 'text-primary')
                                                : (isDarkHeader ? 'text-white/45 hover:text-white' : 'text-secondary hover:text-primary')
                                        }`}
                                        aria-current={isActive ? 'page' : undefined}
                                    >
                                        {item.label}
                                        <span
                                            className={`absolute bottom-0.5 left-3 right-3 h-px bg-gold transition-transform duration-300 origin-left ${
                                                isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                            }`}
                                        />
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Center: Brand Logo */}
                    <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto">
                        <Logo variant="navbar" scrolled={scrolled} />
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <Link
                            href="/shop"
                            data-cursor="magnetic"
                            className={`h-10 w-10 flex items-center justify-center rounded-full border ${borderClass} ${bgClass} ${textMutedClass} transition-all duration-300 hover:text-primary ${hoverBorderClass} hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60`}
                            aria-label="Browse shop"
                        >
                            <Search size={14} strokeWidth={1.4} />
                        </Link>

                        {/* WhatsApp support */}
                        <a
                            href={WHATSAPP}
                            target="_blank"
                            rel="noreferrer"
                            data-cursor="magnetic"
                            className={`hidden md:flex h-10 w-10 items-center justify-center rounded-full border ${borderClass} ${bgClass} ${textMutedClass} transition-all duration-300 hover:border-[#25D366]/40 hover:text-[#25D366] hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/40`}
                            aria-label="WhatsApp Support"
                        >
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.202-1.362a9.923 9.923 0 0 0 4.808 1.238h.005c5.502 0 9.987-4.479 9.989-9.987.002-2.669-1.037-5.176-2.93-7.07a9.905 9.905 0 0 0-7.062-2.919zm0 1.655c2.228 0 4.321.867 5.897 2.445 1.576 1.579 2.443 3.674 2.441 5.9a8.318 8.318 0 0 1-8.333 8.326 8.27 8.27 0 0 1-4.225-1.154l-.303-.18-3.142.823.839-3.064-.198-.314A8.27 8.27 0 0 1 3.67 11.99a8.326 8.326 0 0 1 8.342-8.335zm-3.83 3.693c-.21 0-.395.078-.544.238-.149.16-.57.556-.57 1.357 0 .8.583 1.574.664 1.684.081.11 1.125 1.776 2.766 2.428.39.155.696.248.932.324.394.125.752.107 1.034.066.314-.046.969-.396 1.106-.778.137-.381.137-.708.096-.778-.041-.07-.152-.11-.318-.194-.166-.084-.969-.478-1.119-.533-.15-.054-.259-.082-.369.082-.11.164-.424.533-.52.642-.095.109-.192.122-.358.038-.166-.084-.7-.258-1.333-.822-.493-.439-.826-.981-.923-1.147-.097-.166-.01-.256.072-.34.075-.075.166-.194.249-.29.083-.097.11-.166.166-.277.055-.11.028-.207-.014-.291-.041-.084-.369-.887-.505-1.214-.133-.322-.269-.278-.369-.283l-.314-.005z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Scroll Progress Bar at the bottom of header */}
                <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-transparent overflow-hidden">
                    <motion.div
                        className="h-full bg-gold origin-left"
                        style={{ scaleX: pageScrollProgress }}
                    />
                </div>
            </motion.header>

            {/* ── Premium Fullscreen Navigation Drawer ──────── */}
            <AnimatePresence>
                {drawerOpen && (
                    <motion.div
                        id="nav-drawer"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Navigation menu"
                        className="fixed inset-0 z-[9999] flex"
                        initial="closed"
                        animate="open"
                        exit="exit"
                    >
                        {/* Backdrop */}
                        <motion.div
                            variants={backdropVariants}
                            onClick={closeDrawer}
                            className="absolute inset-0 bg-black/40 backdrop-blur-md"
                        />

                        {/* Drawer Panel (Light theme luxury ivory styling) */}
                        <motion.aside
                            variants={drawerVariants}
                            data-lenis-prevent
                            className="relative flex h-full w-[88%] max-w-[360px] flex-col overflow-y-auto overflow-x-hidden border-r border-border z-10"
                            style={{
                                background: 'linear-gradient(160deg, #F8F6F2 0%, #F3EFE8 100%)',
                                boxShadow: '20px 0 60px rgba(0,0,0,0.05)',
                            }}
                        >
                            {/* Grain texture overlay */}
                            <div
                                className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                                    backgroundSize: '200px 200px',
                                }}
                                aria-hidden="true"
                            />

                            {/* Radial ambient glow top */}
                            <div
                                className="pointer-events-none absolute top-0 left-0 w-full h-64 z-0 opacity-[0.06]"
                                style={{ background: 'radial-gradient(ellipse 80% 60% at 20% -10%, #B7864A, transparent)' }}
                                aria-hidden="true"
                            />

                            {/* ── Header ─────────────────────────── */}
                            <div className="relative z-10 flex items-center justify-between px-7 pt-7 pb-5 border-b border-border">
                                <Logo variant="drawer" onClick={closeDrawer} />

                                <button
                                    onClick={closeDrawer}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/40 text-primary transition-all duration-300 hover:border-primary/20 hover:rotate-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                                    aria-label="Close navigation menu"
                                >
                                    <X size={15} strokeWidth={1.5} />
                                </button>
                            </div>

                            {/* ── Search ─────────────────────────── */}
                            <div className="relative z-10 px-7 pt-6 pb-2">
                                <form onSubmit={handleSearchSubmit} role="search" aria-label="Search products">
                                    <div className="relative">
                                        <Search size={13} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" aria-hidden="true" />
                                        <input
                                            ref={searchRef}
                                            type="search"
                                            placeholder="Search products..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full h-11 rounded-full border border-border bg-white/50 pl-10 pr-4 text-[12px] text-primary placeholder:text-secondary/55 outline-none transition-all duration-300 focus:border-gold/40 focus:bg-white caret-gold"
                                            aria-label="Search products"
                                        />
                                    </div>
                                </form>
                            </div>

                            {/* ── Navigation Links ────────────────── */}
                            <nav className="relative z-10 px-7 pt-7 pb-2" aria-label="Site navigation">
                                <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.42em] text-secondary" aria-hidden="true">
                                    Navigate
                                </p>
                                <ul className="flex flex-col gap-0.5" role="list">
                                    {navLinks.map((item, idx) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <li key={item.href}>
                                                <motion.div
                                                    custom={idx}
                                                    variants={linkStagger}
                                                    initial="closed"
                                                    animate="open"
                                                >
                                                    <Link
                                                        href={item.href}
                                                        onClick={closeDrawer}
                                                        className={`group flex items-center justify-between py-3.5 text-[22px] font-black uppercase tracking-[0.18em] transition-all duration-300 border-b border-border hover:pl-2 ${
                                                            isActive ? 'text-gold' : 'text-primary hover:text-gold'
                                                        }`}
                                                        aria-current={isActive ? 'page' : undefined}
                                                    >
                                                        <span>{item.label}</span>
                                                        <ArrowUpRight
                                                            size={14}
                                                            strokeWidth={2}
                                                            className={`opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isActive ? 'opacity-60' : ''}`}
                                                            aria-hidden="true"
                                                        />
                                                    </Link>
                                                </motion.div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>

                            {/* ── Featured Products Carousel ─────── */}
                            {featuredProducts.length > 0 && (
                                <div className="relative z-10 px-7 pt-7 pb-2">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-[9px] font-bold uppercase tracking-[0.42em] text-secondary" aria-hidden="true">
                                            Featured
                                        </p>
                                        <Link
                                            href="/shop"
                                            onClick={closeDrawer}
                                            className="text-[9px] font-bold uppercase tracking-[0.25em] text-gold hover:text-gold-dark transition-colors"
                                        >
                                            View All
                                        </Link>
                                    </div>
                                    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1" role="list" aria-label="Featured products">
                                        {featuredProducts.map((product, idx) => (
                                            <motion.div
                                                key={product.id}
                                                custom={idx}
                                                variants={cardStagger}
                                                initial="closed"
                                                animate="open"
                                                className="shrink-0 w-[110px]"
                                                role="listitem"
                                            >
                                                <Link
                                                    href={`/product/${('slug' in product && typeof product.slug === 'string') ? product.slug : slugify(product.name)}`}
                                                    onClick={closeDrawer}
                                                    className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded-[14px]"
                                                    aria-label={`${product.name} — Rs. ${product.price.toLocaleString()}`}
                                                >
                                                    <div className="relative w-full aspect-[3/4] rounded-[14px] overflow-hidden border border-border bg-white mb-2">
                                                        <Image
                                                            src={product.images[0] || '/luxury-streetwear-garment.png'}
                                                            alt={product.name}
                                                            fill
                                                            sizes="110px"
                                                            className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.05]"
                                                        />
                                                    </div>
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary truncate group-hover:text-gold transition-colors">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-[10px] text-gold mt-0.5 font-semibold">
                                                        Rs. {product.price.toLocaleString()}
                                                    </p>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── Spacer grows to push footer down ── */}
                            <div className="flex-1" aria-hidden="true" />

                            {/* ── Footer: Socials + WhatsApp ─────── */}
                            <div className="relative z-10 px-7 pt-5 pb-8 border-t border-border space-y-5">
                                {/* Social links */}
                                <div className="flex items-center gap-3">
                                    <a
                                        href={INSTAGRAM}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-secondary hover:text-gold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                                        aria-label="Follow NINE77 on Instagram"
                                    >
                                        <Instagram size={14} strokeWidth={1.5} />
                                    </a>
                                    <a
                                        href={WHATSAPP}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-secondary hover:text-[#25D366] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/40"
                                        aria-label="Contact via WhatsApp"
                                    >
                                        <MessageCircle size={14} strokeWidth={1.5} />
                                    </a>
                                    <span className="text-[9px] uppercase tracking-[0.28em] text-secondary/40 font-bold ml-1">
                                        @nine.77___
                                    </span>
                                </div>

                                {/* WhatsApp CTA */}
                                <a
                                    href={WHATSAPP}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={closeDrawer}
                                    className="flex w-full h-12 items-center justify-center gap-2.5 rounded-full bg-gold text-[11px] font-black uppercase tracking-[0.22em] text-white transition-all duration-250 hover:bg-gold-light hover:shadow-[0_8px_30px_rgba(183,134,74,0.2)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                                    aria-label="Order via WhatsApp"
                                >
                                    <MessageCircle size={14} strokeWidth={2.5} aria-hidden="true" />
                                    WhatsApp Checkout
                                </a>
                            </div>
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}