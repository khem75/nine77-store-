'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';

interface Particle {
    id: number;
    left: string;
    top: string;
    size: number;
    driftX: number;
    driftY: number;
    duration: number;
    delay: number;
    opacity: number;
}

export default function Hero() {
    const heroRef = useRef<HTMLElement>(null);
    const [preloaderActive, setPreloaderActive] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [filmOpen, setFilmOpen] = useState(false);
    const reduceMotion = useReducedMotion();
    
    // Scroll progress transformations
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const copyY = useTransform(scrollYProgress, [0, 1], [0, -38]);
    const copyOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
    
    const imageScrollScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.08]);
    const imageScrollOpacity = useTransform(scrollYProgress, [0, 0.8], [1.0, 0.92]);
    const smokeScrollOpacity = useTransform(scrollYProgress, [0, 0.6], [0.08, 0]);
    const haloScrollOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Mouse parallax setup
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 50, stiffness: 200, mass: 1 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Dynamic Parallax offsets
    const imageParallaxX = useTransform(springX, [-0.5, 0.5], [-12, 12]);
    const imageParallaxY = useTransform(springY, [-0.5, 0.5], [-12, 12]);

    const smokeParallaxX = useTransform(springX, [-0.5, 0.5], [-24, 24]);
    const smokeParallaxY = useTransform(springY, [-0.5, 0.5], [-24, 24]);

    const particlesParallaxX = useTransform(springX, [-0.5, 0.5], [-30, 30]);
    const particlesParallaxY = useTransform(springY, [-0.5, 0.5], [-30, 30]);

    const haloParallaxX = useTransform(springX, [-0.5, 0.5], [-16, 16]);
    const haloParallaxY = useTransform(springY, [-0.5, 0.5], [-16, 16]);

    const textParallaxX = useTransform(springX, [-0.5, 0.5], [-5, 5]);
    const textParallaxY = useTransform(springY, [-0.5, 0.5], [-5, 5]);

    // 3D Tilt perspective transforms
    const rotateX = useTransform(springY, [-0.5, 0.5], [3.5, -3.5]); // Tilt X based on cursor Y
    const rotateY = useTransform(springX, [-0.5, 0.5], [-3.5, 3.5]); // Tilt Y based on cursor X

    // Spotlight cursor coordinates
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);
    const cursorSpringX = useSpring(cursorX, { damping: 45, stiffness: 120 });
    const cursorSpringY = useSpring(cursorY, { damping: 45, stiffness: 120 });
    const spotlightLeft = useTransform(cursorSpringX, [-0.5, 0.5], ['30%', '70%']);
    const spotlightTop = useTransform(cursorSpringY, [-0.5, 0.5], ['30%', '70%']);

    const [isDesktop, setIsDesktop] = useState(false);
    const [particlesList, setParticlesList] = useState<Particle[]>([]);
    const [sweepTrigger, setSweepTrigger] = useState(0);

    useEffect(() => {
        // Preloader timeout (exits at 1.9s)
        const loaderTimer = setTimeout(() => {
            setPreloaderActive(false);
            setMounted(true);
        }, 1900);

        // Check for desktop screen size
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        // Generate luxury particles
        const list: Particle[] = [];
        for (let i = 0; i < 22; i++) {
            list.push({
                id: i,
                left: `${10 + Math.random() * 80}%`,
                top: `${15 + Math.random() * 75}%`,
                size: Math.random() < 0.75 ? 1.5 : Math.random() * 1.5 + 1.5,
                driftX: (Math.random() - 0.5) * 35,
                driftY: -(35 + Math.random() * 55),
                duration: 9 + Math.random() * 11,
                delay: Math.random() * -20, // Pre-warm the particle loop
                opacity: 0.18 + Math.random() * 0.42,
            });
        }
        setParticlesList(list);

        // Light sweep trigger loop (11s interval)
        const sweepInterval = setInterval(() => {
            setSweepTrigger(prev => prev + 1);
        }, 11000);

        return () => {
            clearTimeout(loaderTimer);
            window.removeEventListener('resize', handleResize);
            clearInterval(sweepInterval);
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDesktop) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth) - 0.5;
        const y = (clientY / innerHeight) - 0.5;
        mouseX.set(x);
        mouseY.set(y);
        cursorX.set(x);
        cursorY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
        cursorX.set(0);
        cursorY.set(0);
    };

    return (
        <>
            {/* MUSEUM PRELOADER INTRO SCREEN */}
            <AnimatePresence>
                {preloaderActive && (
                    <motion.div
                        exit={{ 
                            y: '-100%',
                            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] }
                        }}
                        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#000000]"
                    >
                        <div className="flex flex-col items-center justify-center text-center">
                            {/* Logo Text Stagger Fade */}
                            <h2 className="text-[18px] font-black uppercase tracking-[0.62em] text-white flex select-none mb-4 pl-[0.62em]">
                                {"NINE77".split("").map((char, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 0.2 + index * 0.1,
                                            duration: 0.6,
                                            ease: 'easeOut'
                                        }}
                                        className="inline-block"
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </h2>

                            {/* Shimmering Gold Divider */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{
                                    delay: 0.6,
                                    duration: 1.0,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                                className="h-[1.5px] w-28 bg-gradient-to-r from-transparent via-gold to-transparent"
                            />

                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.35 }}
                                transition={{ delay: 1.0, duration: 0.8 }}
                                className="mt-3.5 text-[8px] font-bold uppercase tracking-[0.45em] text-white/50 pl-[0.45em]"
                            >
                                Premium Streetwear
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <section
                ref={heroRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative isolate min-h-[min(900px,100svh)] min-h-[min(900px,100dvh)] overflow-hidden border-b border-white/[0.08] bg-[#000000]"
                aria-label="Hero — Build Different"
            >
                {/* BACKGROUND LAYER 2: Warm radial glow behind sculpture (Connected to mouse parallax) */}
                <motion.div
                    style={reduceMotion ? undefined : { x: smokeParallaxX, y: smokeParallaxY }}
                    animate={reduceMotion ? undefined : {
                        opacity: [0.06, 0.11, 0.06]
                    }}
                    transition={{
                        duration: 8.0,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                    className="pointer-events-none absolute left-[50%] top-[27.5%] md:left-[71%] md:top-[50%] -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] md:w-[45vw] md:h-[45vw] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.18)_0%,rgba(212,175,55,0)_70%)] blur-[60px] z-[0]"
                />

                {/* BACKGROUND LAYER 3: Volumetric Smoke */}
                <motion.div
                    style={reduceMotion ? undefined : { x: smokeParallaxX, y: smokeParallaxY, opacity: smokeScrollOpacity }}
                    className="pointer-events-none absolute inset-0 z-0 overflow-hidden mix-blend-screen opacity-[0.08]"
                >
                    <motion.div
                        animate={{
                            x: [-50, 30, -50],
                            y: [-20, 20, -20],
                            scale: [1, 1.12, 1],
                            rotate: [0, 35, 0],
                        }}
                        transition={{
                            duration: 22,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                        className="absolute -top-[15%] left-[-5%] w-[85vw] h-[85vw] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,rgba(143,100,42,0.02)_60%,transparent_80%)] filter blur-[95px]"
                    />
                    <motion.div
                        animate={{
                            x: [30, -30, 30],
                            y: [20, -20, 20],
                            scale: [1.08, 0.95, 1.08],
                            rotate: [180, 210, 180],
                        }}
                        transition={{
                            duration: 28,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                        className="absolute top-[15%] -right-[10%] w-[75vw] h-[75vw] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,rgba(212,175,55,0.02)_50%,transparent_70%)] filter blur-[100px]"
                    />
                </motion.div>

                {/* BACKGROUND LAYER 4 & 5: Gold Dust & Particles */}
                <motion.div
                    style={reduceMotion ? undefined : { x: particlesParallaxX, y: particlesParallaxY }}
                    className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
                >
                    {particlesList.map((p) => (
                        <motion.i
                            key={p.id}
                            className="absolute rounded-full bg-gold"
                            style={{
                                left: p.left,
                                top: p.top,
                                width: p.size,
                                height: p.size,
                                opacity: p.opacity,
                            }}
                            animate={reduceMotion ? undefined : {
                                y: [0, p.driftY],
                                x: [0, p.driftX, p.driftX * -0.3, p.driftX * 1.1, 0],
                                opacity: [0, p.opacity, p.opacity * 0.4, p.opacity, 0],
                            }}
                            transition={{
                                duration: p.duration,
                                delay: p.delay,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    ))}
                </motion.div>

                {/* LIGHTING: Bloom, Rays, and Faint Haze behind sculpture */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    {/* Bloom glow */}
                    <div className="absolute left-[50%] top-[27.5%] md:left-[71%] md:top-[50%] -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] md:w-[35vw] md:h-[35vw] bg-radial-glow opacity-[0.05] rounded-full filter blur-[70px]" style={{ background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)' }} />
                    
                    {/* Angled subtle light rays (Animated rotation & breathing) */}
                    <motion.div
                        animate={{
                            opacity: [0.04, 0.08, 0.04],
                            rotate: [0, 1.5, -1.5, 0]
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                        className="absolute left-[50%] top-[10%] md:left-[71%] md:top-[20%] -translate-x-1/2 w-[100vw] h-[100vh] opacity-[0.06] blur-[55px] mix-blend-screen select-none origin-top"
                    >
                        <div className="absolute top-0 left-[28%] w-[6%] h-[120%] bg-gradient-to-b from-gold/30 via-gold/10 to-transparent transform rotate-[32deg] origin-top" />
                        <div className="absolute top-[8%] left-[42%] w-[10%] h-[120%] bg-gradient-to-b from-gold/25 via-gold/5 to-transparent transform rotate-[40deg] origin-top" />
                        <div className="absolute top-[-5%] left-[58%] w-[8%] h-[120%] bg-gradient-to-b from-gold/20 via-gold/5 to-transparent transform rotate-[25deg] origin-top" />
                    </motion.div>
                </div>

                {/* HALO LAYER */}
                <motion.div
                    style={reduceMotion ? undefined : { x: haloParallaxX, y: haloParallaxY, opacity: haloScrollOpacity }}
                    className="absolute left-[50%] top-[27.5%] md:left-[71%] md:top-[50%] -translate-x-1/2 -translate-y-1/2 aspect-square w-[42%] md:w-[32%] rounded-full border border-gold/15 shadow-[0_0_70px_rgba(212,175,55,0.07)] pointer-events-none blur-[1px] z-[1]"
                    animate={reduceMotion ? undefined : {
                        scale: [0.97, 1.03, 0.97],
                        opacity: [0.04, 0.08, 0.04]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />

                {/* HERO IMAGE GROUP */}
                <motion.div
                    style={reduceMotion ? undefined : {
                        x: imageParallaxX,
                        y: imageParallaxY,
                        rotateX: rotateX,
                        rotateY: rotateY,
                        transformPerspective: 1200
                    }}
                    className="absolute inset-x-0 top-0 h-[55%] md:inset-y-0 md:left-auto md:right-0 md:w-[58%] md:h-full pointer-events-none z-10"
                >
                    {/* Page Entry Animation Wrapper (starts relative to preloader exit) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 1.05, y: 25 }}
                        animate={mounted ? { opacity: 1, scale: 1.0, y: 0 } : { opacity: 0, scale: 1.05, y: 25 }}
                        transition={{ delay: 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        style={reduceMotion ? undefined : { scale: imageScrollScale, opacity: imageScrollOpacity }}
                        className="w-full h-full relative"
                    >
                        {/* Infinite Idle Animation Wrapper */}
                        <motion.div
                            animate={reduceMotion ? undefined : {
                                y: [0, -6, 0],
                                scale: [1, 1.01, 1],
                                rotate: [0, 0.8, 0],
                            }}
                            transition={{
                                y: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
                                scale: { duration: 14, repeat: Infinity, ease: 'easeInOut' },
                                rotate: { duration: 20, repeat: Infinity, ease: 'easeInOut' },
                            }}
                            className="w-full h-full relative flex items-center justify-center"
                        >
                            {/* The Actual Image with Contain & Custom Blending */}
                            <div className="w-full h-full relative" style={{
                                maskImage: 'radial-gradient(circle at center, black 35%, transparent 80%)',
                                WebkitMaskImage: 'radial-gradient(circle at center, black 35%, transparent 80%)',
                            }}>
                                <Image
                                    src="/hero-monolith-v7.png"
                                    alt="NINE77 black marble and gold monolith"
                                    fill
                                    priority
                                    sizes="(max-width: 767px) 100vw, 58vw"
                                    className="object-contain object-center"
                                />
                                
                                {/* Cinematic Edge Blending Overlays */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#000000_90%)]" />
                                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#000000] to-transparent" />
                                <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#000000] to-transparent" />
                                <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#000000] to-transparent" />
                                <div className="absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-[#000000] to-transparent" />

                                {/* Interactive spotlight cursor projection glow */}
                                <motion.div
                                    className="absolute inset-0 pointer-events-none z-20 mix-blend-color-dodge opacity-[0.38]"
                                    style={{
                                        background: useMotionTemplate`radial-gradient(circle 250px at ${spotlightLeft} ${spotlightTop}, rgba(212,175,55,0.42) 0%, rgba(212,175,55,0.06) 50%, transparent 100%)`
                                    }}
                                />

                                {/* Watch-photography style Light Sweep */}
                                <motion.div
                                    key={sweepTrigger}
                                    initial={{ x: '-150%', opacity: 0 }}
                                    animate={{
                                        x: '150%',
                                        opacity: [0, 0.4, 0.4, 0],
                                    }}
                                    transition={{
                                        duration: 3.0,
                                        ease: [0.25, 1, 0.5, 1],
                                    }}
                                    className="absolute inset-0 pointer-events-none z-30 mix-blend-color-dodge"
                                    style={{
                                        background: 'linear-gradient(110deg, transparent 35%, rgba(212,175,55,0.12) 48%, rgba(255,255,255,0.35) 50%, rgba(212,175,55,0.12) 52%, transparent 65%)'
                                    }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* TEXT & CONTROLS CONTENT AREA */}
                {/* pt accounts for: 32px announcement + 60px navbar on mobile; 72px navbar on md */}
                <div className="relative z-20 mx-auto flex min-h-[min(900px,100svh)] max-w-[1440px] items-end px-6 pb-24 pt-[96px] sm:px-10 md:items-center md:px-12 md:pb-8 md:pt-[88px] lg:px-16">
                    {/* Mouse and Scroll Parallax wrapper on Text */}
                    <motion.div
                        style={reduceMotion ? undefined : { x: textParallaxX, y: textParallaxY }}
                        className="w-full max-w-[620px]"
                    >
                        <motion.div style={mounted ? { y: copyY, opacity: copyOpacity } : undefined} className="w-full">
                            {/* Stagger Letter reveal */}
                            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.48em] text-gold md:mb-7 flex flex-wrap">
                                {"New Drop ’26".split("").map((char, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                                        transition={{
                                            delay: 0.1 + index * 0.03,
                                            duration: 0.5,
                                            ease: 'easeOut'
                                        }}
                                        className="inline-block"
                                        style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </p>
                            
                            {/* Headline: Staggered Letter Mask-Reveal */}
                            <h1 className="text-[clamp(3.55rem,8.2vw,7.4rem)] font-black uppercase leading-[0.84] tracking-[-0.065em] text-white">
                                <span className="block overflow-hidden pb-1">
                                    {"Build".split("").map((char, index) => (
                                        <motion.span
                                            key={index}
                                            initial={{ y: "105%", opacity: 0 }}
                                            animate={mounted ? { y: 0, opacity: 1 } : { y: "105%", opacity: 0 }}
                                            transition={{
                                                delay: 0.3 + index * 0.04,
                                                duration: 0.8,
                                                ease: [0.16, 1, 0.3, 1]
                                            }}
                                            className="inline-block origin-bottom"
                                            style={{
                                                textShadow: '0 0 20px rgba(255, 255, 255, 0.08), 0 2px 4px rgba(0,0,0,0.9)'
                                            }}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </span>
                                <span className="block overflow-hidden pb-1 text-gold">
                                    {"Different".split("").map((char, index) => (
                                        <motion.span
                                            key={index}
                                            initial={{ y: "105%", opacity: 0 }}
                                            animate={mounted ? { y: 0, opacity: 1 } : { y: "105%", opacity: 0 }}
                                            transition={{
                                                delay: 0.5 + index * 0.04,
                                                duration: 0.8,
                                                ease: [0.16, 1, 0.3, 1]
                                            }}
                                            className="inline-block origin-bottom"
                                            style={{
                                                textShadow: '0 0 25px rgba(212, 175, 55, 0.18), 0 2px 4px rgba(0,0,0,0.9)'
                                            }}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </span>
                            </h1>

                            {/* Line separator Gradient scale animation */}
                            <motion.div
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={mounted ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                                transition={{ delay: 0.7, duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
                                className="my-6 h-px w-12 origin-left bg-gradient-to-r from-gold to-white/20 md:my-8"
                            />

                            {/* Description paragraph */}
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                transition={{ delay: 0.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                className="max-w-[325px] text-[13px] leading-relaxed text-white/65 md:text-[15px]"
                            >
                                Luxury streetwear engineered for those who refuse to blend in. Museum-grade garment design.
                            </motion.p>

                            {/* Buttons (Staggered CTA rise) */}
                            <div className="mt-7 flex flex-col gap-3 sm:flex-row md:mt-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                                    transition={{ delay: 0.9, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <Link
                                        href="/shop"
                                        className="group inline-flex w-full sm:w-auto h-12 items-center justify-center gap-4 rounded-sm bg-gold px-6 text-[10px] font-black uppercase tracking-[0.18em] text-black transition-all duration-[250ms] cubic-bezier(0.16,1,0.3,1) hover:-translate-y-[3px] hover:scale-[1.02] hover:bg-[#f2cd5c] hover:shadow-[0_20px_45px_rgba(212,175,55,0.18)]"
                                    >
                                        Shop Collection{' '}
                                        <span className="text-base leading-none inline-block transition-transform duration-[250ms] ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]">
                                            ↗
                                        </span>
                                    </Link>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                                    transition={{ delay: 1.0, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <Link
                                        href="/shop"
                                        className="group inline-flex w-full sm:w-auto h-12 items-center justify-center rounded-sm border border-white/20 px-6 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-[250ms] cubic-bezier(0.16,1,0.3,1) hover:-translate-y-[3px] hover:scale-[1.02] hover:border-white/55 hover:bg-white/5 hover:shadow-[0_20px_45px_rgba(255,255,255,0.06)]"
                                    >
                                        Explore Collection
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Play Intro (1.15s appear) */}
                            <motion.button
                                initial={{ opacity: 0, y: 12 }}
                                animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                                transition={{ delay: 1.15, duration: 0.55 }}
                                type="button"
                                onClick={() => setFilmOpen(true)}
                                className="group mt-8 inline-flex items-center gap-3 text-left transition-all duration-[250ms] hover:scale-[1.02] hover:-translate-y-[2px]"
                            >
                                <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/80 text-gold transition duration-[250ms] group-hover:border-white group-hover:text-white">
                                    <svg className="ml-0.5 h-3 w-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/80 group-hover:text-white transition duration-[250ms]">
                                    Play intro
                                </span>
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
                
                {/* Scroll to explore (1.2s fade in) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={mounted ? { opacity: 0.55 } : { opacity: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="absolute bottom-7 right-7 z-20 hidden items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-white/55 md:flex"
                >
                    <span className="h-px w-10 bg-gold" /> Scroll to explore
                </motion.div>
            </section>

            <AnimatePresence>
                {filmOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 grid place-items-center bg-black/95 p-5 backdrop-blur-md"
                    >
                        <button onClick={() => setFilmOpen(false)} className="absolute inset-0 cursor-default" aria-label="Close brand film" />
                        <div className="relative aspect-video w-full max-w-5xl overflow-hidden border border-white/15 bg-[#111] shadow-2xl">
                            <button
                                onClick={() => setFilmOpen(false)}
                                className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/50 text-lg text-white"
                                aria-label="Close"
                            >
                                ×
                            </button>
                            <iframe
                                className="h-full w-full"
                                src="https://www.youtube.com/embed/Jc5R-S8-0c0?autoplay=1&mute=0&controls=1"
                                title="NINE77 Brand Film"
                                allow="autoplay; encrypted-media; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
