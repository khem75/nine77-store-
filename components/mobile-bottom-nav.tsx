'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, Grid3x3, Info, MessageCircle } from 'lucide-react';

const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/shop', icon: ShoppingBag },
    { label: 'Collections', href: '/shop', icon: Grid3x3 },
    { label: 'About', href: '/about', icon: Info },
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
        >
            {/* Gradient fade above nav */}
            <div className="pointer-events-none h-12 bg-gradient-to-t from-background to-transparent" />

            <div
                className="glass-gold flex items-center justify-around border-t border-white/8 px-2 pb-safe"
                style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
            >
                {navItems.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href && !(href === '/shop' && label === 'Collections');
                    return (
                        <Link
                            key={label}
                            href={href}
                            className="relative flex flex-1 flex-col items-center gap-1 py-3 transition-all duration-300"
                        >
                            <motion.div
                                whileTap={{ scale: 0.85 }}
                                className="relative flex flex-col items-center gap-1"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="mobile-nav-indicator"
                                        className="absolute -inset-x-3 -inset-y-1.5 rounded-2xl bg-gold/10"
                                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                    />
                                )}
                                <Icon
                                    size={20}
                                    strokeWidth={isActive ? 2 : 1.5}
                                    className={`relative z-10 transition-colors duration-300 ${
                                        isActive ? 'text-gold' : 'text-white/50'
                                    }`}
                                />
                                <span
                                    className={`relative z-10 text-[9px] uppercase tracking-[0.15em] transition-colors duration-300 ${
                                        isActive ? 'text-gold' : 'text-white/40'
                                    }`}
                                >
                                    {label}
                                </span>
                            </motion.div>
                        </Link>
                    );
                })}

                {/* WhatsApp button */}
                <motion.a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer"
                    whileTap={{ scale: 0.85 }}
                    className="flex flex-1 flex-col items-center gap-1 py-3"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold shadow-glow-sm">
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
