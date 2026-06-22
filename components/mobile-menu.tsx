'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Menu,
    X,
    Home,
    ShoppingBag,
    Info,
    CircleHelp,
    MessageCircle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function MobileMenu() {
    const [open, setOpen] = useState(false);

    const closeMenu = () => setOpen(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="md:hidden rounded-xl border border-white/10 bg-white/5 p-2 text-white"
            >
                <Menu size={24} />
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        {/* Background Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMenu}
                            className="fixed inset-0 z-[999998] bg-black/70 backdrop-blur-sm"
                        />

                        {/* Side Menu */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.3 }}
                            className="fixed top-0 right-0 z-[999999] h-screen w-[85%] max-w-sm bg-black border-l border-white/10"
                        >
                            <div className="flex h-full flex-col">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                                    <h2 className="text-xl font-black tracking-[0.3em] text-white">
                                        NINE77
                                    </h2>

                                    <button
                                        onClick={closeMenu}
                                        className="rounded-full border border-white/10 p-2 text-white"
                                    >
                                        <X size={22} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto px-6 py-8">
                                    <p className="mb-8 text-xs uppercase tracking-[0.4em] text-gold">
                                        Menu
                                    </p>

                                    <div className="space-y-4">
                                        <Link
                                            href="/"
                                            onClick={closeMenu}
                                            className="flex items-center gap-4 rounded-2xl border border-white/10 p-4 text-lg text-white hover:border-gold"
                                        >
                                            <Home size={22} />
                                            Home
                                        </Link>

                                        <Link
                                            href="/shop"
                                            onClick={closeMenu}
                                            className="flex items-center gap-4 rounded-2xl border border-white/10 p-4 text-lg text-white hover:border-gold"
                                        >
                                            <ShoppingBag size={22} />
                                            Shop
                                        </Link>

                                        <Link
                                            href="/about"
                                            onClick={closeMenu}
                                            className="flex items-center gap-4 rounded-2xl border border-white/10 p-4 text-lg text-white hover:border-gold"
                                        >
                                            <Info size={22} />
                                            About
                                        </Link>

                                        <Link
                                            href="/faq"
                                            onClick={closeMenu}
                                            className="flex items-center gap-4 rounded-2xl border border-white/10 p-4 text-lg text-white hover:border-gold"
                                        >
                                            <CircleHelp size={22} />
                                            FAQ
                                        </Link>
                                    </div>

                                    {/* WhatsApp */}
                                    <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
                                        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">
                                            Support
                                        </p>

                                        <a
                                            href="https://wa.me/9779810605409"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-3 text-white"
                                        >
                                            <MessageCircle size={18} />
                                            WhatsApp Support
                                        </a>
                                    </div>

                                    {/* Social Links */}
                                    <div className="mt-10">
                                        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">
                                            Follow Us
                                        </p>

                                        <div className="flex flex-wrap gap-3">
                                            <a
                                                href="https://www.instagram.com/nine.77___/"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white"
                                            >
                                                Instagram
                                            </a>

                                            <a
                                                href="https://www.tiktok.com/@nine.77__"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white"
                                            >
                                                TikTok
                                            </a>

                                            <a
                                                href="https://www.facebook.com/share/1DtEy4K4MX/?mibextid=wwXIfr"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white"
                                            >
                                                Facebook
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}