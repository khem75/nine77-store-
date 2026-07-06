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
        /* Outer wrapper: fixed positioning only — NO transform here */
        <div
            className="md:hidden"
            style={{
                position: 'fixed',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: 'max(16px, env(safe-area-inset-bottom))',
                width: 'min(92vw, 420px)',
                zIndex: 9999,
                borderRadius: '24px',
            }}
            aria-label="Mobile navigation"
        >
            {/* Inner: Framer Motion animation only — no transform that would conflict */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div
                    style={{ borderRadius: 24 }}
                    className="border border-white/10 bg-[#0A0A0A]/90 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl overflow-hidden"
                >
                    <div
                        className="flex items-center"
                        style={{ paddingBottom: 'max(6px, env(safe-area-inset-bottom, 0px))' }}
                    >
                        {navItems.map(({ label, href, icon: Icon }) => {
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={label}
                                    href={href}
                                    className="relative flex flex-1 flex-col items-center gap-0.5 py-2"
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.span
                                                layoutId="mobile-nav-indicator"
                                                className="absolute inset-x-1 top-1 h-7 rounded-[12px] bg-gold/12"
                                                transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                                            />
                                        )}
                                    </AnimatePresence>
                                    <Icon
                                        size={16}
                                        strokeWidth={isActive ? 2 : 1.5}
                                        className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-gold' : 'text-white/40'}`}
                                    />
                                    <span className={`relative z-10 text-[7px] uppercase tracking-[0.15em] transition-colors duration-300 ${isActive ? 'text-gold' : 'text-white/30'}`}>
                                        {label}
                                    </span>
                                </Link>
                            );
                        })}

                        {/* Order via WhatsApp */}
                        <motion.a
                            href={ORDER_URL}
                            target="_blank"
                            rel="noreferrer"
                            whileTap={{ scale: 0.95 }}
                            className="relative flex flex-1 flex-col items-center gap-0.5 py-2"
                            aria-label="Order via WhatsApp"
                        >
                            <span className="absolute inset-x-1 top-1 h-7 rounded-[12px] bg-gold/90 shadow-[0_6px_20px_rgba(212,175,55,0.25)]" />
                            <MessageCircle size={16} strokeWidth={2} className="relative z-10 text-black" />
                            <span className="relative z-10 text-[7px] uppercase tracking-[0.15em] text-black font-semibold">
                                Order
                            </span>
                        </motion.a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
