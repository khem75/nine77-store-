'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { MessageCircle, ShoppingBag, X, Menu } from 'lucide-react';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
];

const WHATSAPP = 'https://wa.me/9779810605409?text=Hello%20NINE77%2C%20I%20have%20an%20inquiry.';

/* ── Magnetic link wrapper ──────────────────────────────── */
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

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navBg = scrolled
        ? 'bg-black/80 border-white/8 backdrop-blur-2xl shadow-cinematic'
        : 'bg-transparent border-transparent backdrop-blur-0';

    return (
        <>
            <motion.header
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`sticky top-0 z-40 border-b transition-all duration-500 ${navBg}`}
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-xl font-black uppercase tracking-[0.4em] text-white transition-colors duration-300 hover:text-gold"
                    >
                        NINE<span className="text-gold">77</span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden items-center gap-8 md:flex">
                        {navLinks.map(({ label, href }) => (
                            <MagneticLink
                                key={href}
                                href={href}
                                className="editorial-underline relative text-xs uppercase tracking-[0.3em] text-white/70 transition-colors duration-300 hover:text-white"
                            >
                                {label}
                            </MagneticLink>
                        ))}
                    </nav>

                    {/* Right actions */}
                    <div className="flex items-center gap-3">
                        <motion.a
                            href={WHATSAPP}
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ scale: 1.05 }}
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
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile menu overlay */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={mobileOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed inset-x-0 top-16 z-30 overflow-hidden border-b border-white/8 bg-black/95 backdrop-blur-2xl transition-all duration-300 md:hidden ${
                    mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
            >
                <nav className="flex flex-col divide-y divide-white/5 px-5">
                    {navLinks.map(({ label, href }, i) => (
                        <motion.div
                            key={href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={mobileOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Link
                                href={href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center py-5 text-sm font-semibold uppercase tracking-[0.25em] text-white transition-colors duration-300 hover:text-gold"
                            >
                                <span className="mr-4 text-[10px] tracking-wider text-gold/50">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                {label}
                            </Link>
                        </motion.div>
                    ))}

                    <a
                        href={WHATSAPP}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 py-5 text-sm font-semibold uppercase tracking-[0.25em] text-gold"
                    >
                        <MessageCircle size={16} />
                        Order on WhatsApp
                    </a>
                </nav>
            </motion.div>
        </>
    );
}