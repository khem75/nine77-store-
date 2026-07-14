'use client';

import Link from 'next/link';
import { Instagram, Facebook, Music2 } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-white/[0.08] bg-[#070707]">
            <div className="mx-auto max-w-[1440px] px-6 pt-12 pb-[calc(120px+env(safe-area-inset-bottom))] md:pb-12 lg:px-8">
                {/* Desktop layout: multi-column. Mobile: accordion */}
                <div className="grid gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-xl font-extrabold uppercase tracking-widest text-white">
                            NINE<span className="text-gold">77</span>
                        </h3>
                        <p className="text-xs leading-relaxed text-white/50 max-w-xs">
                            Premium streetwear label. Engineered for statement silhouettes.
                        </p>
                    </div>

                    {/* Navigation Column */}
                    <div className="border-b border-white/[0.08] pb-5 md:border-none md:pb-0">
                        <div className="py-2 md:p-0">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white">
                                Navigation
                            </h4>
                        </div>
                        <div className="mt-3 space-y-2 block">
                            {[
                                { label: 'Home', href: '/' },
                                { label: 'Shop', href: '/shop' },
                                { label: 'About', href: '/about' },
                                { label: 'FAQ', href: '/faq' },
                            ].map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="block text-[13px] text-white/45 hover:text-white transition-colors duration-200"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact Column */}
                    <div className="border-b border-white/[0.08] pb-5 md:border-none md:pb-0">
                        <div className="py-2 md:p-0">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white">
                                Contact
                            </h4>
                        </div>
                        <div className="mt-3 space-y-2 block">
                            <p className="text-[13px] text-white/45">WhatsApp Orders Only</p>
                            <a
                                href="https://wa.me/9779810605409"
                                target="_blank"
                                rel="noreferrer"
                                className="block text-[13px] font-medium text-gold hover:text-gold-light"
                            >
                                +977 9810605409
                            </a>
                        </div>
                    </div>

                    {/* Socials Column */}
                    <div className="border-b border-white/[0.08] pb-5 md:border-none md:pb-0">
                        <div className="py-2 md:p-0">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white">
                                Social
                            </h4>
                        </div>
                        <div className="mt-3 space-y-2 block">
                            {[
                                { label: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/nine.77___/' },
                                { label: 'TikTok', icon: Music2, href: 'https://www.tiktok.com/@nine.77__' },
                                { label: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/share/1DtEy4K4MX/?mibextid=wwXIfr' },
                            ].map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-[13px] text-white/45 hover:text-white transition-colors duration-250"
                                >
                                    <item.icon size={13} strokeWidth={1.5} />
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-12 border-t border-white/[0.08] pt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-[11px] text-white/30">
                        © {new Date().getFullYear()} NINE77. All Rights Reserved.
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-white/30">
                        Designed & Developed by{' '}
                        <a
                            href="https://khemjoshi.tech/"
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-gold transition-colors duration-200 hover:text-gold-light"
                        >
                            Khem R. Joshi
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}