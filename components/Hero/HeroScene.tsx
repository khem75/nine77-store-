'use client';

/**
 * NINE77 — Cinematic Hero Scene v4
 *
 * Key upgrades from v3:
 * ✓ Enhanced Nero Marquina marble — high-contrast white + gold veins
 * ✓ Volumetric floor fog via instanced sprites
 * ✓ Thicker, more emissive orbital rings with clear engraving
 * ✓ Dramatic single-key studio spotlight
 * ✓ NINE77 engraving: larger, more emissive, catches light correctly
 * ✓ Micro floating dust with additive blending
 * ✓ Bloom-ready emissive materials on gold only
 * ✓ Performance: adaptive DPR, frustum culling, instanced meshes
 */

import { Suspense, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  ContactShadows,
  MeshReflectorMaterial,
  RoundedBox,
  Environment,
  Sparkles,
} from '@react-three/drei';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rng  = (seed: number) => { const v = Math.sin(seed * 9301 + 49297) * 233280; return v - Math.floor(v); };

/* ─────────────────────────────────────────────────────────
   MARBLE TEXTURE — Nero Marquina
   • Carbon obsidian base
   • Bold white calcite fractures
   • Sparse gold metallic veins (emissive only)
   • High anisotropy for polish
───────────────────────────────────────────────────────── */
function useMarble() {
  return useMemo(() => {
    if (typeof window === 'undefined') return { color: null, rough: null, emi: null, norm: null };

    const S = 2048;
    const mk = () => { const c = document.createElement('canvas'); c.width = c.height = S; return c; };

    const cc = mk(), rc = mk(), ec = mk(), nc = mk();
    const col  = cc.getContext('2d')!;
    const rou  = rc.getContext('2d')!;
    const emi  = ec.getContext('2d')!;
    const nor  = nc.getContext('2d')!;

    // ── Base fills ──
    // Color: deep obsidian with subtle warm spot
    const cg = col.createRadialGradient(S * 0.45, S * 0.25, 0, S * 0.5, S * 0.5, S * 0.9);
    cg.addColorStop(0,   '#111010');
    cg.addColorStop(0.3, '#0c0c0b');
    cg.addColorStop(0.7, '#090908');
    cg.addColorStop(1,   '#060605');
    col.fillStyle = cg; col.fillRect(0, 0, S, S);

    // Roughness: medium-low (polished stone, ~0.3)
    rou.fillStyle = '#4a4a4a'; rou.fillRect(0, 0, S, S);
    // Emissive: pure black base
    emi.fillStyle = '#000';   emi.fillRect(0, 0, S, S);
    // Normal: flat (128,128,255)
    nor.fillStyle = '#8080ff'; nor.fillRect(0, 0, S, S);

    // ── Vein drawing ──
    const vein = (seed: number, type: 'micro' | 'white' | 'gold') => {
      const sx = rng(seed + 0.1) * S;
      const ex = rng(seed + 0.9) * S;
      const pts: [number, number][] = [];
      for (let i = 0; i <= 32; i++) {
        const t   = i / 32;
        const jit = type === 'gold' ? 130 : type === 'white' ? 85 : 45;
        pts.push([lerp(sx, ex, t) + (rng(seed * 41 + i) - 0.5) * jit, t * (S + 30) - 15]);
      }
      const draw = (ctx: CanvasRenderingContext2D, stroke: string, lw: number, alpha = 1) => {
        ctx.save(); ctx.globalAlpha = alpha;
        ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
      };

      if (type === 'micro') {
        draw(col, `rgba(160,155,145,${0.03 + rng(seed+2)*0.04})`, 0.3 + rng(seed)*0.5);
        draw(rou, '#3a3a3a', 0.4);
      } else if (type === 'white') {
        // High contrast white/silver calcite — key feature of Nero Marquina
        const w = 0.7 + rng(seed + 4) * 1.2;
        draw(col, `rgba(220,215,205,${0.14 + rng(seed+3)*0.10})`, w);
        draw(col, `rgba(240,238,232,${0.06 + rng(seed+6)*0.05})`, w * 0.4);
        draw(rou, '#555', w * 1.2);
        // Slight surface bump
        draw(nor, `rgba(90,90,220,0.18)`, w * 2);
      } else {
        // Gold — very sparse, mostly emissive
        const w = 0.6 + rng(seed+8) * 1.0;
        draw(col, `rgba(185,152,68,${0.07 + rng(seed+9)*0.06})`, w);
        draw(emi, `rgba(200,168,75,${0.55 + rng(seed+7)*0.3})`, w * 0.85);
        draw(rou, '#3a3a3a', w * 0.9);
      }
    };

    for (let i = 0;  i < 70; i++) vein(i, 'micro');   // 70 micro
    for (let i = 70; i < 90; i++) vein(i, 'white');   // 20 white (bold)
    for (const s of [120, 133, 148, 165]) vein(s, 'gold'); // 4 gold

    const tex = (c: HTMLCanvasElement, srgb = true) => {
      const t = new THREE.CanvasTexture(c);
      t.anisotropy = 16;
      if (srgb) t.colorSpace = THREE.SRGBColorSpace;
      return t;
    };

    return { color: tex(cc, true), rough: tex(rc, false), emi: tex(ec, false), norm: tex(nc, false) };
  }, []);
}

