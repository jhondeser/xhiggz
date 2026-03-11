"use client";

import { useGLTF } from "@react-three/drei";
import CourseModelViewer from "./CourseModelViwer";

function Model() {
  const { scene } = useGLTF("/models/Isle_of_the_Sword.glb");

  return (
    <primitive
      object={scene}
      scale={1.2}
      position={[0, 0, 0]}
      rotation={[0.1, 0.8, 0.1]}
    />
  );
}

useGLTF.preload("/models/Isle_of_the_Sword.glb");

export default function RobloxCourse1Model() {
  return (
    <CourseModelViewer>
      <Model />
    </CourseModelViewer>
  );
}