'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const MARQUEE_ITEMS = [
    '⚡ NEW ARRIVALS JUST DROPPED',
    '✦ FREE DELIVERY ON ORDERS ABOVE Rs. 2999',
    '✦ PREMIUM STREETWEAR FOR THE BOLD',
    '✦ ORDER VIA WHATSAPP — FAST & EASY',
    '✦ NINE77 — BUILT DIFFERENT',
    '✦ LIMITED EDITION PIECES',
];

const text = MARQUEE_ITEMS.join('   ·   ');
const repeated = `${text}   ·   ${text}`;

export default function AnnouncementBar() {
    // Only animate after mount to avoid SSR/CSR hydration mismatch
    const [ready, setReady] = useState(false);
    useEffect(() => { setReady(true); }, []);

    return (
        <div className="relative z-50 overflow-hidden border-b border-gold/10 bg-black py-2">
            <div className="flex overflow-hidden">
                {ready ? (
                    <motion.div
                        animate={{ x: [0, '-50%'] }}
                        transition={{
                            duration: 28,
                            repeat: Infinity,
                            ease: 'linear',
                            repeatType: 'loop',
                        }}
                        className="flex shrink-0 whitespace-nowrap"
                    >
                        <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold/80">
                            {repeated}
                        </span>
                    </motion.div>
                ) : (
                    // Static fallback during SSR — prevents hydration mismatch
                    <div className="flex shrink-0 whitespace-nowrap">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold/80">
                            {repeated}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
