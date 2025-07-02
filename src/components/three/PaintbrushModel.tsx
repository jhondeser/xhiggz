"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { Mesh } from "three";

function Paintbrush() {
  const meshRef = useRef<Mesh>(null!);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} scale={[0.8, 0.8, 0.8]} position={[0, 0, 0]}>
      <coneGeometry args={[0.3, 1, 32]} />
      <meshStandardMaterial color="#a855f7" />
    </mesh>
  );
}

export default function PaintbrushModel() {
  return (
    <Canvas style={{ width: "100%", height: 150 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} intensity={1} />
      <Paintbrush />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
    </Canvas>
  );
}
