'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { AdminProduct } from '@/types/admin';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        let frame: number;
        const duration = 2000;
        const start = performance.now();

        function tick(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) frame = requestAnimationFrame(tick);
        }

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [inView, target]);

    return (
        <span ref={ref}>
            {count.toLocaleString()}{suffix}
        </span>
    );
}

interface StatsProps {
    products?: AdminProduct[];
}

export default function Stats({ products = [] }: StatsProps) {
    const stats = [
        { value: 2500, suffix: '+', label: 'Happy Customers' },
        { value: products.length > 0 ? products.length * 10 : 150, suffix: '+', label: 'Premium Garments' },
        { value: 25, suffix: '+', label: 'Collections' },
        { value: 99, suffix: '%', label: 'Customer Satisfaction' },
    ];

    return (
        <div className="mx-auto max-w-[1440px] px-5 md:px-12 lg:px-16">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-10">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.1, ease: luxuryEase }}
                        className="text-center md:text-left"
                    >
                        <p className="text-3xl md:text-4xl lg:text-5xl font-black text-primary tracking-tight">
                            <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                        </p>
                        <p className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-secondary font-medium mt-1.5">
                            {stat.label}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}