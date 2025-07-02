"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { Mesh } from "three";

function Building() {
  const meshRef = useRef<Mesh>(null!);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} scale={[1.1, 1.3, 1.1]} position={[0, -0.3, 0]}>
      <boxGeometry args={[1, 1.5, 1]} />
      <meshStandardMaterial color="#3b82f6" />
    </mesh>
  );
}

export default function BuildingModel() {
  return (
    <Canvas style={{ width: "100%", height: 150 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} intensity={1} />
      <Building />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
    </Canvas>
  );
}
