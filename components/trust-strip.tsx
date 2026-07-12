'use client';

import { ShieldCheck, RotateCcw, Truck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const badges = [
    { icon: ShieldCheck, label: '100% Authentic', detail: 'Premium quality' },
    { icon: RotateCcw, label: 'Easy Returns', detail: '7 day returns' },
    { icon: Truck, label: 'Fast Delivery', detail: 'All over Nepal' },
    { icon: Sparkles, label: 'Premium Quality', detail: 'Built to last' },
];

export default function TrustStrip() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-white/[0.08] bg-[#080808] py-5 relative z-20"
        >
            <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-y-5 gap-x-2 md:grid-cols-4 md:divide-x md:divide-white/[0.08]">
                    {badges.map(({ icon: Icon, label, detail }) => (
                        <div
                            key={label}
                            className="flex items-center justify-center gap-3 px-2 md:first:pl-0 md:last:pr-0"
                        >
                            <Icon size={19} strokeWidth={1.5} className="shrink-0 text-gold" />
                            <span className="flex flex-col gap-0.5 animate-pulse-subtle">
                                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white">
                                    {label}
                                </span>
                                <span className="text-[10px] text-white/45">{detail}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
