'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, ShoppingBag, Info, CircleHelp, MessageCircle } from 'lucide-react';

const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/shop', icon: ShoppingBag },
    { label: 'About', href: '/about', icon: Info },
    { label: 'FAQ', href: '/faq', icon: CircleHelp },
];

const ORDER_URL = 'https://wa.me/9779810605409?text=Hello%20NINE77%2C%20I%20would%20like%20to%20place%20an%20order.';

export default function MobileBottomNav() {
    const pathname = usePathname();

    return (
        <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-3 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-[430px] -translate-x-1/2 md:hidden"
            aria-label="Mobile navigation"
        >
            <div className="rounded-[28px] border border-white/10 bg-[#0A0A0A]/78 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                <div className="flex items-center justify-around px-2 py-2" style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}>
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const isActive = pathname === href;

                        return (
                            <Link
                                key={label}
                                href={href}
                                className="relative flex flex-1 flex-col items-center gap-1 py-2"
                                aria-current={isActive ? 'page' : undefined}
                            >
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.span
                                            layoutId="mobile-nav-indicator"
                                            className="absolute inset-x-2 top-0 h-10 rounded-[18px] bg-gold/12"
                                            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                                        />
                                    )}
                                </AnimatePresence>

                                <Icon
                                    size={19}
                                    strokeWidth={isActive ? 2 : 1.5}
                                    className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-gold' : 'text-white/42'}`}
                                />
                                <span className={`relative z-10 text-[8px] uppercase tracking-[0.16em] transition-colors duration-300 ${isActive ? 'text-gold' : 'text-white/30'}`}>
                                    {label}
                                </span>
                            </Link>
                        );
                    })}

                    <motion.a
                        href={ORDER_URL}
                        target="_blank"
                        rel="noreferrer"
                        whileTap={{ scale: 0.95 }}
                        className="relative flex flex-1 flex-col items-center gap-1 py-2"
                        aria-label="Order"
                    >
                        <span className="absolute inset-x-2 top-0 h-10 rounded-[18px] bg-gold/90 shadow-[0_10px_24px_rgba(212,175,55,0.18)]" />
                        <MessageCircle size={19} strokeWidth={2} className="relative z-10 text-black" />
                        <span className="relative z-10 text-[8px] uppercase tracking-[0.16em] text-black">
                            Order
                        </span>
                    </motion.a>
                </div>
            </div>
        </motion.nav>
    );
}
