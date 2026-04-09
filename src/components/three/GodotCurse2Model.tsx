"use client";

import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import CourseModelViewer from "./CourseModelViwer";

interface ModelProps {
  onReady?: () => void;
}

function Model({ onReady }: ModelProps) {
  const { scene } = useGLTF("/models/portal.glb");

  useEffect(() => {
    onReady?.();
  }, [scene, onReady]);

  return (
    <primitive
      object={scene}
      scale={0.90}
      position={[0, 0, 0]}
      rotation={[0.15, 0.5, 0]}
    />
  );
}

export default function RobloxCourse1Model({ onReady }: ModelProps) {
  return (
    <CourseModelViewer>
      <Model onReady={onReady} />
    </CourseModelViewer>
  );
}