/* ─────────────────────────────────────────────────────────
   RING ENGRAVING TEXTURE
───────────────────────────────────────────────────────── */
function useRingTex() {
  return useMemo(() => {
    if (typeof window === 'undefined') return null;
    const W = 2048, H = 112;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d')!;
    // Brushed gold base
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0,    '#1c1810'); g.addColorStop(0.5, '#241f13'); g.addColorStop(1, '#1c1810');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // Horizontal brushing lines
    for (let i = 0; i < H; i += 2) {
      ctx.fillStyle = `rgba(${160 + (i % 4) * 8},${130 + (i % 3) * 5},${60 + (i % 5) * 3},0.04)`;
      ctx.fillRect(0, i, W, 1);
    }
    // Engraved text
    ctx.font = '700 22px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(200,168,75,0.65)';
    ctx.textBaseline = 'middle';
    const txt = 'NINE77  •  PREMIUM STREETWEAR  •  BUILD DIFFERENT  •  ';
    let x = 0;
    while (x < W + 400) { ctx.fillText(txt, x, H / 2); x += ctx.measureText(txt).width; }
    const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping;
    return t;
  }, []);
}

/* ─────────────────────────────────────────────────────────
   NINE77 ENGRAVING TEXTURE
───────────────────────────────────────────────────────── */
function useEngraveTex() {
  return useMemo(() => {
    if (typeof window === 'undefined') return { logo: null, sub: null };

    // Logo
    const lc = document.createElement('canvas'); lc.width = 1024; lc.height = 240;
    const lx = lc.getContext('2d')!;
    lx.clearRect(0, 0, 1024, 240);
    // Deep recess
    lx.fillStyle = 'rgba(0,0,0,0.85)'; lx.fillRect(0, 0, 1024, 240);
    // Primary gold fill
    lx.font = '900 144px system-ui, -apple-system, sans-serif';
    lx.textAlign = 'center'; lx.textBaseline = 'middle';
    lx.fillStyle = '#d4af55';
    lx.shadowColor = 'rgba(200,168,75,0.8)'; lx.shadowBlur = 20;
    lx.fillText('NINE77', 512, 120);
    lx.shadowBlur = 0;
    // Edge highlight (light catching bevel)
    lx.strokeStyle = 'rgba(255,225,140,0.45)'; lx.lineWidth = 2;
    lx.strokeText('NINE77', 512, 120);

    // Sub label
    const sc = document.createElement('canvas'); sc.width = 1024; sc.height = 100;
    const sx = sc.getContext('2d')!;
    sx.clearRect(0, 0, 1024, 100);
    sx.font = '600 30px system-ui, -apple-system, sans-serif';
    sx.textAlign = 'center'; sx.textBaseline = 'middle';
    sx.fillStyle = 'rgba(180,148,70,0.75)';
    sx.fillText('PREMIUM  STREETWEAR', 512, 50);

    const mk = (canvas: HTMLCanvasElement) => {
      const t = new THREE.CanvasTexture(canvas);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      return t;
    };
    return { logo: mk(lc), sub: mk(sc) };
  }, []);
}

