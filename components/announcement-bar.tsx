'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const separator = '   \u2726   ';
const marqueeItems = [
    'NEW DROP ’25',
    'FREE DELIVERY ON ORDERS ABOVE RS. 2999',
    'PREMIUM STREETWEAR FOR THE BOLD',
    'ORDER VIA WHATSAPP — FAST & EASY',
];
const marqueeText = marqueeItems.join(separator);
const repeatedText = `${marqueeText}${separator}${marqueeText}`;

export default function AnnouncementBar() {
    const [ready, setReady] = useState(false);
    const pathname = usePathname();
    useEffect(() => setReady(true), []);

    return (
        <div className={`relative z-50 flex h-8 items-center overflow-hidden border-b border-white/[0.06] bg-black ${pathname === '/shop' ? 'hidden md:flex' : ''}`}>
            <div className="flex w-full overflow-hidden">
                <motion.div animate={ready ? { x: [0, '-50%'] } : undefined} transition={{ duration: 38, repeat: Infinity, ease: 'linear' }} className="flex shrink-0 whitespace-nowrap">
                    <span className="text-[9px] font-bold uppercase tracking-[0.38em] text-white/65">{repeatedText}</span>
                </motion.div>
            </div>
        </div>
    );
}
