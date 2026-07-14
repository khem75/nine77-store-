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
                zIndex: 50,  // lower than drawer (9999) but above content
            }}
            aria-label="Mobile navigation"
        >
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
                <div
                    className="border border-white/[0.06] backdrop-blur-2xl"
                    style={{
                        borderRadius: 28,
                        background:
                            'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%), rgba(9,9,9,0.88)',
                        boxShadow:
                            'inset 0 1px 0px rgba(255,255,255,0.08), 0 16px 40px rgba(0,0,0,0.8)',
                    }}
                >
                    <div className="flex items-center justify-between px-2 py-1.5">
                        {navItems.map(({ label, href, icon: Icon }) => {
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={label}
                                    href={href}
                                    className="relative flex flex-1 flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-[20px] transition-colors duration-200"
                                    aria-current={isActive ? 'page' : undefined}
                                    aria-label={label}
                                >
                                    <Icon
                                        size={18}
                                        strokeWidth={isActive ? 2.2 : 1.5}
                                        className={`transition-colors duration-300 ${
                                            isActive ? 'text-gold' : 'text-white/40'
                                        }`}
                                        aria-hidden="true"
                                    />
                                    <span
                                        className={`text-[8px] font-bold uppercase tracking-[0.14em] transition-colors duration-300 ${
                                            isActive ? 'text-gold' : 'text-white/28'
                                        }`}
                                    >
                                        {label}
                                    </span>
                                    {isActive && (
                                        <motion.span
                                            layoutId="mobile-nav-dot"
                                            className="absolute -bottom-0.5 h-[2px] w-4 rounded-full bg-gold shadow-[0_0_6px_rgba(212,175,55,0.5)]"
                                            transition={{
                                                type: 'spring',
                                                stiffness: 380,
                                                damping: 30,
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
                            whileTap={{ scale: 0.93 }}
                            className="relative ml-1.5 flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-gold px-4 shadow-[0_4px_18px_rgba(212,175,55,0.28)]"
                            aria-label="Order via WhatsApp"
                        >
                            <MessageCircle size={14} strokeWidth={2.5} className="text-black" aria-hidden="true" />
                            <span className="text-[9px] font-black uppercase tracking-[0.16em] text-black">
                                Order
                            </span>
                        </motion.a>
                    </div>
                </div>
            </motion.div>
        </nav>
    );
}
