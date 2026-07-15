'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll } from 'framer-motion';

const HeroScene = dynamic(() => import('./hero-scene'), { ssr: false });

export default function Hero() {
    const heroRef = useRef<HTMLElement>(null);
    const [audioActive, setAudioActive] = useState(false);
    const [threeReady, setThreeReady] = useState(false);
    const [introComplete, setIntroComplete] = useState(false);
    const [ambientOsc, setAmbientOsc] = useState<any>(null);
    const scrollProgressRef = useRef(0);

    // Track scroll progress of the hero section container
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });

    useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            scrollProgressRef.current = latest;
        });
        return () => unsubscribe();
    }, [scrollYProgress]);

    // Preloader and Intro Sequence triggers
    useEffect(() => {
        const timer = setTimeout(() => {
            setIntroComplete(true);
        }, 1200); // 1.2s delay for slow reveal
        return () => clearTimeout(timer);
    }, []);

    // Web Audio API ambient hum synth (compliant with browser safety policies)
    const toggleAmbientSound = () => {
        if (typeof window === 'undefined') return;

        if (audioActive) {
            // Stop hum
            if (ambientOsc) {
                try {
                    ambientOsc.stop();
                    ambientOsc.disconnect();
                } catch (e) {}
                setAmbientOsc(null);
            }
            setAudioActive(false);
            return;
        }

        try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(54, ctx.currentTime); // Deep luxury sub hum

            // Soft atmospheric modulation
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(140, ctx.currentTime);

            gain.gain.setValueAtTime(0.0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 3.0); // slow fade in

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            setAmbientOsc(osc);
            setAudioActive(true);
        } catch (e) {
            console.warn('Web Audio activation blocked or not supported:', e);
        }
    };

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (ambientOsc) {
                try {
                    ambientOsc.stop();
                } catch (e) {}
            }
        };
    }, [ambientOsc]);

    return (
        <section
            ref={heroRef}
            className="relative w-full h-[220vh] bg-[#000000] overflow-hidden"
        >
            {/* Sticky viewport frame to project the cinematic story */}
            <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between">
                
                {/* ── 3D Visual Engine Container ── */}
                <div className="absolute inset-0 z-0">
                    <HeroScene
                        scrollProgressRef={scrollProgressRef}
                        onLoaded={() => setThreeReady(true)}
                    />
                    
                    {/* Shadow overlay to fade the 3D scene into the bottom products table */}
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
                </div>

                {/* ── Editorial Header Overlay (Announcements) ── */}
                <div className="relative z-10 w-full px-6 py-6 flex items-center justify-between pointer-events-none sm:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={introComplete ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1.0, ease: 'easeOut' }}
                        className="text-[9px] uppercase tracking-[0.45em] text-white/50"
                    >
                        NINE77 COLLECTION DROP '26
                    </motion.div>

                    {/* Sound Controller Button (User-action required by modern browsers) */}
                    <motion.button
                        initial={{ opacity: 0, y: -10 }}
                        animate={introComplete ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1.0, delay: 0.15, ease: 'easeOut' }}
                        onClick={toggleAmbientSound}
                        className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[8px] uppercase tracking-[0.25em] text-white/60 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${audioActive ? 'bg-gold animate-pulse' : 'bg-white/20'}`} />
                        {audioActive ? 'Mute Hum' : 'Ambient Audio'}
                    </motion.button>
                </div>

                {/* ── Editorial Monolith Typography Reveal ── */}
                <div className="relative z-10 w-full px-6 pb-24 sm:px-12 flex flex-col items-start max-w-4xl">
                    <div className="space-y-4 select-none">
                        
                        {/* Staggered letter reveal */}
                        <div className="overflow-hidden">
                            <motion.h1
                                initial={{ y: '100%' }}
                                animate={introComplete ? { y: 0 } : {}}
                                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                                className="text-[clamp(3.5rem,10vw,8.5rem)] font-black uppercase leading-none tracking-tight text-white"
                            >
                                NINE77
                            </motion.h1>
                        </div>

                        <div className="overflow-hidden max-w-lg">
                            <motion.p
                                initial={{ y: '100%' }}
                                animate={introComplete ? { y: 0 } : {}}
                                transition={{ duration: 1.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                                className="text-sm font-semibold uppercase tracking-[0.35em] text-gold"
                            >
                                Built Different.
                            </motion.p>
                        </div>

                        <div className="overflow-hidden max-w-xl">
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={introComplete ? { opacity: 0.45 } : {}}
                                transition={{ duration: 2.0, delay: 0.35 }}
                                className="text-xs text-white leading-relaxed font-light tracking-wide pt-2"
                            >
                                Fusing architectural obsidian geometry with premium streetwear direction. Kathmandu, Nepal.
                            </motion.p>
                        </div>
                    </div>

                    {/* Magnetic Buttons block */}
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        
                        {/* Primary Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={introComplete ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 1.2, delay: 0.45, ease: 'easeOut' }}
                        >
                            <Link
                                href="/shop"
                                data-cursor="magnetic"
                                className="group relative overflow-hidden inline-flex items-center justify-center rounded-full bg-gold px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-black shadow-lg hover:bg-gold-light transition-all"
                            >
                                Shop Collection
                                <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                            </Link>
                        </motion.div>

                        {/* Secondary Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={introComplete ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 1.2, delay: 0.55, ease: 'easeOut' }}
                        >
                            <a
                                href="#new-drop"
                                data-cursor="magnetic"
                                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all"
                            >
                                Explore drop
                            </a>
                        </motion.div>
                    </div>
                </div>

                {/* ── Filmstrip Indicator (Bottom corner scrolling tip) ── */}
                <div className="relative z-10 w-full px-6 py-6 flex items-center justify-between text-white/30 text-[8px] uppercase tracking-[0.3em] pointer-events-none sm:px-12">
                    <div>DRAG MOUSE TO SHIFT VOLUMETRIC SPOTLIGHTS</div>
                    <div>SCROLL DOWN TO DISSOLVE THE MONOLITH</div>
                </div>
            </div>

            {/* Pitch black initial loading preloader (cross-faded to clean up rendering initialization lag) */}
            <AnimatePresence>
                {!threeReady && (
                    <motion.div
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.0 }}
                        className="fixed inset-0 z-[999] bg-[#000000] flex flex-col items-center justify-center pointer-events-none"
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-gold rounded-full animate-ping" />
                            <p className="text-[9px] uppercase tracking-[0.5em] text-white/40">Entering NINE77</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
