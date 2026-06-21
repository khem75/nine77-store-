'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import MobileMenu from '@/components/mobile-menu';

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' }
];

export default function Navbar() {
    return (
        <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-xl"
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                <Link href="/" className="text-xl font-black uppercase tracking-[0.4em] text-white">
                    NINE77
                </Link>
                <nav className="hidden items-center gap-10 md:flex">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href} className="text-sm uppercase tracking-[0.3em] text-white transition hover:text-gold">
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="https://wa.me/9779845465529" target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.2em] text-white transition hover:border-gold hover:text-gold md:inline-flex">
                        <MessageCircle size={16} />
                        WhatsApp
                    </Link>
                    <MobileMenu />
                </div>
            </div>
        </motion.header>
    );
}
