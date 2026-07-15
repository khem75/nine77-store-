'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';

// Deterministic seed randomizer
function seededRandom(seed: number) {
    const value = Math.sin(seed * 12.9898) * 43758.5453;
    return value - Math.floor(value);
}

// Procedural Nero Marquina Marble Texture Generator
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

        // Base dark marble tone
        const base = color.createLinearGradient(0, 0, size, size);
        base.addColorStop(0, '#060606');
        base.addColorStop(0.5, '#121212');
        base.addColorStop(1, '#080808');
        color.fillStyle = base;
        color.fillRect(0, 0, size, size);

        roughness.fillStyle = '#6a6a6a';
        roughness.fillRect(0, 0, size, size);

        // Procedural fine mineral veins (marble signature look)
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
            color.strokeStyle = `rgba(223, 212, 185, ${primary ? 0.22 : 0.04 + seededRandom(index) * 0.05})`;
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

// 3D Shards (Fragments of the monolith that break and disperse on scroll)
function MonolithShards({ scrollProgressRef }: { scrollProgressRef: React.RefObject<number> }) {
    const { texture, roughnessMap } = useNeroMarquina();
    const shardsRef = useRef<THREE.Group>(null!);

    // Definition of 8 fractured shards to form the solid monolith
    const shardData = useMemo(() => {
        return [
            // Left-Top
            { size: [0.75, 0.8, 0.07], pos: [-0.375, 0.4, 0], dir: [-0.65, 0.45, 0.35], rot: [0.8, -0.4, 0.6] },
            // Right-Top
            { size: [0.75, 0.8, 0.07], pos: [0.375, 0.4, 0], dir: [0.75, 0.35, 0.45], rot: [-0.6, 0.8, -0.4] },
            // Left-Middle
            { size: [0.75, 0.8, 0.07], pos: [-0.375, -0.4, 0], dir: [-0.85, -0.25, 0.25], rot: [-0.4, 0.5, 0.8] },
            // Right-Middle
            { size: [0.75, 0.8, 0.07], pos: [0.375, -0.4, 0], dir: [0.95, -0.35, 0.3], rot: [0.5, -0.7, -0.5] },
            // Bottom-Left
            { size: [0.75, 0.6, 0.07], pos: [-0.375, -1.0, 0], dir: [-0.55, -0.85, 0.4], rot: [0.7, 0.3, 0.9] },
            // Bottom-Right
            { size: [0.75, 0.6, 0.07], pos: [0.375, -1.0, 0], dir: [0.65, -0.75, 0.5], rot: [-0.9, -0.5, 0.4] },
        ];
    }, []);

    useFrame((state) => {
        if (!shardsRef.current) return;
        const progress = scrollProgressRef.current ?? 0;
        const t = state.clock.getElapsedTime();

        // 1. Entrance rise (progress 0.0 to 0.15)
        const riseFactor = Math.min(1, progress / 0.15);
        const yPos = THREE.MathUtils.lerp(-2.8, -0.2, riseFactor);

        // 2. Monolith fracture dispersal (progress 0.15 to 0.55)
        const fractureFactor = Math.max(0, Math.min(1, (progress - 0.15) / 0.4));

        // 3. Shards dissolution / fade out (progress 0.45 to 0.6)
        const dissolveFactor = Math.max(0, Math.min(1, (progress - 0.45) / 0.15));
        const opacity = 1 - dissolveFactor;

        shardsRef.current.position.y = yPos + Math.sin(t * 0.4) * 0.02; // soft float idle

        // Apply translation and rotation to each individual fragment
        shardsRef.current.children.forEach((child, index) => {
            const data = shardData[index];
            if (!data || !child) return;

            // Target separation position
            const targetX = data.pos[0] + data.dir[0] * fractureFactor * 1.8;
            const targetY = data.pos[1] + data.dir[1] * fractureFactor * 1.8;
            const targetZ = data.pos[2] + data.dir[2] * fractureFactor * 1.8;

            child.position.x = THREE.MathUtils.lerp(data.pos[0], targetX, fractureFactor);
            child.position.y = THREE.MathUtils.lerp(data.pos[1], targetY, fractureFactor);
            child.position.z = THREE.MathUtils.lerp(data.pos[2], targetZ, fractureFactor);

            child.rotation.x = data.rot[0] * fractureFactor * 1.2;
            child.rotation.y = data.rot[1] * fractureFactor * 1.2;
            child.rotation.z = data.rot[2] * fractureFactor * 0.8;

            // Apply opacity
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
                const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                materials.forEach((mat) => {
                    const physicalMat = mat as THREE.MeshPhysicalMaterial;
                    physicalMat.opacity = opacity;
                    physicalMat.transparent = opacity < 1;
                });
            }
        });
    });

    return (
        <group ref={shardsRef} position={[0, -0.2, 0]}>
            {shardData.map((shard, idx) => (
                <mesh key={idx} position={shard.pos as any} castShadow receiveShadow>
                    <boxGeometry args={shard.size as any} />
                    <meshPhysicalMaterial
                        map={texture || undefined}
                        roughnessMap={roughnessMap || undefined}
                        color="#0f0f0f"
                        metalness={0.08}
                        roughness={0.56}
                        clearcoat={0.16}
                        clearcoatRoughness={0.4}
                        reflectivity={0.32}
                    />
                </mesh>
            ))}
        </group>
    );
}

