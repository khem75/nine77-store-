'use client';

import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, MeshDistortMaterial, Torus, Sphere } from '@react-three/drei';
import * as THREE from 'three';

/* ── Animated product 3D object ─────────────────────────── */
function ProductObject() {
    const groupRef = useRef<THREE.Group>(null!);
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame(({ clock, pointer }) => {
        const t = clock.getElapsedTime();
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            pointer.x * 0.8 + t * 0.2,
            0.05
        );
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x,
            -pointer.y * 0.4,
            0.05
        );
        meshRef.current.rotation.z = Math.sin(t * 0.5) * 0.08;
    });

    return (
        <group ref={groupRef}>
            {/* Main body — luxury garment silhouette */}
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
                <mesh ref={meshRef} position={[0, 0, 0]}>
                    <boxGeometry args={[1.4, 1.8, 0.12, 8, 8, 4]} />
                    <MeshDistortMaterial
                        color="#1C1C1C"
                        metalness={0.3}
                        roughness={0.7}
                        distort={0.08}
                        speed={1}
                        envMapIntensity={1}
                    />
                </mesh>
            </Float>

            {/* Gold NINE77 logo badge */}
            <Float speed={1.5} floatIntensity={0.2}>
                <mesh position={[0, 0.1, 0.085]}>
                    <planeGeometry args={[0.7, 0.18]} />
                    <meshStandardMaterial
                        color="#D4AF37"
                        metalness={0.98}
                        roughness={0.02}
                        emissive="#F0CB5A"
                        emissiveIntensity={0.2}
                        envMapIntensity={3}
                    />
                </mesh>
            </Float>

            {/* Collar detail */}
            <mesh position={[0, 0.88, 0.07]}>
                <torusGeometry args={[0.35, 0.06, 8, 32, Math.PI]} />
                <meshStandardMaterial
                    color="#D4AF37"
                    metalness={0.95}
                    roughness={0.05}
                    emissive="#8B6914"
                    emissiveIntensity={0.3}
                />
            </mesh>

            {/* Shoulder patches (left and right) */}
            <mesh position={[-0.62, 0.6, 0.07]}>
                <boxGeometry args={[0.15, 0.35, 0.04]} />
                <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} emissive="#D4AF37" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0.62, 0.6, 0.07]}>
                <boxGeometry args={[0.15, 0.35, 0.04]} />
                <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} emissive="#D4AF37" emissiveIntensity={0.2} />
            </mesh>

            {/* Orbiting particle ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.6, 0.004, 8, 120]} />
                <meshStandardMaterial
                    color="#D4AF37"
                    emissive="#F0CB5A"
                    emissiveIntensity={1.5}
                    transparent
                    opacity={0.6}
                />
            </mesh>
        </group>
    );
}

/* ── Ambient effect particles ───────────────────────────── */
function SceneParticles() {
    const mesh = useRef<THREE.Points>(null!);

    const geometry = useMemo(() => {
        const positions = new Float32Array(60 * 3);
        for (let i = 0; i < 60; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 6;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 2;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return geo;
    }, []);

    useFrame(({ clock }) => {
        mesh.current.rotation.y = clock.getElapsedTime() * 0.05;
    });

    return (
        <points ref={mesh} geometry={geometry}>
            <pointsMaterial color="#D4AF37" size={0.02} transparent opacity={0.5} depthWrite={false} sizeAttenuation />
        </points>
    );
}

export function ProductShowcaseScene() {
    return (
        <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 4], fov: 45 }}
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.3,
            }}
            style={{ width: '100%', height: '100%' }}
        >
            <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <pointLight position={[3, 3, 3]} intensity={4} color="#FFFFFF" distance={10} />
                <pointLight position={[-3, -2, 2]} intensity={3} color="#D4AF37" distance={8} />
                <spotLight position={[0, 6, 3]} intensity={5} angle={0.4} penumbra={0.9} color="#FFFFFF" />
                <Environment preset="studio" />
                <SceneParticles />
                <ProductObject />
            </Suspense>
        </Canvas>
    );
}
