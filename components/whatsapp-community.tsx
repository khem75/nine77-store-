'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Copy, Check, ArrowUpRight, Lock, Shield, BadgeCheck } from 'lucide-react';

/* ─── Official Assets ────────────────────────────────────── */
const INVITE_URL = 'https://chat.whatsapp.com/EowSDtaqeCPBY3ce9RqxTM?mode=gi_t';
const QR_PATH    = '/whatsapp-qr.png';
const QR_FALLBACK = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(INVITE_URL)}&margin=10`;
const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── WhatsApp SVG ───────────────────────────────────────── */
function WAIcon({ size = 20, className }: { size?: number; className?: string }) {
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} aria-hidden="true">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 0 0 1.333 4.983L2 22l5.198-1.361a9.938 9.938 0 0 0 4.81 1.238h.004c5.503 0 9.988-4.479 9.99-9.988.001-2.668-1.037-5.177-2.93-7.07A9.905 9.905 0 0 0 12.012 2zm0 1.655c2.226 0 4.321.867 5.897 2.445 1.576 1.579 2.444 3.674 2.442 5.9a8.318 8.318 0 0 1-8.334 8.326 8.278 8.278 0 0 1-4.225-1.154l-.303-.181-3.142.824.84-3.065-.198-.313A8.271 8.271 0 0 1 3.67 11.99a8.327 8.327 0 0 1 8.342-8.335zm-3.83 3.693c-.21 0-.394.078-.543.238-.15.16-.57.556-.57 1.357 0 .8.582 1.574.663 1.684.08.11 1.125 1.776 2.766 2.428.39.155.696.248.932.324.394.125.752.107 1.034.066.315-.046.97-.396 1.107-.778.136-.381.136-.708.095-.778-.04-.07-.152-.11-.318-.194-.166-.084-.969-.478-1.119-.533-.15-.054-.259-.082-.369.082-.11.164-.425.534-.52.643-.096.11-.192.122-.358.038-.166-.084-.7-.258-1.333-.822-.493-.44-.826-.981-.923-1.148-.097-.166-.01-.255.073-.34.074-.074.165-.193.249-.29.082-.096.11-.165.165-.276.055-.11.028-.207-.013-.29-.041-.084-.37-.888-.506-1.215-.133-.322-.269-.278-.37-.283l-.313-.005z" />
        </svg>
    );
}

/* ─── Copy Button ────────────────────────────────────────── */
function CopyBtn({ variant = 'icon' }: { variant?: 'icon' | 'outline' }) {
    const [copied, setCopied] = useState(false);
    const copy = useCallback(async () => {
        try { await navigator.clipboard.writeText(INVITE_URL); }
        catch { /* fallback */ }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, []);

    if (variant === 'icon') {
        return (
            <button onClick={copy} aria-label={copied ? 'Copied' : 'Copy link'}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 active:scale-95"
                style={{ background: copied ? 'rgba(200,155,90,0.12)' : 'rgba(255,255,255,0.04)', borderColor: copied ? 'rgba(200,155,90,0.35)' : 'rgba(255,255,255,0.10)', color: copied ? '#C89B5A' : '#9D9D9D' }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={copied ? 'c' : 'cp'} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.15 }}>
                        {copied ? <Check size={13} /> : <Copy size={13} />}
                    </motion.span>
                </AnimatePresence>
            </button>
        );
    }

    return (
        <motion.button onClick={copy} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }} aria-label={copied ? 'Copied!' : 'Copy invite link'}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[11px] font-black uppercase tracking-[0.22em] transition-all duration-300"
            style={{ border: '1px solid rgba(200,155,90,0.30)', background: 'rgba(200,155,90,0.05)', color: copied ? '#D6A864' : '#C89B5A' }}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span key={copied ? 'd' : 'i'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="flex items-center gap-2">
                    {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Invite Link</>}
                </motion.span>
            </AnimatePresence>
        </motion.button>
    );
}

/* ─── Main Export ────────────────────────────────────────── */
export default function WhatsAppCommunity() {
    const ref = useRef<HTMLElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.2 });
    const [qrSrc, setQrSrc] = useState(QR_PATH);

    return (
        <section ref={ref} id="whatsapp-community" className="relative overflow-hidden py-20 md:py-28"
            style={{ background: '#080808' }}
            aria-labelledby="wac-title"
        >
            {/* Background: noise + N77 watermark + glow */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
                aria-hidden="true" />
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center select-none overflow-hidden" aria-hidden="true">
                <span className="font-black leading-none opacity-[0.018]" style={{ fontSize: '32vw', color: '#C89B5A' }}>N77</span>
            </div>
            <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-1/2"
                style={{ background: 'radial-gradient(ellipse 60% 50% at 50% -10%, rgba(200,155,90,0.09), transparent)' }}
                aria-hidden="true" />
            {/* Top gold line */}
            <div className="pointer-events-none absolute inset-x-[20%] top-0 z-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(200,155,90,0.35), transparent)' }}
                aria-hidden="true" />

            <div className="relative z-10 mx-auto max-w-[1100px] px-5 md:px-12 lg:px-16">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="mb-10 text-center"
                >
                    <p className="mb-3 text-[9px] font-black uppercase tracking-[0.5em]" style={{ color: '#C89B5A' }}>
                        Join The Club
                    </p>
                    <h2 id="wac-title" className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-black uppercase leading-[0.95] tracking-tight text-white">
                        Join The NINE77 Community
                    </h2>
                    <p className="mx-auto mt-4 max-w-md text-[13px] leading-relaxed font-light" style={{ color: '#9D9D9D' }}>
                        Early drops, exclusive offers, and members-only announcements — straight to your WhatsApp.
                    </p>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 32, filter: 'blur(10px)' }}
                    animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                    transition={{ duration: 0.85, delay: 0.12, ease: EASE }}
                    className="relative overflow-hidden rounded-[28px]"
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 50px rgba(200,155,90,0.04)',
                    }}
                >
                    {/* Top glow line */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(200,155,90,0.25), transparent)' }}
                        aria-hidden="true" />

                    <div className="grid md:grid-cols-2">

                        {/* ── LEFT: Info + CTAs ──────────────── */}
                        <div className="flex flex-col gap-6 p-7 md:p-9 border-b md:border-b-0 md:border-r"
                            style={{ borderColor: 'rgba(255,255,255,0.07)' }}>

                            {/* Brand + heading */}
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                                    style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.22)' }}>
                                    <WAIcon size={26} className="text-[#25D366]" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.38em] mb-1" style={{ color: '#C89B5A' }}>
                                        Official Community
                                    </p>
                                    <h3 className="text-[1.15rem] font-black uppercase leading-[1.1] text-white">
                                        Join Our WhatsApp Community
                                    </h3>
                                </div>
                            </div>

                            {/* Benefits */}
                            <ul className="flex flex-col gap-2" role="list">
                                {['New Drop Alerts', 'Private Offers', 'Members-Only Announcements'].map((b) => (
                                    <li key={b} className="flex items-center gap-2.5">
                                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                                            style={{ background: 'rgba(200,155,90,0.12)', border: '1px solid rgba(200,155,90,0.20)' }}>
                                            <svg viewBox="0 0 10 10" width={7} height={7} fill="none" aria-hidden="true">
                                                <path d="M1.5 5.5l2 2 5-5" stroke="#C89B5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                        <span className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.70)' }}>{b}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Stats row */}
                            <div className="flex gap-3">
                                {[['4', 'Groups'], ['300+', 'Members'], ['✓', 'Verified'], ['🔒', 'Private']].map(([val, lbl]) => (
                                    <div key={lbl} className="flex-1 rounded-xl px-3 py-2.5 text-center"
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                        <p className="text-[14px] font-black text-white leading-none">{val}</p>
                                        <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.12em]" style={{ color: '#9D9D9D' }}>{lbl}</p>
                                    </div>
                                ))}
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-col gap-2.5 mt-auto">
                                <motion.a href={INVITE_URL} target="_blank" rel="noreferrer"
                                    whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
                                    className="flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.24em] text-white transition-all duration-300"
                                    style={{ background: 'linear-gradient(135deg, #C89B5A, #D6A864)', boxShadow: '0 6px 28px rgba(200,155,90,0.32)' }}
                                    aria-label="Join the official NINE77 WhatsApp Community"
                                >
                                    <WAIcon size={16} />
                                    Join WhatsApp Community
                                    <ArrowUpRight size={14} strokeWidth={2.5} className="opacity-75" />
                                </motion.a>
                                <CopyBtn variant="outline" />
                            </div>

                            {/* Security note */}
                            <div className="flex items-center gap-2 text-[10px] font-medium" style={{ color: '#9D9D9D' }}>
                                <Lock size={11} />
                                <span>Safe, private &amp; spam-free.</span>
                            </div>
                        </div>

                        {/* ── RIGHT: QR + Link ───────────────── */}
                        <div className="flex flex-col items-center justify-center gap-6 p-7 md:p-9">

                            {/* Community pill */}
                            <div className="flex items-center gap-3 self-start rounded-2xl px-4 py-2.5 w-full"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                    style={{ background: '#111', border: '1px solid rgba(200,155,90,0.22)' }}>
                                    <span className="text-[10px] font-black uppercase tracking-[0.04em]" style={{ color: '#C89B5A' }}>N77</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-black uppercase tracking-[0.06em] text-white">NINE77 Community</p>
                                    <div className="mt-1 flex flex-wrap gap-1.5">
                                        {['4 Groups', '300+ Members', 'Verified', 'Private'].map((t) => (
                                            <span key={t} className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em]"
                                                style={{ background: 'rgba(200,155,90,0.10)', border: '1px solid rgba(200,155,90,0.18)', color: '#C89B5A' }}>
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* QR Code */}
                            <motion.div whileHover={{ scale: 1.015 }} transition={{ duration: 0.3, ease: EASE }}
                                className="rounded-[20px] p-4"
                                style={{ background: 'rgba(255,255,255,0.97)', boxShadow: '0 6px 36px rgba(200,155,90,0.18)', border: '1px solid rgba(200,155,90,0.2)' }}>
                                <div className="relative h-[180px] w-[180px] md:h-[200px] md:w-[200px]">
                                    <Image src={qrSrc} alt="Scan to join the official NINE77 WhatsApp Community" fill sizes="200px"
                                        className="object-contain" onError={() => setQrSrc(QR_FALLBACK)} priority unoptimized={qrSrc === QR_FALLBACK} />
                                </div>
                            </motion.div>

                            <p className="text-[9px] font-bold uppercase tracking-[0.4em]" style={{ color: '#9D9D9D' }}>
                                Scan to Join
                            </p>

                            {/* Invite link field */}
                            <div className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <input readOnly value={INVITE_URL} aria-label="WhatsApp invite link"
                                    className="min-w-0 flex-1 truncate bg-transparent text-[10px] font-light outline-none"
                                    style={{ color: '#9D9D9D' }} />
                                <CopyBtn variant="icon" />
                            </div>

                            {/* Safety badges */}
                            <div className="flex items-center gap-4">
                                {[{ icon: Shield, label: 'Safe' }, { icon: Lock, label: 'Private' }, { icon: BadgeCheck, label: 'Spam-Free' }].map(({ icon: Icon, label }) => (
                                    <div key={label} className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: '#9D9D9D' }}>
                                        <Icon size={10} />{label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
