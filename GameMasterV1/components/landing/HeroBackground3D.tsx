'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef<THREE.Points>(null);

  const particlesCount = 3000;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    const colorPalette = [
      new THREE.Color('#F277B0'),
      new THREE.Color('#07D9D9'),
      new THREE.Color('#11D9A0'),
      new THREE.Color('#482973'),
    ];

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;

      const radius = Math.random() * 15 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    return [positions, colors];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (ref.current) {
      ref.current.rotation.y = time * 0.05;
      ref.current.rotation.x = Math.sin(time * 0.1) * 0.1;

      const positions = ref.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        positions[i3 + 1] = y + Math.sin(time + x * 0.5) * 0.002;
      }

      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors}>
      <PointMaterial
        transparent
        vertexColors
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function FloatingOrbs() {
  const orb1Ref = useRef<THREE.Mesh>(null);
  const orb2Ref = useRef<THREE.Mesh>(null);
  const orb3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (orb1Ref.current) {
      orb1Ref.current.position.x = Math.sin(time * 0.3) * 4;
      orb1Ref.current.position.y = Math.cos(time * 0.2) * 3;
      orb1Ref.current.position.z = Math.sin(time * 0.15) * 2;
    }

    if (orb2Ref.current) {
      orb2Ref.current.position.x = Math.cos(time * 0.25) * 5;
      orb2Ref.current.position.y = Math.sin(time * 0.3) * 4;
      orb2Ref.current.position.z = Math.cos(time * 0.2) * 3;
    }

    if (orb3Ref.current) {
      orb3Ref.current.position.x = Math.sin(time * 0.2) * 3;
      orb3Ref.current.position.y = Math.cos(time * 0.25) * 2;
      orb3Ref.current.position.z = Math.sin(time * 0.3) * 4;
    }
  });

  return (
    <>
      <mesh ref={orb1Ref}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#F277B0" transparent opacity={0.15} />
      </mesh>

      <mesh ref={orb2Ref}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial color="#07D9D9" transparent opacity={0.12} />
      </mesh>

      <mesh ref={orb3Ref}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial color="#11D9A0" transparent opacity={0.13} />
      </mesh>
    </>
  );
}

export function HeroBackground3D() {
  return (
    <div className="absolute inset-0 opacity-40">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ParticleField />
        <FloatingOrbs />
      </Canvas>
    </div>
  );
}
