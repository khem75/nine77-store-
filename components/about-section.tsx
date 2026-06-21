'use client';

import { motion } from 'framer-motion';
import ImagePlaceholder from '@/components/image-placeholder';

export default function AboutSection() {
    return (
        <section className="border-t border-white/10 px-6 py-16 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7 }}>
                    <p className="text-sm uppercase tracking-[0.35em] text-gold">About NINE77</p>
                    <h2 className="mt-4 text-4xl font-black uppercase tracking-[0.04em] text-white sm:text-5xl">A brand defined by premium streetwear identity.</h2>
                    <p className="mt-6 max-w-xl text-sm leading-8 text-white/70">
                        NINE77 was created for those who demand luxury with attitude. Each piece balances quiet sophistication with bold streetwear spirit, crafted to become a signature statement in every wardrobe.
                    </p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
                            <p className="font-semibold uppercase tracking-[0.25em] text-gold">Quiet luxury</p>
                            <p className="mt-3 text-sm leading-7 text-white/70">Refined finishes designed for premium everyday wear.</p>
                        </div>
                        <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
                            <p className="font-semibold uppercase tracking-[0.25em] text-gold">Editorial edge</p>
                            <p className="mt-3 text-sm leading-7 text-white/70">Modern silhouettes inspired by luxury streetwear culture.</p>
                        </div>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7 }}>
                    <ImagePlaceholder />
                </motion.div>
            </div>
        </section>
    );
}