// Swirling Fabric Ribbons (parametric tubes swirling tightly to assemble the product)
function SwirlingFabric({ scrollProgressRef }: { scrollProgressRef: React.RefObject<number> }) {
    const groupRef = useRef<THREE.Group>(null!);

    const curves = useMemo(() => {
        const spiral1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-1.8, 1.2, -1.0),
            new THREE.Vector3(-0.6, 0.4, 0.8),
            new THREE.Vector3(0.5, -0.2, 0.4),
            new THREE.Vector3(0.2, -0.8, -0.6),
            new THREE.Vector3(-0.1, -1.2, 0.1),
        ]);
        const spiral2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(1.8, 1.0, 1.0),
            new THREE.Vector3(0.7, 0.3, -0.8),
            new THREE.Vector3(-0.4, -0.3, -0.4),
            new THREE.Vector3(-0.3, -0.9, 0.6),
            new THREE.Vector3(0.1, -1.3, -0.1),
        ]);
        return [spiral1, spiral2];
    }, []);

    useFrame((state) => {
        if (!groupRef.current) return;
        const progress = scrollProgressRef.current ?? 0;
        const t = state.clock.getElapsedTime();

        // Active range: progress 0.4 to 0.8
        const activeFactor = Math.max(0, Math.min(1, (progress - 0.4) / 0.3));
        const fadeOutFactor = Math.max(0, Math.min(1, (progress - 0.7) / 0.1));
        const opacity = activeFactor * (1 - fadeOutFactor);

        groupRef.current.rotation.y = t * 0.36 + progress * 2.8;

        // Shrink radius as it spirals in to build the hoodie
        const scale = 1.0 - activeFactor * 0.45;
        groupRef.current.scale.setScalar(scale);

        groupRef.current.children.forEach((child) => {
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
                const mat = mesh.material as THREE.MeshPhysicalMaterial;
                mat.opacity = opacity;
                mat.transparent = opacity < 1;
            }
        });
    });

    return (
        <group ref={groupRef}>
            {curves.map((curve, idx) => (
                <mesh key={idx} castShadow>
                    <tubeGeometry args={[curve, 64, 0.024, 8, false]} />
                    <meshPhysicalMaterial
                        color="#111111"
                        roughness={0.92}
                        metalness={0.05}
                        sheen={1.0}
                        sheenColor="#b58d3d"
                        sheenRoughness={0.8}
                    />
                </mesh>
            ))}
        </group>
    );
}

