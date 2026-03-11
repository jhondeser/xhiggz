"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { ReactNode, Suspense } from "react";

type CourseModelViewerProps = {
  children: ReactNode;
  height?: number;
};

export default function CourseModelViewer({
  children,
  height = 150,
}: CourseModelViewerProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 3, 4]} intensity={2} />
        <directionalLight position={[-2, 2, 2]} intensity={1} />
        <Environment preset="city" />

        {children}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={2}
        />
      </Suspense>
    </Canvas>
  );
}