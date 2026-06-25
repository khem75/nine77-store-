'use client';

import Image from 'next/image';
import { useRef, useEffect } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';

function AnimateOnView({
  children,
  variants,
  className,
}: {
  children: React.ReactNode;
  variants: Variants;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) controls.start('visible');
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
};

export default function AboutSection() {
  return (
    <section
      suppressHydrationWarning
      className="border-t border-white/10 px-6 py-16 lg:px-8"
    >
      <div
        suppressHydrationWarning
        className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
      >
        {/* Left */}
        <AnimateOnView variants={slideLeft}>
          <p className="text-sm uppercase tracking-[0.35em] text-gold">
            About NINE77
          </p>

          <h2 className="mt-4 text-4xl font-black uppercase tracking-[0.04em] text-white sm:text-5xl">
            A brand defined by premium streetwear identity.
          </h2>

          <p className="mt-6 max-w-xl text-sm leading-8 text-white/70">
            NINE77 was created for those who demand luxury with attitude. Each
            piece balances quiet sophistication with bold streetwear spirit,
            crafted to become a signature statement in every wardrobe.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
              <p className="font-semibold uppercase tracking-[0.25em] text-gold">
                Quiet Luxury
              </p>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Refined finishes designed for premium everyday wear.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
              <p className="font-semibold uppercase tracking-[0.25em] text-gold">
                Editorial Edge
              </p>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Modern silhouettes inspired by luxury streetwear culture.
              </p>
            </div>
          </div>
        </AnimateOnView>

        {/* Right */}
        <AnimateOnView variants={slideRight}>
          <div className="relative h-[550px] overflow-hidden rounded-[40px] border border-white/10 bg-black shadow-[0_0_80px_rgba(212,175,55,0.12)]">
            <Image
              src="/about-image.jpg"
              alt="About NINE77"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </AnimateOnView>
      </div>
    </section>
  );
}