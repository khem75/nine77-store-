'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
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

        // Deep obsidian base
        const base = color.createLinearGradient(0, 0, size, size);
        base.addColorStop(0, '#080808');
        base.addColorStop(0.5, '#111111');
        base.addColorStop(1, '#0A0A0A');
        color.fillStyle = base;
        color.fillRect(0, 0, size, size);

        roughness.fillStyle = '#6a6a6a';
        roughness.fillRect(0, 0, size, size);

        // Marble veins
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

/* ── Main Monolith with Gold Chamfer Edges ── */
function Monolith() {
    const groupRef = useRef<THREE.Group>(null!);
    const { texture, roughnessMap } = useNeroMarquina();

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.getElapsedTime();

        // Slow float
        groupRef.current.position.y = Math.sin(t * 0.35) * 0.06;

        // Very slow rotation
        groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.08;
    });

    return (
        <group ref={groupRef}>
            {/* Main marble body */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[1.3, 1.8, 0.12]} />
                <meshPhysicalMaterial
                    map={texture || undefined}
                    roughnessMap={roughnessMap || undefined}
                    color="#0f0f0f"
                    metalness={0.06}
                    roughness={0.5}
                    clearcoat={0.2}
                    clearcoatRoughness={0.35}
                    reflectivity={0.35}
                />
            </mesh>

            {/* Champagne gold chamfer edges — top */}
            <mesh position={[0, 0.91, 0]}>
                <boxGeometry args={[1.32, 0.02, 0.14]} />
                <meshStandardMaterial color="#B7864A" metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Bottom */}
            <mesh position={[0, -0.91, 0]}>
                <boxGeometry args={[1.32, 0.02, 0.14]} />
                <meshStandardMaterial color="#B7864A" metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Left */}
            <mesh position={[-0.66, 0, 0]}>
                <boxGeometry args={[0.02, 1.82, 0.14]} />
                <meshStandardMaterial color="#B7864A" metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Right */}
            <mesh position={[0.66, 0, 0]}>
                <boxGeometry args={[0.02, 1.82, 0.14]} />
                <meshStandardMaterial color="#B7864A" metalness={0.85} roughness={0.2} />
            </mesh>

            {/* Inner product portal glow */}
            <mesh position={[0, 0, 0.065]}>
                <planeGeometry args={[1.0, 1.4]} />
                <meshBasicMaterial color="#0A0A0A" transparent opacity={0.9} />
            </mesh>
        </group>
    );
}

/* ── Orbiting Marble Fragments ── */
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
                        map={texture || undefined}
                        roughnessMap={roughnessMap || undefined}
                        color="#0f0f0f"
                        metalness={0.05}
                        roughness={0.55}
                        clearcoat={0.15}
                    />
                </mesh>
            ))}
        </group>
    );
}

/* ── Metallic Pedestal ── */
function Pedestal() {
    return (
        <mesh position={[0, -1.15, 0]} receiveShadow>
            <cylinderGeometry args={[0.9, 1.0, 0.06, 64]} />
            <meshStandardMaterial color="#1A1816" metalness={0.7} roughness={0.3} />
        </mesh>
    );
}

/* ── Studio Lighting Setup ── */
function StudioLights() {
    return (
        <>
            {/* Warm key light from above-right */}
            <directionalLight
                position={[3, 4, 2]}
                intensity={1.2}
                color="#F5E6D0"
                castShadow
                shadow-mapSize={[1024, 1024]}
            />
            {/* Champagne rim light from behind */}
            <pointLight position={[0, 2, -3]} intensity={0.8} color="#B7864A" />
            {/* Soft fill from left */}
            <pointLight position={[-3, 1, 1]} intensity={0.4} color="#E8DDD0" />
            {/* Ambient base */}
            <ambientLight intensity={0.15} color="#F8F6F2" />
            {/* Volumetric glow behind monolith */}
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
function SceneContent({ scrollProgressRef, onLoaded }: {
    scrollProgressRef: React.RefObject<number>;
    onLoaded: () => void;
}) {
    const { scene } = useThree();

    // Signal loaded after first frame
    useFrame(() => {
        onLoaded();
    });

    return (
        <>
            <StudioLights />
            <Monolith />
            <OrbitingRocks />
            <Pedestal />
            <ContactShadows
                position={[0, -1.12, 0]}
                opacity={0.35}
                scale={6}
                blur={2.5}
                far={3}
                color="#0C0A08"
            />
            <Environment preset="studio" environmentIntensity={0.15} />
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
                <SceneContent scrollProgressRef={scrollProgressRef} onLoaded={onLoaded} />
            </Suspense>
        </Canvas>
    );
}
