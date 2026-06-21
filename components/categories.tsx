'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const categories = [
    { label: 'Tops', description: 'Layer with luxe.', href: '/shop?category=Tops' },
    { label: 'Pants', description: 'Tailored street silhouettes.', href: '/shop?category=Pants' },
    { label: 'Outerwear', description: 'Statement outer layers.', href: '/shop?category=Outerwear' }
];

export default function Categories() {
    return (
        <section className="px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-gold">Shop by category</p>
                        <h2 className="mt-3 text-3xl font-black uppercase tracking-[0.04em] text-white sm:text-4xl">Luxury categories</h2>
                    </div>
                    <p className="max-w-xl text-sm leading-7 text-white/70">
                        Refined essentials shaped for premium streetwear. Discover each signature category.
                    </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-3">
                    {categories.map((category, index) => (
                        <motion.article
                            key={category.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ duration: 0.55, delay: index * 0.08 }}
                            className="group rounded-[28px] border border-white/10 bg-white/5 p-8 text-center transition hover:border-gold hover:bg-white/10"
                        >
                            <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-black/60 text-2xl font-black text-gold">
                                {category.label[0]}
                            </div>
                            <h3 className="text-xl font-semibold uppercase tracking-[0.2em] text-white">{category.label}</h3>
                            <p className="mt-4 text-sm leading-7 text-white/70">{category.description}</p>
                            <Link href={category.href} className="mt-8 inline-flex items-center text-sm uppercase tracking-[0.3em] text-gold transition hover:text-gold-dark">
                                Explore
                            </Link>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
