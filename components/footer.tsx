'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, Instagram, Facebook, Music2 } from 'lucide-react';

export default function Footer() {
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <footer className="border-t border-white/[0.08] bg-[#070707]">
            <div className="mx-auto max-w-[1440px] px-6 pt-12 pb-28 md:pb-12 lg:px-8">
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

                    {/* Navigation Accordion/Column */}
                    <div className="border-b border-white/[0.08] pb-4 md:border-none md:pb-0">
                        <button
                            onClick={() => toggleSection('nav')}
                            className="flex w-full items-center justify-between py-2 text-left md:pointer-events-none md:block md:p-0"
                        >
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white">
                                Navigation
                            </h4>
                            <ChevronDown
                                size={14}
                                className={`text-white/60 transition-transform duration-300 md:hidden ${
                                    openSection === 'nav' ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                        <div
                            className={`mt-3 space-y-2 md:block ${
                                openSection === 'nav' ? 'block' : 'hidden'
                            }`}
                        >
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

                    {/* Contact Accordion/Column */}
                    <div className="border-b border-white/[0.08] pb-4 md:border-none md:pb-0">
                        <button
                            onClick={() => toggleSection('contact')}
                            className="flex w-full items-center justify-between py-2 text-left md:pointer-events-none md:block md:p-0"
                        >
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white">
                                Contact
                            </h4>
                            <ChevronDown
                                size={14}
                                className={`text-white/60 transition-transform duration-300 md:hidden ${
                                    openSection === 'contact' ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                        <div
                            className={`mt-3 space-y-2 md:block ${
                                openSection === 'contact' ? 'block' : 'hidden'
                            }`}
                        >
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

                    {/* Socials Accordion/Column */}
                    <div className="border-b border-white/[0.08] pb-4 md:border-none md:pb-0">
                        <button
                            onClick={() => toggleSection('social')}
                            className="flex w-full items-center justify-between py-2 text-left md:pointer-events-none md:block md:p-0"
                        >
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white">
                                Social
                            </h4>
                            <ChevronDown
                                size={14}
                                className={`text-white/60 transition-transform duration-300 md:hidden ${
                                    openSection === 'social' ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                        <div
                            className={`mt-3 space-y-2 md:block ${
                                openSection === 'social' ? 'block' : 'hidden'
                            }`}
                        >
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