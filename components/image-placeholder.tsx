'use client';

import { motion } from 'framer-motion';

const shimmer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
};

export default function ImagePlaceholder() {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={shimmer}
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.15),_transparent_40%),linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(10,10,10,0.95))] p-8 shadow-glow"
        >
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.2),transparent_35%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] bg-[length:200%_100%] animate-shimmer" />
            <div className="relative flex h-full min-h-[420px] flex-col items-center justify-center gap-4 rounded-[28px] border border-white/10 bg-black/20 px-6 py-20 text-center backdrop-blur-lg">
                <span className="text-sm uppercase tracking-[0.35em] text-gold/85">IMAGE</span>
                <h3 className="text-3xl font-black uppercase text-white">COMING SOON</h3>
            </div>
        </motion.div>
    );
}
