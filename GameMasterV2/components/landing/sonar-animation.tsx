"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function SonarAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const sonarRings: THREE.Mesh[] = [];
    const particles: THREE.Points[] = [];
    const lines: THREE.Line[] = [];

    const createSonarRing = (delay: number) => {
      const geometry = new THREE.RingGeometry(0.1, 0.15, 64);
      const material = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(geometry, material);
      ring.userData.delay = delay;
      ring.userData.age = -delay;
      scene.add(ring);
      sonarRings.push(ring);
      return ring;
    };

    for (let i = 0; i < 3; i++) {
      createSonarRing(i * 1.5);
    }

    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 2;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x3b82f6,
      size: 0.05,
      transparent: true,
      opacity: 0.6
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    particles.push(particleSystem);

    for (let i = 0; i < 15; i++) {
      const lineGeometry = new THREE.BufferGeometry();
      const theta = (i / 15) * Math.PI * 2;
      const linePositions = new Float32Array([
        0, 0, 0,
        Math.cos(theta) * 4, Math.sin(theta) * 4, 0
      ]);
      lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.1
      });

      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
      lines.push(line);
    }

    const centerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.8
      })
    );
    scene.add(centerSphere);

    let time = 0;

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      time += 0.01;

      scene.rotation.y = time * 0.1;
      scene.rotation.x = Math.sin(time * 0.2) * 0.1;

      sonarRings.forEach((ring) => {
        ring.userData.age += 0.02;

        if (ring.userData.age > 0) {
          const progress = ring.userData.age / 4;
          const scale = 1 + progress * 8;
          ring.scale.set(scale, scale, 1);

          const opacity = Math.max(0, 0.8 - progress);
          (ring.material as THREE.MeshBasicMaterial).opacity = opacity;

          if (progress > 1) {
            ring.userData.age = -ring.userData.delay;
          }
        }
      });

      particles.forEach((particle) => {
        particle.rotation.y = time * 0.2;
        particle.rotation.x = time * 0.1;
      });

      lines.forEach((line, i) => {
        const opacity = 0.1 + Math.sin(time * 2 + i * 0.5) * 0.05;
        (line.material as THREE.LineBasicMaterial).opacity = Math.max(0.05, opacity);
      });

      centerSphere.scale.setScalar(1 + Math.sin(time * 2) * 0.1);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }

      sonarRings.forEach(ring => {
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
      });

      particles.forEach(particle => {
        particle.geometry.dispose();
        (particle.material as THREE.Material).dispose();
      });

      lines.forEach(line => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      });

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 opacity-30"
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    />
  );
}
