'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_URL =
    'https://wa.me/9779810605409?text=Hello%20NINE77%2C%20I%20would%20like%20to%20place%20an%20order.';

export default function WhatsappButton() {
    return (
        <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="group fixed bottom-24 right-5 z-50 hidden items-center gap-3 rounded-full bg-gold px-4.5 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-luxury transition-all duration-200 hover:bg-gold-dark hover:gap-4 md:bottom-8 md:right-8 md:flex"
        >
            {/* Ambient breathing gold aura */}
            <motion.span
                animate={{
                    scale: [1, 1.18, 1],
                    opacity: [0.2, 0.45, 0.2]
                }}
                transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
                className="absolute inset-0 rounded-full bg-gold blur-[6px] pointer-events-none z-0"
            />

            {/* Ping animation */}
            <span className="absolute -inset-0.5 animate-ping rounded-full bg-gold/40 opacity-0 group-hover:opacity-100 z-0" />

            <MessageCircle size={17} strokeWidth={1.75} className="relative z-10" />
            <span className="relative z-10">Order via WhatsApp</span>
        </motion.a>
    );
}
