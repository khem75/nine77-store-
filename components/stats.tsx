'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { AdminProduct } from '@/types/admin';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.3 });
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        if (shouldReduceMotion) {
            setCount(target);
            return;
        }

        if (!inView) return;
        let frame: number;
        const duration = 1600; // 1.6s smooth count-up animation
        const start = performance.now();

        function tick(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Cubic ease-out curve for luxury numerical count animation
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) frame = requestAnimationFrame(tick);
        }

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [inView, target, shouldReduceMotion]);

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
    const activeProductsCount = products.length > 0 ? products.filter(p => p.status === 'active').length : 25;

    const stats = [
        { value: 100, suffix: '+', label: 'Happy Customers' },
        { value: activeProductsCount > 0 ? activeProductsCount : 25, suffix: '+', label: 'Curated Garments' },
        { value: 10, suffix: '+', label: 'Exclusive Drops' },
        { value: 99, suffix: '%', label: 'Satisfaction Rate' },
    ];

    return (
        <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-16">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-10 border-t border-border pt-12 md:pt-16">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7, delay: i * 0.1, ease: luxuryEase }}
                        className="text-center md:text-left"
                    >
                        <p className="text-3xl md:text-4xl lg:text-5xl font-black text-primary tracking-tight">
                            <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                        </p>
                        <p className="text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-secondary font-medium mt-1.5">
                            {stat.label}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}