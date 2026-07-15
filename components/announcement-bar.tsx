'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const separator = '   \u2726   ';
const marqueeItems = [
    "NEW DROP '26",
    'FREE DELIVERY ON ORDERS ABOVE RS. 2999',
    'PREMIUM STREETWEAR FOR THE BOLD',
    'ORDER VIA WHATSAPP — FAST & EASY',
    'SIZE GUIDE AVAILABLE ON EVERY PRODUCT',
];
const marqueeText = marqueeItems.join(separator);
const repeatedText = `${marqueeText}${separator}${marqueeText}`;

export default function AnnouncementBar() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setReady(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <div
            className="relative z-50 flex h-8 items-center overflow-hidden bg-gold"
            role="marquee"
            aria-label="Announcement: Free delivery above Rs. 2999. New Drop available."
            aria-live="off"
        >
            <div className="flex w-full overflow-hidden" aria-hidden="true">
                <motion.div
                    animate={ready ? { x: [0, '-50%'] } : undefined}
                    transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
                    className="flex shrink-0 whitespace-nowrap will-change-transform"
                >
                    <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-white">
                        {repeatedText}
                    </span>
                </motion.div>
            </div>
        </div>
    );
}
