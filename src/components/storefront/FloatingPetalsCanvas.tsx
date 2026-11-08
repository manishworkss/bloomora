'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface PetalData {
  mesh: THREE.Mesh;
  speedY: number;
  speedX: number;
  rotationSpeedX: number;
  rotationSpeedY: number;
  rotationSpeedZ: number;
  oscillationSpeed: number;
  oscillationDistance: number;
  initialX: number;
  timeOffset: number;
}

export const FloatingPetalsCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Scene setup
    const scene = new THREE.Scene();
    let width = container.clientWidth;
    let height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff3ea, 0.7);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Create Organic Petal Geometry
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.bezierCurveTo(0.4, 0.3, 0.6, 0.9, 0, 1.4);
    petalShape.bezierCurveTo(-0.6, 0.9, -0.4, 0.3, 0, 0);

    const geometry = new THREE.ShapeGeometry(petalShape, 8);
    // Add slight natural cupping curve
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Gentle parabolic bend
      pos.setZ(i, Math.sin((y / 1.4) * Math.PI) * 0.12 - Math.abs(x) * 0.08);
    }
    geometry.computeVertexNormals();

    // High-end pastel floral palette (Antique Rose, Cashmere Blush, Warm Cream)
    const petalColors = [0xf4dde3, 0xeedadf, 0xfff9f2, 0xe9d5db, 0xfcefee];
    const materials = petalColors.map(
      (color) =>
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.65,
          metalness: 0.05,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.88,
        })
    );

    // Spawn Petals
    const PETAL_COUNT = 38;
    const petals: PetalData[] = [];

    const spawnYRange = 24;
    const spawnXRange = 26;

    for (let i = 0; i < PETAL_COUNT; i++) {
      const material = materials[Math.floor(Math.random() * materials.length)];
      const mesh = new THREE.Mesh(geometry, material);

      const scale = 0.45 + Math.random() * 0.55;
      mesh.scale.set(scale, scale, scale);

      const initialX = (Math.random() - 0.5) * spawnXRange;
      const initialY = (Math.random() - 0.5) * spawnYRange;
      const initialZ = (Math.random() - 0.5) * 8;

      mesh.position.set(initialX, initialY, initialZ);
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      scene.add(mesh);

      petals.push({
        mesh,
        speedY: 0.014 + Math.random() * 0.02,
        speedX: (Math.random() - 0.5) * 0.006,
        rotationSpeedX: (Math.random() - 0.5) * 0.016,
        rotationSpeedY: (Math.random() - 0.5) * 0.016,
        rotationSpeedZ: (Math.random() - 0.5) * 0.01,
        oscillationSpeed: 0.6 + Math.random() * 0.8,
        oscillationDistance: 0.2 + Math.random() * 0.4,
        initialX,
        timeOffset: Math.random() * 100,
      });
    }

    // Mouse drift interaction
    let mouseX = 0;
    let targetMouseX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetMouseX = x * 0.6;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Pause rendering when scrolled out of view to preserve battery
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // Drift downwards
        p.mesh.position.y -= p.speedY;

        // Gentle lateral sway
        const sway = Math.sin(elapsed * p.oscillationSpeed + p.timeOffset) * p.oscillationDistance;
        p.mesh.position.x = p.initialX + sway + mouseX * 2;

        // Slow 3D tumble
        p.mesh.rotation.x += p.rotationSpeedX;
        p.mesh.rotation.y += p.rotationSpeedY;
        p.mesh.rotation.z += p.rotationSpeedZ;

        // Wrap around when falling past bottom
        if (p.mesh.position.y < -spawnYRange / 2) {
          p.mesh.position.y = spawnYRange / 2 + Math.random() * 2;
          p.initialX = (Math.random() - 0.5) * spawnXRange;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      geometry.dispose();
      materials.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
