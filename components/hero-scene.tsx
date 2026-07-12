'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';

function seededRandom(seed: number) {
    const value = Math.sin(seed * 12.9898) * 43758.5453;
    return value - Math.floor(value);
}

function useNeroMarquina() {
    return useMemo(() => {
        const size = 1024;
        const colorCanvas = document.createElement('canvas');
        const roughCanvas = document.createElement('canvas');
        colorCanvas.width = roughCanvas.width = size;
        colorCanvas.height = roughCanvas.height = size;
        const color = colorCanvas.getContext('2d')!;
        const roughness = roughCanvas.getContext('2d')!;

        const base = color.createLinearGradient(0, 0, size, size);
        base.addColorStop(0, '#050505');
        base.addColorStop(0.48, '#171717');
        base.addColorStop(1, '#080808');
        color.fillStyle = base;
        color.fillRect(0, 0, size, size);
        roughness.fillStyle = '#8a8a8a';
        roughness.fillRect(0, 0, size, size);

        const vein = (index: number, primary = false) => {
            const startX = seededRandom(index + 1) * size;
            const endX = seededRandom(index + 31) * size;
            color.beginPath();
            roughness.beginPath();
            color.moveTo(startX, -20);
            roughness.moveTo(startX, -20);
            for (let step = 1; step <= 22; step++) {
                const t = step / 22;
                const x = startX + (endX - startX) * t + (seededRandom(index * 41 + step) - 0.5) * (primary ? 95 : 55);
                const y = t * (size + 40);
                color.lineTo(x, y);
                roughness.lineTo(x, y);
            }
            color.strokeStyle = `rgba(223, 221, 211, ${primary ? 0.21 : 0.045 + seededRandom(index) * 0.055})`;
            color.lineWidth = primary ? 1.5 : 0.35 + seededRandom(index + 3) * 0.9;
            color.stroke();
            roughness.strokeStyle = primary ? '#565656' : '#777777';
            roughness.lineWidth = primary ? 2.2 : 0.7;
            roughness.stroke();
        };
        for (let i = 0; i < 42; i++) vein(i);
        vein(70, true); vein(83, true); vein(91, true);

        const texture = new THREE.CanvasTexture(colorCanvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;
        const roughnessMap = new THREE.CanvasTexture(roughCanvas);
        return { texture, roughnessMap };
    }, []);
}

function Monolith() {
    const { texture, roughnessMap } = useNeroMarquina();
    const { slab, goldBack } = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(-0.75, -0.8); shape.lineTo(0.75, -0.8); shape.lineTo(0.75, 0.34); shape.lineTo(0.33, 0.8); shape.lineTo(-0.75, 0.8); shape.closePath();
        const make = (depth: number, bevel: number) => {
            const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.85, bevelSegments: 5, curveSegments: 6 });
            geometry.center();
            return geometry;
        };
        return { slab: make(0.07, 0.022), goldBack: make(0.092, 0.027) };
    }, []);

    return <group>
        <mesh geometry={goldBack} position={[0, 0, -0.012]} castShadow>
            <meshPhysicalMaterial color="#b8802d" metalness={0.96} roughness={0.27} clearcoat={0.25} clearcoatRoughness={0.34} reflectivity={0.9} />
        </mesh>
        <mesh geometry={slab} castShadow receiveShadow>
            <meshPhysicalMaterial map={texture} roughnessMap={roughnessMap} color="#101010" metalness={0.08} roughness={0.52} clearcoat={0.18} clearcoatRoughness={0.48} reflectivity={0.38} />
        </mesh>
        <Text position={[0, 0.27, 0.061]} fontSize={0.33} letterSpacing={0.14} anchorX="center" anchorY="middle" fontWeight="900">
            NINE
            <meshPhysicalMaterial color="#e4b354" metalness={0.96} roughness={0.25} clearcoat={0.32} clearcoatRoughness={0.28} />
        </Text>
        <Text position={[0, -0.28, 0.061]} fontSize={0.56} letterSpacing={0.07} anchorX="center" anchorY="middle" fontWeight="900">
            77
            <meshPhysicalMaterial color="#e4b354" metalness={0.96} roughness={0.25} clearcoat={0.32} clearcoatRoughness={0.28} />
        </Text>
    </group>;
}

