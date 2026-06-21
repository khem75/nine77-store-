'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, Menu, MessageSquare } from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' }
];

export default function MobileMenu() {
    const [open, setOpen] = useState(false);

    return (
        <div className="md:hidden">
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white transition hover:bg-white/10"
                aria-label="Open menu"
            >
                <Menu size={20} />
            </button>
            <AnimatePresence>
                {open ? (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="fixed inset-0 z-50 bg-black/80 px-6 py-8 backdrop-blur-xl"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-semibold uppercase tracking-[0.4em] text-white">NINE77</span>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-white"
                                aria-label="Close menu"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="mt-10 space-y-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="block text-2xl font-semibold uppercase tracking-[0.2em] text-white transition hover:text-gold"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-12 flex items-center gap-3 rounded-3xl bg-white/5 p-4">
                            <MessageSquare className="text-gold" size={18} />
                            <div>
                                <p className="text-sm uppercase text-muted">Order on WhatsApp</p>
                                <p className="text-sm text-white/80">Quick luxury support</p>
                            </div>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
