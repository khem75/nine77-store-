'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Menu, X, Home, ShoppingBag, Info, CircleHelp, ArrowUpRight } from 'lucide-react';

const navLinks = [
    { label: 'Home',  href: '/',      icon: Home },
    { label: 'Shop',  href: '/shop',  icon: ShoppingBag },
    { label: 'About', href: '/about', icon: Info },
    { label: 'FAQ',   href: '/faq',   icon: CircleHelp },
];

const WHATSAPP = 'https://wa.me/9779810605409?text=Hello%20NINE77%2C%20I%20have%20an%20inquiry.';

const socialLinks = [
    { label: 'Instagram', href: 'https://www.instagram.com/nine.77___/' },
    { label: 'TikTok',    href: 'https://www.tiktok.com/@nine.77__' },
    { label: 'Facebook',  href: 'https://www.facebook.com/share/1DtEy4K4MX/?mibextid=wwXIfr' },
];

/* ── Magnetic link wrapper ─────────────────────────── */
function MagneticLink({
    href,
    children,
    className,
}: {
    href: string;
    children: React.ReactNode;
    className?: string;
}) {
    const ref = useRef<HTMLAnchorElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        el.style.transition = 'transform 0.15s ease';
    };

    const handleMouseLeave = () => {
        const el = ref.current;
        if (!el) return;
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    };

    return (
        <Link
            ref={ref}
            href={href}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </Link>
    );
}

