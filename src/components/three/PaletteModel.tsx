"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function PaletteModel() {
  return (
    <Canvas style={{ width: "100%", height: 150 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 2, 2]} intensity={1} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />

      {/* Paleta base */}
      <mesh rotation={[0.3, 0.2, 0]}>
        <torusGeometry args={[0.8, 0.3, 16, 100, Math.PI * 1.5]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Pinturas de colores (puntos) */}
      {[
        { color: "#ef4444", position: [0.5, 0.4, 0.3] },
        { color: "#3b82f6", position: [0.3, 0.7, 0.2] },
        { color: "#22c55e", position: [-0.2, 0.6, 0.25] },
        { color: "#eab308", position: [-0.4, 0.3, 0.2] },
      ].map((dot, i) => (
        <mesh key={i} position={dot.position as [number, number, number]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color={dot.color} emissive={dot.color} emissiveIntensity={0.6} />
        </mesh>
      ))}
    </Canvas>
  );
}