// Procedural 3D Streetwear Hoodie Mesh
function HoodieMesh({ scrollProgressRef }: { scrollProgressRef: React.RefObject<number> }) {
    const hoodieGroup = useRef<THREE.Group>(null!);

    useFrame((state) => {
        if (!hoodieGroup.current) return;
        const progress = scrollProgressRef.current ?? 0;
        const t = state.clock.getElapsedTime();

        // 1. Fade in & scale up (progress 0.55 to 0.78)
        const scaleFactor = Math.max(0, Math.min(1, (progress - 0.55) / 0.18));
        const size = scaleFactor * 1.15;
        hoodieGroup.current.scale.set(size, size, size);

        // 2. Slow elegant rotation (idle orbit)
        hoodieGroup.current.rotation.y = t * 0.15 + (progress * 1.5);
        hoodieGroup.current.rotation.x = Math.sin(t * 0.35) * 0.04;

        // 3. Zoom / Fade Out transitions (progress 0.82 to 1.0)
        const zoomOutFactor = Math.max(0, Math.min(1, (progress - 0.82) / 0.16));
        const opacity = scaleFactor * (1 - zoomOutFactor);

        hoodieGroup.current.children.forEach((child) => {
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
                const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                materials.forEach((mat) => {
                    const physicalMat = mat as THREE.MeshPhysicalMaterial;
                    physicalMat.opacity = opacity;
                    physicalMat.transparent = opacity < 1;
                });
            }
        });
    });

    return (
        <group ref={hoodieGroup} position={[0, -0.1, 0]}>
            {/* Torso (oversized draping posture) */}
            <mesh castShadow receiveShadow position={[0, -0.2, 0]}>
                <cylinderGeometry args={[0.42, 0.48, 0.72, 32]} />
                <meshPhysicalMaterial
                    color="#080808"
                    roughness={0.92}
                    metalness={0.05}
                    sheen={1.0}
                    sheenColor="#b58d3d"
                    sheenRoughness={0.8}
                />
            </mesh>

            {/* Left Arm sleeve */}
            <mesh castShadow receiveShadow position={[-0.55, -0.1, 0]} rotation={[0, 0, 0.4]}>
                <cylinderGeometry args={[0.13, 0.1, 0.65, 16]} />
                <meshPhysicalMaterial
                    color="#080808"
                    roughness={0.92}
                    metalness={0.05}
                    sheen={1.0}
                    sheenColor="#b58d3d"
                    sheenRoughness={0.8}
                />
            </mesh>

            {/* Right Arm sleeve */}
            <mesh castShadow receiveShadow position={[0.55, -0.1, 0]} rotation={[0, 0, -0.4]}>
                <cylinderGeometry args={[0.13, 0.1, 0.65, 16]} />
                <meshPhysicalMaterial
                    color="#080808"
                    roughness={0.92}
                    metalness={0.05}
                    sheen={1.0}
                    sheenColor="#b58d3d"
                    sheenRoughness={0.8}
                />
            </mesh>

            {/* Hood cowl */}
            <mesh castShadow receiveShadow position={[0, 0.28, 0.05]} rotation={[0.2, 0, 0]}>
                <sphereGeometry args={[0.28, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
                <meshPhysicalMaterial
                    color="#060606"
                    roughness={0.95}
                    metalness={0.05}
                    sheen={1.0}
                    sheenColor="#b58d3d"
                    sheenRoughness={0.8}
                />
            </mesh>
        </group>
    );
}

// Subtle Floating Dust Particles (reacts slightly to scroll progress)
function DustParticles({ scrollProgressRef }: { scrollProgressRef: React.RefObject<number> }) {
    const pointsRef = useRef<THREE.Points>(null!);

    const count = 90;
    const positions = useMemo(() => {
        const pts = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pts[i * 3] = (seededRandom(i) - 0.5) * 4.5;
            pts[i * 3 + 1] = (seededRandom(i + 90) - 0.5) * 3.5;
            pts[i * 3 + 2] = seededRandom(i + 180) * 2.0 - 0.5;
        }
        return pts;
    }, []);

    useFrame((state) => {
        if (!pointsRef.current) return;
        const progress = scrollProgressRef.current ?? 0;
        const t = state.clock.getElapsedTime();
        pointsRef.current.rotation.y = t * 0.006 + progress * 0.15;
        pointsRef.current.rotation.x = Math.sin(t * 0.1) * 0.02;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#bfa36c"
                size={0.008}
                sizeAttenuation
                transparent
                opacity={0.16}
                depthWrite={false}
            />
        </points>
    );
}

// Camera Motion & Inertia Dolly
function CameraDolly({ scrollProgressRef }: { scrollProgressRef: React.RefObject<number> }) {
    const { camera } = useThree();

    useFrame((state) => {
        const progress = scrollProgressRef.current ?? 0;
        const t = state.clock.getElapsedTime();

        // Base orbiting drift
        const targetX = Math.sin(t * 0.08) * 0.06 + state.pointer.x * 0.08;
        const targetY = -0.06 + Math.cos(t * 0.09) * 0.04 + state.pointer.y * 0.04;

        // Dolly zoom parameters: starts at Z=4.2, zooms close to fabric weave at Z=1.12 on full scroll progress
        const targetZ = THREE.MathUtils.lerp(4.2, 1.12, progress);

        camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.035);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.035);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.04);

        camera.lookAt(0, -0.15, 0);
    });

    return null;
}

