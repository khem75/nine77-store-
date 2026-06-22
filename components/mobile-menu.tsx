'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, ShoppingBag, Info, CircleHelp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[999] bg-black"
                    >
                        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                            <h2 className="text-xl font-black tracking-[0.3em] text-white">
                                NINE77
                            </h2>

                            <button
                                onClick={closeMenu}
                                className="rounded-full border border-white/10 p-2 text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="px-6 py-8">
                            <p className="mb-6 text-xs uppercase tracking-[0.4em] text-gold">
                                Menu
                            </p>

                            <div className="space-y-5">
                                <Link
                                    href="/"
                                    onClick={closeMenu}
                                    className="flex items-center gap-4 border-b border-white/10 pb-4 text-xl font-medium text-white"
                                >
                                    <Home size={22} />
                                    Home
                                </Link>

                                <Link
                                    href="/shop"
                                    onClick={closeMenu}
                                    className="flex items-center gap-4 border-b border-white/10 pb-4 text-xl font-medium text-white"
                                >
                                    <ShoppingBag size={22} />
                                    Shop
                                </Link>

                                <Link
                                    href="/about"
                                    onClick={closeMenu}
                                    className="flex items-center gap-4 border-b border-white/10 pb-4 text-xl font-medium text-white"
                                >
                                    <Info size={22} />
                                    About
                                </Link>

                                <Link
                                    href="/faq"
                                    onClick={closeMenu}
                                    className="flex items-center gap-4 border-b border-white/10 pb-4 text-xl font-medium text-white"
                                >
                                    <CircleHelp size={22} />
                                    FAQ
                                </Link>
                            </div>

                            <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5">
                                <p className="text-xs uppercase tracking-[0.3em] text-gold">
                                    Support
                                </p>

                                <a
                                    href="https://wa.me/9779845465529"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 block text-white"
                                >
                                    WhatsApp Support
                                </a>
                            </div>

                            <div className="mt-8 flex gap-4">
                                <a
                                    href="https://www.instagram.com/nine.77___/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-full border border-white/10 px-4 py-2 text-white"
                                >
                                    Instagram
                                </a>

                                <a
                                    href="https://www.tiktok.com/@nine.77__"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-full border border-white/10 px-4 py-2 text-white"
                                >
                                    TikTok
                                </a>

                                <a
                                    href="https://www.facebook.com/share/1DtEy4K4MX/?mibextid=wwXIfr"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-full border border-white/10 px-4 py-2 text-white"
                                >
                                    Facebook
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}