import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import * as THREE from 'three'

// ── Glowing node dots scattered on a sphere surface ────────────────
function ControlNodes({ count = 80, radius = 1.6 }) {
    const meshRef = useRef()

    // Generate fibonacci sphere points for even distribution
    const positions = useMemo(() => {
        const pts = []
        const golden = Math.PI * (3 - Math.sqrt(5))
        for (let i = 0; i < count; i++) {
            const y = 1 - (i / (count - 1)) * 2
            const r = Math.sqrt(1 - y * y)
            const theta = golden * i
            pts.push(
                r * Math.cos(theta) * radius,
                y * radius,
                r * Math.sin(theta) * radius
            )
        }
        return new Float32Array(pts)
    }, [count, radius])

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = clock.getElapsedTime() * 0.08
            meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.04) * 0.15
        }
    })

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.04}
                color="#60a5fa"
                sizeAttenuation
                transparent
                opacity={0.9}
            />
        </points>
    )
}

// ── Connection lines between nearby nodes ──────────────────────────
function ConnectionLines({ count = 80, radius = 1.6 }) {
    const ref = useRef()

    const linePositions = useMemo(() => {
        const golden = Math.PI * (3 - Math.sqrt(5))
        const nodes = []
        for (let i = 0; i < count; i++) {
            const y = 1 - (i / (count - 1)) * 2
            const r = Math.sqrt(1 - y * y)
            const theta = golden * i
            nodes.push(new THREE.Vector3(
                r * Math.cos(theta) * radius,
                y * radius,
                r * Math.sin(theta) * radius
            ))
        }

        const lineVerts = []
        const maxDist = 0.75
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (nodes[i].distanceTo(nodes[j]) < maxDist) {
                    lineVerts.push(nodes[i].x, nodes[i].y, nodes[i].z)
                    lineVerts.push(nodes[j].x, nodes[j].y, nodes[j].z)
                }
            }
        }
        return new Float32Array(lineVerts)
    }, [count, radius])

    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.rotation.y = clock.getElapsedTime() * 0.08
            ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.04) * 0.15
        }
    })

    return (
        <lineSegments ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[linePositions, 3]}
                />
            </bufferGeometry>
            <lineBasicMaterial color="#1d4ed8" transparent opacity={0.25} />
        </lineSegments>
    )
}

// ── Orbiting compliance score ring ─────────────────────────────────
function ScoreRing({ score = 0 }) {
    const ringRef = useRef()
    const fillRef = useRef()

    useFrame(({ clock }) => {
        if (ringRef.current) {
            ringRef.current.rotation.z = clock.getElapsedTime() * 0.12
            ringRef.current.rotation.x = 0.3
        }
    })

    const fillAngle = (score / 100) * Math.PI * 2
    const arcShape = useMemo(() => {
        const curve = new THREE.EllipseCurve(0, 0, 2.1, 2.1, 0, fillAngle, false, 0)
        const pts = curve.getPoints(64)
        return pts.flatMap(p => [p.x, p.y, 0])
    }, [fillAngle])

    return (
        <group ref={ringRef}>
            {/* Base ring */}
            <mesh>
                <torusGeometry args={[2.1, 0.015, 8, 120]} />
                <meshBasicMaterial color="#1e3a5f" transparent opacity={0.5} />
            </mesh>
            {/* Fill arc */}
            {score > 0 && (
                <line>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            args={[new Float32Array(arcShape), 3]}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial color="#3b82f6" linewidth={2} />
                </line>
            )}
        </group>
    )
}

// ── Wire-frame glass sphere ─────────────────────────────────────────
function GlassSphere() {
    return (
        <Sphere args={[1.55, 32, 32]}>
            <meshStandardMaterial
                color="#0f172a"
                transparent
                opacity={0.15}
                wireframe={false}
                roughness={0.1}
                metalness={0.6}
            />
        </Sphere>
    )
}

// ── Inner 3D Scene ──────────────────────────────────────────────────
function Scene({ score }) {
    return (
        <>
            <ambientLight intensity={0.3} />
            <pointLight position={[5, 5, 5]} intensity={1.2} color="#3b82f6" />
            <pointLight position={[-5, -3, -5]} intensity={0.6} color="#818cf8" />
            <GlassSphere />
            <ConnectionLines />
            <ControlNodes />
            <ScoreRing score={score} />
            <OrbitControls
                enablePan={false}
                enableZoom={false}
                autoRotate={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={(3 * Math.PI) / 4}
            />
        </>
    )
}

// ── Public component ────────────────────────────────────────────────
export default function ComplianceGlobe({ score = 0, className = '' }) {
    return (
        <div className={`w-full h-full ${className}`}>
            <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center opacity-30">
                    <div className="w-16 h-16 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                </div>
            }>
                <Canvas
                    camera={{ position: [0, 0, 5.5], fov: 42 }}
                    dpr={[1, 2]}
                    gl={{ antialias: true, alpha: true }}
                    style={{ background: 'transparent' }}
                >
                    <Scene score={score} />
                </Canvas>
            </Suspense>
        </div>
    )
}
