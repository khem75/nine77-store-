'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Environment, Torus, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ── Floating particles field ───────────────────────────── */
function Particles({ count = 150 }: { count?: number }) {
    const mesh = useRef<THREE.Points>(null!);

    const { geometry, phases } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const phases: number[] = [];
        for (let i = 0; i < count; i++) {
            pos[i * 3 + 0] = (Math.random() - 0.5) * 18;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 4;
            phases.push(Math.random() * Math.PI * 2);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        return { geometry: geo, phases };
    }, [count]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        const arr = mesh.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < count; i++) {
            arr[i * 3 + 1] += Math.sin(t * 0.3 + phases[i]) * 0.003;
            arr[i * 3 + 0] += Math.cos(t * 0.2 + phases[i]) * 0.002;
        }
        mesh.current.geometry.attributes.position.needsUpdate = true;
        mesh.current.rotation.y = t * 0.02;
    });

    return (
        <points ref={mesh} geometry={geometry}>
            <pointsMaterial
                color="#D4AF37"
                size={0.025}
                sizeAttenuation
                transparent
                opacity={0.65}
                depthWrite={false}
            />
        </points>
    );
}

/* ── Spinning torus rings ───────────────────────────────── */
function TorusRings() {
    const ring1 = useRef<THREE.Mesh>(null!);
    const ring2 = useRef<THREE.Mesh>(null!);
    const ring3 = useRef<THREE.Mesh>(null!);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        ring1.current.rotation.x = t * 0.15;
        ring1.current.rotation.y = t * 0.08;
        ring2.current.rotation.z = t * 0.12;
        ring2.current.rotation.x = -t * 0.06;
        ring3.current.rotation.y = -t * 0.1;
        ring3.current.rotation.z = t * 0.18;
    });

    return (
        <>
            <mesh ref={ring1} position={[0, 0, -3]}>
                <torusGeometry args={[2.8, 0.006, 16, 180]} />
                <meshStandardMaterial
                    color="#D4AF37"
                    emissive="#B8860B"
                    emissiveIntensity={0.6}
                    transparent
                    opacity={0.5}
                    metalness={1}
                    roughness={0}
                />
            </mesh>
            <mesh ref={ring2} position={[0, 0, -3]} rotation={[Math.PI / 4, 0, 0]}>
                <torusGeometry args={[3.5, 0.004, 16, 180]} />
                <meshStandardMaterial
                    color="#F0CB5A"
                    emissive="#D4AF37"
                    emissiveIntensity={0.4}
                    transparent
                    opacity={0.3}
                    metalness={1}
                    roughness={0}
                />
            </mesh>
            <mesh ref={ring3} position={[0, 0, -3]} rotation={[0, Math.PI / 3, Math.PI / 6]}>
                <torusGeometry args={[4.2, 0.003, 16, 180]} />
                <meshStandardMaterial
                    color="#D4AF37"
                    emissive="#8B6914"
                    emissiveIntensity={0.3}
                    transparent
                    opacity={0.2}
                    metalness={1}
                    roughness={0}
                />
            </mesh>
        </>
    );
}

/* ── Central glowing sphere ─────────────────────────────── */
function CentralSphere() {
    const mesh = useRef<THREE.Mesh>(null!);

    useFrame(({ clock, pointer }) => {
        const t = clock.getElapsedTime();
        mesh.current.rotation.y = t * 0.2;
        mesh.current.rotation.x = THREE.MathUtils.lerp(
            mesh.current.rotation.x,
            pointer.y * 0.3,
            0.05
        );
        mesh.current.rotation.z = THREE.MathUtils.lerp(
            mesh.current.rotation.z,
            pointer.x * -0.2,
            0.05
        );
    });

    return (
        <Float speed={2} rotationIntensity={0} floatIntensity={0.3}>
            <mesh ref={mesh} position={[0, 0, -1]}>
                <sphereGeometry args={[0.8, 64, 64]} />
                <MeshDistortMaterial
                    color="#1a1008"
                    emissive="#D4AF37"
                    emissiveIntensity={0.3}
                    metalness={0.95}
                    roughness={0.05}
                    distort={0.25}
                    speed={2}
                    envMapIntensity={3}
                />
            </mesh>
        </Float>
    );
}

/* ── Orbiting gold orbs ─────────────────────────────────── */
function OrbitingOrbs() {
    const group = useRef<THREE.Group>(null!);

    useFrame(({ clock }) => {
        group.current.rotation.y = clock.getElapsedTime() * 0.18;
    });

    const orbData = [
        { radius: 1.8, angle: 0, size: 0.06, speed: 1.0 },
        { radius: 1.8, angle: Math.PI * 0.66, size: 0.04, speed: 1.3 },
        { radius: 1.8, angle: Math.PI * 1.33, size: 0.05, speed: 0.8 },
        { radius: 2.4, angle: Math.PI * 0.33, size: 0.035, speed: 1.5 },
        { radius: 2.4, angle: Math.PI * 1.1, size: 0.04, speed: 0.9 },
    ];

    return (
        <group ref={group}>
            {orbData.map((orb, i) => (
                <Float key={i} speed={orb.speed} floatIntensity={0.4}>
                    <mesh
                        position={[
                            Math.cos(orb.angle) * orb.radius,
                            Math.sin(orb.angle * 0.5) * 0.4,
                            Math.sin(orb.angle) * orb.radius * 0.5 - 1,
                        ]}
                    >
                        <sphereGeometry args={[orb.size, 16, 16]} />
                        <meshStandardMaterial
                            color="#D4AF37"
                            emissive="#F0CB5A"
                            emissiveIntensity={2}
                            metalness={1}
                            roughness={0}
                        />
                    </mesh>
                </Float>
            ))}
        </group>
    );
}

/* ── Exported canvas component ──────────────────────────── */
export function HeroScene() {
    return (
        <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 6], fov: 55 }}
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.4,
            }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
            <Suspense fallback={null}>
                <ambientLight intensity={0.4} />
                <pointLight position={[0, 0, 4]} intensity={3} color="#D4AF37" distance={10} />
                <pointLight position={[-4, 3, 2]} intensity={2} color="#FFFFFF" distance={10} />
                <pointLight position={[4, -3, 2]} intensity={2} color="#F0CB5A" distance={10} />
                <spotLight
                    position={[0, 8, 4]}
                    intensity={5}
                    angle={0.4}
                    penumbra={0.9}
                    color="#FFFFFF"
                />

                <Environment preset="studio" />

                <Stars
                    radius={80}
                    depth={60}
                    count={600}
                    factor={2}
                    saturation={0}
                    fade
                    speed={0.2}
                />

                <Particles count={120} />
                <TorusRings />
                <CentralSphere />
                <OrbitingOrbs />
            </Suspense>
        </Canvas>
    );
}
