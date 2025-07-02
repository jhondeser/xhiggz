"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function CoreX() {
  return (
    <group>
      {/* Dos cilindros cruzados en X */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[2.5, 0.3, 0.3]} />
        <meshStandardMaterial
          color={"#6ee7ff"}
          emissive={"#8b5cf6"}
          emissiveIntensity={1.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[2.5, 0.3, 0.3]} />
        <meshStandardMaterial
          color={"#6ee7ff"}
          emissive={"#9333ea"}
          emissiveIntensity={1.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

function OrbitRing({ rotation = [0, 0, 0], radius = 2.8, color = "#22d3ee" }) {
  return (
    <mesh rotation={rotation}>
      <torusGeometry args={[radius, 0.01, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function OrbitParticle({ speed = 1, distance = 2.8, size = 0.12, color = "#60a5fa", angleOffset = 0 }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + angleOffset;
    ref.current.position.x = Math.cos(t) * distance;
    ref.current.position.z = Math.sin(t) * distance;
    ref.current.position.y = Math.sin(t * 0.7) * 0.4;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
    </mesh>
  );
}

export default function ParticleScene() {
  return (
    <Canvas style={{ width: "100%", height: "100%" }}>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1.5} />
      <CoreX />
      {/* Anillos elípticos tipo logo */}
      <OrbitRing rotation={[Math.PI / 2.5, 0, 0]} color="#38bdf8" />
      <OrbitRing rotation={[0, Math.PI / 2.5, 0]} color="#9333ea" />
      <OrbitRing rotation={[0, 0, Math.PI / 2.5]} color="#22d3ee" />

      {/* Partículas orbitando */}
      <OrbitParticle speed={1} distance={2.8} angleOffset={0} />
      <OrbitParticle speed={1.3} distance={2.8} angleOffset={2} />
      <OrbitParticle speed={0.9} distance={2.8} angleOffset={4} />

      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
    </Canvas>
  );
}
