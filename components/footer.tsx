'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Music2, ArrowRight, Check } from 'lucide-react';
import Logo from './logo';

const WHATSAPP = 'https://wa.me/9779810605409?text=Hello%20NINE77%2C%20I%20have%20an%20inquiry.';
const INSTAGRAM = 'https://www.instagram.com/nine.77___/';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 4000);
        }
    };

    return (
        <footer className="dark-section border-t border-white/[0.08] bg-[#0C0A08]">
            <div className="mx-auto max-w-[1440px] px-5 pt-16 pb-[calc(120px+env(safe-area-inset-bottom))] md:px-12 md:pb-12 lg:px-16">
                <div className="grid gap-10 md:grid-cols-5 lg:gap-12">
                    {/* Brand */}
                    <div className="md:col-span-2 flex flex-col gap-4">
                        <Logo variant="footer" />
                        <p className="text-[12px] leading-relaxed text-white/50 max-w-xs font-light">
                            NINE77 — Next-generation luxury streetwear. Museum-grade craftsmanship and bold visual drape. Mahendranagar, Nepal.
                        </p>
                        
                        {/* Newsletter Input */}
                        <div className="mt-2 max-w-sm">
                            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-gold block mb-2">
                                Join The Private List
                            </span>
                            <form onSubmit={handleSubscribe} className="relative flex items-center">
                                <input
                                    type="email"
                                    placeholder="Enter your email for private drops..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-11 rounded-[14px] border border-white/10 bg-white/[0.04] px-4 pr-24 text-[11px] text-white placeholder:text-white/35 outline-none transition-all duration-200 focus:border-gold/60 focus:bg-white/[0.06] caret-gold"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1.5 h-8 px-3 rounded-[12px] bg-gold text-[9px] font-bold uppercase tracking-[0.16em] text-white hover:bg-gold-light transition-colors flex items-center gap-1"
                                >
                                    {subscribed ? (
                                        <>
                                            <Check size={12} strokeWidth={2} /> Joined
                                        </>
                                    ) : (
                                        <>
                                            Join <ArrowRight size={11} strokeWidth={1.75} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Social */}
                        <div className="flex gap-3 mt-2">
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
                                    className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/40 transition-all duration-200 hover:scale-105"
                                >
                                    <Icon size={15} strokeWidth={1.75} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.28em] text-white mb-4">
                            Shop Collections
                        </h4>
                        <div className="space-y-2.5">
                            {[
                                { label: 'All Garments', href: '/shop' },
                                { label: 'New Arrivals', href: '/shop' },
                                { label: 'Nightfall Collection', href: '/shop' },
                                { label: 'Accessories', href: '/shop' },
                            ].map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="block text-[12px] text-white/45 hover:text-white transition-colors duration-200 font-light"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.28em] text-white mb-4">
                            Brand &amp; Info
                        </h4>
                        <div className="space-y-2.5">
                            {[
                                { label: 'About NINE77', href: '/about' },
                                { label: 'Editorial Lookbook', href: '/shop' },
                                { label: 'FAQ & Support', href: '/faq' },
                                { label: 'Sizing & Care', href: '/faq' },
                            ].map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="block text-[12px] text-white/45 hover:text-white transition-colors duration-200 font-light"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.28em] text-white mb-4">
                            Direct Support
                        </h4>
                        <div className="space-y-2.5">
                            <p className="text-[12px] text-white/45 font-light">WhatsApp Direct Line</p>
                            <a
                                href={WHATSAPP}
                                target="_blank"
                                rel="noreferrer"
                                className="block text-[12px] font-medium text-gold hover:text-gold-light transition-colors"
                            >
                                +977 9810605409
                            </a>
                            <p className="text-[12px] text-white/35 font-light">
                                Mahendranagar, Sudurpashchim, Nepal
                            </p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-6 border-t border-white/[0.08] flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-[10px] text-white/30 tracking-wide">
                    <p>© {new Date().getFullYear()} NINE77. All rights reserved.</p>

                    {/* Developer Credit */}
                    <div className="flex items-center gap-1.5 uppercase tracking-[0.18em] text-[9px] text-white/35">
                        <span>Designed &amp; Developed by</span>
                        <a
                            href="https://khemjoshi.com.np/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-black text-white/70 hover:text-gold transition-all duration-200 relative group flex items-center gap-1.5"
                        >
                            <span>Khem R. Joshi</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block animate-pulse" />
                            <span className="absolute bottom-0 left-0 w-0 h-px bg-gold transition-all duration-200 group-hover:w-full" />
                        </a>
                    </div>

                    <div className="flex gap-4">
                        {['Privacy Policy', 'Terms of Service'].map((item) => (
                            <span key={item} className="text-white/30 hover:text-white/60 cursor-pointer transition-colors duration-200">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}