"use client";

import { useGLTF } from "@react-three/drei";
import CourseModelViewer from "./CourseModelViwer";

function Model() {
  const { scene } = useGLTF("/models/PortalDungueon.glb");

  return (
    <primitive
      object={scene}
      scale={1.2}
      position={[0, 0, 0]}
      rotation={[0, 0.5, 0]}
    />
  );
}

useGLTF.preload("/models/PortalDungueon.glb");

export default function RobloxCourse1Model() {
  return (
    <CourseModelViewer>
      <Model />
    </CourseModelViewer>
  );
}