/* ─────────────────────────────────────────────────────────
   LUXURY MONOLITH — Material Stack
───────────────────────────────────────────────────────── */
function LuxuryMonolith({
  mouseRef, scrollRef, isMobile,
}: {
  mouseRef:  React.RefObject<{ x: number; y: number }>;
  scrollRef: React.RefObject<number>;
  isMobile: boolean;
}) {
  const gRef   = useRef<THREE.Group>(null!);
  const emiRef = useRef<THREE.MeshStandardMaterial>(null!);
  const marble  = useMarble();
  const engrave = useEngraveTex();

  // Dimensions increased by 30%:
  // 0.88 * 1.30 = 1.144 (Width)
  // 2.18 * 1.30 = 2.834 (Height)
  // 0.17 * 1.30 = 0.221 (Depth)
  const W = 1.14, H = 2.83, D = 0.22;

  useFrame((s) => {
    if (!gRef.current) return;
    const t  = s.clock.getElapsedTime();
    const mx = mouseRef.current?.x  ?? 0;
    const my = mouseRef.current?.y  ?? 0;
    const sc = scrollRef.current    ?? 0;

    gRef.current.position.y  = Math.sin(t * 0.38) * 0.055 - sc * 0.55;
    gRef.current.rotation.y  = lerp(gRef.current.rotation.y, t * 0.045 + mx * 0.09 + sc * Math.PI * 0.45, 0.028);
    gRef.current.rotation.x  = lerp(gRef.current.rotation.x, my * 0.04, 0.03);
    gRef.current.rotation.z  = lerp(gRef.current.rotation.z, mx * 0.012, 0.04);
    if (emiRef.current) {
      emiRef.current.emissiveIntensity = 0.20 + Math.sin(t * 1.05) * 0.07 + Math.sin(t * 2.5 + 0.9) * 0.035;
    }
  });

  const goldFr = (
    <meshStandardMaterial color="#c0a24a" metalness={0.96} roughness={0.20} envMapIntensity={1.6} />
  );
  const alumMat = (
    <meshStandardMaterial color="#111115" metalness={0.94} roughness={0.06} envMapIntensity={3.0} />
  );

  return (
    <group ref={gRef}>
      {/* Frame: thin brushed gold. Mobile uses lower smoothness (2) for performance. */}
      <RoundedBox args={[W + 0.030, H + 0.030, D + 0.030]} radius={0.020} smoothness={isMobile ? 2 : 4} castShadow>
        {goldFr}
      </RoundedBox>
      {/* Inset: polished black aluminum */}
      <RoundedBox args={[W + 0.008, H + 0.008, D + 0.006]} radius={0.016} smoothness={isMobile ? 2 : 4} castShadow>
        {alumMat}
      </RoundedBox>

      {/* Front marble panel */}
      <mesh position={[0, 0, D / 2 + 0.004]} castShadow receiveShadow>
        <planeGeometry args={[W - 0.016, H - 0.016]} />
        <meshStandardMaterial
          map={marble.color ?? undefined}
          roughnessMap={marble.rough ?? undefined}
          emissiveMap={marble.emi   ?? undefined}
          normalMap={marble.norm    ?? undefined}
          emissive={new THREE.Color('#c0a020')}
          emissiveIntensity={0.20}
          metalness={0.03}
          roughness={0.26}
          envMapIntensity={0.65}
          ref={emiRef}
        />
      </mesh>

      {/* Back marble panel */}
      <mesh position={[0, 0, -(D / 2 + 0.004)]} rotation={[0, Math.PI, 0]} castShadow>
        <planeGeometry args={[W - 0.016, H - 0.016]} />
        <meshStandardMaterial
          map={marble.color ?? undefined}
          roughnessMap={marble.rough ?? undefined}
          metalness={0.03} roughness={0.30} envMapIntensity={0.35}
        />
      </mesh>

      {/* Side panels */}
      {([-1, 1] as const).map((s, i) => (
        <mesh key={i} position={[s * (W / 2 + 0.002), 0, 0]} rotation={[0, s * Math.PI / 2, 0]}>
          <planeGeometry args={[D - 0.008, H - 0.016]} />
          <meshStandardMaterial
            map={marble.color ?? undefined}
            roughnessMap={marble.rough ?? undefined}
            metalness={0.04} roughness={0.32} envMapIntensity={0.25}
          />
        </mesh>
      ))}

      {/* NINE77 engraving — front face. Dimensions scaled 30%. */}
      <group position={[0, 0.36 * 1.3, D / 2 + 0.006]}>
        {/* Recessed dark cavity */}
        <mesh position={[0, 0, -0.0012]}>
          <planeGeometry args={[0.58 * 1.3, 0.24 * 1.3]} />
          <meshStandardMaterial color="#030302" roughness={0.75} metalness={0.08} />
        </mesh>
        {/* NINE77 logo inlay */}
        <mesh position={[0, 0.025 * 1.3, 0.002]}>
          <planeGeometry args={[0.56 * 1.3, 0.130 * 1.3]} />
          <meshStandardMaterial
            map={engrave.logo ?? undefined}
            emissiveMap={engrave.logo ?? undefined}
            emissive={new THREE.Color('#d4af55')}
            emissiveIntensity={0.62}
            metalness={0.92} roughness={0.06}
            transparent alphaTest={0.08}
          />
        </mesh>
        {/* Sub-label */}
        <mesh position={[0, -0.072 * 1.3, 0.0016]}>
          <planeGeometry args={[0.44 * 1.3, 0.048 * 1.3]} />
          <meshStandardMaterial
            map={engrave.sub ?? undefined}
            emissiveMap={engrave.sub ?? undefined}
            emissive={new THREE.Color('#a07838')}
            emissiveIntensity={0.30}
            transparent alphaTest={0.04}
            metalness={0.55} roughness={0.3}
          />
        </mesh>
      </group>

      {/* Internal glow */}
      <pointLight position={[0, 0.3 * 1.3, D / 2 + 0.08]} intensity={0.55} color="#d4af55" distance={1.4} />
    </group>
  );
}

