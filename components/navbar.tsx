'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ShoppingBag } from 'lucide-react';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
];

const WHATSAPP = 'https://wa.me/9779810605409?text=Hello%20NINE77%2C%20I%20have%20an%20inquiry.';

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolledScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [logoMounted, setLogoMounted] = useState(false);
    const lastY = useRef(0);
    const isShopPage = pathname === '/shop';

    useEffect(() => {
        const t1 = setTimeout(() => setMounted(true), 200);
        const t2 = setTimeout(() => setLogoMounted(true), 500);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            const delta = y - lastY.current;

            if (y < 60) {
                setHidden(false);
            } else if (delta > 10) {
                setHidden(true);
                setMobileOpen(false);
            } else if (delta < -8) {
                setHidden(false);
            }

            setScrolledScrolled(y > 30);
            lastY.current = y;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Outer style top positioning
    const navTopStyle = scrolled ? { top: 0 } : { top: '32px' };

    return (
        <>
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{
                    y: hidden ? -90 : (mounted ? 0 : -80),
                    opacity: hidden ? 0 : (mounted ? 1 : 0),
                }}
                transition={{
                    y: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.5 },
                }}
                style={navTopStyle}
                className={`fixed inset-x-0 z-40 transition-all duration-550 ease-luxury ${
                    scrolled 
                        ? 'bg-black/95 border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.8)]' 
                        : 'bg-transparent border-b border-transparent'
                } ${isShopPage ? 'hidden md:block' : ''}`}
            >
                <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 lg:px-12 relative">
                    
                    {/* Left: Premium Hamburger (Thin border, modern layout) */}
                    <div className="flex items-center">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.01] text-white transition-all duration-300 hover:border-white/25 hover:bg-white/[0.05] hover:scale-[1.08] active:scale-95"
                            aria-label="Open menu"
                        >
                            <Menu size={15} strokeWidth={1.2} />
                        </button>
                    </div>

                    {/* Center: Iconic Spaced Brand Logo */}
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: logoMounted ? 1 : 0 }}
                            transition={{ duration: 0.55, ease: 'easeOut' }}
                        >
                            <Link href="/" className="flex flex-col items-center justify-center text-center group">
                                <span className="text-[13px] font-black uppercase tracking-[0.58em] text-white transition-all duration-[400ms] ease-luxury group-hover:tracking-[0.66em] group-hover:text-gold">
                                    N I N E <span className="text-gold group-hover:text-white transition-colors duration-[400ms]">7 7</span>
                                </span>
                                <span className="text-[7.5px] font-bold uppercase tracking-[0.45em] text-white/35 mt-1.5 transition-all duration-[400ms] ease-luxury group-hover:tracking-[0.52em] group-hover:text-white/60 select-none">
                                    PREMIUM STREETWEAR
                                </span>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right: Actions (Search & WhatsApp) */}
                    <div className="flex items-center gap-2.5">
                        <Link
                            href="/shop"
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.01] text-white/70 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.05] hover:text-white hover:scale-[1.08] active:scale-95"
                            aria-label="Search Collection"
                        >
                            <Search size={14} strokeWidth={1.2} />
                        </Link>
                        <a
                            href={WHATSAPP}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.01] text-white/70 transition-all duration-300 hover:border-[#25D366]/30 hover:bg-white/[0.05] hover:text-[#25D366] hover:scale-[1.08] active:scale-95"
                            aria-label="WhatsApp Support"
                        >
                            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.202-1.362a9.923 9.923 0 0 0 4.808 1.238h.005c5.502 0 9.987-4.479 9.989-9.987.002-2.669-1.037-5.176-2.93-7.07a9.905 9.905 0 0 0-7.062-2.919zm0 1.655c2.228 0 4.321.867 5.897 2.445 1.576 1.579 2.443 3.674 2.441 5.9a8.318 8.318 0 0 1-8.333 8.326 8.27 8.27 0 0 1-4.225-1.154l-.303-.18-3.142.823.839-3.064-.198-.314A8.27 8.27 0 0 1 3.67 11.99a8.326 8.326 0 0 1 8.342-8.335zm-3.83 3.693c-.21 0-.395.078-.544.238-.149.16-.57.556-.57 1.357 0 .8.583 1.574.664 1.684.081.11 1.125 1.776 2.766 2.428.39.155.696.248.932.324.394.125.752.107 1.034.066.314-.046.969-.396 1.106-.778.137-.381.137-.708.096-.778-.041-.07-.152-.11-.318-.194-.166-.084-.969-.478-1.119-.533-.15-.054-.259-.082-.369.082-.11.164-.424.533-.52.642-.095.109-.192.122-.358.038-.166-.084-.7-.258-1.333-.822-.493-.439-.826-.981-.923-1.147-.097-.166-.01-.256.072-.34.075-.075.166-.194.249-.29.083-.097.11-.166.166-.277.055-.11.028-.207-.014-.291-.041-.084-.369-.887-.505-1.214-.133-.322-.269-.278-.369-.283l-.314-.005z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </motion.header>

            {/* Premium Fullscreen Navigation Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="fixed inset-0 z-[10000] flex justify-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Smoothly animated Backdrop Blur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setMobileOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl cursor-default"
                        />
                        {/* Premium Glassmorphism Drawer body */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                            className="relative h-full w-[85%] max-w-[340px] border-r border-white/[0.05] px-8 py-8 flex flex-col justify-between z-10"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%), rgba(8,8,8,0.92)',
                                boxShadow: 'inset -1px 0px 0px rgba(255,255,255,0.06), 25px 0px 55px rgba(0,0,0,0.9)',
                            }}
                        >
                            <div>
                                <div className="flex items-center justify-between">
                                    <Link
                                        href="/"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex flex-col text-left group/menu-logo"
                                    >
                                        <span className="text-[12px] font-black uppercase tracking-[0.55em] text-white transition-all duration-[400ms] group-hover/menu-logo:tracking-[0.62em] group-hover/menu-logo:text-gold">
                                            N I N E <span className="text-gold group-hover/menu-logo:text-white transition-colors duration-[400ms]">7 7</span>
                                        </span>
                                    </Link>
                                    <button
                                        onClick={() => setMobileOpen(false)}
                                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-300 hover:rotate-90 hover:scale-105 active:scale-95 hover:border-white/25 hover:bg-white/10 hover:text-white"
                                    >
                                        <X size={15} strokeWidth={1.5} />
                                    </button>
                                </div>

                                <nav className="mt-24 flex flex-col gap-6">
                                    {navLinks.map((item, idx) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <motion.div
                                                key={item.href}
                                                initial={{ opacity: 0, x: -30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ type: 'spring', stiffness: 220, damping: 20, delay: idx * 0.08 }}
                                            >
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setMobileOpen(false)}
                                                    className={`relative text-[20px] font-bold uppercase tracking-[0.22em] py-1.5 block group transition-all duration-300 hover:tracking-[0.26em] ${isActive ? 'text-gold' : 'text-white/55 hover:text-white'}`}
                                                >
                                                    {item.label}
                                                    <span className={`absolute bottom-0 left-0 w-8 h-px bg-gold transition-transform duration-300 origin-left group-hover:scale-x-150 ${isActive ? 'scale-x-150' : 'scale-x-0'}`} style={{ boxShadow: '0 0 6px rgba(212,175,55,0.6)' }} />
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </nav>
                            </div>

                            <div className="w-full">
                                <a
                                    href={WHATSAPP}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex w-full h-[52px] items-center justify-center gap-2.5 rounded-sm bg-gold text-[11px] font-black uppercase tracking-[0.25em] text-black transition-all duration-[250ms] cubic-bezier(0.16,1,0.3,1) hover:-translate-y-[3px] hover:scale-[1.02] hover:bg-[#f2cd5c] hover:shadow-[0_20px_45px_rgba(212,175,55,0.18)]"
                                >
                                    WhatsApp Checkout
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}