"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, ReactNode, useEffect, useRef, useState } from "react";

interface CourseModelViewerProps {
  children: ReactNode;
}

function AutoRotate({ children, isMobile }: { children: ReactNode; isMobile: boolean }) {
  const groupRef = useRef<any>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y += delta * (isMobile ? 0.2 : 0.3);
  });

  return <group ref={groupRef}>{children}</group>;
}

function SceneLights({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <ambientLight intensity={isMobile ? 1.4 : 1.1} />
      <directionalLight
        position={[3, 4, 5]}
        intensity={isMobile ? 0.8 : 1.1}
      />
      {!isMobile && <directionalLight position={[-2, 2, -2]} intensity={0.45} />}
    </>
  );
}

export default function CourseModelViewer({ children }: CourseModelViewerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
      setMounted(true);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-full">
      <Canvas
        dpr={isMobile ? 1 : [1, 1.5]}
        shadows={false}
        frameloop="always"
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
          stencil: false,
          depth: true,
        }}
        camera={{
          position: isMobile ? [0, 0, 4.2] : [0, 0, 4],
          fov: isMobile ? 34 : 30,
          near: 0.1,
          far: 100,
        }}
      >
        <Suspense fallback={null}>
          <SceneLights isMobile={isMobile} />
          <AutoRotate isMobile={isMobile}>{children}</AutoRotate>
        </Suspense>
      </Canvas>
    </div>
  );
}