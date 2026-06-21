'use client';

import { motion } from 'framer-motion';
import ImagePlaceholder from '@/components/image-placeholder';

export default function InstagramGallery() {
    return (
        <section className="border-t border-white/10 px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                    <p className="text-sm uppercase tracking-[0.35em] text-gold">Instagram</p>
                    <h2 className="mt-4 text-4xl font-black uppercase tracking-[0.04em] text-white sm:text-5xl">Editorial moments in motion.</h2>
                </div>
                <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, index) => (
                        <motion.div key={index} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.55, delay: index * 0.08 }}>
                            <ImagePlaceholder />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
