'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function HeroBackground({ visible = true }: { visible?: boolean }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-[4]"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 2.5s ease' }}
    >
      {/* Void base */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* TOP — Warm spotlight bloom */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[50vw] h-[75vh]"
        style={{
          background: 'radial-gradient(ellipse 60% 55% at 50% 0%, rgba(200,168,75,0.07) 0%, transparent 70%)',
        }}
      />

      {/* BOTTOM — Dense smoke / fog */}
      <motion.div
        className="absolute bottom-0 inset-x-0 h-[55%]"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(18,16,10,0.92) 0%, transparent 70%)',
        }}
        animate={{ scaleX: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* SMOKE LAYER 1 — slow drift left-right */}
      <motion.div
        className="absolute bottom-0 inset-x-0 h-[42%]"
        style={{
          background: 'radial-gradient(ellipse 55% 45% at 52% 100%, rgba(8,7,5,0.88) 0%, transparent 65%)',
        }}
        animate={{ x: ['-3%', '3%', '-3%'], opacity: [0.7, 0.9, 0.7] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* SMOKE LAYER 2 — counter drift */}
      <motion.div
        className="absolute bottom-0 inset-x-0 h-[32%]"
        style={{
          background: 'radial-gradient(ellipse 42% 35% at 48% 105%, rgba(5,5,4,0.80) 0%, transparent 70%)',
        }}
        animate={{ x: ['2%', '-4%', '2%'], opacity: [0.6, 0.85, 0.6] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      />

      {/* CSS LIGHT CONE — volumetric ray from top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-[45%] origin-top"
        style={{
          width: '35vw',
          height: '80vh',
          background: 'linear-gradient(180deg, rgba(245,236,210,0.06) 0%, transparent 75%)',
          clipPath: 'polygon(30% 0%, 70% 0%, 95% 100%, 5% 100%)',
          filter: 'blur(24px)',
        }}
      />

      {/* RIGHT EDGE darkening */}
      <div
        className="absolute inset-y-0 right-0 w-[20%]"
        style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.45), transparent)' }}
      />

      {/* LEFT EDGE darkening */}
      <div
        className="absolute inset-y-0 left-0 w-[12%]"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.35), transparent)' }}
      />

      {/* Bottom hard fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-28"
        style={{ background: 'linear-gradient(to top, #050505, transparent)' }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.75) 100%)' }}
      />

      {/* Film grain overlay */}
      <div className="grain absolute inset-0 pointer-events-none opacity-35" />
    </div>
  );
}
