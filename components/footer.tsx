'use client';

import Link from 'next/link';
import { Instagram, Facebook, Music2 } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black">
            <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
                <div className="grid gap-10 md:grid-cols-4">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-[0.3em] text-white">
                            NINE77
                        </h3>

                        <p className="mt-4 text-sm leading-7 text-white/60">
                            Premium streetwear for the bold. Comfort. Quality. Statement.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                            Navigation
                        </h4>

                        <ul className="space-y-3 text-sm text-white/70">
                            <li>
                                <Link href="/" className="hover:text-gold transition">
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link href="/shop" className="hover:text-gold transition">
                                    Shop
                                </Link>
                            </li>

                            <li>
                                <Link href="/about" className="hover:text-gold transition">
                                    About
                                </Link>
                            </li>

                            <li>
                                <Link href="/faq" className="hover:text-gold transition">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                            Contact
                        </h4>

                        <ul className="space-y-3 text-sm text-white/70">
                            <li>WhatsApp Orders</li>
                            <li>+977 9810605409</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                            Social
                        </h4>

                        <ul className="space-y-4 text-sm text-white/70">
                            <li>
                                <a
                                    href="https://www.instagram.com/nine.77___/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 hover:text-gold transition"
                                >
                                    <Instagram size={16} />
                                    Instagram
                                </a>
                            </li>

                            <li>
                                <a
                                    href="https://www.tiktok.com/@nine.77___"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 hover:text-gold transition"
                                >
                                    <Music2 size={16} />
                                    TikTok
                                </a>
                            </li>

                            <li>
                                <a
                                    href="https://www.facebook.com/share/1DtEy4K4MX/?mibextid=wwXIfr"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 hover:text-gold transition"
                                >
                                    <Facebook size={16} />
                                    Facebook
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-white/10 pt-8 text-center">
                    <p className="text-sm text-white/40">
                        © {new Date().getFullYear()} NINE77. All Rights Reserved.
                    </p>

                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/30">
                        Designed & Developed by{' '}
                        <a
                            href="https://github.com/khem75"
                            target="_blank"
                            rel="noreferrer"
                            className="text-gold hover:text-white transition"
                        >
                            Khem R. Joshi
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}