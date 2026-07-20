"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * ThreeBulbScene
 *
 * A premium 3D Edison-style light bulb hanging from a ceiling canopy.
 * - Vintage brass socket with glass teardrop globe
 * - Glowing filament with volumetric warm light
 * - Gentle pendulum swing physics
 * - Background starfield
 * - GPU-accelerated via WebGL
 *
 * Adapted from a Three.js hero concept — no UI elements here,
 * just the immersive 3D backdrop for the hero content.
 */
export function ThreeBulbScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    /* ── Scene ── */
    const scene = new THREE.Scene();

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 20);

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /* ── Starfield ── */
    const starCount = 1200;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 1500;
    }
    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3)
    );
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffddaa,
      size: 1.1,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    /* ── Materials ── */
    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.15,
      bumpScale: 0.05,
    });

    const darkMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.9,
      roughness: 0.4,
    });

    /* ── Ceiling Canopy ── */
    const canopyGeom = new THREE.CylinderGeometry(1.4, 1.4, 0.25, 32);
    const canopy = new THREE.Mesh(canopyGeom, brassMaterial);
    canopy.position.y = 12;
    scene.add(canopy);

    const canopyCapGeom = new THREE.SphereGeometry(
      0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2
    );
    const canopyCap = new THREE.Mesh(canopyCapGeom, darkMetalMaterial);
    canopyCap.position.y = 11.8;
    scene.add(canopyCap);

    /* ── Pivot Group ── */
    const pivot = new THREE.Group();
    pivot.position.y = 12;
    scene.add(pivot);

    /* ── Wire / Cord ── */
    const wireLength = 12.0;
    const wireGeom = new THREE.CylinderGeometry(0.045, 0.045, wireLength, 16);
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0x1c1813,
      roughness: 0.8,
      metalness: 0.1,
    });
    const wire = new THREE.Mesh(wireGeom, wireMat);
    wire.position.y = -(wireLength / 2);
    pivot.add(wire);

    /* ── Bulb Assembly ── */
    const bulbAssembly = new THREE.Group();
    bulbAssembly.position.y = -wireLength;
    pivot.add(bulbAssembly);

    /* ── Brass Socket ── */
    const socketGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.9, 32);
    const socket = new THREE.Mesh(socketGeom, brassMaterial);
    socket.position.y = 0.45;
    bulbAssembly.add(socket);

    /* ── Socket Rings ── */
    const socketRingGeom = new THREE.TorusGeometry(0.41, 0.04, 12, 32);
    const ring1 = new THREE.Mesh(socketRingGeom, brassMaterial);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 0.65;
    bulbAssembly.add(ring1);

    const ring2 = ring1.clone();
    ring2.position.y = 0.25;
    bulbAssembly.add(ring2);

    /* ── Strain Relief Boot ── */
    const bootGeom = new THREE.CylinderGeometry(0.12, 0.22, 0.35, 16);
    const boot = new THREE.Mesh(bootGeom, darkMetalMaterial);
    boot.position.y = 0.95;
    bulbAssembly.add(boot);

    /* ── Glass Geometry ── */
    const glassNeckGeom = new THREE.CylinderGeometry(0.38, 0.85, 0.9, 32, 1, true);
    const glassGlobeGeom = new THREE.SphereGeometry(0.9, 32, 32);
    glassGlobeGeom.translate(0, -0.75, 0);

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xfff6e5,
      transmission: 0.95,
      opacity: 1.0,
      metalness: 0.05,
      roughness: 0.08,
      ior: 1.55,
      thickness: 1.2,
      specularIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const glassNeck = new THREE.Mesh(glassNeckGeom, glassMaterial);
    glassNeck.position.y = 0.0;
    bulbAssembly.add(glassNeck);

    const glassGlobe = new THREE.Mesh(glassGlobeGeom, glassMaterial);
    glassGlobe.position.y = 0.0;
    bulbAssembly.add(glassGlobe);

    /* ── Glass Stem ── */
    const stemGeom = new THREE.CylinderGeometry(0.08, 0.12, 0.6, 16);
    const stem = new THREE.Mesh(stemGeom, glassMaterial);
    stem.position.y = -0.1;
    bulbAssembly.add(stem);

    /* ── Support Wires ── */
    const supportGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.7, 8);
    const supportMat = new THREE.MeshStandardMaterial({
      color: 0x444444,
      metalness: 0.9,
      roughness: 0.3,
    });

    const supportLeft = new THREE.Mesh(supportGeom, supportMat);
    supportLeft.position.set(-0.14, -0.4, 0);
    supportLeft.rotation.z = -0.15;
    bulbAssembly.add(supportLeft);

    const supportRight = supportLeft.clone();
    supportRight.position.x = 0.14;
    supportRight.rotation.z = 0.15;
    bulbAssembly.add(supportRight);

    /* ── Filament ── */
    const filamentGeom = new THREE.TorusGeometry(0.16, 0.015, 8, 24, Math.PI);
    const filamentMat = new THREE.MeshBasicMaterial({
      color: 0xffaa11,
    });
    const filament = new THREE.Mesh(filamentGeom, filamentMat);
    filament.rotation.x = Math.PI;
    filament.position.set(0, -0.75, 0);
    bulbAssembly.add(filament);

    /* ── Glow Sprite ── */
    const createGlowTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext("2d")!;
      const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 256);
      gradient.addColorStop(0, "rgba(255, 245, 220, 1.0)");
      gradient.addColorStop(0.08, "rgba(255, 210, 80, 0.8)");
      gradient.addColorStop(0.2, "rgba(255, 140, 20, 0.4)");
      gradient.addColorStop(0.45, "rgba(150, 60, 5, 0.1)");
      gradient.addColorStop(0.75, "rgba(60, 20, 0, 0.02)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 512, 512);
      return new THREE.CanvasTexture(canvas);
    };

    const glowMaterial = new THREE.SpriteMaterial({
      map: createGlowTexture(),
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.95,
    });

    const glow = new THREE.Sprite(glowMaterial);
    glow.scale.set(16, 16, 1);
    glow.position.set(0, -0.75, 0);
    bulbAssembly.add(glow);

    /* ── Point Light ── */
    const bulbLight = new THREE.PointLight(0xff9922, 4.5, 45, 1.5);
    bulbLight.position.set(0, -0.75, 0);
    bulbAssembly.add(bulbLight);

    /* ── Ambient Light ── */
    const ambientLight = new THREE.AmbientLight(0xfff6e5, 0.08);
    scene.add(ambientLight);

    /* ── Pendulum Physics ── */
    let angle = 0.22;
    let velocity = 0;
    const gravity = 0.013;
    const damping = 0.9995;

    let animationFrameId: number;

    const animate = () => {
      const acceleration = -(gravity / wireLength) * Math.sin(angle);
      velocity += acceleration;
      velocity *= damping;
      angle += velocity;

      pivot.rotation.z = angle;

      starField.rotation.y += 0.00015;
      starField.rotation.x += 0.00008;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    /* ── Resize ── */
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    /* ── Cleanup ── */
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      canopyGeom.dispose();
      canopyCapGeom.dispose();
      wireGeom.dispose();
      wireMat.dispose();
      socketGeom.dispose();
      socketRingGeom.dispose();
      bootGeom.dispose();
      glassNeckGeom.dispose();
      glassGlobeGeom.dispose();
      glassMaterial.dispose();
      stemGeom.dispose();
      supportGeom.dispose();
      supportMat.dispose();
      filamentGeom.dispose();
      filamentMat.dispose();
      glowMaterial.map?.dispose();
      glowMaterial.dispose();

      scene.clear();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 outline-none"
      aria-hidden="true"
    />
  );
}