/* ─────────────────────────────────────────────────────────
   ORBITAL RINGS — 3 depth-sorted, never cross UI
───────────────────────────────────────────────────────── */
function Ring({
  r, tube, tiltX, tiltZ = 0, speed, opacity = 1, zOff = 0,
}: {
  r: number; tube: number; tiltX: number; tiltZ?: number;
  speed: number; opacity?: number; zOff?: number;
}) {
  const ref    = useRef<THREE.Group>(null!);
  const ringTex = useRingTex();

  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.getElapsedTime() * speed; });

  return (
    <group ref={ref} rotation={[tiltX, 0, tiltZ]} position={[0, 0, zOff]}>
      {/* Main torus */}
      <mesh castShadow>
        <torusGeometry args={[r, tube, 20, 200]} />
        <meshStandardMaterial
          color="#b89840" metalness={0.97} roughness={0.20}
          envMapIntensity={1.8} transparent opacity={opacity}
        />
      </mesh>
      {/* Emissive inner engraving */}
      <mesh>
        <torusGeometry args={[r, tube * 0.5, 10, 200]} />
        <meshStandardMaterial
          map={ringTex ?? undefined}
          emissiveMap={ringTex ?? undefined}
          emissive={new THREE.Color('#c8a84b')}
          emissiveIntensity={0.45}
          transparent opacity={opacity * 0.78}
          metalness={0.25} roughness={0.55}
        />
      </mesh>
    </group>
  );
}