// Volumetric Cinematic Spotlights
function SpotlightStudio() {
    return (
        <>
            <ambientLight intensity={0.08} color="#ffffff" />
            
            {/* Volumetric Top Spotlight */}
            <spotLight
                position={[0, 4.2, 0.8]}
                angle={0.45}
                penumbra={1}
                intensity={4.5}
                color="#f7ebd5"
                castShadow
                shadow-mapSize={[1024, 1024]}
            />

            {/* Back light to create rim/sheen reflections */}
            <spotLight
                position={[-2.8, 1.8, -2.5]}
                angle={0.6}
                penumbra={0.9}
                intensity={3.0}
                color="#c4d5ff"
            />

            {/* Accent gold light */}
            <spotLight
                position={[3.0, 1.2, 2.5]}
                angle={0.5}
                penumbra={0.8}
                intensity={3.5}
                color="#b58d3d"
            />
        </>
    );
}

interface HeroSceneProps {
    scrollProgressRef: React.RefObject<number>;
    onLoaded?: () => void;
}

export default function HeroScene({ scrollProgressRef, onLoaded }: HeroSceneProps) {
    return (
        <Canvas
            dpr={[1, 1.5]}
            shadows
            camera={{ position: [0, -0.06, 4.2], fov: 32 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            onCreated={({ gl }) => {
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 0.95;
                gl.outputColorSpace = THREE.SRGBColorSpace;
                if (onLoaded) onLoaded();
            }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
            <Suspense fallback={null}>
                <CameraDolly scrollProgressRef={scrollProgressRef} />
                <Environment preset="studio" environmentIntensity={0.16} />
                <SpotlightStudio />
                
                {/* 3D Elements controlled by scroll */}
                <MonolithShards scrollProgressRef={scrollProgressRef} />
                <SwirlingFabric scrollProgressRef={scrollProgressRef} />
                <HoodieMesh scrollProgressRef={scrollProgressRef} />
                
                <DustParticles scrollProgressRef={scrollProgressRef} />
                
                <ContactShadows
                    position={[0, -1.02, 0]}
                    opacity={0.34}
                    scale={4.0}
                    blur={2.4}
                    far={2.2}
                    color="#000000"
                />

                {/* Polished reflective studio floor */}
                <mesh position={[0, -1.03, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[12, 12]} />
                    <meshPhysicalMaterial
                        color="#050505"
                        metalness={0.45}
                        roughness={0.28}
                        clearcoat={0.5}
                        clearcoatRoughness={0.3}
                        reflectivity={0.65}
                    />
                </mesh>
            </Suspense>
        </Canvas>
    );
}
