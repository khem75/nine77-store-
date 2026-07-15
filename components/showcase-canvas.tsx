'use client';

import { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Stylized 3D luxury folded streetwear piece (parametric CGI mockup)
function GarmentMesh() {
    const meshRef = useRef<THREE.Group>(null!);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();
        
        // Soft idle hover float and slow rotation
        meshRef.current.position.y = Math.sin(t * 0.5) * 0.04;
        meshRef.current.rotation.y = t * 0.12;
        meshRef.current.rotation.z = Math.cos(t * 0.3) * 0.02;

        // Spring scale on hover
        const targetScale = hovered ? 1.08 : 1.0;
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
    });

    // Assemble the geometry to represent a premium folded streetwear piece
    const components = useMemo(() => {
        return {
            torso: new THREE.BoxGeometry(1.2, 1.4, 0.28),
            sleeveL: new THREE.CylinderGeometry(0.18, 0.18, 0.55, 16),
            sleeveR: new THREE.CylinderGeometry(0.18, 0.18, 0.55, 16),
            cuffL: new THREE.TorusGeometry(0.19, 0.02, 8, 16),
            cuffR: new THREE.TorusGeometry(0.19, 0.02, 8, 16),
        };
    }, []);

    return (
        <group
            ref={meshRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Main torso body */}
            <mesh geometry={components.torso} castShadow receiveShadow>
                <meshPhysicalMaterial
                    color="#080808"
                    roughness={0.9}
                    metalness={0.06}
                    sheen={1.0}
                    sheenColor="#b58d3d"
                    sheenRoughness={0.8}
                    clearcoat={0.12}
                    clearcoatRoughness={0.4}
                />
            </mesh>

            {/* Left sleeve folds */}
            <mesh
                geometry={components.sleeveL}
                position={[-0.68, 0.2, 0.06]}
                rotation={[0, 0, 0.55]}
                castShadow
            >
                <meshPhysicalMaterial
                    color="#060606"
                    roughness={0.92}
                    metalness={0.05}
                    sheen={1.0 as any}
                    sheenColor="#b58d3d"
                    sheenRoughness={0.8}
                />
            </mesh>

            {/* Right sleeve folds */}
            <mesh
                geometry={components.sleeveR}
                position={[0.68, 0.2, 0.06]}
                rotation={[0, 0, -0.55]}
                castShadow
            >
                <meshPhysicalMaterial
                    color="#060606"
                    roughness={0.92}
                    metalness={0.05}
                    sheen={1.0 as any}
                    sheenColor="#b58d3d"
                    sheenRoughness={0.8}
                />
            </mesh>

            {/* Cuffs detail */}
            <mesh
                geometry={components.cuffL}
                position={[-0.82, -0.05, 0.08]}
                rotation={[Math.PI / 2, 0, 0.55]}
                castShadow
            >
                <meshPhysicalMaterial color="#b58d3d" metalness={0.92} roughness={0.24} />
            </mesh>

            <mesh
                geometry={components.cuffR}
                position={[0.82, -0.05, 0.08]}
                rotation={[Math.PI / 2, 0, -0.55]}
                castShadow
            >
                <meshPhysicalMaterial color="#b58d3d" metalness={0.92} roughness={0.24} />
            </mesh>
        </group>
    );
}

export default function ShowcaseCanvas() {
    return (
        <Canvas
            dpr={[1, 1.5]}
            shadows
            camera={{ position: [0, 0, 3.2], fov: 36 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        >
            <Suspense fallback={null}>
                <ambientLight intensity={0.12} color="#ffffff" />
                <spotLight
                    position={[2, 3.5, 3]}
                    angle={0.4}
                    penumbra={1}
                    intensity={3.5}
                    color="#f8ecd2"
                    castShadow
                />
                <spotLight
                    position={[-3, 1.8, 2.5]}
                    angle={0.5}
                    penumbra={0.9}
                    intensity={2.0}
                    color="#c2d5ff"
                />
                
                <GarmentMesh />
                
                <ContactShadows
                    position={[0, -0.92, 0]}
                    opacity={0.34}
                    scale={2.6}
                    blur={1.8}
                    far={1.8}
                    color="#000000"
                />
                
                <Environment preset="studio" environmentIntensity={0.2} />
                
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 2.8}
                    maxPolarAngle={Math.PI / 1.6}
                />
            </Suspense>
        </Canvas>
    );
}
