'use client';

import { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';

/* ── Deterministic seed randomizer ── */
function seededRandom(seed: number) {
    const value = Math.sin(seed * 12.9898) * 43758.5453;
    return value - Math.floor(value);
}

/* ── Procedural Nero Marquina Marble Texture ── */
function useNeroMarquina() {
    return useMemo(() => {
        if (typeof window === 'undefined' || typeof document === 'undefined') {
            return { texture: null, roughnessMap: null };
        }
        const size = 1024;
        const colorCanvas = document.createElement('canvas');
        const roughCanvas = document.createElement('canvas');
        colorCanvas.width = roughCanvas.width = size;
        colorCanvas.height = roughCanvas.height = size;
        const color = colorCanvas.getContext('2d')!;
        const roughness = roughCanvas.getContext('2d')!;

        const base = color.createLinearGradient(0, 0, size, size);
        base.addColorStop(0, '#080808');
        base.addColorStop(0.5, '#111111');
        base.addColorStop(1, '#0A0A0A');
        color.fillStyle = base;
        color.fillRect(0, 0, size, size);

        roughness.fillStyle = '#6a6a6a';
        roughness.fillRect(0, 0, size, size);

        const vein = (index: number, primary = false) => {
            const startX = seededRandom(index + 2) * size;
            const endX = seededRandom(index + 32) * size;
            color.beginPath();
            roughness.beginPath();
            color.moveTo(startX, -20);
            roughness.moveTo(startX, -20);
            for (let step = 1; step <= 25; step++) {
                const t = step / 25;
                const x = startX + (endX - startX) * t + (seededRandom(index * 43 + step) - 0.5) * (primary ? 85 : 45);
                const y = t * (size + 40);
                color.lineTo(x, y);
                roughness.lineTo(x, y);
            }
            color.strokeStyle = `rgba(223, 212, 185, ${primary ? 0.2 : 0.04 + seededRandom(index) * 0.05})`;
            color.lineWidth = primary ? 1.4 : 0.35 + seededRandom(index + 3) * 0.8;
            color.stroke();
            roughness.strokeStyle = primary ? '#444444' : '#666666';
            roughness.lineWidth = primary ? 2.0 : 0.6;
            roughness.stroke();
        };
        for (let i = 0; i < 35; i++) vein(i);
        vein(60, true); vein(75, true); vein(88, true);

        const texture = new THREE.CanvasTexture(colorCanvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;
        const roughnessMap = new THREE.CanvasTexture(roughCanvas);
        return { texture, roughnessMap };
    }, []);
}

/* ── Floating Gold Particles Sparkle Field ── */
function FloatingParticles() {
    const pointsRef = useRef<THREE.Points>(null!);

    const [positions, speeds] = useMemo(() => {
        const count = 50;
        const pos = new Float32Array(count * 3);
        const spd = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            // Distribute randomly in a sphere around the center
            const r = 0.3 + seededRandom(i * 3) * 0.55;
            const theta = seededRandom(i * 7) * Math.PI * 2;
            const phi = Math.acos(seededRandom(i * 11) * 2 - 1);
            
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
            
            spd[i] = 0.15 + seededRandom(i * 13) * 0.3;
        }
        return [pos, spd];
    }, []);

    useFrame((state) => {
        if (!pointsRef.current) return;
        const t = state.clock.getElapsedTime();
        const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
        
        for (let i = 0; i < 50; i++) {
            const x = posArray[i * 3];
            const z = posArray[i * 3 + 2];
            const speed = speeds[i];
            
            // Apply slow orbital rotation
            posArray[i * 3] = x * Math.cos(speed * 0.015) - z * Math.sin(speed * 0.015);
            posArray[i * 3 + 2] = x * Math.sin(speed * 0.015) + z * Math.cos(speed * 0.015);
            
            // Add slight vertical wave bobbing
            posArray[i * 3 + 1] += Math.sin(t * speed + i) * 0.0003;
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef} position={[0, 0, 0.01]}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#D4AF37"
                size={0.018}
                transparent
                opacity={0.7}
                sizeAttenuation
            />
        </points>
    );
}

/* ── 3D Brand Emblem Component ── */
function BrandEmblem3D() {
    const emblemRef = useRef<THREE.Group>(null!);
    const innerRingRef = useRef<THREE.Mesh>(null!);
    const coreRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Gentle floating
        if (emblemRef.current) {
            emblemRef.current.position.y = Math.sin(t * 0.45) * 0.04;
        }

        // Inner core rotation
        if (coreRef.current) {
            coreRef.current.rotation.y = t * 0.25;
        }

        // Gyroscope ring rotation
        if (innerRingRef.current) {
            innerRingRef.current.rotation.x = t * 0.3;
            innerRingRef.current.rotation.y = t * 0.15;
        }
    });

    return (
        <group ref={emblemRef} position={[0, 0, 0.015]}>
            {/* Core Golden Light Projection */}
            <pointLight position={[0, 0, 0.05]} intensity={3.5} distance={1.8} color="#D4AF37" decay={1.5} />

            {/* 1. Core Rotating Text Logo with Gold Bezel & Glass Backing */}
            <group ref={coreRef} scale={[0.7, 0.7, 0.7]}>
                {/* Thin gold bezel ring around the text */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.36, 0.004, 8, 48]} />
                    <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.15} />
                </mesh>
                
                {/* Small dark circular glass backing disc to improve text readability */}
                <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.35, 0.35, 0.002, 32]} />
                    <meshStandardMaterial color="#050505" transparent opacity={0.7} roughness={0.2} metalness={0.8} />
                </mesh>

                {/* Front facing text */}
                <Text
                    position={[0, 0, 0.015]}
                    fontSize={0.095}
                    anchorX="center"
                    anchorY="middle"
                    letterSpacing={0.18}
                    color="#D4AF37"
                >
                    NINE77
                </Text>
                
                {/* Back facing text */}
                <Text
                    position={[0, 0, -0.015]}
                    fontSize={0.095}
                    anchorX="center"
                    anchorY="middle"
                    letterSpacing={0.18}
                    color="#D4AF37"
                    rotation={[0, Math.PI, 0]}
                >
                    NINE77
                </Text>
            </group>

            {/* 2. Single Elegant Gold Ring */}
            <mesh ref={innerRingRef}>
                <torusGeometry args={[0.54, 0.004, 16, 80]} />
                <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.1} />
            </mesh>

            {/* 5. Tiny central glowing core */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshBasicMaterial color="#C9A227" />
            </mesh>

            {/* 6. Orbiting Gold Sparks */}
            <FloatingParticles />
        </group>
    );
}
/* ── Orbiting Marble/Gold Fragments ── */
function OrbitingRocks() {
    const groupRef = useRef<THREE.Group>(null!);
    const { texture, roughnessMap } = useNeroMarquina();

    const rockData = useMemo(() => {
        return Array.from({ length: 6 }, (_, i) => ({
            radius: 1.6 + seededRandom(i * 7) * 0.8,
            speed: 0.12 + seededRandom(i * 13) * 0.08,
            offset: seededRandom(i * 23) * Math.PI * 2,
            size: 0.04 + seededRandom(i * 31) * 0.06,
            yOffset: (seededRandom(i * 17) - 0.5) * 1.4,
        }));
    }, []);

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.getElapsedTime();

        groupRef.current.children.forEach((child, i) => {
            const rock = rockData[i];
            if (!rock) return;
            const angle = t * rock.speed + rock.offset;
            child.position.x = Math.cos(angle) * rock.radius;
            child.position.z = Math.sin(angle) * rock.radius * 0.5;
            child.position.y = rock.yOffset + Math.sin(t * 0.5 + i) * 0.05;
            child.rotation.x = t * 0.3 + i;
            child.rotation.z = t * 0.2 + i * 0.5;
        });
    });

    return (
        <group ref={groupRef}>
            {rockData.map((rock, i) => (
                <mesh key={i} castShadow>
                    <dodecahedronGeometry args={[rock.size, 0]} />
                    <meshPhysicalMaterial
                        map={i % 3 === 0 ? undefined : texture || undefined}
                        roughnessMap={i % 3 === 0 ? undefined : roughnessMap || undefined}
                        color={i % 3 === 0 ? "#D4AF37" : "#0f0f0f"}
                        metalness={i % 3 === 0 ? 0.95 : 0.05}
                        roughness={i % 3 === 0 ? 0.1 : 0.55}
                        clearcoat={0.2}
                    />
                </mesh>
            ))}
        </group>
    );
}