function Presenter() {
    const group = useRef<THREE.Group>(null!);
    useFrame(({ clock, pointer }) => {
        const t = clock.getElapsedTime();
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0.32 + pointer.x * 0.025 + Math.sin(t * 0.16) * 0.018, 0.025);
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0.025 - pointer.y * 0.012, 0.025);
        group.current.position.y = -0.02 + Math.sin(t * 0.42) * 0.018;
    });
    return <group ref={group}><Monolith /></group>;
}

function MuseumHalo() {
    const halo = useRef<THREE.Mesh>(null!);
    useFrame(({ clock }) => {
        const material = halo.current.material as THREE.MeshPhysicalMaterial;
        material.opacity = 0.11 + Math.sin(clock.getElapsedTime() * 0.36) * 0.012;
    });
    return <mesh ref={halo} position={[0.02, 0.07, -0.48]} rotation={[0, 0, 0.02]}>
        <torusGeometry args={[1.3, 0.006, 10, 128]} />
        <meshPhysicalMaterial color="#c99236" metalness={0.84} roughness={0.34} transparent opacity={0.11} />
    </mesh>;
}

function Dust() {
    const dust = useRef<THREE.Points>(null!);
    const positions = useMemo(() => {
        const points = new Float32Array(72 * 3);
        for (let i = 0; i < 72; i++) {
            points[i * 3] = (seededRandom(i) - 0.5) * 4.2;
            points[i * 3 + 1] = (seededRandom(i + 70) - 0.5) * 3.2;
            points[i * 3 + 2] = seededRandom(i + 140) * 1.5 - 0.4;
        }
        return points;
    }, []);
    useFrame(({ clock }) => { dust.current.rotation.y = clock.getElapsedTime() * 0.008; });
    return <points ref={dust}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color="#dcccae" size={0.009} sizeAttenuation transparent opacity={0.18} depthWrite={false} /></points>;
}

function CameraDrift() {
    const { camera } = useThree();
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        camera.position.x = Math.sin(t * 0.11) * 0.025;
        camera.position.y = -0.04 + Math.cos(t * 0.13) * 0.018;
        camera.lookAt(0, -0.05, 0);
    });
    return null;
}

function StudioLights() {
    return <>
        <ambientLight intensity={0.15} color="#ffffff" />
        <spotLight position={[-2.8, 3.3, 4]} angle={0.45} penumbra={0.9} intensity={3} color="#ffe3b0" castShadow shadow-mapSize={[1024, 1024]} />
        <spotLight position={[-3.5, 0.8, 2.2]} angle={0.65} penumbra={1} intensity={1} color="#c5d7ff" />
        <spotLight position={[3.2, 2.4, -1.8]} angle={0.55} penumbra={0.85} intensity={2} color="#e8ac52" />
    </>;
}

export default function HeroScene() {
    return <Canvas dpr={[1, 1.65]} shadows camera={{ position: [0, -0.04, 4.1], fov: 34 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 0.9; gl.outputColorSpace = THREE.SRGBColorSpace; }} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <Suspense fallback={null}>
            <CameraDrift />
            <Environment preset="studio" environmentIntensity={0.25} />
            <StudioLights />
            <MuseumHalo />
            <Presenter />
            <Dust />
            <ContactShadows position={[0, -1.15, 0]} opacity={0.32} scale={4.3} blur={2.4} far={2.4} color="#000000" />
            <mesh position={[0, -2.02, 0]} receiveShadow><sphereGeometry args={[1.48, 64, 48]} /><meshPhysicalMaterial color="#080808" metalness={0.42} roughness={0.3} clearcoat={0.42} clearcoatRoughness={0.34} reflectivity={0.6} /></mesh>
        </Suspense>
    </Canvas>;
}
