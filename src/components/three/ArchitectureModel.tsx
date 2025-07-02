"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function ArchitectureModel() {
  return (
    <Canvas style={{ width: "100%", height: 150 }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 3, 2]} intensity={1.2} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />

      {/* Base cube */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[1.5, 0.3, 1.5]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Vertical pillar */}
      <mesh position={[0.5, -0.2, 0]}>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="#6366f1" />
      </mesh>

      {/* Second cube above */}
      <mesh position={[-0.5, 0.3, 0]}>
        <boxGeometry args={[0.8, 0.2, 0.8]} />
        <meshStandardMaterial color="#60a5fa" />
      </mesh>
    </Canvas>
  );
}