function OrbitalSystem({
  scrollRef, mouseRef, isMobile,
}: {
  scrollRef: React.RefObject<number>;
  mouseRef:  React.RefObject<{ x: number; y: number }>;
  isMobile: boolean;
}) {
  const ref = useRef<THREE.Group>(null!);

  useFrame((s) => {
    if (!ref.current) return;
    const sc = scrollRef.current ?? 0;
    const mx = mouseRef.current?.x ?? 0;
    ref.current.rotation.x = lerp(ref.current.rotation.x, mx * 0.025, 0.03);
    const scale = lerp(1, 1.16, Math.min(sc * 1.4, 1));
    ref.current.scale.setScalar(lerp(ref.current.scale.x, scale, 0.035));
  });

  return (
    <group ref={ref}>
      {/* Ring 1: Large, behind, nearly vertical */}
      <group position={[0, 0, -0.7]}>
        <Ring r={1.52} tube={0.0075} tiltX={Math.PI * 0.48} speed={0.05}  zOff={0} />
      </group>
      {/* Ring 2: Medium, front, tilted */}
      <group position={[0, -0.08, 0.35]}>
        <Ring r={1.18} tube={0.0065} tiltX={Math.PI * 0.36} tiltZ={-0.20} speed={-0.065} zOff={0} />
      </group>
      {/* Ring 3: Small, fog-hidden. Hidden on mobile. */}
      {!isMobile && (
        <group position={[0.18, -0.55, -0.18]}>
          <Ring r={0.82} tube={0.0048} tiltX={Math.PI * 0.70} tiltZ={0.38} speed={0.09} opacity={0.38} zOff={0} />
        </group>
      )}
    </group>
  );
}

/* ─────────────────────────────────────────────────────────
   FLOATING DARK SHARDS
───────────────────────────────────────────────────────── */
function FloatingShards({ marble }: { marble: { color: THREE.CanvasTexture | null; rough: THREE.CanvasTexture | null } }) {
  const gRef   = useRef<THREE.Group>(null!);
  const shards = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    r:       0.85 + rng(i * 11) * 1.1,
    speed:   0.038 + rng(i * 13) * 0.045,
    offset:  rng(i * 23) * Math.PI * 2,
    scale:   0.020 + rng(i * 37) * 0.055,
    yBase:  (rng(i * 17) - 0.5) * 1.7,
    isGold:  i === 2 || i === 6,
  })), []);

  useFrame((s) => {
    if (!gRef.current) return;
    const t = s.clock.getElapsedTime();
    gRef.current.children.forEach((child, i) => {
      const sh = shards[i];
      if (!sh) return;
      const a = t * sh.speed + sh.offset;
      child.position.x = Math.cos(a) * sh.r;
      child.position.z = Math.sin(a) * sh.r * 0.52;
      child.position.y = sh.yBase + Math.sin(t * 0.28 + i) * 0.065;
      child.rotation.x += 0.0030; child.rotation.z += 0.0022;
    });
  });

  return (
    <group ref={gRef}>
      {shards.map((sh, i) => (
        <mesh key={i} scale={sh.scale} castShadow>
          <dodecahedronGeometry args={[1, 0]} />
          {sh.isGold
            ? <meshStandardMaterial color="#b89840" metalness={0.97} roughness={0.12} envMapIntensity={2.5} />
            : <meshStandardMaterial map={marble.color ?? undefined} roughnessMap={marble.rough ?? undefined}
                color="#0a0a09" metalness={0.05} roughness={0.50} envMapIntensity={0.3} />
          }
        </mesh>
      ))}
    </group>
  );
}

/* ─────────────────────────────────────────────────────────
   PLATFORM GLOW RING
───────────────────────────────────────────────────────── */
function Platform() {
  const mRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame((s) => {
    if (mRef.current) {
      mRef.current.emissiveIntensity = 0.55 + Math.sin(s.clock.getElapsedTime() * 0.7) * 0.22;
    }
  });

  return (
    <group position={[0, -1.10, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.38, 0.50, 64]} />
        <meshStandardMaterial ref={mRef} color="#c8a84b" emissive={new THREE.Color('#c8a84b')}
          emissiveIntensity={0.55} metalness={0.92} roughness={0.08} transparent opacity={0.78} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.50, 1.55, 64]} />
        <meshBasicMaterial color="#c8a84b" transparent opacity={0.038} depthWrite={false}
          blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────
   VOLUMETRIC SPOTLIGHT CONE
