'use client';

import { Suspense, useMemo, useRef, useState, useEffect } from 'react';
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

/* ── Safely Load Textures with Failures & Fallback Logging ── */
function usePortalTextures(urls: string[], fallbackUrl: string) {
    const [textures, setTextures] = useState<THREE.Texture[]>([]);
    const [loadedUrls, setLoadedUrls] = useState<string[]>([]);

    useEffect(() => {
        const loader = new THREE.TextureLoader();
        const loadedList: THREE.Texture[] = [];
        const loadedUrlsList: string[] = [];

        console.log("Portal: Initiating product asset preloading sequence...");

        urls.forEach((url, index) => {
            loader.load(
                url,
                (texture) => {
                    texture.colorSpace = THREE.SRGBColorSpace;
                    texture.minFilter = THREE.LinearFilter;
                    texture.generateMipmaps = false;
                    loadedList[index] = texture;
                    loadedUrlsList[index] = url;
                    console.log(`Portal: [SUCCESS] Preloaded asset: ${url}`);
                    
                    // Filter out empty spots and update texture state
                    setTextures(loadedList.filter(Boolean));
                    setLoadedUrls(loadedUrlsList.filter(Boolean));
                },
                undefined,
                (error) => {
                    console.error(`Portal: [FAIL] Preloading asset: ${url}. Triggering fallback sequence...`, error);
                    
                    // Load the fallback asset
                    loader.load(
                        fallbackUrl,
                        (fallbackTex) => {
                            fallbackTex.colorSpace = THREE.SRGBColorSpace;
                            fallbackTex.minFilter = THREE.LinearFilter;
                            fallbackTex.generateMipmaps = false;
                            loadedList[index] = fallbackTex;
                            loadedUrlsList[index] = `${url} (fallback)`;
                            console.log(`Portal: [FALLBACK SUCCESS] Preloaded fallback asset for ${url}`);
                            
                            setTextures(loadedList.filter(Boolean));
                            setLoadedUrls(loadedUrlsList.filter(Boolean));
                        },
                        undefined,
                        (fallbackError) => {
                            console.error(`Portal: [CRITICAL FAIL] Fallback asset failed to load!`, fallbackError);
                        }
                    );
                }
            );
        });

        // Cleanup function
        return () => {
            loadedList.forEach(t => t.dispose());
        };
    }, [urls, fallbackUrl]);

    return { textures, loadedUrls };
}

/* ── Crossfading Product Portal inside Monolith ── */
function ProductPortal({ urls, fallbackUrl }: { urls: string[]; fallbackUrl: string }) {
    const { textures } = usePortalTextures(urls, fallbackUrl);
    const textureIndexRef = useRef(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(0);
    const fadeProgressRef = useRef(0);
    const isTransitioningRef = useRef(false);

    const baseMaterialRef = useRef<THREE.MeshBasicMaterial>(null!);
    const overlayMaterialRef = useRef<THREE.MeshBasicMaterial>(null!);
    const portalGroupRef = useRef<THREE.Group>(null!);

    // Handle crossfade timer loop
    useEffect(() => {
        if (textures.length <= 1) return;

        const interval = setInterval(() => {
            const nextIdx = (textureIndexRef.current + 1) % textures.length;
            setNextIndex(nextIdx);
            fadeProgressRef.current = 0;
            isTransitioningRef.current = true;
        }, 8000);

        return () => clearInterval(interval);
    }, [textures]);

    // Animate crossfade opacities & float movement
    useFrame((state, delta) => {
        const t = state.clock.getElapsedTime();

        // 1. Float Portal Content slightly inside Monolith depth
        if (portalGroupRef.current) {
            portalGroupRef.current.position.y = Math.sin(t * 0.45) * 0.02;
            portalGroupRef.current.position.z = Math.cos(t * 0.35) * 0.005;
        }

        // 2. Handle crossfade interpolation
        if (isTransitioningRef.current && textures.length > 0) {
            fadeProgressRef.current += delta * 1.25; // complete fade in ~0.8s
            if (fadeProgressRef.current >= 1) {
                fadeProgressRef.current = 1;
                isTransitioningRef.current = false;
                
                // Commit transition
                setCurrentIndex(nextIndex);
                textureIndexRef.current = nextIndex;
                fadeProgressRef.current = 0;
            }
        }

        // Apply opacities to materials
        if (baseMaterialRef.current && overlayMaterialRef.current && textures.length > 0) {
            const currentTex = textures[currentIndex] || textures[0];
            const nextTex = textures[nextIndex] || textures[0];

            baseMaterialRef.current.map = currentTex;
            baseMaterialRef.current.needsUpdate = true;

            if (isTransitioningRef.current) {
                overlayMaterialRef.current.map = nextTex;
                overlayMaterialRef.current.opacity = fadeProgressRef.current;
                overlayMaterialRef.current.visible = true;
                overlayMaterialRef.current.needsUpdate = true;
            } else {
                overlayMaterialRef.current.visible = false;
            }
        }
    });

    if (textures.length === 0) {
        return (
            <mesh position={[0, 0, 0.015]}>
                <planeGeometry args={[0.9, 1.3]} />
                <meshBasicMaterial color="#111111" />
            </mesh>
        );
    }

    return (
        <group ref={portalGroupRef} position={[0, 0, 0.015]}>
            {/* Base Product Layer */}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[0.85, 1.25]} />
                <meshBasicMaterial
                    ref={baseMaterialRef}
                    transparent
                    opacity={1}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Overlap Fade Layer */}
            <mesh position={[0, 0, 0.001]}>
                <planeGeometry args={[0.85, 1.25]} />
                <meshBasicMaterial
                    ref={overlayMaterialRef}
                    transparent
                    opacity={0}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
}

