'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Frame, ArrowUpRight } from 'lucide-react';

const features = [
    { icon: ShieldCheck, title: 'Premium Fabric', description: 'Luxuriously soft materials selected for long wear and comfort.' },
    { icon: Sparkles, title: 'Oversized Fit', description: 'Relaxed silhouettes designed with modern streetwear proportions.' },
    { icon: Frame, title: 'Built To Last', description: 'Meticulous tailoring and premium finishes for lasting quality.' },
    { icon: ArrowUpRight, title: 'Made For The Bold', description: 'Fearless styling with elevated details for statement dressing.' }
];

export default function WhyNine77() {
    return (
        <section className="border-t border-white/10 px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 max-w-3xl">
                    <p className="text-sm uppercase tracking-[0.35em] text-gold">Why NINE77</p>
                    <h2 className="mt-4 text-4xl font-black uppercase tracking-[0.04em] text-white sm:text-5xl">Luxury craftsmanship for streetwear essentials.</h2>
                </div>
                <div className="grid gap-6 lg:grid-cols-4">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.article
                                key={feature.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: 0.55, delay: index * 0.08 }}
                                className="rounded-[28px] border border-white/10 bg-white/5 p-8"
                            >
                                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gold/10 text-gold">
                                    <Icon size={24} />
                                </div>
                                <h3 className="text-xl font-semibold uppercase tracking-[0.08em] text-white">{feature.title}</h3>
                                <p className="mt-4 text-sm leading-7 text-white/70">{feature.description}</p>
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
