"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Node({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial
        color="#a78bfa"
        emissive="#c084fc"
        emissiveIntensity={0.7}
        roughness={0.2}
        metalness={0.5}
      />
    </mesh>
  );
}

function Connection({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#60a5fa" linewidth={2} />
    </line>
  );
}

export default function BrainModel() {
  const nodes = [
    [0, 0, 0],
    [1, 0.8, 0.2],
    [-1, 0.7, -0.5],
    [0.5, -1, 0.3],
    [-0.8, -0.9, -0.2],
  ] as [number, number, number][];

  const connections = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 3],
    [2, 4],
  ];

  return (
    <Canvas style={{ width: "100%", height: 150 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 2, 2]} intensity={1.2} />
      {nodes.map((pos, i) => (
        <Node key={i} position={pos} />
      ))}
      {connections.map(([i, j], idx) => (
        <Connection key={idx} start={nodes[i]} end={nodes[j]} />
      ))}
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
    </Canvas>
  );
}
