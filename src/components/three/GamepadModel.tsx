"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function GamepadModel() {
  return (
    <Canvas style={{ width: "100%", height: 150 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 2, 3]} intensity={1.1} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />

      {/* Gamepad base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 0.6, 0.3]} />
        <meshStandardMaterial color="#1f2937" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Botones (círculos) */}
      {[
        [0.6, 0.15, 0.2],
        [0.4, -0.15, 0.2],
        [-0.5, 0.15, 0.2],
        [-0.7, -0.15, 0.2],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#93c5fd" emissive="#60a5fa" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </Canvas>
  );
}
