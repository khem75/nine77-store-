'use client';

import Link from 'next/link';
import { Instagram, Facebook, Music2, ArrowRight } from 'lucide-react';

const WHATSAPP = 'https://wa.me/9779810605409?text=Hello%20NINE77%2C%20I%20have%20an%20inquiry.';
const INSTAGRAM = 'https://www.instagram.com/nine.77___/';

export default function Footer() {
    return (
        <footer className="dark-section border-t border-white/[0.06]">
            <div className="mx-auto max-w-[1440px] px-5 pt-12 pb-[calc(120px+env(safe-area-inset-bottom))] md:px-12 md:pb-12 lg:px-16">
                <div className="grid gap-8 md:grid-cols-5">
                    {/* Brand */}
                    <div className="md:col-span-2 flex flex-col gap-3">
                        <h3 className="text-xl font-black uppercase tracking-[0.08em] text-white">
                            NINE<span className="text-gold">77</span>
                        </h3>
                        <p className="text-[12px] leading-relaxed text-white/40 max-w-xs font-light">
                            Premium streetwear engineered for those who refuse to blend in. Kathmandu, Nepal.
                        </p>
                        <Link
                            href="/shop"
                            className="group inline-flex items-center gap-2 mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold transition-all hover:gap-3"
                        >
                            Discover Collection
                            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                        </Link>

                        {/* Social */}
                        <div className="flex gap-3 mt-4">
                            {[
                                { icon: Instagram, href: INSTAGRAM, label: 'Instagram' },
                                { icon: Facebook, href: '#', label: 'Facebook' },
                                { icon: Music2, href: '#', label: 'TikTok' },
                            ].map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/30 transition-all"
                                >
                                    <Icon size={15} strokeWidth={1.5} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white mb-4">
                            Shop
                        </h4>
                        <div className="space-y-2.5">
                            {[
                                { label: 'All Products', href: '/shop' },
                                { label: 'New Arrivals', href: '/shop' },
                                { label: 'Best Sellers', href: '/shop' },
                                { label: 'Accessories', href: '/shop' },
                            ].map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="block text-[12px] text-white/40 hover:text-white transition-colors font-light"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white mb-4">
                            Info
                        </h4>
                        <div className="space-y-2.5">
                            {[
                                { label: 'About Us', href: '/about' },
                                { label: 'Lookbook', href: '/shop' },
                                { label: 'FAQ', href: '/faq' },
                                { label: 'Size Guide', href: '/faq' },
                            ].map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="block text-[12px] text-white/40 hover:text-white transition-colors font-light"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white mb-4">
                            Contact
                        </h4>
                        <div className="space-y-2.5">
                            <p className="text-[12px] text-white/40 font-light">WhatsApp Orders Only</p>
                            <a
                                href={WHATSAPP}
                                target="_blank"
                                rel="noreferrer"
                                className="block text-[12px] font-medium text-gold hover:text-gold-light transition-colors"
                            >
                                +977 9810605409
                            </a>
                            <a
                                href={`mailto:nine77nepal@gmail.com`}
                                className="block text-[12px] text-white/40 hover:text-white transition-colors font-light"
                            >
                                nine77nepal@gmail.com
                            </a>
                            <p className="text-[12px] text-white/30 font-light">
                                Kathmandu, Nepal
                            </p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <p className="text-[10px] text-white/25 tracking-wide">
                        © {new Date().getFullYear()} NINE77. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        {['Privacy Policy', 'Terms & Conditions'].map((item) => (
                            <span key={item} className="text-[10px] text-white/25 hover:text-white/50 cursor-pointer transition-colors">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}