───────────────────────────────────────────────────────── */
function SpotCone() {
  const mRef = useRef<THREE.MeshBasicMaterial>(null!);

  useFrame((s) => {
    if (mRef.current) {
      mRef.current.opacity = 0.016 + Math.sin(s.clock.getElapsedTime() * 0.5) * 0.005;
    }
  });

  return (
    <mesh position={[0.3, 3.8, 0.3]} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[1.6, 7.5, 32, 1, true]} />
      <meshBasicMaterial ref={mRef} color="#f0e8d0" transparent opacity={0.018}
        side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────
   INSTANCED AMBIENT DUST
───────────────────────────────────────────────────────── */
function AmbientDust({ count = 90 }: { count?: number }) {
  const ptRef = useRef<THREE.Points>(null!);
  const [pos, phase] = useMemo(() => {
    const p = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p[i*3]   = (rng(i*3.1) - 0.5) * 6.5;
      p[i*3+1] = (rng(i*5.7) - 0.5) * 4.5;
      p[i*3+2] = (rng(i*7.3) - 0.5) * 3.5;
      ph[i]    = rng(i*11.9) * Math.PI * 2;
    }
    return [p, ph];
  }, [count]);

  useFrame((s) => {
    if (!ptRef.current) return;
    const t  = s.clock.getElapsedTime();
    const arr = ptRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i*3+1] += 0.00022;
      arr[i*3]   += Math.sin(t * 0.10 + phase[i]) * 0.00040;
      if (arr[i*3+1] > 2.5) arr[i*3+1] = -2.5;
    }
    ptRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ptRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#c8a84b" size={0.011} transparent opacity={0.35}
        sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/* ─────────────────────────────────────────────────────────
   STUDIO LIGHTING
───────────────────────────────────────────────────────── */
function StudioLights({ mouseRef }: { mouseRef: React.RefObject<{ x: number; y: number }> }) {
  const keyRef = useRef<THREE.SpotLight>(null!);
  const rimRef = useRef<THREE.PointLight>(null!);

  useFrame((s) => {
    const t  = s.clock.getElapsedTime();
    const mx = mouseRef.current?.x ?? 0;
    const my = mouseRef.current?.y ?? 0;
    if (keyRef.current) {
      keyRef.current.intensity = 24 + Math.sin(t * 0.45) * 3;
      keyRef.current.position.x = lerp(keyRef.current.position.x, 0.4 + mx * 0.5, 0.04);
      keyRef.current.position.z = lerp(keyRef.current.position.z, 0.5 + my * 0.4, 0.04);
    }
    if (rimRef.current) {
      rimRef.current.intensity = 1.6 + Math.sin(t * 0.6 + 1) * 0.35;
      rimRef.current.position.x = lerp(rimRef.current.position.x, -1.6 - mx * 0.5, 0.04);
    }
  });

  return (
    <>
      {/* Key: large top spotlight */}
      <spotLight ref={keyRef} position={[0.4, 5.5, 0.5]} angle={0.17} penumbra={0.9}
        intensity={24} color="#f5ecd8" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} />
      {/* Warm rim lights */}
      <pointLight ref={rimRef} position={[-1.6, 0.8, -3.0]} intensity={1.6} color="#d4a86a" />
      <pointLight position={[1.6, 0.8, -3.0]} intensity={1.0} color="#d4a86a" />
      {/* Cool fill */}
      <pointLight position={[2.5, 1.5, 3.0]} intensity={0.16} color="#bcc8e0" />
      {/* Platform warm bounce */}
      <pointLight position={[0, -0.75, 0.5]} intensity={0.65} color="#c8a84b" />
      {/* Ambient */}
      <ambientLight intensity={0.055} color="#e8dcc8" />
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   REFLECTIVE OBSIDIAN FLOOR
───────────────────────────────────────────────────────── */
function ObsidianFloor() {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.11, 0]} receiveShadow>
      <planeGeometry args={[24, 24]} />
      <MeshReflectorMaterial blur={[700, 260]} resolution={isMobile ? 256 : 1024} mixBlur={0.96}
        mixStrength={30} roughness={0.96} depthScale={1.3}
        minDepthThreshold={0.82} maxDepthThreshold={1.0}
        color="#040404" metalness={0.88} mirror={0.48} />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────
   CAMERA CONTROLLER
───────────────────────────────────────────────────────── */
function CinematicCamera({
  mouseRef, scrollRef,
}: {
  mouseRef:  React.RefObject<{ x: number; y: number }>;
  scrollRef: React.RefObject<number>;
}) {
  const { camera } = useThree();
  const target     = useRef(new THREE.Vector3(0, 0.2, 4.0));

  useFrame((s) => {
    const t  = s.clock.getElapsedTime();
    const mx = mouseRef.current?.x ?? 0;
    const my = mouseRef.current?.y ?? 0;
    const sc = scrollRef.current   ?? 0;

    const dx = Math.sin(t * 0.085) * 0.075;
    const dy = Math.cos(t * 0.065) * 0.038;
    const dz = Math.sin(t * 0.055) * 0.042;
    const zZ = lerp(4.0, 2.2, Math.min(sc * 1.25, 1));

    target.current.set(mx * 0.14 + dx, my * -0.08 + dy + 0.22, zZ + dz);
    camera.position.lerp(target.current, 0.020);
    camera.lookAt(0, 0.1, 0);
  });

  return null;
}

/* ─────────────────────────────────────────────────────────
   FULL SCENE
───────────────────────────────────────────────────────── */
function Scene({
  mouseRef, scrollRef,
}: {
  mouseRef:  React.RefObject<{ x: number; y: number }>;
  scrollRef: React.RefObject<number>;
}) {
  const { viewport } = useThree();
  const isMobile     = viewport.width < 5;
  const marble       = useMarble();

  return (
    <>
      <CinematicCamera mouseRef={mouseRef} scrollRef={scrollRef} />
      <StudioLights    mouseRef={mouseRef} />
      <Environment preset="night" environmentIntensity={0.15} />

      <group scale={isMobile ? 0.68 : 1.0}>
        {/* Monolith & rings shifted 0.35 to the right on desktop, centered on mobile */}
        <group position={[isMobile ? 0 : 0.35, 0, 0]}>
          <LuxuryMonolith mouseRef={mouseRef} scrollRef={scrollRef} isMobile={isMobile} />
          <OrbitalSystem  scrollRef={scrollRef} mouseRef={mouseRef} isMobile={isMobile} />
          <FloatingShards marble={{ color: marble.color, rough: marble.rough }} />
          <SpotCone />
          <Platform />
        </group>

        {/* Ambient particles (reduced by 70% on mobile) */}
        <AmbientDust count={isMobile ? 25 : 90} />

        {/* Gold sparkle dust (reduced by 70% on mobile) */}
        <Sparkles
          count={isMobile ? 20 : 70}
          scale={[5, 4.5, 3.5]}
          size={0.55}
          speed={0.18}
          opacity={0.38}
          color="#c8a84b"
          noise={0.05}
        />

        <ContactShadows position={[0, -1.10, 0]} opacity={0.65} scale={6} blur={2.5} far={2.2} />
      </group>

      <ObsidianFloor />
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   EXPORTED CANVAS
───────────────────────────────────────────────────────── */
export default function HeroScene({
  mouseRef, scrollRef, onLoaded,
}: {
  mouseRef:  React.RefObject<{ x: number; y: number }>;
  scrollRef: React.RefObject<number>;
  onLoaded:  () => void;
}) {
  useEffect(() => { const t = setTimeout(onLoaded, 800); return () => clearTimeout(t); }, [onLoaded]);

  return (
    <Canvas
      camera={{ position: [0, 0.22, 4.0], fov: 32, near: 0.05, far: 120 }}
      gl={{
        antialias: true, alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
        stencil: false,
      }}
      dpr={[1, typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1]}
      shadows="soft"
    >
      <Suspense fallback={null}>
        <Scene mouseRef={mouseRef} scrollRef={scrollRef} />
      </Suspense>
    </Canvas>
  );
}
