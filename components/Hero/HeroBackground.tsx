'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Static gold dust particles — deterministic positions (no Math.random to avoid hydration mismatch)
const PARTICLES = [
  { x: 6,  size: 1.5, duration: 12, delay: 0,   driftX: 12 },
  { x: 14, size: 2.0, duration: 16, delay: 3.2, driftX: 8  },
  { x: 21, size: 1.0, duration: 14, delay: 1.4, driftX: 15 },
  { x: 29, size: 1.5, duration: 18, delay: 5.5, driftX: 10 },
  { x: 37, size: 2.0, duration: 11, delay: 2.1, driftX: 6  },
  { x: 44, size: 1.0, duration: 20, delay: 7.0, driftX: 18 },
  { x: 52, size: 1.5, duration: 13, delay: 0.8, driftX: 8  },
  { x: 61, size: 2.0, duration: 17, delay: 4.2, driftX: 12 },
  { x: 68, size: 1.0, duration: 12, delay: 6.1, driftX: 9  },
  { x: 75, size: 1.5, duration: 15, delay: 2.6, driftX: 14 },
  { x: 83, size: 2.0, duration: 19, delay: 8.3, driftX: 7  },
  { x: 90, size: 1.0, duration: 13, delay: 3.8, driftX: 16 },
] as const;

export default function HeroBackground({ visible = true }: { visible?: boolean }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-[4]"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 2.8s ease' }}
      aria-hidden="true"
    >
      {/* ── Void base ─────────────────────────────────── */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* ── Gold dust particles ────────────────────────── */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: '12%',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: '#C89B5A',
            willChange: 'transform, opacity',
            animation: `goldFloat ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* ── TOP — Warm spotlight bloom ─────────────────── */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[55vw] h-[70vh]"
        style={{
          background: 'radial-gradient(ellipse 55% 50% at 50% 0%, rgba(200,155,90,0.085) 0%, transparent 72%)',
        }}
      />

      {/* ── BOTTOM — Dense atmospheric fog ────────────── */}
      <motion.div
        className="absolute bottom-0 inset-x-0 h-[52%]"
        style={{
          background: 'radial-gradient(ellipse 78% 62% at 50% 100%, rgba(5,5,5,0.95) 0%, transparent 72%)',
        }}
        animate={{ scaleX: [1, 1.05, 1], opacity: [0.88, 1, 0.88] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── SMOKE LAYER 1 — slow drift ─────────────────── */}
      <motion.div
        className="absolute bottom-0 inset-x-0 h-[38%]"
        style={{
          background: 'radial-gradient(ellipse 52% 42% at 52% 100%, rgba(8,6,4,0.90) 0%, transparent 68%)',
        }}
        animate={{ x: ['-3%', '3%', '-3%'], opacity: [0.72, 0.92, 0.72] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── SMOKE LAYER 2 — counter drift ─────────────── */}
      <motion.div
        className="absolute bottom-0 inset-x-0 h-[28%]"
        style={{
          background: 'radial-gradient(ellipse 40% 32% at 48% 108%, rgba(5,4,3,0.82) 0%, transparent 72%)',
        }}
        animate={{ x: ['2.5%', '-3.5%', '2.5%'], opacity: [0.62, 0.84, 0.62] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      />

      {/* ── VOLUMETRIC LIGHT CONE — warm gold ray ──────── */}
      <div
        className="absolute top-0 left-1/2 -translate-x-[42%] origin-top"
        style={{
          width: '32vw',
          height: '78vh',
          background: 'linear-gradient(180deg, rgba(240,220,170,0.07) 0%, rgba(200,155,90,0.02) 40%, transparent 78%)',
          clipPath: 'polygon(28% 0%, 72% 0%, 96% 100%, 4% 100%)',
          filter: 'blur(28px)',
        }}
      />

      {/* ── SECONDARY LIGHT STREAK — soft left accent ── */}
      <div
        className="absolute top-[10%] left-0 w-[18vw] h-[55vh]"
        style={{
          background: 'linear-gradient(135deg, rgba(200,155,90,0.04) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* ── LEFT EDGE darkness ─────────────────────────── */}
      <div
        className="absolute inset-y-0 left-0 w-[14%]"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.50), transparent)' }}
      />

      {/* ── RIGHT EDGE darkness ────────────────────────── */}
      <div
        className="absolute inset-y-0 right-0 w-[18%]"
        style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.52), transparent)' }}
      />

      {/* ── BOTTOM hard scrim ──────────────────────────── */}
      <div
        className="absolute inset-x-0 bottom-0 h-32"
        style={{ background: 'linear-gradient(to top, #050505 0%, transparent 100%)' }}
      />

      {/* ── VIGNETTE — cinematic corners ───────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.82) 100%)',
        }}
      />

      {/* ── FILM GRAIN — animated noise overlay ────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.032,
          mixBlendMode: 'overlay',
          animation: 'heroGrain 0.18s steps(1) infinite',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
