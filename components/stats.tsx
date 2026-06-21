'use client';

import { motion } from 'framer-motion';

const stats = [
    { label: 'Happy Customers', value: '500+' },
    { label: 'Exclusive Pieces', value: '9' },
    { label: 'Premium Quality', value: '100%' },
    { label: 'Vision', value: '1' }
];

export default function Stats() {
    return (
        <section className="border-t border-white/10 px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ duration: 0.55, delay: index * 0.1 }}
                            className="rounded-[28px] border border-white/10 bg-white/5 p-8 text-center"
                        >
                            <p className="text-4xl font-black text-gold">{stat.value}</p>
                            <p className="mt-4 text-sm uppercase tracking-[0.35em] text-white/70">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
