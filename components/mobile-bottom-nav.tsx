'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ShoppingBag, Info, CircleHelp, MessageCircle } from 'lucide-react';

const navItems = [
    { label: 'Home',  href: '/',      icon: Home },
    { label: 'Shop',  href: '/shop',  icon: ShoppingBag },
    { label: 'About', href: '/about', icon: Info },
    { label: 'FAQ',   href: '/faq',   icon: CircleHelp },
];

const WHATSAPP_URL =
    'https://wa.me/9779810605409?text=Hello%20NINE77%2C%20I%20have%20an%20inquiry.';

export default function MobileBottomNav() {
    const pathname = usePathname();

    return (
        <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
            aria-label="Mobile navigation"
        >
            {/* Gradient fade above nav */}
            <div className="pointer-events-none h-10 bg-gradient-to-t from-background to-transparent" />

            <div
                className="glass-gold flex items-center justify-around border-t border-white/8 px-1"
                style={{ paddingBottom: 'max(14px, env(safe-area-inset-bottom))' }}
            >
                {navItems.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={label}
                            href={href}
                            className="relative flex flex-1 flex-col items-center gap-1 py-3"
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <motion.div
                                whileTap={{ scale: 0.82 }}
                                className="relative flex flex-col items-center gap-1"
                            >
                                {/* Animated background pill */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.span
                                            layoutId="mobile-nav-indicator"
                                            className="absolute -inset-x-3 -inset-y-1.5 rounded-2xl bg-gold/10"
                                            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                        />
                                    )}
                                </AnimatePresence>

                                <Icon
                                    size={20}
                                    strokeWidth={isActive ? 2 : 1.5}
                                    className={`relative z-10 transition-colors duration-300 ${
                                        isActive ? 'text-gold' : 'text-white/40'
                                    }`}
                                />
                                <span
                                    className={`relative z-10 text-[9px] uppercase tracking-[0.15em] transition-colors duration-300 ${
                                        isActive ? 'text-gold' : 'text-white/30'
                                    }`}
                                >
                                    {label}
                                </span>
                            </motion.div>
                        </Link>
                    );
                })}

                {/* WhatsApp CTA button */}
                <motion.a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer"
                    whileTap={{ scale: 0.82 }}
                    className="flex flex-1 flex-col items-center gap-1 py-3"
                    aria-label="Order on WhatsApp"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold shadow-glow-sm transition-all duration-300">
                        <MessageCircle size={17} strokeWidth={2} className="text-black" />
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.15em] text-gold/70">
                        Order
                    </span>
                </motion.a>
            </div>
        </motion.nav>
    );
}