/* ── Studio Lighting Setup ── */
function StudioLights() {
    return (
        <>
            <directionalLight
                position={[3, 4, 2]}
                intensity={1.2}
                color="#F5E6D0"
                castShadow
                shadow-mapSize={[1024, 1024]}
            />
            <pointLight position={[0, 2, -3]} intensity={0.8} color="#B7864A" />
            <pointLight position={[-3, 1, 1]} intensity={0.4} color="#E8DDD0" />
            <ambientLight intensity={0.15} color="#F8F6F2" />
            <spotLight
                position={[0, 0, -2]}
                angle={0.8}
                penumbra={1}
                intensity={0.6}
                color="#B7864A"
            />
        </>
    );
}

/* ── Scene Content ── */
function SceneContent({ scrollProgressRef }: {
    scrollProgressRef: React.RefObject<number>;
}) {
    const { width } = useThree().viewport;
    const isMobile = width < 2.5;

    // Centered composition scaled up to fill the background space beautifully
    const scale = isMobile ? 0.8 : 1.65;
    const posY = isMobile ? -0.05 : 0.0;

    return (
        <>
            <StudioLights />
            <group position={[0, posY, 0]} scale={[scale, scale, scale]}>
                <BrandEmblem3D />
                <OrbitingRocks />
                <ContactShadows
                    position={[0, -1.12, 0]}
                    opacity={0.25}
                    scale={6}
                    blur={2.5}
                    far={3}
                    color="#0C0A08"
                />
            </group>
        </>
    );
}

/* ── Exported Canvas ── */
export default function HeroScene({
    scrollProgressRef,
    onLoaded,
}: {
    scrollProgressRef: React.RefObject<number>;
    onLoaded: () => void;
}) {
    useEffect(() => {
        // Trigger loaded state to ensure preloader exits safely after mount
        const timer = setTimeout(onLoaded, 500);
        return () => clearTimeout(timer);
    }, [onLoaded]);

    return (
        <Canvas
            className="r3f-canvas"
            camera={{ position: [0, 0.2, 3.8], fov: 35 }}
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.1,
            }}
            dpr={[1, 1.5]}
            shadows
        >
            <Suspense fallback={null}>
                <SceneContent scrollProgressRef={scrollProgressRef} />
            </Suspense>
        </Canvas>
    );
}
