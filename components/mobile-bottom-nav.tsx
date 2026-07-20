'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, Info, CircleHelp, MessageCircle } from 'lucide-react';

const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/shop', icon: ShoppingBag },
    { label: 'About', href: '/about', icon: Info },
    { label: 'FAQ', href: '/faq', icon: CircleHelp },
] as const;

const ORDER_URL =
    'https://wa.me/9779810605409?text=Hello%20NINE77%2C%20I%20would%20like%20to%20place%20an%20order.';

export default function MobileBottomNav() {
    const pathname = usePathname();

    return (
        <nav
            className="md:hidden"
            style={{
                position: 'fixed',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
                width: '92vw',
                maxWidth: '400px',
                zIndex: 50,
            }}
            aria-label="Mobile navigation"
        >
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
                <div
                    className="border border-[#E8E3DC] backdrop-blur-2xl bg-[#F7F5F2]/90 shadow-luxury-lg"
                    style={{
                        borderRadius: 24,
                    }}
                >
                    <div className="flex items-center justify-between px-2.5 py-1.5">
                        {navItems.map(({ label, href, icon: Icon }) => {
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={label}
                                    href={href}
                                    className="relative flex flex-1 flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-[18px] min-h-[44px] transition-colors duration-200"
                                    aria-current={isActive ? 'page' : undefined}
                                    aria-label={label}
                                >
                                    <Icon
                                        size={18}
                                        strokeWidth={1.75}
                                        className={`transition-colors duration-200 ${
                                            isActive ? 'text-gold' : 'text-secondary/60'
                                        }`}
                                        aria-hidden="true"
                                    />
                                    <span
                                        className={`text-[8px] font-bold uppercase tracking-[0.14em] transition-colors duration-200 ${
                                            isActive ? 'text-gold' : 'text-secondary/70'
                                        }`}
                                    >
                                        {label}
                                    </span>
                                    {isActive && (
                                        <motion.span
                                            layoutId="mobile-nav-dot"
                                            className="absolute -bottom-0.5 h-[2.5px] w-4 rounded-full bg-gold"
                                            transition={{
                                                type: 'spring',
                                                stiffness: 140,
                                                damping: 20,
                                                mass: 0.8,
                                            }}
                                            aria-hidden="true"
                                        />
                                    )}
                                </Link>
                            );
                        })}

                        {/* WhatsApp Order CTA */}
                        <motion.a
                            href={ORDER_URL}
                            target="_blank"
                            rel="noreferrer"
                            whileTap={{ scale: 0.94 }}
                            className="relative ml-1.5 flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-[12px] bg-gold px-4 shadow-luxury hover:bg-gold-dark transition-colors"
                            aria-label="Order via WhatsApp"
                        >
                            <MessageCircle size={14} strokeWidth={1.75} className="text-white" aria-hidden="true" />
                            <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white">
                                Order
                            </span>
                        </motion.a>
                    </div>
                </div>
            </motion.div>
        </nav>
    );
}
