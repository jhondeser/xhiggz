"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function XhiggsModel() {
  const modelRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF("/models/xhiggz-particle.glb", true);

  useFrame(({ clock }) => {
    if (!modelRef.current) return;

    modelRef.current.rotation.y = clock.getElapsedTime() * 0.25;
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={1.5}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

export default function ParticleScene() {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      camera={{ position: [0, 0, 6], fov: 45 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.7} />

        <directionalLight position={[5, 5, 5]} intensity={2.5} />

        <directionalLight position={[-5, 2, 3]} intensity={1.2} />

        <pointLight position={[0, 3, -4]} intensity={2} color="#8b5cf6" />

        <pointLight position={[0, 0, 4]} intensity={1.5} color="#38bdf8" />

        <Environment preset="city" />

        <XhiggsModel />

        <OrbitControls enableZoom={false} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/models/xhiggz-particle.glb", true);