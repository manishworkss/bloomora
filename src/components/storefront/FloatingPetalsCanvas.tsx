'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface PetalData {
  mesh: THREE.Mesh;
  speedY: number;
  swaySpeed: number;
  swayDistance: number;
  initialX: number;
  phase: number;
  tumbleSpeedX: number;
  tumbleSpeedZ: number;
  flutterIntensity: number;
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

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Soft Ambient Lighting for Natural Translucent Petals
    const ambientLight = new THREE.AmbientLight(0xfff8f4, 1.1);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffeedd, 0.6);
    sunLight.position.set(6, 12, 8);
    scene.add(sunLight);

    // Create Organic Curved Petal Geometry
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.bezierCurveTo(0.35, 0.25, 0.55, 0.85, 0, 1.35);
    petalShape.bezierCurveTo(-0.55, 0.85, -0.35, 0.25, 0, 0);

    const geometry = new THREE.ShapeGeometry(petalShape, 12);
    // Smooth natural parabolic cupping
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin((y / 1.35) * Math.PI) * 0.14 - Math.abs(x) * 0.09);
    }
    geometry.computeVertexNormals();

    // Natural Artisan Floral Colors (Cashmere Blush, Soft Cream Silk, Dusty Rose, Pale Peach)
    const petalColors = [0xf5e2e8, 0xfffaf4, 0xf0d8df, 0xebd0d7, 0xfbf1ed];
    const materials = petalColors.map(
      (color, idx) =>
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.8,
          metalness: 0.02,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7 + (idx % 3) * 0.08,
        })
    );

    // Spawn 28 Organic Petals (Not overcrowded, delicate and airy)
    const PETAL_COUNT = 28;
    const petals: PetalData[] = [];

    const spawnYRange = 26;
    const spawnXRange = 28;

    for (let i = 0; i < PETAL_COUNT; i++) {
      const material = materials[Math.floor(Math.random() * materials.length)];
      const mesh = new THREE.Mesh(geometry, material);

      // Depth variation: distant petals are smaller & softer
      const depthZ = (Math.random() - 0.5) * 12;
      const normalizedDepth = (depthZ + 6) / 12; // 0 (far) to 1 (near)
      const scale = 0.35 + normalizedDepth * 0.45;
      mesh.scale.set(scale, scale, scale);

      const initialX = (Math.random() - 0.5) * spawnXRange;
      const initialY = (Math.random() - 0.5) * spawnYRange;

      mesh.position.set(initialX, initialY, depthZ);
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      scene.add(mesh);

      // Natural airy descent physics: very slow, gentle flutter
      petals.push({
        mesh,
        // Feather-light terminal velocity: takes 12-18 seconds to drift across screen
        speedY: 0.0055 + Math.random() * 0.005,
        swaySpeed: 0.35 + Math.random() * 0.4,
        swayDistance: 0.4 + Math.random() * 0.6,
        initialX,
        phase: Math.random() * Math.PI * 2,
        tumbleSpeedX: (Math.random() - 0.5) * 0.006,
        tumbleSpeedZ: 0.004 + Math.random() * 0.008,
        flutterIntensity: 0.25 + Math.random() * 0.35,
      });
    }

    // Smooth subtle mouse draft (ambient room airflow)
    let currentWindX = 0;
    let targetWindX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetWindX = x * 0.35;
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

    // Pause rendering when scrolled away to preserve performance
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Animation Loop: Aerodynamic Leaf/Petal Gliding
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      // Ambient natural draft with soft turbulence
      currentWindX += (targetWindX - currentWindX) * 0.03;
      const naturalBreeze = Math.sin(elapsed * 0.25) * 0.15;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // 1. Feather-light fall
        p.mesh.position.y -= p.speedY;

        // 2. Harmonic lateral sway (the natural pendulum glide of a falling petal)
        const swayCycle = Math.sin(elapsed * p.swaySpeed + p.phase);
        const lateralSway = swayCycle * p.swayDistance;
        p.mesh.position.x = p.initialX + lateralSway + (currentWindX + naturalBreeze) * 2;

        // 3. Aerodynamic Banking: Petal tilts in the direction of its lateral velocity
        // When swinging right, it leans right; when swinging left, it leans left!
        p.mesh.rotation.z = Math.cos(elapsed * p.swaySpeed + p.phase) * p.flutterIntensity;

        // 4. Subtle, slow 3D tumble on pitch and yaw
        p.mesh.rotation.x += p.tumbleSpeedX;
        p.mesh.rotation.y += Math.sin(elapsed * 0.4 + p.phase) * 0.004;

        // 5. Wrap around when floating past bottom
        if (p.mesh.position.y < -spawnYRange / 2) {
          p.mesh.position.y = spawnYRange / 2 + Math.random() * 2;
          p.initialX = (Math.random() - 0.5) * spawnXRange;
          p.phase = Math.random() * Math.PI * 2;
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
