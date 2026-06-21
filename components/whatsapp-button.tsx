'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsappButton() {
    return (
        <motion.a
            href="https://wa.me/9779845465529"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05 }}
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-3 rounded-full bg-gold px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black shadow-glow"
        >
            <MessageCircle size={18} />
            Order on WhatsApp
        </motion.a>
    );
}
