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
        <div
            className="md:hidden"
            style={{
                position: 'fixed',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: 'max(18px, env(safe-area-inset-bottom))',
                width: '92vw',
                maxWidth: '400px',
                zIndex: 9999,
            }}
            aria-label="Mobile navigation"
        >
            <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.65, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
                <div
                    className="border border-white/[0.05] backdrop-blur-2xl"
                    style={{
                        borderRadius: 28,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%), rgba(10,10,10,0.85)',
                        boxShadow: 'inset 0 1px 0px rgba(255,255,255,0.1), 0 20px 45px rgba(0,0,0,0.85)',
                    }}
                >
                    <div
                        className="flex items-center justify-between px-3 py-2.5"
                    >
                        {navItems.map(({ label, href, icon: Icon }) => {
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={label}
                                    href={href}
                                    className="relative flex flex-1 flex-col items-center justify-center gap-1.5 py-1"
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    <Icon
                                        size={18}
                                        strokeWidth={isActive ? 2 : 1.4}
                                        className={`transition-colors duration-300 ${isActive ? 'text-gold' : 'text-white/40'}`}
                                    />
                                    <span className={`text-[8px] font-bold uppercase tracking-[0.16em] transition-colors duration-300 ${isActive ? 'text-gold' : 'text-white/30'}`}>
                                        {label}
                                    </span>
                                    {isActive && (
                                        <motion.span
                                            layoutId="mobile-nav-dot"
                                            className="absolute bottom-[-2px] h-[3px] w-3 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}

                        {/* WhatsApp Order Pill Button */}
                        <motion.a
                            href={ORDER_URL}
                            target="_blank"
                            rel="noreferrer"
                            whileTap={{ scale: 0.94 }}
                            className="relative flex h-10 px-5 items-center justify-center gap-1.5 rounded-full bg-gold shadow-[0_4px_15px_rgba(212,175,55,0.3)] ml-2"
                            aria-label="Order via WhatsApp"
                        >
                            <MessageCircle size={15} strokeWidth={2.2} className="text-black" />
                            <span className="text-[9px] font-black uppercase tracking-[0.16em] text-black">
                                Order
                            </span>
                        </motion.a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