/* ── Mobile full-screen menu ───────────────────────── */
function MobileDrawer({
    open,
    onClose,
    pathname,
}: {
    open: boolean;
    onClose: () => void;
    pathname: string;
}) {
    // Lock body scroll when open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    const containerVariants = {
        hidden: { x: '100%' },
        visible: {
            x: 0,
            transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
        },
        exit: {
            x: '100%',
            transition: { duration: 0.35, ease: [0.7, 0, 0.84, 0] },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: 30 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: { delay: 0.12 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        }),
        exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
    };

    return (
        <>
            {/* Backdrop — own AnimatePresence so React can track it independently */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Drawer panel — own AnimatePresence */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="drawer"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed top-0 right-0 z-[9999] h-dvh w-[min(85vw,360px)] flex flex-col bg-[#080808] border-l border-white/8 overflow-hidden"
                    >
                        {/* Decorative gold orb */}
                        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gold/5 blur-[80px]" />

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/8 px-6 py-5 shrink-0">
                            <Link
                                href="/"
                                onClick={onClose}
                                className="text-lg font-black uppercase tracking-[0.4em] text-white"
                            >
                                NINE<span className="text-gold">77</span>
                            </Link>
                            <button
                                onClick={onClose}
                                aria-label="Close menu"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all duration-200 hover:border-gold/30 hover:text-gold"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Nav links */}
                        <nav className="flex-1 overflow-y-auto px-5 py-8">
                            <p className="mb-6 text-[10px] uppercase tracking-[0.45em] text-white/25">
                                Navigate
                            </p>

                            <div className="space-y-1">
                                {navLinks.map(({ label, href, icon: Icon }, i) => {
                                    const isActive = pathname === href;
                                    return (
                                        <motion.div
                                            key={href}
                                            custom={i}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                        >
                                            <Link
                                                href={href}
                                                onClick={onClose}
                                                className={`group relative flex items-center gap-4 rounded-2xl px-4 py-4 transition-all duration-300 ${
                                                    isActive
                                                        ? 'bg-gold/8 text-gold'
                                                        : 'text-white/70 hover:bg-white/4 hover:text-white'
                                                }`}
                                            >
                                                {/* Active pill */}
                                                {isActive && (
                                                    <motion.span
                                                        layoutId="mobile-drawer-indicator"
                                                        className="absolute inset-0 rounded-2xl border border-gold/20 bg-gold/8"
                                                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                                    />
                                                )}

                                                <span className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 ${
                                                    isActive
                                                        ? 'border-gold/25 bg-gold/10 text-gold'
                                                        : 'border-white/8 bg-white/4 text-white/50 group-hover:border-gold/15 group-hover:text-white/80'
                                                }`}>
                                                    <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                                                </span>

                                                <span className="relative text-sm font-semibold uppercase tracking-[0.2em]">
                                                    {label}
                                                </span>

                                                <span className={`relative ml-auto text-[10px] tracking-wider transition-colors duration-300 ${isActive ? 'text-gold/50' : 'text-white/15'}`}>
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Divider */}
                            <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

                            {/* Floating featured product image */}
                            <motion.div
                                custom={navLinks.length - 1}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="relative mb-6 overflow-hidden rounded-2xl border border-white/8 bg-white/3"
                            >
                                {/* Slow float animation wrapper */}
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    className="relative h-44 w-full"
                                >
                                    <Image
                                        src="/products/windcheater-1.jpg"
                                        alt="NINE77 Windcheater"
                                        fill
                                        className="object-cover object-top"
                                        sizes="360px"
                                        priority={false}
                                    />
                                    {/* Gold shimmer overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/80 via-transparent to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
                                </motion.div>

                                {/* Label */}
                                <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
                                    <p className="text-[9px] uppercase tracking-[0.4em] text-gold/60">Featured</p>
                                    <p className="text-sm font-bold uppercase tracking-[0.15em] text-white">Windcheater</p>
                                </div>

                                {/* Corner bracket accent */}
                                <div className="absolute right-3 top-3 h-5 w-5 border-r border-t border-gold/30" />
                                <div className="absolute bottom-3 left-3 h-5 w-5 border-b border-l border-gold/30" />
                            </motion.div>

                            {/* WhatsApp CTA */}
                            <motion.div
                                custom={navLinks.length}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <a
                                    href={WHATSAPP}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={onClose}
                                    className="group flex items-center gap-4 rounded-2xl border border-gold/20 bg-gold/5 px-4 py-4 transition-all duration-300 hover:border-gold/35 hover:bg-gold/10"
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold text-black shadow-glow-sm transition-all duration-300 group-hover:shadow-glow">
                                        <MessageCircle size={16} strokeWidth={2} />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                                            Order on WhatsApp
                                        </p>
                                        <p className="mt-0.5 text-[10px] text-white/35 tracking-wide">
                                            Fast &amp; easy ordering
                                        </p>
                                    </div>
                                    <ArrowUpRight size={14} className="ml-auto text-gold/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold/70" />
                                </a>
                            </motion.div>

                            {/* Social links */}
                            <motion.div
                                custom={navLinks.length + 1}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="mt-8"
                            >
                                <p className="mb-4 text-[10px] uppercase tracking-[0.45em] text-white/25">
                                    Follow Us
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {socialLinks.map(({ label, href }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/3 px-4 py-2 text-xs text-white/50 transition-all duration-200 hover:border-gold/20 hover:text-white/80"
                                        >
                                            <ArrowUpRight size={10} className="opacity-50" />
                                            {label}
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        </nav>

                        {/* Footer */}
                        <div className="shrink-0 border-t border-white/6 px-6 py-4">
                            <p className="text-center text-[10px] uppercase tracking-[0.35em] text-white/15">
                                Premium Streetwear · Est. MMXXVI
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

/* ── Main Navbar ───────────────────────────────────── */
export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const lastY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            const delta = y - lastY.current;

            // Show/hide on scroll direction
            if (y < 80) {
                setHidden(false);
            } else if (delta > 6) {
                setHidden(true);
                setMobileOpen(false);
            } else if (delta < -4) {
                setHidden(false);
            }

            setScrolled(y > 40);
            lastY.current = y;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navBg = scrolled
        ? 'bg-[#080808]/85 border-white/8 backdrop-blur-2xl shadow-cinematic'
        : 'bg-transparent border-transparent backdrop-blur-0';

    return (
        <>
            <motion.header
                initial={{ y: -60, opacity: 0 }}
                animate={{
                    y: hidden ? -80 : 0,
                    opacity: hidden ? 0 : 1,
                }}
                transition={{
                    y:       { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.3 },
                }}
                className={`sticky top-0 z-40 border-b transition-colors duration-500 ${navBg}`}
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">

                    {/* Logo */}
                    <Link
                        href="/"
                        className="relative z-10 text-xl font-black uppercase tracking-[0.4em] text-white transition-colors duration-300 hover:text-gold"
                    >
                        NINE<span className="text-gold">77</span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
                        {navLinks.map(({ label, href }) => {
                            const isActive = pathname === href;
                            return (
                                <MagneticLink
                                    key={href}
                                    href={href}
                                    className={`relative rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] transition-colors duration-300 ${
                                        isActive
                                            ? 'text-white'
                                            : 'text-white/55 hover:text-white'
                                    }`}
                                >
                                    {/* Animated active pill */}
                                    {isActive && (
                                        <motion.span
                                            layoutId="desktop-nav-pill"
                                            className="absolute inset-0 rounded-full border border-white/10 bg-white/6"
                                            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                        />
                                    )}
                                    <span className="relative">{label}</span>
                                </MagneticLink>
                            );
                        })}
                    </nav>

                    {/* Right actions */}
                    <div className="flex items-center gap-3">
                        {/* WhatsApp CTA — desktop */}
                        <motion.a
                            href={WHATSAPP}
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.95 }}
                            className="hidden items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold transition-all duration-300 hover:border-gold/40 hover:bg-gold/10 md:inline-flex"
                        >
                            <MessageCircle size={14} />
                            Order
                        </motion.a>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-gold/30 hover:text-gold md:hidden"
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {mobileOpen ? (
                                    <motion.span
                                        key="close"
                                        initial={{ rotate: -45, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 45, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X size={18} />
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="open"
                                        initial={{ rotate: 45, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -45, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu size={18} />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile drawer */}
            <MobileDrawer
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                pathname={pathname}
            />
        </>
    );
}