/* ── Main Monolith case containing the Glass Portal ── */
function Monolith() {
    const groupRef = useRef<THREE.Group>(null!);
    const { texture, roughnessMap } = useNeroMarquina();

    const productUrls = useMemo(() => [
        '/luxury-streetwear-garment.png',
        '/products/windcheater-1.jpg',
        '/products/vintage-t-shirt-1.jpg',
        '/products/linen-shirt-1.jpg'
    ], []);
    const fallbackUrl = '/luxury-streetwear-garment.png';

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
            {/* 1. Monolith Marble Backing Plate */}
            <mesh position={[0, 0, -0.04]} castShadow receiveShadow>
                <boxGeometry args={[1.3, 1.8, 0.04]} />
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

            {/* 2. Outer Marble Frame Bars to hold the glass case */}
            {/* Top Frame Bar */}
            <mesh position={[0, 0.825, 0.02]} castShadow receiveShadow>
                <boxGeometry args={[1.3, 0.15, 0.08]} />
                <meshPhysicalMaterial
                    map={texture || undefined}
                    roughnessMap={roughnessMap || undefined}
                    color="#0f0f0f"
                    metalness={0.06}
                    roughness={0.5}
                />
            </mesh>
            {/* Bottom Frame Bar */}
            <mesh position={[0, -0.825, 0.02]} castShadow receiveShadow>
                <boxGeometry args={[1.3, 0.15, 0.08]} />
                <meshPhysicalMaterial
                    map={texture || undefined}
                    roughnessMap={roughnessMap || undefined}
                    color="#0f0f0f"
                    metalness={0.06}
                    roughness={0.5}
                />
            </mesh>
            {/* Left Frame Bar */}
            <mesh position={[-0.575, 0, 0.02]} castShadow receiveShadow>
                <boxGeometry args={[0.15, 1.5, 0.08]} />
                <meshPhysicalMaterial
                    map={texture || undefined}
                    roughnessMap={roughnessMap || undefined}
                    color="#0f0f0f"
                    metalness={0.06}
                    roughness={0.5}
                />
            </mesh>
            {/* Right Frame Bar */}
            <mesh position={[0.575, 0, 0.02]} castShadow receiveShadow>
                <boxGeometry args={[0.15, 1.5, 0.08]} />
                <meshPhysicalMaterial
                    map={texture || undefined}
                    roughnessMap={roughnessMap || undefined}
                    color="#0f0f0f"
                    metalness={0.06}
                    roughness={0.5}
                />
            </mesh>

            {/* 3. Champagne Gold Chamfer Edges */}
            {/* Top Gold Edge */}
            <mesh position={[0, 0.91, 0.065]}>
                <boxGeometry args={[1.32, 0.02, 0.01]} />
                <meshStandardMaterial color="#B7864A" metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Bottom Gold Edge */}
            <mesh position={[0, -0.91, 0.065]}>
                <boxGeometry args={[1.32, 0.02, 0.01]} />
                <meshStandardMaterial color="#B7864A" metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Left Gold Edge */}
            <mesh position={[-0.66, 0, 0.065]}>
                <boxGeometry args={[0.02, 1.82, 0.01]} />
                <meshStandardMaterial color="#B7864A" metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Right Gold Edge */}
            <mesh position={[0.66, 0, 0.065]}>
                <boxGeometry args={[0.02, 1.82, 0.01]} />
                <meshStandardMaterial color="#B7864A" metalness={0.85} roughness={0.2} />
            </mesh>

            {/* 4. Inside: Product Portal displaying dynamic hoodies/shirts */}
            <ProductPortal urls={productUrls} fallbackUrl={fallbackUrl} />

            {/* 5. Inset Glow Backing Plate behind portal */}
            <mesh position={[0, 0, -0.018]}>
                <planeGeometry args={[1.0, 1.5]} />
                <meshBasicMaterial color="#0b0907" />
            </mesh>

            {/* 6. Front Premium Glass Screen case */}
            <mesh position={[0, 0, 0.055]}>
                <planeGeometry args={[1.0, 1.5]} />
                <meshPhysicalMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.35}
                    roughness={0.05}
                    metalness={0.1}
                    transmission={0.95}
                    thickness={0.8}
                    ior={1.5}
                />
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
